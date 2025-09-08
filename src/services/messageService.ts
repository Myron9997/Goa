import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

type Message = Database['public']['Tables']['messages']['Row']
type MessageInsert = Database['public']['Tables']['messages']['Insert']

export interface MessageWithUsers extends Message {
  sender: {
    full_name: string | null
    avatar_url: string | null
  }
  receiver: {
    full_name: string | null
    avatar_url: string | null
  }
  booking?: {
    event_date: string
    event_type: string
    vendor: {
      business_name: string
    }
  }
}

export interface Conversation {
  otherUser: {
    id: string
    full_name: string | null
    avatar_url: string | null
  }
  lastMessage: Message
  unreadCount: number
}

export class MessageService {
  private static getCache<T>(key: string, ttlMs: number): T | null {
    try {
      const raw = localStorage.getItem(key)
      if (!raw) return null
      const parsed = JSON.parse(raw)
      if (!parsed || typeof parsed !== 'object') return null
      if (Date.now() - (parsed.ts || 0) > ttlMs) return null
      return parsed.data as T
    } catch {
      return null
    }
  }

  private static setCache<T>(key: string, data: T) {
    try { localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data })) } catch {}
  }
  // Send a message
  static async sendMessage(messageData: MessageInsert): Promise<Message> {
    const { data, error } = await supabase
      .from('messages')
      .insert(messageData)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Get messages between two users
  static async getMessages(
    userId1: string,
    userId2: string,
    bookingId?: string
  ): Promise<MessageWithUsers[]> {
    let query = supabase
      .from('messages')
      .select(`
        *,
        sender:users!messages_sender_id_fkey(full_name, avatar_url),
        receiver:users!messages_receiver_id_fkey(full_name, avatar_url),
        booking:bookings!messages_booking_id_fkey(
          event_date,
          event_type,
          vendor:vendors!bookings_vendor_id_fkey(business_name)
        )
      `)
      .or(`and(sender_id.eq.${userId1},receiver_id.eq.${userId2}),and(sender_id.eq.${userId2},receiver_id.eq.${userId1})`)
      .order('created_at', { ascending: true })

    if (bookingId) {
      query = query.eq('booking_id', bookingId)
    }

    const { data, error } = await query

    if (error) throw error
    return data as MessageWithUsers[]
  }

  static async getMessagesCachedFirst(userId1: string, userId2: string, bookingId?: string, ttlMs: number = 2 * 60 * 1000): Promise<MessageWithUsers[]> {
    const key = `msgs_${userId1}_${userId2}_${bookingId || 'none'}`
    const cached = this.getCache<MessageWithUsers[]>(key, ttlMs)
    if (cached) {
      // refresh in background
      this.getMessages(userId1, userId2, bookingId).then((fresh) => this.setCache(key, fresh)).catch(() => {})
      return cached
    }
    const fresh = await this.getMessages(userId1, userId2, bookingId)
    this.setCache(key, fresh)
    return fresh
  }

  // Get conversations for a user
  static async getConversations(userId: string): Promise<Conversation[]> {
    // Get all messages where user is sender or receiver
    const { data: messages, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:users!messages_sender_id_fkey(full_name, avatar_url),
        receiver:users!messages_receiver_id_fkey(full_name, avatar_url)
      `)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Group messages by conversation partner
    const conversations = new Map<string, Conversation>()

    for (const message of messages) {
      const otherUserId = message.sender_id === userId ? message.receiver_id : message.sender_id
      const otherUser = message.sender_id === userId ? message.receiver : message.sender

      if (!conversations.has(otherUserId)) {
        conversations.set(otherUserId, {
          otherUser: {
            id: otherUserId,
            full_name: otherUser.full_name,
            avatar_url: otherUser.avatar_url
          },
          lastMessage: message,
          unreadCount: 0
        })
      }

      const conversation = conversations.get(otherUserId)!
      
      // Update last message if this is more recent
      if (new Date(message.created_at) > new Date(conversation.lastMessage.created_at)) {
        conversation.lastMessage = message
      }

      // Count unread messages (messages sent to current user that are not read)
      if (message.receiver_id === userId && !message.is_read) {
        conversation.unreadCount++
      }
    }

    return Array.from(conversations.values()).sort((a, b) => 
      new Date(b.lastMessage.created_at).getTime() - new Date(a.lastMessage.created_at).getTime()
    )
  }

  static async getConversationsCachedFirst(userId: string, ttlMs: number = 2 * 60 * 1000): Promise<Conversation[]> {
    const key = `convos_${userId}`
    const cached = this.getCache<Conversation[]>(key, ttlMs)
    if (cached) {
      this.getConversations(userId).then((fresh) => this.setCache(key, fresh)).catch(() => {})
      return cached
    }
    const fresh = await this.getConversations(userId)
    this.setCache(key, fresh)
    return fresh
  }

  // Mark messages as read
  static async markMessagesAsRead(senderId: string, receiverId: string): Promise<void> {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('sender_id', senderId)
      .eq('receiver_id', receiverId)
      .eq('is_read', false)

    if (error) throw error
  }

  // Get unread message count for a user
  static async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('receiver_id', userId)
      .eq('is_read', false)

    if (error) throw error
    return count || 0
  }

  // Delete a message
  static async deleteMessage(messageId: string): Promise<void> {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId)

    if (error) throw error
  }

  // Get messages for a specific booking
  static async getBookingMessages(bookingId: string): Promise<MessageWithUsers[]> {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:users!messages_sender_id_fkey(full_name, avatar_url),
        receiver:users!messages_receiver_id_fkey(full_name, avatar_url),
        booking:bookings!messages_booking_id_fkey(
          event_date,
          event_type,
          vendor:vendors!bookings_vendor_id_fkey(business_name)
        )
      `)
      .eq('booking_id', bookingId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data as MessageWithUsers[]
  }

  // Subscribe to new messages for real-time updates
  static subscribeToMessages(
    userId: string,
    onNewMessage: (message: MessageWithUsers) => void
  ) {
    return supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${userId}`
        },
        async (payload) => {
          // Fetch the full message with user details
          const { data, error } = await supabase
            .from('messages')
            .select(`
              *,
              sender:users!messages_sender_id_fkey(full_name, avatar_url),
              receiver:users!messages_receiver_id_fkey(full_name, avatar_url),
              booking:bookings!messages_booking_id_fkey(
                event_date,
                event_type,
                vendor:vendors!bookings_vendor_id_fkey(business_name)
              )
            `)
            .eq('id', payload.new.id)
            .single()

          if (!error && data) {
            onNewMessage(data as MessageWithUsers)
          }
        }
      )
      .subscribe()
  }

  // Unsubscribe from messages
  static unsubscribeFromMessages(subscription: any) {
    supabase.removeChannel(subscription)
  }
}

