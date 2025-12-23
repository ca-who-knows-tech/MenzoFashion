import React, { createContext, useState, useContext, useEffect } from 'react';

export interface SearchResult {
  id: number;
  name: string;
  image: string;
  price: number;
  category: string;
  rating?: number;
}

interface SearchContextType {
  searchResults: SearchResult[];
  searchQuery: string;
  performSearch: (query: string) => Promise<void>;
  clearSearch: () => void;
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('menzo_recent_searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setSearchQuery('');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/products');
      const allProducts: any[] = await response.json();

      // Filter products by name, category, or description
      const filtered = allProducts.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 10); // Limit to 10 results

      setSearchResults(filtered);
      setSearchQuery(query);
    } catch (error) {
      console.error('Error performing search:', error);
      setSearchResults([]);
    }
  };

  const clearSearch = () => {
    setSearchResults([]);
    setSearchQuery('');
  };

  const addRecentSearch = (query: string) => {
    if (!query.trim()) return;

    const updated = [query, ...recentSearches.filter(q => q !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('menzo_recent_searches', JSON.stringify(updated));
  };

  return (
    <SearchContext.Provider value={{ searchResults, searchQuery, performSearch, clearSearch, recentSearches, addRecentSearch }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within SearchProvider');
  }
  return context;
};
