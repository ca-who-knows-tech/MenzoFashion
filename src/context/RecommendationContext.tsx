import React, { createContext, useState, useContext, useEffect } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  rating?: number;
  reviews?: number;
}

interface RecommendationContextType {
  recommendations: Product[];
  trendingProducts: Product[];
  browseHistory: number[];
  addToBrowseHistory: (productId: number) => void;
  getRecommendations: (currentProductId?: number) => Promise<Product[]>;
}

const RecommendationContext = createContext<RecommendationContextType | undefined>(undefined);

export const RecommendationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [browseHistory, setBrowseHistory] = useState<number[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  // Load browse history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('menzo_browse_history');
    if (saved) {
      setBrowseHistory(JSON.parse(saved));
    }
  }, []);

  // Fetch all products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/products');
        const data = await response.json();
        setAllProducts(data);
        calculateTrending(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  // Calculate trending products based on average rating and review count
  const calculateTrending = (products: Product[]) => {
    const trending = [...products]
      .sort((a, b) => {
        const scoreA = (a.rating || 0) * (a.reviews || 0);
        const scoreB = (b.rating || 0) * (b.reviews || 0);
        return scoreB - scoreA;
      })
      .slice(0, 8);
    setTrendingProducts(trending);
  };

  // Add product to browse history
  const addToBrowseHistory = (productId: number) => {
    setBrowseHistory((prev) => {
      // Keep only last 20 items, remove duplicates
      const updated = [productId, ...prev.filter((id) => id !== productId)].slice(0, 20);
      localStorage.setItem('menzo_browse_history', JSON.stringify(updated));
      return updated;
    });
  };

  // Get personalized recommendations
  const getRecommendations = async (currentProductId?: number): Promise<Product[]> => {
    if (allProducts.length === 0) return [];

    // Get categories from browse history
    const browseCategories = browseHistory
      .slice(0, 5) // Last 5 browsed items
      .map((id) => allProducts.find((p) => p.id === id)?.category)
      .filter(Boolean);

    let recommended = allProducts.filter((p) => {
      // Don't recommend current product or already browsed
      if (currentProductId && p.id === currentProductId) return false;
      if (browseHistory.includes(p.id)) return false;

      // Prioritize products from categories user browsed
      return browseCategories.includes(p.category);
    });

    // If not enough recommendations, add trending products
    if (recommended.length < 6) {
      const trending = trendingProducts.filter(
        (p) => p.id !== currentProductId && !browseHistory.includes(p.id) && !recommended.find((r) => r.id === p.id)
      );
      recommended = [...recommended, ...trending];
    }

    // Sort by rating and limit to 6
    const sorted = recommended
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 6);

    setRecommendations(sorted);
    return sorted;
  };

  return (
    <RecommendationContext.Provider
      value={{
        recommendations,
        trendingProducts,
        browseHistory,
        addToBrowseHistory,
        getRecommendations,
      }}
    >
      {children}
    </RecommendationContext.Provider>
  );
};

export const useRecommendation = () => {
  const context = useContext(RecommendationContext);
  if (!context) {
    throw new Error('useRecommendation must be used within RecommendationProvider');
  }
  return context;
};
