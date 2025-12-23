import { Helmet } from 'react-helmet-async';
import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAdmin } from '../context/AdminContext';
import { HeartIcon } from '@heroicons/react/24/solid';
import { useToast } from '../context/ToastContext';

const Catalog: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const { products: allProducts, loading, getCategoryBySlug } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState<[number, number]>([0, 12000]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'popularity' | 'price-asc' | 'price-desc' | 'rating'>('popularity');
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { showToast } = useToast();

  // Filter by category first (from URL param)
  const products = category 
    ? allProducts.filter(p => p.category === category)
    : allProducts;
  
  // Get category info for display
  const categoryInfo = category ? getCategoryBySlug(category) : null;

  const filteredProducts = useMemo(() => {
    const base = products.filter(product => {
      // Search filter
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Price filter
      const matchesPrice = product.price >= priceFilter[0] && product.price <= priceFilter[1];
      
      // Size filter
      const matchesSize = selectedSizes.length === 0 || 
        (product.sizes && product.sizes.some((size: string) => selectedSizes.includes(size)));
      
      // Color filter
      const matchesColor = selectedColors.length === 0 || 
        (product.colors && product.colors.some((color: string) => selectedColors.includes(color)));
      
      return matchesSearch && matchesPrice && matchesSize && matchesColor;
    });

    return base.sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return (b.reviews || 0) - (a.reviews || 0);
    });
  }, [products, searchTerm, priceFilter, sortBy, selectedSizes, selectedColors]);

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>{categoryInfo?.name || 'Catalog'} — Menzo Fashion</title>
        <meta name="description" content="Browse Menzo Fashion catalog. Filter by size, color, and price to find your perfect fit." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : ''} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${categoryInfo?.name || 'Catalog'} — Menzo Fashion`} />
        <meta property="og:description" content="Browse Menzo Fashion catalog." />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
        <meta property="og:image" content={`${import.meta.env.BASE_URL}assets/hot-tees.jpg`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${categoryInfo?.name || 'Catalog'} — Menzo Fashion`} />
        <meta name="twitter:description" content="Browse Menzo Fashion catalog." />
        <meta name="twitter:image" content={`${import.meta.env.BASE_URL}assets/hot-tees.jpg`} />
      </Helmet>
      <div className="bg-gradient-to-r from-yellow-100 via-white to-gray-100 border border-gray-200 rounded-3xl p-6 mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest text-gray-600">Curated for you</p>
          <h1 className="text-4xl font-bold text-black capitalize">{categoryInfo?.name || 'All Products'} Collection</h1>
          <p className="text-gray-700 mt-2">Discover fits, layers, and accessories tailored for the season.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:border-black focus:ring-1 focus:ring-black"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="p-3 border border-gray-300 rounded-lg shadow-sm focus:border-black focus:ring-1 focus:ring-black"
          >
            <option value="popularity">Sort: Popular</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-10 bg-gray-50 border border-gray-100 rounded-lg p-5 shadow-sm">
        <h3 className="text-sm font-medium text-gray-600 mb-3">Refine by price</h3>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <label className="text-xs text-gray-500">Min ₹{priceFilter[0]}</label>
            <label className="text-xs text-gray-500">Max ₹{priceFilter[1]}</label>
          </div>
          <div className="relative h-8 flex items-center">
            {/* Track background */}
            <div className="absolute w-full h-1 bg-gray-200 rounded" />
            {/* Active range track */}
            <div 
              className="absolute h-1 bg-gray-400 rounded"
              style={{
                left: `${(priceFilter[0] / 12000) * 100}%`,
                right: `${100 - (priceFilter[1] / 12000) * 100}%`
              }}
            />
            {/* Min slider */}
            <input
              type="range"
              min={0}
              max={12000}
              step={500}
              value={priceFilter[0]}
              onChange={(e) => {
                const next = Number(e.target.value);
                setPriceFilter([Math.min(next, priceFilter[1] - 500), priceFilter[1]]);
              }}
              className="absolute w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gray-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gray-600 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow"
              style={{ zIndex: priceFilter[0] > 12000 - 1000 ? 5 : 3 }}
            />
            {/* Max slider */}
            <input
              type="range"
              min={0}
              max={12000}
              step={500}
              value={priceFilter[1]}
              onChange={(e) => {
                const next = Number(e.target.value);
                setPriceFilter([priceFilter[0], Math.max(next, priceFilter[0] + 500)]);
              }}
              className="absolute w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gray-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gray-600 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow"
              style={{ zIndex: 4 }}
            />
          </div>
        </div>
      </div>

      {/* Size and Color Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Size Filter */}
        <div className="bg-gray-50 border border-gray-100 rounded-lg p-5 shadow-sm">
          <h3 className="text-sm font-medium text-gray-600 mb-3">Filter by Size</h3>
          <div className="flex flex-wrap gap-2">
            {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'].map(size => (
              <button
                key={size}
                onClick={() => {
                  setSelectedSizes(prev =>
                    prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
                  );
                }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  selectedSizes.includes(size)
                    ? 'bg-black text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-black'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
          {selectedSizes.length > 0 && (
            <button
              onClick={() => setSelectedSizes([])}
              className="text-xs text-gray-500 hover:text-gray-700 mt-3"
            >
              Clear sizes
            </button>
          )}
        </div>

        {/* Color Filter */}
        <div className="bg-gray-50 border border-gray-100 rounded-lg p-5 shadow-sm">
          <h3 className="text-sm font-medium text-gray-600 mb-3">Filter by Color</h3>
          <div className="flex flex-wrap gap-2">
            {['Black', 'White', 'Blue', 'Red', 'Green', 'Yellow', 'Gray'].map(color => (
              <button
                key={color}
                onClick={() => {
                  setSelectedColors(prev =>
                    prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
                  );
                }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  selectedColors.includes(color)
                    ? 'ring-2 ring-offset-2 ring-black'
                    : 'border border-gray-300 hover:border-black'
                }`}
                style={{
                  backgroundColor: color.toLowerCase(),
                  color: ['Black', 'Blue', 'Red', 'Green', 'Gray'].includes(color) ? 'white' : 'black',
                }}
              >
                {color}
              </button>
            ))}
          </div>
          {selectedColors.length > 0 && (
            <button
              onClick={() => setSelectedColors([])}
              className="text-xs text-gray-500 hover:text-gray-700 mt-3"
            >
              Clear colors
            </button>
          )}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center bg-white border border-gray-200 rounded-3xl p-10 shadow-sm">
          <h3 className="text-2xl font-bold text-black mb-2">No items match your filters</h3>
          <p className="text-gray-600 mb-4">Try widening the price range or clearing search to discover more styles.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedSizes([]);
              setSelectedColors([]);
              setPriceFilter([0, 12000]);
            }}
            className="inline-block bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 relative group">
              <div className="aspect-w-1 aspect-h-1 bg-gradient-to-br from-gray-100 to-white relative">
                <span className="absolute top-3 left-3 bg-black text-white text-xs px-3 py-1 rounded-full uppercase">{product.category}</span>
                {/* Wishlist button */}
                <button
                  onClick={() => {
                    const id = Number(product.id);
                    if (wishlist.includes(id)) {
                      removeFromWishlist(id);
                      showToast('Removed from wishlist');
                    } else {
                      addToWishlist(id);
                      showToast('Added to wishlist');
                    }
                  }}
                  className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-yellow-50 transition"
                  title={wishlist.includes(Number(product.id)) ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <HeartIcon className={`h-5 w-5 transition ${wishlist.includes(Number(product.id)) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                </button>
                <img src={product.image} alt={product.name} className="w-full h-64 object-cover" loading="lazy" decoding="async" />
              </div>
              <div className="p-6 flex flex-col gap-3">
                <h3 className="text-xl font-bold text-black leading-tight">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <div className="flex text-yellow-400 items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-4 h-4 ${i < Math.floor(product.rating || 0) ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-sm text-gray-600 ml-2">{product.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">{product.reviews} reviews</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-black">₹{product.price}</p>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/product/${product.id}`}
                    className="flex-1 bg-black text-white py-3 px-4 rounded-lg font-bold hover:bg-gray-800 transition-all duration-300 text-center"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => {
                      const size = product.sizes?.[0] || 'One Size';
                      const color = product.colors?.[0] || 'Default';
                      addToCart({ id: Number(product.id), name: product.name, price: product.price, image: product.image || '', size, color });
                      showToast('Added to cart');
                    }}
                    className="px-4 py-3 border border-black text-black rounded-lg font-semibold hover:bg-black hover:text-white transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Catalog;