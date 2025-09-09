import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock } from 'lucide-react';
import { useSupabase } from '../context/SupabaseContext';
import { AuthService } from '../services/authService';

export function VendorLogin() {
  const navigate = useNavigate();
  const { signIn } = useSupabase();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Lock scroll on vendor login page
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Enter email and password');
      return;
    }
    setIsLoading(true);

    try {
      // Prevent viewers from logging in via vendor page
      const emailInfo = await AuthService.checkEmailExists(email);
      if (emailInfo.exists && emailInfo.role && emailInfo.role !== 'vendor') {
        setError('This email is registered as a viewer. Please use Viewer Login.');
        return;
      }

      // Proceed with sign-in via context (handles redirects)
      await signIn(email, password);
      // Fallback redirect in case listener doesn't fire
      setTimeout(() => {
        window.location.href = '/account';
      }, 1000);
    } catch (err: any) {
      console.error("VendorLogin unexpected error", err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] h-[100dvh] bg-white overflow-hidden">
      <div className="px-4 pt-4">
        <div className="relative mb-4">
          <button onClick={() => navigate('/')} className="absolute left-0 p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Logo Section */}
        <div className="flex justify-center mb-4">
          <div className="w-56 h-56 bg-white rounded-full shadow-sm flex items-center justify-center">
            <img src="/logo.png" alt="GoaFYI Logo" className="w-44 h-44 rounded-full object-cover" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-serif font-bold text-gray-900">Vendor Login</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-9 text-sm py-2"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-9 text-sm py-2"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {error && <p className="text-xs text-red-600">{error}</p>}

            <button type="submit" disabled={isLoading} className="w-full btn-primary disabled:opacity-50 text-sm py-2">
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-4 text-center text-xs text-gray-600">
            <span>Not signed up? </span>
            <button onClick={() => navigate('/signup')} className="text-rose-700 hover:text-rose-800 font-medium">Register here</button>
          </div>
        </div>
      </div>
    </div>
  );
}


