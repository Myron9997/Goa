import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Lock, Check } from 'lucide-react';
import { useSupabase } from '../context/SupabaseContext';
import { AuthService } from '../services/authService';
import { CATEGORIES } from '../constants';

interface VendorSignupForm {
  businessName: string;
  categories: string[];
  email: string;
  password: string;
  confirmPassword: string;
}

export function VendorSignup() {
  const navigate = useNavigate();
  const { signUp } = useSupabase();
  const [form, setForm] = useState<VendorSignupForm>({
    businessName: '',
    categories: [],
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Partial<VendorSignupForm>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<VendorSignupForm> = {};

    if (!form.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }

    if (form.categories.length === 0) {
      newErrors.categories = 'Please select at least one category';
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!form.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof VendorSignupForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCategoryToggle = (category: string) => {
    setForm(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
    if (errors.categories) {
      setErrors(prev => ({ ...prev, categories: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      console.log('🚀 Starting vendor signup process...');
      console.log('📧 Email:', form.email);
      console.log('🏢 Business Name:', form.businessName);
      
      // Check if email already exists with different role
      console.log('🔍 Checking if email exists...');
      const emailCheck = await AuthService.checkEmailExists(form.email);
      console.log('📋 Email check result:', emailCheck);
      
      if (emailCheck.exists && emailCheck.role === 'viewer') {
        console.log('❌ Email exists as viewer, blocking signup');
        setErrors({ email: 'This email is already registered as a viewer. Please use the viewer login page.' });
        return;
      }
      
      console.log('✅ Email check passed, proceeding with signup...');
      console.log('📤 Calling signUp with role: vendor');
      
      const result = await signUp(form.email, form.password, form.businessName, 'vendor');
      console.log('🎉 Signup result:', result);
      
      if (result && result.user) {
        console.log('✅ User created successfully:', result.user.id);
        console.log('📧 Email confirmation sent:', result.user.email_confirmed_at ? 'Already confirmed' : 'Pending confirmation');
        
        // Navigate to confirmation page with email
        console.log('🔄 Navigating to email confirmation page...');
        navigate('/email-confirmation', { 
          state: { email: form.email } 
        });
      } else {
        console.log('❌ No user returned from signup');
        setErrors({ email: 'Signup failed. Please try again.' });
      }
    } catch (error: any) {
      console.error('💥 Signup error:', error);
      console.error('📝 Error details:', {
        message: error.message,
        code: error.code,
        status: error.status,
        details: error.details
      });
      setErrors({ email: error.message || 'Something went wrong. Please try again.' });
    } finally {
      console.log('🏁 Signup process finished, setting isSubmitting to false');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Vendor Sign Up</h1>
            <p className="text-gray-600">Create your vendor account to start listing services</p>
          </div>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Business Name */}
            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
                Business Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={form.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  className={`input-field pl-10 ${errors.businessName ? 'border-red-300 focus:ring-red-500' : ''}`}
                  placeholder="Enter your business name"
                />
              </div>
              {errors.businessName && <p className="text-sm text-red-600 mt-1">{errors.businessName}</p>}
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Categories
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.filter(cat => cat !== 'All').map(category => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleCategoryToggle(category)}
                    className={`flex items-center gap-2 p-3 rounded-lg border text-sm font-medium transition-colors ${
                      form.categories.includes(category)
                        ? 'bg-rose-50 border-rose-300 text-rose-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                      form.categories.includes(category)
                        ? 'bg-rose-500 border-rose-500'
                        : 'border-gray-300'
                    }`}>
                      {form.categories.includes(category) && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    {category}
                  </button>
                ))}
              </div>
              {errors.categories && <p className="text-sm text-red-600 mt-1">{errors.categories}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`input-field pl-10 ${errors.email ? 'border-red-300 focus:ring-red-500' : ''}`}
                  placeholder="Enter your email address"
                />
              </div>
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`input-field pl-10 ${errors.password ? 'border-red-300 focus:ring-red-500' : ''}`}
                  placeholder="Enter your password"
                />
              </div>
              {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`input-field pl-10 ${errors.confirmPassword ? 'border-red-300 focus:ring-red-500' : ''}`}
                  placeholder="Confirm your password"
                />
              </div>
              {errors.confirmPassword && <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating Account...' : 'Create Vendor Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/vendor-login')}
                className="text-rose-700 hover:text-rose-800 font-medium"
              >
                Sign In
              </button>
            </p>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Are you a viewer?{' '}
              <button
                onClick={() => navigate('/viewer-login')}
                className="text-rose-700 hover:text-rose-800 font-medium"
              >
                Viewer login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}