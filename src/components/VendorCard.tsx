import React from 'react';
import { Heart, Star, MapPin, Phone } from 'lucide-react';
import { VendorWithUser } from '../services/vendorService';

interface VendorCardProps {
  vendor: VendorWithUser;
  onView: () => void;
  compact?: boolean;
}

export function VendorCard({ vendor, onView, compact = false }: VendorCardProps) {
  const [isSaved, setIsSaved] = React.useState(false);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    // TODO: Implement save functionality with Supabase
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (vendor.contact_phone) {
      window.open(`tel:${vendor.contact_phone}`, '_self');
    }
  };

  if (compact) {
    return (
      <div 
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 cursor-pointer hover:shadow-md transition-shadow"
        onClick={onView}
      >
        <div className="flex gap-3">
          <div 
            className="w-16 h-16 bg-cover bg-center rounded-lg flex-shrink-0"
            style={{ backgroundImage: `url('${vendor.portfolio_images[0] || '/placeholder-image.svg'}')` }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{vendor.business_name}</h3>
                <p className="text-sm text-gray-500 truncate">{vendor.category}</p>
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500 truncate">{vendor.location}</span>
                </div>
              </div>
              <button
                onClick={handleSave}
                className={`p-1 rounded-full transition-colors ${
                  isSaved ? 'text-rose-700' : 'text-gray-400 hover:text-rose-700'
                }`}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="text-xs font-medium text-gray-700">{vendor.rating}</span>
              </div>
              <span className="text-sm font-semibold text-rose-700">
                {vendor.price_range || 'Contact for pricing'}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={onView}
    >
      {/* Image */}
      <div 
        className="h-48 bg-cover bg-center relative"
        style={{ backgroundImage: `url('${vendor.portfolio_images[0] || '/placeholder-image.svg'}')` }}
      >
        {vendor.is_verified && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-rose-700 text-white">
              Verified
            </span>
          </div>
        )}
        <button
          onClick={handleSave}
          className={`absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm transition-colors ${
            isSaved ? 'text-rose-700' : 'text-gray-600 hover:text-rose-700'
          }`}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{vendor.business_name}</h3>
            <p className="text-sm text-gray-500 truncate">{vendor.category}</p>
          </div>
          <div className="flex items-center gap-1 ml-2">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-700">{vendor.rating || 'New'}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 mb-3">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500">{vendor.location}</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-semibold text-rose-700">
            {vendor.price_range || 'Contact for pricing'}
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
            Available
          </span>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={onView}
            className="flex-1 btn-primary text-sm py-2"
          >
            View Details
          </button>
          {vendor.contact_phone && (
            <button
              onClick={handleCall}
              className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Phone className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

