import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Store, Heart, Calendar, MapPin, Star } from 'lucide-react';

export function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100">
      <div className="container mx-auto px-6 py-3 md:py-8">
        {/* Header */}
        <div className="text-center mb-4 md:mb-12">
                <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold text-gray-900 mb-2 md:mb-4">
                  Goa FYI
                </h1>
                <p className="text-sm md:text-xl text-gray-600 max-w-2xl mx-auto px-2">
                  What you need for your event. Find vendors or showcase your services.
                </p>
        </div>

        {/* Main Options */}
        <div className="max-w-4xl mx-auto mb-4 md:mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-8">
            {/* Viewer Option */}
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl p-4 md:p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 md:hover:-translate-y-2">
              <div className="text-center">
                <div className="w-12 h-12 md:w-20 md:h-20 bg-gradient-to-br from-rose-500 to-rose-700 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-6">
                  <Heart className="w-6 h-6 md:w-10 md:h-10 text-white" />
                </div>
                
                <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-2 md:mb-4">
                  I'm Planning an Event
                </h2>
                
                <p className="text-xs md:text-base text-gray-600 mb-3 md:mb-6">
                  Find and connect with the best event vendors in your area. Save your favorites and get quotes.
                </p>

                <div className="space-y-1 md:space-y-3 mb-4 md:mb-8">
                  <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-600">
                    <Calendar className="w-3 h-3 md:w-4 md:h-4 text-rose-500" />
                    <span>Browse vendor portfolios</span>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-600">
                    <MapPin className="w-3 h-3 md:w-4 md:h-4 text-rose-500" />
                    <span>Find local vendors</span>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-600">
                    <Star className="w-3 h-3 md:w-4 md:h-4 text-rose-500" />
                    <span>Save favorites</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/viewer-login')}
                  className="w-full bg-gradient-to-r from-rose-500 to-rose-700 text-white py-2 md:py-4 px-4 md:px-8 rounded-lg md:rounded-xl font-semibold text-sm md:text-lg hover:from-rose-600 hover:to-rose-800 transition-all duration-300 transform hover:scale-105"
                >
                  Continue as Viewer
                </button>
              </div>
            </div>

            {/* Vendor Option */}
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl p-4 md:p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 md:hover:-translate-y-2">
              <div className="text-center">
                <div className="w-12 h-12 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-6">
                  <Store className="w-6 h-6 md:w-10 md:h-10 text-white" />
                </div>
                
                <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-2 md:mb-4">
                  I'm What You Need for Your Event
                </h2>
                
                <p className="text-xs md:text-base text-gray-600 mb-3 md:mb-6">
                  Showcase your services, connect with event planners, and grow your business.
                </p>

                <div className="space-y-1 md:space-y-3 mb-4 md:mb-8">
                  <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-600">
                    <Users className="w-3 h-3 md:w-4 md:h-4 text-blue-500" />
                    <span>Create vendor profile</span>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-600">
                    <Calendar className="w-3 h-3 md:w-4 md:h-4 text-blue-500" />
                    <span>Manage bookings</span>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-600">
                    <Star className="w-3 h-3 md:w-4 md:h-4 text-blue-500" />
                    <span>Get reviews & ratings</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/vendor-login')}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2 md:py-4 px-4 md:px-8 rounded-lg md:rounded-xl font-semibold text-sm md:text-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-300 transform hover:scale-105"
                >
                  Continue as Vendor
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
