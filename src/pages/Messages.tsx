import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Send, Search as SearchIcon } from 'lucide-react';
import { SupabaseContext } from '../context/SupabaseContext';
import { MessageService, type Conversation, type MessageWithUsers } from '../services/messageService';

export function Messages() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(SupabaseContext)!;

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageWithUsers[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const subscriptionRef = useRef<any>(null);

  // Select chat via navigation state (e.g., from account/messages list)
  useEffect(() => {
    const st: any = location.state || {};
    const otherUserId = st.otherUserId as string | undefined;
    const otherUserName = st.otherUserName as string | undefined;
    if (otherUserId) setSelectedUserId(otherUserId);
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
        // Auto-select first on desktop
        if (!selectedUserId && convos.length > 0) {
          setSelectedUserId(convos[0].otherUser.id);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  // Load messages for selected conversation
  useEffect(() => {
    if (!user || !selectedUserId) return;
    (async () => {
      const msgs = await MessageService.getMessagesCachedFirst(user.id, selectedUserId);
      setMessages(msgs);
      await MessageService.markMessagesAsRead(selectedUserId, user.id);
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
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const selectedConversation = useMemo(
    () => conversations.find(c => c.otherUser.id === selectedUserId) || null,
    [conversations, selectedUserId]
  );

  const handleSend = async () => {
    if (!user || !selectedUserId || !input.trim()) return;
    try {
      setSending(true);
      const newMsg = await MessageService.sendMessage({
        sender_id: user.id,
        receiver_id: selectedUserId,
        content: input.trim(),
        booking_id: null as any
      } as any);
      setMessages(prev => [...prev, newMsg as any]);
      setInput('');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="bg-white rounded-2xl shadow-sm grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 overflow-hidden">
          {/* Conversations list */}
          <div className="border-r border-gray-100 md:col-span-1 lg:col-span-1">
            <div className="p-3 border-b border-gray-100 flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-lg px-3 py-2 bg-gray-50 text-gray-600 text-sm w-full">
                <SearchIcon className="w-4 h-4" />
                <input placeholder="Search" className="bg-transparent outline-none flex-1" />
              </div>
            </div>
            <div className="max-h-[70vh] overflow-y-auto">
              {loading ? (
                <div className="p-4 text-sm text-gray-500">Loading...</div>
              ) : conversations.length === 0 ? (
                <div className="p-4 text-sm text-gray-500">No conversations</div>
              ) : (
                conversations.map((c) => (
                  <button
                    key={c.otherUser.id}
                    onClick={() => setSelectedUserId(c.otherUser.id)}
                    className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 ${selectedUserId === c.otherUser.id ? 'bg-rose-50' : ''}`}
                  >
                    <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 font-semibold">
                      {(c.otherUser.full_name || c.otherUser.id).charAt(0).toUpperCase()}
                    </div>
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

          {/* Chat area */}
          <div className="md:col-span-2 lg:col-span-3 flex flex-col h-[70vh]">
            {!selectedUserId ? (
              <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">Select a conversation</div>
            ) : (
              <>
                {/* Chat header */}
                <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center">
                    {(selectedConversation?.otherUser.full_name || selectedConversation?.otherUser.id || (location.state as any)?.otherUserName || '?').charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{selectedConversation?.otherUser.full_name || (location.state as any)?.otherUserName || selectedConversation?.otherUser.id}</p>
                    <p className="text-xs text-gray-500">Online</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 bg-gray-50">
                  {messages.map((m) => {
                    const mine = m.sender_id === user!.id;
                    return (
                      <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                        <div className={`${mine ? 'bg-rose-600 text-white' : 'bg-white text-gray-900'} rounded-2xl px-3 py-2 max-w-[75%] shadow-sm`}>
                          <p className="text-sm whitespace-pre-wrap break-words">{m.content}</p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <div className="p-3 border-t border-gray-100 flex items-center gap-2">
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
