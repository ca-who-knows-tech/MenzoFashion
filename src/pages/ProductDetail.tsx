import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useReview } from '../context/ReviewContext';
import { useRecommendation } from '../context/RecommendationContext';
import { HeartIcon } from '@heroicons/react/24/solid';
import { ReviewForm, ReviewsList } from '../components/ReviewsComponent';
import { SizeGuideModal } from '../components/SizeGuideModal';
import { StockIndicator } from '../components/StockIndicator';
import ProductRecommendations from '../components/ProductRecommendations';
import { useToast } from '../context/ToastContext';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  const { getAverageRating, getReviewCount } = useReview();
  const { addToBrowseHistory } = useRecommendation();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5000/products/${id}`);
        const data = await response.json();
        setProduct(data);
        // Track in browse history
        if (id) {
          addToBrowseHistory(parseInt(id));
        }
        // Load last selected size/color or preselect defaults
        const key = `menzo_selection_${id}`;
        const saved = key ? localStorage.getItem(key) : null;
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed.size) setSelectedSize(parsed.size);
            if (parsed.color) setSelectedColor(parsed.color);
          } catch {}
        } else {
          if (data?.sizes?.length) setSelectedSize(data.sizes[0]);
          if (data?.colors?.length) setSelectedColor(data.colors[0]);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id, addToBrowseHistory]);

  // Persist selection changes
  useEffect(() => {
    if (!id) return;
    const key = `menzo_selection_${id}`;
    localStorage.setItem(key, JSON.stringify({ size: selectedSize, color: selectedColor }));
  }, [id, selectedSize, selectedColor]);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (!product) return <div className="text-center py-8">Product not found</div>;

  return (
    <div>
      <Helmet>
        <title>{product ? `${product.name} — Menzo Fashion` : 'Product — Menzo Fashion'}</title>
        <meta name="description" content={product ? `Buy ${product.name} at Menzo Fashion. Great price, fast delivery.` : 'View product details at Menzo Fashion.'} />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : ''} />
        <meta property="og:type" content="product" />
        <meta property="og:title" content={product ? `${product.name} — Menzo Fashion` : 'Product — Menzo Fashion'} />
        <meta property="og:description" content={product ? `Buy ${product.name} at Menzo Fashion.` : 'View product details at Menzo Fashion.'} />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
        <meta property="og:image" content={product?.image || `${import.meta.env.BASE_URL}logo.svg`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={product ? `${product.name} — Menzo Fashion` : 'Product — Menzo Fashion'} />
        <meta name="twitter:description" content={product ? `Buy ${product.name} at Menzo Fashion.` : 'View product details at Menzo Fashion.'} />
        <meta name="twitter:image" content={product?.image || `${import.meta.env.BASE_URL}logo.svg`} />
      </Helmet>
      <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" decoding="async" />
        </div>
        <div>
          <h1 className="text-4xl font-bold mb-4 text-black">{product.name}</h1>
          
          {/* Use reviews data if available, otherwise fall back to product rating */}
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400 mr-2">
              {(() => {
                const reviewRating = product.id ? getAverageRating(product.id) : product.rating;
                return [...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-5 h-5 ${i < Math.floor(reviewRating) ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ));
              })()}
            </div>
            <span className="text-gray-600">({product.id ? getAverageRating(product.id) : product.rating}) ({product.id ? getReviewCount(product.id) : product.reviews} reviews)</span>
          </div>
          <div className="flex items-center mb-6">
            <span className="text-3xl font-bold text-black mr-4">₹{product.price}</span>
            <span className="text-xl text-gray-500 line-through">₹{product.originalPrice}</span>
            <span className="ml-2 bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-semibold">Save ₹{(product.originalPrice - product.price)}</span>
          </div>
          <p className="text-gray-700 mb-6">{product.description}</p>

          {/* Stock Status */}
          <div className="mb-6">
            <StockIndicator stock={product.stock !== undefined ? product.stock : 10} />
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Size</h3>
              <button
                onClick={() => setSizeGuideOpen(true)}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Size Guide
              </button>
            </div>
            <div className="flex space-x-2">
              {product.sizes.map((size: string) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`border px-4 py-2 rounded transition-colors ${
                    selectedSize === size
                      ? 'border-black bg-black text-white'
                      : 'border-gray-300 hover:border-black hover:text-black'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Color</h3>
            <div className="flex space-x-2">
              {product.colors.map((color: string) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`border px-4 py-2 rounded transition-colors capitalize ${
                    selectedColor === color
                      ? 'border-black bg-black text-white'
                      : color === 'Black'
                      ? 'bg-black text-white border-gray-300'
                      : color === 'White'
                      ? 'bg-white text-black border-gray-300'
                      : `bg-${color.toLowerCase()}-500 text-white`
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => {
                if (!selectedSize || !selectedColor) {
                  alert('Please select a size and color before adding to cart.');
                } else {
                  addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    size: selectedSize,
                    color: selectedColor,
                  });
                  showToast('Added to cart');
                }
              }}
              className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Add to Cart
            </button>
            <button 
              onClick={() => {
                if (isInWishlist(product.id)) {
                  removeFromWishlist(product.id);
                  showToast('Removed from wishlist');
                } else {
                  addToWishlist(product.id);
                  showToast('Added to wishlist');
                }
              }}
              className={`border px-8 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2 ${
                isInWishlist(product.id)
                  ? 'border-red-500 bg-red-50 text-red-600 hover:bg-red-100'
                  : 'border-black text-black hover:bg-black hover:text-white'
              }`}
            >
              <HeartIcon className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
              <span>{isInWishlist(product.id) ? 'In Wishlist' : 'Add to Wishlist'}</span>
            </button>
          </div>
        </div>
      </div>

        {/* Reviews Section */}
        <div className="mt-16 border-t pt-12">
          <ReviewForm productId={product.id} />
          <ReviewsList productId={product.id} />
        </div>
      </div>

      {/* Product Recommendations */}
      <ProductRecommendations currentProductId={product.id} title="Similar Products You Might Like" />

      {/* Size Guide Modal */}
      <SizeGuideModal isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </div>
  );
};

export default ProductDetail;