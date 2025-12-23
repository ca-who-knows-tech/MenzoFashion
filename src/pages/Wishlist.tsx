import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { HeartIcon } from '@heroicons/react/24/solid';

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  category: string;
  rating?: number;
  reviews?: number;
}

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/products');
        const allProducts: Product[] = await response.json();
        // Filter products that are in wishlist
        const wishlistProducts = allProducts.filter(p => wishlist.includes(p.id));
        setProducts(wishlistProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [wishlist]);

  const handleRemoveFromWishlist = (productId: number) => {
    removeFromWishlist(productId);
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: 'One Size',
      color: 'Default'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-gray-500">Loading wishlist...</div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Helmet>
          <title>Wishlist — Menzo Fashion</title>
          <meta name="description" content="Your saved items at Menzo Fashion." />
          <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : ''} />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Wishlist — Menzo Fashion" />
          <meta property="og:description" content="Your saved items at Menzo Fashion." />
          <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
          <meta property="og:image" content={`${import.meta.env.BASE_URL}logo.svg`} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Wishlist — Menzo Fashion" />
          <meta name="twitter:description" content="Your saved items at Menzo Fashion." />
          <meta name="twitter:image" content={`${import.meta.env.BASE_URL}logo.svg`} />
        </Helmet>
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
        <div className="text-center py-12">
          <HeartIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Your wishlist is empty</p>
          <p className="text-gray-400 text-sm mt-2">Start adding your favorite items!</p>
          <a
            href="/catalog"
            className="inline-block mt-6 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-6 rounded-lg transition"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Wishlist — Menzo Fashion</title>
        <meta name="description" content="Your saved items at Menzo Fashion." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : ''} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Wishlist — Menzo Fashion" />
        <meta property="og:description" content="Your saved items at Menzo Fashion." />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
        <meta property="og:image" content={`${import.meta.env.BASE_URL}logo.svg`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Wishlist — Menzo Fashion" />
        <meta name="twitter:description" content="Your saved items at Menzo Fashion." />
        <meta name="twitter:image" content={`${import.meta.env.BASE_URL}logo.svg`} />
      </Helmet>
      <h1 className="text-3xl font-bold mb-8">My Wishlist ({products.length})</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition group">
            <div className="relative overflow-hidden bg-gray-100 h-56">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                loading="lazy"
                decoding="async"
              />
              <button
                onClick={() => handleRemoveFromWishlist(product.id)}
                className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition"
                title="Remove from wishlist"
              >
                <HeartIcon className="h-5 w-5 text-red-500 fill-current" />
              </button>
            </div>
            <div className="p-4">
              <p className="text-xs text-gray-500 mb-1">{product.category}</p>
              <h3 className="font-semibold text-sm line-clamp-2 mb-2">{product.name}</h3>
              
              {product.rating && (
                <div className="flex items-center mb-2">
                  <span className="text-yellow-400 text-sm">★ {product.rating}</span>
                  {product.reviews && (
                    <span className="text-gray-400 text-xs ml-1">({product.reviews})</span>
                  )}
                </div>
              )}
              
              <div className="flex items-center justifyrap-between mt-3">
                <span className="text-lg font-bold text-gray-800">₹{product.price.toLocaleString()}</span>
              </div>
              
              <button
                onClick={() => handleAddToCart(product)}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded mt-3 transition text-sm"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
