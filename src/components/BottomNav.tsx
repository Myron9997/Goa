import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, MessageCircle, User } from 'lucide-react';
import { SupabaseContext } from '../context/SupabaseContext';
import { useChat } from '../context/ChatContext';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const supabaseContext = useContext(SupabaseContext);
  const { user } = supabaseContext || { user: null };
  const { isInChatView } = useChat();

  const isActive = (path: string) => location.pathname === path;

  // Debug logging
  console.log('BottomNav: isInChatView =', isInChatView, 'location =', location.pathname);

  const getNavItems = () => {
    if (user?.role === 'vendor') {
      return [
        { path: '/account', icon: Home, label: 'Home', active: isActive('/account') },
        { path: '/messages', icon: MessageCircle, label: 'Messages', active: isActive('/messages') }
      ];
    }
    if (user?.role === 'viewer') {
      return [
        { path: '/home', icon: Home, label: 'Home', active: isActive('/home') },
        { path: '/account', icon: User, label: 'Profile', active: isActive('/account') },
        { path: '/messages', icon: MessageCircle, label: 'Messages', active: isActive('/messages') }
      ];
    }
    return [] as Array<{ path: string; icon: any; label: string; active: boolean }>;
  };

  const navItems = getNavItems();

  if (!user || isInChatView) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 safe-area">
      <div className="max-w-md mx-auto px-4 py-2">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`relative flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors ${
                  item.active
                    ? 'text-rose-700 bg-rose-50'
                    : 'text-gray-500 hover:text-rose-700 hover:bg-gray-50'
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium mt-1">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

