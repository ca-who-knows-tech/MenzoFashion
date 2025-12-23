import React, { useState } from 'react';
import { useReview } from '../context/ReviewContext';
import { useAuth } from '../context/AuthContext';
import { HandThumbUpIcon, StarIcon } from '@heroicons/react/24/outline';

interface ReviewsProps {
  productId: number;
}

export const ReviewsList: React.FC<ReviewsProps> = ({ productId }) => {
  const { getProductReviews, markHelpful, deleteReview, getAverageRating, getReviewCount } = useReview();
  const { user } = useAuth();
  const [sortBy, setSortBy] = useState<'helpful' | 'recent' | 'rating'>('recent');

  const reviews = getProductReviews(productId);
  const avgRating = getAverageRating(productId);
  const reviewCount = getReviewCount(productId);

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'helpful') return b.helpful - a.helpful;
    if (sortBy === 'rating') return b.rating - a.rating;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const getRatingDistribution = () => {
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
      dist[r.rating as keyof typeof dist]++;
    });
    return dist;
  };

  const distribution = getRatingDistribution();

  return (
    <div className="mt-12 border-t pt-8">
      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

      {reviews.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
        </div>
      ) : (
        <>
          {/* Rating Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-2">
                <span className="text-4xl font-bold text-gray-900">{avgRating}</span>
                <span className="text-gray-500 ml-2">/ 5</span>
              </div>
              <div className="flex text-yellow-400 mb-2">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-4 w-4 ${i < Math.floor(avgRating) ? 'fill-current' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600">{reviewCount} verified reviews</p>
            </div>

            <div className="md:col-span-2">
              {[5, 4, 3, 2, 1].map(rating => (
                <div key={rating} className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-gray-600 w-12">{rating} ★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${reviewCount > 0 ? (distribution[rating as keyof typeof distribution] / reviewCount) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">{distribution[rating as keyof typeof distribution]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div className="mb-6 flex items-center gap-4">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'helpful' | 'recent' | 'rating')}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="recent">Most Recent</option>
              <option value="helpful">Most Helpful</option>
              <option value="rating">Highest Rating</option>
            </select>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {sortedReviews.map(review => (
              <div key={review.id} className="border-b pb-6 last:border-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="font-semibold text-gray-900">{review.title}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      by {review.userName} • {new Date(review.date).toLocaleDateString()}
                      {review.verified && <span className="ml-2 text-green-600">✓ Verified Purchase</span>}
                    </p>
                  </div>
                  {user && user.email && review.userId === user.email && (
                    <button
                      onClick={() => deleteReview(review.id)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p className="text-gray-700 mb-4">{review.text}</p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => markHelpful(review.id)}
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
                  >
                    <HandThumbUpIcon className="h-4 w-4" />
                    Helpful ({review.helpful})
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

interface ReviewFormProps {
  productId: number;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ productId }) => {
  const { addReview } = useReview();
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!user) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <p className="text-sm text-blue-800">Please sign in to leave a review.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!title.trim() || !text.trim()) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      await addReview({
        productId,
        userId: user.email || user.sub || 'anonymous',
        userName: user.name || 'Anonymous',
        rating,
        title,
        text,
      });
      setTitle('');
      setText('');
      setRating(5);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Share your review</h3>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-2 rounded mb-4 text-sm">
          Thank you! Your review has been posted.
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-2 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setRating(r)}
                className="focus:outline-none"
              >
                <StarIcon
                  className={`h-6 w-6 cursor-pointer transition ${
                    r <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Sum up your experience"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <div>
          <label htmlFor="text" className="block text-sm font-medium mb-2">
            Review
          </label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Tell us what you think about this product..."
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white font-semibold py-2 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
        >
          {loading ? 'Posting...' : 'Post Review'}
        </button>
      </form>
    </div>
  );
};
