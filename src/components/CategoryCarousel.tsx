import React, { useState, useEffect } from 'react';
import { X, List } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { VendorService } from '../services/vendorService';

interface CategoryCarouselProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategoryCarousel({ activeCategory, onSelectCategory }: CategoryCarouselProps) {
  const [showCategoryList, setShowCategoryList] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<string[]>(['All']);

  // Load available categories from database and merge with constants
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const dbCategories = await VendorService.getCategories();
        console.log('Raw categories from DB:', dbCategories);
        
        // Extract individual categories from comma-separated strings
        const dbCategorySet = new Set<string>();
        dbCategories.forEach(catString => {
          if (catString) {
            catString.split(',').forEach(cat => {
              const trimmed = cat.trim();
              if (trimmed) dbCategorySet.add(trimmed);
            });
          }
        });
        
        // Start with all predefined categories from constants
        const allCategories = new Set(CATEGORIES.filter(cat => cat !== 'All'));
        
        // Add any additional categories found in the database
        dbCategorySet.forEach(cat => allCategories.add(cat));
        
        const finalCategories = ['All', ...Array.from(allCategories).sort()];
        console.log('Final categories:', finalCategories);
        setAvailableCategories(finalCategories);
      } catch (error) {
        console.error('Error loading categories:', error);
        // Fallback to constants if database fails
        setAvailableCategories(CATEGORIES);
      }
    };
    loadCategories();
  }, []);

  const handleCategorySelect = (category: string) => {
    onSelectCategory(category);
    setShowCategoryList(false);
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex gap-3 items-center">
          {/* All button - smaller */}
          <button
            onClick={() => onSelectCategory('All')}
            className={`flex-shrink-0 px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-200 focus:outline-none ${
              activeCategory === 'All'
                ? 'bg-rose-700 text-white border-rose-700 shadow-md'
                : 'bg-white text-gray-700 border-gray-200 hover:border-rose-300 hover:bg-rose-50'
            }`}
          >
            All
          </button>

          {/* List button */}
          <button
            onClick={() => setShowCategoryList(true)}
            className="flex-shrink-0 px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:border-rose-300 hover:bg-rose-50 transition-all duration-200 focus:outline-none flex items-center gap-2"
          >
            <List className="w-4 h-4" />
            <span className="text-sm font-medium">List</span>
          </button>

        </div>
      </div>

      {/* Category List Popup */}
      {showCategoryList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Select Category</h3>
              <button
                onClick={() => setShowCategoryList(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Scrollable category list */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {availableCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                    className={`w-full text-left px-4 py-3 rounded-lg border text-sm font-medium transition-all duration-200 focus:outline-none ${
                      activeCategory === category
                        ? 'bg-rose-700 text-white border-rose-700 shadow-md'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-rose-300 hover:bg-rose-50'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

