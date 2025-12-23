import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { StarIcon, HeartIcon } from '@heroicons/react/24/solid';
import { useRecommendation } from '../context/RecommendationContext';
import { useWishlist } from '../context/WishlistContext';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  rating?: number;
  reviews?: number;
}

interface ProductRecommendationsProps {
  currentProductId?: number;
  title?: string;
}

const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({
  currentProductId,
  title = 'Recommended For You',
}) => {
  const { getRecommendations, trendingProducts } = useRecommendation();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      const recs = await getRecommendations(currentProductId);
      setProducts(recs.length > 0 ? recs : trendingProducts.slice(0, 6));
      setLoading(false);
    };
    fetchRecommendations();
  }, [currentProductId, getRecommendations, trendingProducts]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-64 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition group"
          >
            <div className="relative overflow-hidden bg-gray-100 h-40">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                loading="lazy"
                decoding="async"
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (isInWishlist(product.id)) {
                    removeFromWishlist(product.id);
                  } else {
                    addToWishlist(product.id);
                  }
                }}
                className={`absolute top-2 right-2 p-1.5 rounded-full transition ${
                  isInWishlist(product.id)
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-200'
                }`}
              >
                <HeartIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="p-3">
              <p className="text-xs text-gray-500 uppercase">{product.category}</p>
              <h3 className="font-semibold text-sm line-clamp-2 mb-2">{product.name}</h3>
              <div className="flex items-center justify-between">
                <p className="font-bold text-sm">₹{product.price}</p>
              </div>
              {product.rating && (
                <div className="flex items-center gap-1 mt-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.round(product.rating!) ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-600">({product.reviews})</span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductRecommendations;
