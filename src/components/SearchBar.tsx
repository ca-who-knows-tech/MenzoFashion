import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

export const SearchBar: React.FC = () => {
  const { searchResults, searchQuery, performSearch, clearSearch, recentSearches, addRecentSearch } = useSearch();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounce search to reduce re-renders and fetches
  useEffect(() => {
    const t = setTimeout(() => {
      const query = inputValue.trim();
      if (query) {
        performSearch(query);
        setIsOpen(true);
      } else {
        clearSearch();
        setIsOpen(false);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [inputValue, performSearch, clearSearch]);

  const handleResultClick = (query: string) => {
    addRecentSearch(query);
    setIsOpen(false);
    setInputValue('');
    clearSearch();
  };

  const handleRecentSearch = (query: string) => {
    setInputValue(query);
    performSearch(query);
    setIsOpen(true);
  };

  return (
    <div ref={searchRef} className="relative flex-1">
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search products, categories..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => inputValue.trim() && setIsOpen(true)}
          className="w-full px-3 py-1.5 pl-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        {inputValue && (
          <button
            onClick={() => {
              setInputValue('');
              clearSearch();
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {/* Search Results */}
          {searchQuery && searchResults.length > 0 && (
            <>
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50 sticky top-0">
                Results for "{searchQuery}"
              </div>
              <div className="divide-y">
                {searchResults.map(result => (
                  <Link
                    key={result.id}
                    to={`/product/${result.id}`}
                    onClick={() => handleResultClick(searchQuery)}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition"
                  >
                    <img
                      src={result.image}
                      alt={result.name}
                      className="h-10 w-10 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{result.name}</p>
                      <p className="text-xs text-gray-500">{result.category}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">₹{result.price}</p>
                  </Link>
                ))}
              </div>
            </>
          )}

          {/* No Results */}
          {searchQuery && searchResults.length === 0 && (
            <div className="px-4 py-6 text-center">
              <p className="text-gray-500">No products found for "{searchQuery}"</p>
            </div>
          )}

          {/* Recent Searches */}
          {!searchQuery && recentSearches.length > 0 && (
            <>
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50 sticky top-0">
                Recent Searches
              </div>
              <div className="divide-y">
                {recentSearches.map((search, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleRecentSearch(search)}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-gray-50 transition"
                  >
                    <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{search}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Popular Searches */}
          {!searchQuery && recentSearches.length === 0 && (
            <>
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50">
                Popular Searches
              </div>
              <div className="divide-y">
                {['T-Shirts', 'Jeans', 'Hoodies', 'Accessories', 'Winterwear'].map(search => (
                  <button
                    key={search}
                    onClick={() => handleRecentSearch(search)}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-gray-50 transition"
                  >
                    <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{search}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
