import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { SupabaseContext } from '../context/SupabaseContext';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const supabaseContext = useContext(SupabaseContext);
  const { user, signOut } = supabaseContext || { user: null, signOut: () => {} };
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  const isLandingPage = location.pathname === '/';

  const handleNavigation = (path: string) => {
    navigate(path);
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 h-12">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <img src="/logo.png" alt="Logo" className="w-24 h-24 -mt-6 rounded-lg object-cover" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 -mt-4">
            {user?.role === 'viewer' ? (
              <>
                <button
                  onClick={() => navigate('/home')}
                  className={`text-sm font-medium transition-colors ${
                    isActive('/home') ? 'text-rose-700' : 'text-gray-600 hover:text-rose-700'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => navigate('/account')}
                  className={`text-sm font-medium transition-colors ${
                    isActive('/account') ? 'text-rose-700' : 'text-gray-600 hover:text-rose-700'
                  }`}
                >
                  Profile
                </button>
                <button
                  onClick={() => navigate('/messages')}
                  className={`text-sm font-medium transition-colors ${
                    isActive('/messages') ? 'text-rose-700' : 'text-gray-600 hover:text-rose-700'
                  }`}
                >
                  Messages
                </button>
              </>
            ) : user?.role === 'vendor' ? (
              <>
                <button
                  onClick={() => navigate('/account')}
                  className={`text-sm font-medium transition-colors ${
                    isActive('/account') ? 'text-rose-700' : 'text-gray-600 hover:text-rose-700'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigate('/messages')}
                  className={`text-sm font-medium transition-colors ${
                    isActive('/messages') ? 'text-rose-700' : 'text-gray-600 hover:text-rose-700'
                  }`}
                >
                  Messages
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/home')}
                  className={`text-sm font-medium transition-colors ${
                    isActive('/home') ? 'text-rose-700' : 'text-gray-600 hover:text-rose-700'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => navigate('/search')}
                  className={`text-sm font-medium transition-colors ${
                    isActive('/search') ? 'text-rose-700' : 'text-gray-600 hover:text-rose-700'
                  }`}
                >
                  Search
                </button>
              </>
            )}
            {/* No Admin link for vendors */}
          </nav>

          {/* User Actions (simple sign out when logged in) */}
          <div className="hidden md:flex items-center gap-3 -mt-4">
            {!user ? (
              <>
                <button
                  onClick={() => navigate('/vendor-login')}
                  className="text-sm font-medium text-gray-600 hover:text-rose-700 transition-colors"
                >
                  Vendor Login
                </button>
                <button
                  onClick={() => navigate('/viewer-login')}
                  className="btn-primary text-sm"
                >
                  Sign In
                </button>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-gray-600 hover:text-rose-700 transition-colors"
              >
                Sign Out
              </button>
            )}
          </div>

          {/* Mobile Menu Button - Hidden on landing page */}
          {!isLandingPage && (
            <button
              onClick={() => setMenuOpen(true)}
              className="md:hidden p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors -mt-5"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu - Hidden on landing page */}
      {menuOpen && !isLandingPage && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="absolute inset-0 bg-black/40" 
            onClick={() => setMenuOpen(false)} 
          />
          <aside className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl p-6 overflow-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <nav className="space-y-2">
              {user?.role === 'vendor' ? (
                <>
                  <button
                    onClick={() => handleNavigation('/account')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      isActive('/account') ? 'bg-rose-50 text-rose-700' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Dashboard
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleNavigation('/home')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      isActive('/home') ? 'bg-rose-50 text-rose-700' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Home
                  </button>
                  <button
                    onClick={() => handleNavigation('/account')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      isActive('/account') ? 'bg-rose-50 text-rose-700' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => handleNavigation('/messages')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      isActive('/messages') ? 'bg-rose-50 text-rose-700' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Messages
                  </button>
                </>
              )}
            </nav>

            <div className="mt-8 pt-6 border-t border-gray-200">
              {!user ? (
                <div className="space-y-3">
                  <button
                    onClick={() => handleNavigation('/vendor-login')}
                    className="w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Vendor Login
                  </button>
                  <button
                    onClick={() => handleNavigation('/viewer-login')}
                    className="w-full btn-primary"
                  >
                    Sign In
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}

