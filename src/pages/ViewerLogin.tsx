import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, User } from 'lucide-react';
import { useSupabase } from '../context/SupabaseContext';
import { supabase } from '../lib/supabase';

export function ViewerLogin() {
  const navigate = useNavigate();
  const { signUp } = useSupabase();
  const [isSignUp, setIsSignUp] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Lock scroll while on this page and default to login view
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    setIsSignUp(false);
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const validateForm = (): boolean => {
    if (isSignUp && !form.fullName.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!form.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError('Please enter a valid email');
      return false;
    }
    if (!form.password.trim()) {
      setError('Password is required');
      return false;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (isSignUp && form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (isSignUp) {
        console.log('🟢 ViewerLogin: starting sign-up', { email: form.email });
        await signUp(form.email, form.password, form.fullName, 'viewer');
        navigate('/email-confirmation', { state: { email: form.email } });
      } else {
        // Simple sign-in with password
        const { data, error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password
        });

        console.log("ViewerLogin signIn response", { data, error });

        if (error) {
          setError("Sign in error: " + error.message);
          return;
        }

        // Check that session exists
        if (data?.session) {
          console.log("ViewerLogin session token:", data.session.access_token);
          // The auth state change listener will handle the redirect
          // But add a fallback redirect in case the listener doesn't fire
          setTimeout(() => {
            console.log("ViewerLogin: fallback redirect to /home after 1 second");
            window.location.href = '/home';
          }, 1000);
        } else {
          setError("Signed in, but session not present. Please try again.");
        }
      }
    } catch (err: any) {
      console.error('💥 ViewerLogin: exception', err);
      setError(err?.message || 'Something went wrong. Please try again.');
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
          <h1 className="text-2xl font-serif font-bold text-gray-900">
            {isSignUp ? 'Viewer Sign Up' : 'Viewer Login'}
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            {isSignUp && (
              <div>
                <label htmlFor="fullName" className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={form.fullName}
                    onChange={(e) => setForm(prev => ({ ...prev, fullName: e.target.value }))}
                    className="input-field pl-9 text-sm py-2"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
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
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  value={form.password}
                  onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
                  className="input-field pl-9 text-sm py-2"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {isSignUp && (
              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="input-field pl-9 text-sm py-2"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>
            )}

            {error && <p className="text-xs text-red-600">{error}</p>}

            <button type="submit" disabled={isLoading} className="w-full btn-primary disabled:opacity-50 text-sm py-2">
              {isLoading 
                ? (isSignUp ? 'Creating Account...' : 'Signing In...') 
                : (isSignUp ? 'Create Account' : 'Sign In')
              }
            </button>
          </form>

          <div className="mt-4 text-center text-xs text-gray-600">
            <span>{isSignUp ? 'Already have an account?' : "Don't have an account?"} </span>
            <button 
              onClick={() => {
                setIsSignUp(!isSignUp);
                setForm({ fullName: '', email: '', password: '', confirmPassword: '' });
                setError(null);
              }} 
              className="text-rose-700 hover:text-rose-800 font-medium"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
