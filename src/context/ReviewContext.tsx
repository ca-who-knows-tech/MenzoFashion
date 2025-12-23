import React, { createContext, useState, useContext, useEffect } from 'react';

export interface Review {
  id: number;
  productId: number;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  text: string;
  date: string;
  helpful: number;
  verified?: boolean;
}

interface ReviewContextType {
  reviews: Review[];
  getProductReviews: (productId: number) => Review[];
  addReview: (review: Omit<Review, 'id' | 'helpful' | 'date'>) => Promise<void>;
  deleteReview: (reviewId: number) => Promise<void>;
  markHelpful: (reviewId: number) => Promise<void>;
  getAverageRating: (productId: number) => number;
  getReviewCount: (productId: number) => number;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export const ReviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<Review[]>([]);

  // Load reviews from backend
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('http://localhost:5000/reviews');
        const data = await response.json();
        setReviews(data || []);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, []);

  const getProductReviews = (productId: number): Review[] => {
    return reviews.filter(r => r.productId === productId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const addReview = async (review: Omit<Review, 'id' | 'helpful' | 'date'>) => {
    try {
      const newReview = {
        ...review,
        date: new Date().toISOString().split('T')[0],
        helpful: 0,
        verified: true,
      };

      const response = await fetch('http://localhost:5000/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview),
      });

      if (response.ok) {
        const createdReview = await response.json();
        setReviews([...reviews, createdReview]);
      }
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  };

  const deleteReview = async (reviewId: number) => {
    try {
      const response = await fetch(`http://localhost:5000/reviews/${reviewId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setReviews(reviews.filter(r => r.id !== reviewId));
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  };

  const markHelpful = async (reviewId: number) => {
    try {
      const review = reviews.find(r => r.id === reviewId);
      if (!review) return;

      const updatedReview = { ...review, helpful: review.helpful + 1 };

      const response = await fetch(`http://localhost:5000/reviews/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedReview),
      });

      if (response.ok) {
        setReviews(reviews.map(r => r.id === reviewId ? updatedReview : r));
      }
    } catch (error) {
      console.error('Error marking review helpful:', error);
    }
  };

  const getAverageRating = (productId: number): number => {
    const productReviews = getProductReviews(productId);
    if (productReviews.length === 0) return 0;
    const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / productReviews.length) * 10) / 10;
  };

  const getReviewCount = (productId: number): number => {
    return getProductReviews(productId).length;
  };

  return (
    <ReviewContext.Provider value={{ reviews, getProductReviews, addReview, deleteReview, markHelpful, getAverageRating, getReviewCount }}>
      {children}
    </ReviewContext.Provider>
  );
};

export const useReview = (): ReviewContextType => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReview must be used within ReviewProvider');
  }
  return context;
};
