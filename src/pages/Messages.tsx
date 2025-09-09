import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Send, Search as SearchIcon, ArrowLeft } from 'lucide-react';
import { SupabaseContext } from '../context/SupabaseContext';
import { useChat } from '../context/ChatContext';
import { MessageService, type Conversation, type MessageWithUsers } from '../services/messageService';

export function Messages() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(SupabaseContext)!;
  const { setIsInChatView } = useChat();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageWithUsers[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showChatView, setShowChatView] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const subscriptionRef = useRef<any>(null);

  // Select chat via navigation state (e.g., from account/messages list)
  useEffect(() => {
    const st: any = location.state || {};
    const otherUserId = st.otherUserId as string | undefined;
    const otherUserName = st.otherUserName as string | undefined;
    if (otherUserId) {
      setSelectedUserId(otherUserId);
      setShowChatView(true);
      setIsInChatView(true);
    }
    if (otherUserId && otherUserName) {
      setConversations(prev => {
        const exists = prev.some(c => c.otherUser.id === otherUserId);
        if (exists) return prev;
        return [
          {
            otherUser: { id: otherUserId, full_name: otherUserName, avatar_url: null },
            lastMessage: { id: 'temp', sender_id: '', receiver_id: '', content: '', created_at: new Date().toISOString(), is_read: true } as any,
            unreadCount: 0,
          },
          ...prev,
        ];
      });
    }
  }, [location.state]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      try {
        const convos = await MessageService.getConversationsCachedFirst(user.id);
        setConversations(convos);
        // Don't auto-select on mobile - show chat list by default
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  // Cleanup chat view state when component unmounts
  useEffect(() => {
    return () => {
      setIsInChatView(false);
    };
  }, [setIsInChatView]);

  // Load messages for selected conversation
  useEffect(() => {
    if (!user || !selectedUserId) return;
    (async () => {
      const msgs = await MessageService.getMessagesCachedFirst(user.id, selectedUserId);
      setMessages(msgs);
      await MessageService.markMessagesAsRead(selectedUserId, user.id);
      
      // Auto-scroll to bottom after messages load
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    })();

    // Realtime subscription for incoming messages
    if (subscriptionRef.current) {
      MessageService.unsubscribeFromMessages(subscriptionRef.current);
      subscriptionRef.current = null;
    }
    subscriptionRef.current = MessageService.subscribeToMessages(user.id, (msg) => {
      // Only append if belongs to current chat
      if (msg.sender_id === selectedUserId || msg.receiver_id === selectedUserId) {
        setMessages(prev => [...prev, msg]);
      }
    });

    return () => {
      if (subscriptionRef.current) {
        MessageService.unsubscribeFromMessages(subscriptionRef.current);
        subscriptionRef.current = null;
      }
    };
  }, [user, selectedUserId]);

  useEffect(() => {
    // Auto-scroll to bottom when messages change
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }, [messages]);

  const selectedConversation = useMemo(
    () => conversations.find(c => c.otherUser.id === selectedUserId) || null,
    [conversations, selectedUserId]
  );

  // Filter conversations based on search query
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    return conversations.filter(c => 
      (c.otherUser.full_name || c.otherUser.id).toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [conversations, searchQuery]);

  const handleChatSelect = (userId: string) => {
    setSelectedUserId(userId);
    setShowChatView(true);
    setIsInChatView(true);
    console.log('Chat selected, isInChatView set to true');
    
    // Ensure we scroll to bottom when opening chat
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  };

  const handleBackToChats = () => {
    setShowChatView(false);
    setSelectedUserId(null);
    setIsInChatView(false);
    console.log('Back to chats, isInChatView set to false');
  };

  const handleSend = async () => {
    if (!user || !selectedUserId || !input.trim()) return;
    
    const messageContent = input.trim();
    setInput(''); // Clear input immediately for instant feedback
    
    // Create optimistic message (shows instantly)
    const optimisticMessage: MessageWithUsers = {
      id: `temp-${Date.now()}`, // Temporary ID
      sender_id: user.id,
      receiver_id: selectedUserId,
      content: messageContent,
      created_at: new Date().toISOString(),
      is_read: false,
      booking_id: null,
      sender: {
        full_name: user.user_metadata?.full_name || user.email || 'You',
        avatar_url: user.user_metadata?.avatar_url || null
      },
      receiver: {
        full_name: null,
        avatar_url: null
      }
    };
    
    // Add optimistic message immediately (instant UI update)
    setMessages(prev => [...prev, optimisticMessage]);
    
    try {
      setSending(true);
      // Send to database in background
      const newMsg = await MessageService.sendMessage({
        sender_id: user.id,
        receiver_id: selectedUserId,
        content: messageContent,
        booking_id: null as any
      } as any);
      
      // Replace optimistic message with real one
      setMessages(prev => prev.map(msg => 
        msg.id === optimisticMessage.id ? newMsg as any : msg
      ));
    } catch (error) {
      console.error('Failed to send message:', error);
      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
      // Restore input on error
      setInput(messageContent);
    } finally {
      setSending(false);
    }
  };

  if (showChatView && selectedUserId) {
    // Chat view - full screen overlay that breaks out of app container
    return (
      <div className="fixed inset-0 h-screen bg-white overflow-hidden z-50">
        {/* Fixed Chat header with back button - positioned below main header */}
        <div className="fixed top-12 left-0 right-0 z-50 px-4 py-3 border-b border-gray-100 flex items-center gap-3 bg-white">
          <button onClick={handleBackToChats} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          {selectedConversation?.otherUser.avatar_url ? (
            <img 
              src={selectedConversation.otherUser.avatar_url} 
              alt={selectedConversation.otherUser.full_name || selectedConversation.otherUser.id} 
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center">
              {(selectedConversation?.otherUser.full_name || selectedConversation?.otherUser.id || (location.state as any)?.otherUserName || '?').charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{selectedConversation?.otherUser.full_name || (location.state as any)?.otherUserName || selectedConversation?.otherUser.id}</p>
            <p className="text-xs text-gray-500">Online</p>
          </div>
        </div>

        {/* Scrollable Messages area - properly contained with internal scroll only */}
        <div 
          className="absolute top-28 bottom-20 left-0 right-0 overflow-y-auto px-4 py-4 space-y-2 bg-white scrollbar-hide"
          style={{ 
            scrollBehavior: 'smooth', 
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {messages.map((m) => {
            const mine = m.sender_id === user!.id;
            return (
              <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'} gap-2`}>
                {!mine && (
                  <div className="flex-shrink-0">
                    {m.sender.avatar_url ? (
                      <img 
                        src={m.sender.avatar_url} 
                        alt={m.sender.full_name || 'User'} 
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-semibold">
                        {(m.sender.full_name || 'U').charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                )}
                <div className={`${mine ? 'bg-rose-600 text-white' : 'bg-gray-100 text-gray-900'} rounded-2xl px-3 py-2 max-w-[75%] shadow-sm`}>
                  <p className="text-sm whitespace-pre-wrap break-words">{m.content}</p>
                </div>
                {mine && (
                  <div className="flex-shrink-0">
                    {user?.avatar_url ? (
                      <img 
                        src={user.avatar_url} 
                        alt={user.full_name || 'You'} 
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-rose-200 flex items-center justify-center text-rose-600 text-xs font-semibold">
                        {(user?.full_name || 'Y').charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* Fixed Input at bottom - like bottom nav */}
        <div className="fixed bottom-0 left-0 right-0 z-50 p-3 border-t border-gray-100 flex items-center gap-2 bg-white safe-area">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
            placeholder="Type a message"
            className="flex-1 input-field"
          />
          <button disabled={sending || !input.trim()} onClick={handleSend} className="btn-primary disabled:opacity-50 flex items-center gap-2">
            <Send className="w-4 h-4" />
            Send
          </button>
        </div>
      </div>
    );
  }

  // Chat list view - default view
  return (
    <div className="h-screen bg-white overflow-hidden">
      {/* Fixed Search bar - positioned below main header */}
      <div className="fixed top-12 left-0 right-0 z-30 p-4 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-2 rounded-lg px-3 py-2 bg-gray-50 text-gray-600 text-sm">
          <SearchIcon className="w-4 h-4" />
          <input 
            placeholder="Search conversations" 
            className="bg-transparent outline-none flex-1" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Scrollable Chat list - positioned below fixed search */}
      <div 
        className="absolute top-32 bottom-0 left-0 right-0 overflow-y-auto scrollbar-hide"
        style={{ 
          scrollBehavior: 'smooth', 
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {loading ? (
          <div className="p-4 text-sm text-gray-500">Loading...</div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-4 text-sm text-gray-500">
            {searchQuery ? 'No conversations found' : 'No conversations'}
          </div>
        ) : (
          filteredConversations.map((c) => (
            <button
              key={c.otherUser.id}
              onClick={() => handleChatSelect(c.otherUser.id)}
              className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 border-b border-gray-100"
            >
              {c.otherUser.avatar_url ? (
                <img 
                  src={c.otherUser.avatar_url} 
                  alt={c.otherUser.full_name || c.otherUser.id} 
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 font-semibold">
                  {(c.otherUser.full_name || c.otherUser.id).charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 truncate">{c.otherUser.full_name || c.otherUser.id}</p>
                  {c.unreadCount > 0 && <span className="ml-2 text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">{c.unreadCount}</span>}
                </div>
                <p className="text-xs text-gray-500 truncate">{c.lastMessage.content}</p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
