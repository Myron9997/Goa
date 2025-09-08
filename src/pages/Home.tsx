import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus } from 'lucide-react';
import { VendorService, type VendorWithUser } from '../services/vendorService';
import { MessageCircle } from 'lucide-react';
import { VendorCard } from '../components/VendorCard';
import { CategoryCarousel } from '../components/CategoryCarousel';
import { CATEGORIES } from '../constants';

export function Home() {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState<VendorWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');

  // Load vendors from Supabase (lite)
  useEffect(() => {
    const loadVendors = async () => {
      try {
        setLoading(true);
        // Fetch minimal fields for performance
        const lite = await VendorService.getVendorsLite();
        // Coerce to VendorWithUser-compatible shape where needed
        setVendors(lite as any);
      } catch (error) {
        console.error('Error loading vendors:', error);
      } finally {
        setLoading(false);
      }
    };

    loadVendors();
  }, []);

  const filteredVendors = useMemo(() => {
    let filtered = vendors;
    
    // Filter by category
    if (activeCategory !== 'All') {
      filtered = filtered.filter(vendor => {
        if (!vendor.category) return false;
        // Handle comma-separated categories
        const categories = vendor.category.split(',').map(cat => cat.trim().toLowerCase());
        return categories.includes(activeCategory.toLowerCase());
      });
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(vendor => 
        vendor.business_name.toLowerCase().includes(query) ||
        (vendor.category && vendor.category.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  }, [vendors, activeCategory, searchQuery]);


  const handleVendorClick = (vendor: VendorWithUser) => {
    navigate(`/vendor/${vendor.id}`);
  };

  const handleCategorySelect = (category: string) => {
    setActiveCategory(category);
    setSearchQuery(''); // Clear search when changing category
    setSearchInput(''); // Clear search input when changing category
  };

  const handleSearchInputChange = (query: string) => {
    setSearchInput(query);
  };

  const handleSearch = () => {
    setSearchQuery(searchInput);
    if (searchInput.trim()) {
      setActiveCategory('All'); // Reset category when searching
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vendors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 safe-area pb-20">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-5">

        {/* Search and Categories (sticky search on mobile) */}
        <div className="space-y-3">
          <div className="sticky top-[56px] z-30">
            <div className="bg-white rounded-2xl p-3 shadow-sm">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search vendors, locations, or services..."
                    value={searchInput}
                    onChange={(e) => handleSearchInputChange(e.target.value)}
                    className="w-full pl-3 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="px-4 py-3 bg-rose-700 text-white rounded-lg hover:bg-rose-800 transition-colors flex items-center justify-center"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <CategoryCarousel 
            activeCategory={activeCategory}
            onSelectCategory={handleCategorySelect}
          />
        </div>


        {/* All Results */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {activeCategory === 'All' ? 'All Vendors' : activeCategory}
              <span className="text-lg font-normal text-gray-500 ml-2">
                ({filteredVendors.length} {filteredVendors.length === 1 ? 'vendor' : 'vendors'})
              </span>
            </h2>
            {filteredVendors.length > 0 && (
              <div className="w-8 h-1 bg-gradient-to-r from-rose-500 to-rose-700 rounded-full"></div>
            )}
          </div>

          {filteredVendors.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No vendors found</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery.trim() 
                  ? `No vendors match your search for "${searchQuery}"`
                  : `No vendors found in the ${activeCategory} category`
                }
              </p>
              <div className="space-x-3">
                {searchQuery.trim() && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSearchInput('');
                    }}
                    className="btn-secondary"
                  >
                    Clear Search
                  </button>
                )}
                <button
                  onClick={() => setActiveCategory('All')}
                  className="btn-primary"
                >
                  View All Vendors
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {filteredVendors.map((vendor: any) => (
                <div key={vendor.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div 
                    className="h-32 w-full bg-cover bg-center cursor-pointer" 
                    style={{ backgroundImage: `url('${(vendor.portfolio_images && vendor.portfolio_images[0]) || '/placeholder-image.svg'}')` }}
                    onClick={() => handleVendorClick(vendor)}
                  />
                  <div className="p-3">
                    <div className="mb-3">
                      <h3 className="font-semibold text-gray-900 text-sm truncate">{vendor.business_name}</h3>
                      <p className="text-xs text-gray-500 truncate">{vendor.category}</p>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/messages', { state: { otherUserId: vendor.user_id, otherUserName: vendor.business_name } });
                      }} 
                      className="w-full bg-rose-700 text-white text-xs py-2 px-3 rounded-lg hover:bg-rose-800 transition-colors flex items-center justify-center gap-1"
                    >
                      <MessageCircle className="w-3 h-3" />
                      Message
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}

