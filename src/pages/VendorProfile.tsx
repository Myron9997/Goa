import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, MapPin, Globe, Instagram, Facebook, Mail, Phone } from 'lucide-react';
import { VendorService, type VendorWithUser } from '../services/vendorService';

export function VendorProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState<VendorWithUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVendor = async () => {
      if (!id) {
        setError('Vendor ID not provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const vendorData = await VendorService.getVendorById(id);
        setVendor(vendorData);
      } catch (err) {
        console.error('Error loading vendor:', err);
        setError('Failed to load vendor profile');
      } finally {
        setLoading(false);
      }
    };

    loadVendor();
  }, [id]);

  const handleMessageClick = () => {
    if (vendor) {
      navigate('/messages', { 
        state: { 
          otherUserId: vendor.user_id, 
          otherUserName: vendor.business_name 
        } 
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vendor profile...</p>
        </div>
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Vendor not found</h3>
          <p className="text-gray-500 mb-6">{error || 'This vendor profile could not be found.'}</p>
          <button
            onClick={() => navigate('/home')}
            className="btn-primary"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const coverImage = vendor.portfolio_images && vendor.portfolio_images[0] 
    ? vendor.portfolio_images[0] 
    : '/placeholder-image.svg';
  
  const profileImage = vendor.avatar_url || '/placeholder-image.svg';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with back button */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/home')}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Vendor Profile</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Cover Photo */}
        <div className="relative h-48 sm:h-64">
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url('${coverImage}')` }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-20" />
        </div>

        {/* Profile Section */}
        <div className="relative -mt-16 px-4 pb-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {/* Profile Picture */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden -mt-12">
                <img
                  src={profileImage}
                  alt={vendor.business_name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mt-4 text-center">
                {vendor.business_name}
              </h2>
              <p className="text-gray-600 text-center">
                {vendor.full_name}
              </p>
            </div>

            {/* Business Category */}
            {vendor.category && (
              <div className="flex justify-center mb-6">
                <span className="bg-rose-100 text-rose-700 px-4 py-2 rounded-full text-sm font-medium">
                  {vendor.category}
                </span>
              </div>
            )}

            {/* Contact Information */}
            <div className="space-y-4 mb-6">
              {vendor.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{vendor.email}</span>
                </div>
              )}
              
              {vendor.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{vendor.phone}</span>
                </div>
              )}

              {vendor.location && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{vendor.location}</span>
                </div>
              )}
            </div>

            {/* Social Media Links */}
            <div className="flex flex-wrap gap-3 mb-6">
              {vendor.social_media?.website && (
                <a
                  href={vendor.social_media.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-sm">Website</span>
                </a>
              )}
              
              {vendor.social_media?.instagram && (
                <div className="flex gap-2">
                  <a
                    href={(() => {
                      // Extract username from Instagram URL
                      const instagramUrl = vendor.social_media.instagram;
                      let username = '';
                      
                      // Handle different Instagram URL formats
                      if (instagramUrl.includes('instagram.com/')) {
                        username = instagramUrl.split('instagram.com/')[1].split('/')[0].replace('@', '');
                      }
                      
                      if (username) {
                        // Try DM link format
                        const message = encodeURIComponent("Hey! I came across your profile on GoaFYI and I'm interested in your services for my upcoming event. Could you please share more details?");
                        return `https://www.instagram.com/direct/new/?recipient=${username}&text=${message}`;
                      }
                      
                      // Fallback to original URL if username extraction fails
                      return instagramUrl;
                    })()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-pink-100 text-pink-700 px-3 py-2 rounded-lg hover:bg-pink-200 transition-colors flex-1"
                  >
                    <Instagram className="w-4 h-4" />
                    <span className="text-sm">Message on Instagram</span>
                  </a>
                  
                  <a
                    href={vendor.social_media.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                    title="View Instagram Profile"
                  >
                    <Instagram className="w-4 h-4" />
                    <span className="text-sm">Profile</span>
                  </a>
                </div>
              )}
              
              {vendor.social_media?.facebook && (
                <a
                  href={vendor.social_media.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                  <span className="text-sm">Facebook</span>
                </a>
              )}
            </div>

            {/* Message Button */}
            <button
              onClick={handleMessageClick}
              className="w-full bg-rose-700 text-white py-3 px-6 rounded-lg font-semibold hover:bg-rose-800 transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Send Message
            </button>
          </div>
        </div>

        {/* Portfolio Images */}
        {vendor.portfolio_images && vendor.portfolio_images.length > 1 && (
          <div className="px-4 pb-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {vendor.portfolio_images.slice(1).map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-lg bg-cover bg-center"
                    style={{ backgroundImage: `url('${image}')` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
