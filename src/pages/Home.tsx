import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useAdmin } from '../context/AdminContext';
import { HeartIcon } from '@heroicons/react/24/solid';
import ProductRecommendations from '../components/ProductRecommendations';
import { Helmet } from 'react-helmet-async';

const Home: React.FC = () => {
  const { offers, products } = useAdmin();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  // Filter active offers
  const activeOffers = offers.filter(o => o.active !== false);

  // Compute best offers (products with highest discounts)
  const bestOffers = products
    .map(p => ({ ...p, discountPct: p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0 }))
    .filter(p => p.discountPct && p.discountPct > 0)
    .sort((a, b) => (b.discountPct as number) - (a.discountPct as number))
    .slice(0, 8);

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Menzo Fashion — Trendy Styles, Best Prices</title>
        <meta name="description" content="Shop Menzo Fashion for trendy apparel, accessories, and more. Mobile-first experience, fast checkout, and personalized recommendations." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : ''} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Menzo Fashion — Trendy Styles, Best Prices" />
        <meta property="og:description" content="Shop Menzo Fashion for trendy apparel, accessories, and more." />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
        <meta property="og:image" content={`${import.meta.env.BASE_URL}assets/hot-winter.jpg`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Menzo Fashion — Trendy Styles, Best Prices" />
        <meta name="twitter:description" content="Shop Menzo Fashion for trendy apparel, accessories, and more." />
        <meta name="twitter:image" content={`${import.meta.env.BASE_URL}assets/hot-winter.jpg`} />
      </Helmet>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 bg-gradient-to-br from-black via-gray-900 to-yellow-500 text-white">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,#facc15,transparent_25%),radial-gradient(circle_at_80%_0%,#ffffff,transparent_20%)]" />
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center relative z-10 gap-10">
          <div className="lg:w-1/2 text-center lg:text-left">
            <p className="uppercase tracking-[0.35em] text-sm text-yellow-200 mb-4">Men's Style, Curated</p>
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">Fresh drops for every layer</h1>
            <p className="text-xl text-gray-200 mb-8">Hoodies for the chill, jeans for the stride, and accessories to seal the look.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/catalog" className="bg-yellow-400 text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition-all duration-300 shadow-lg shadow-yellow-500/30">
                Shop Now
              </Link>
              <Link to="/catalog/winterwear" className="border border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-black transition-all duration-300">
                Explore Winterwear
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-3 justify-center lg:justify-start text-sm text-gray-200">
              <span className="bg-white/10 px-3 py-2 rounded-full">Free shipping over ₹1999</span>
              <span className="bg-white/10 px-3 py-2 rounded-full">Easy 7-day returns</span>
              <span className="bg-white/10 px-3 py-2 rounded-full">New drops weekly</span>
            </div>
          </div>
          <div className="lg:w-1/2 grid grid-cols-2 gap-4">
            {['Layer Ready', 'Denim Core', 'Weekend Fits', 'Street Essentials'].map(label => (
              <div key={label} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 text-center shadow-2xl">
                <p className="text-lg font-semibold text-white">{label}</p>
                <p className="text-sm text-gray-200 mt-2">Curated picks for now</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* (Shop by Category removed per request) */}

      {/* Hot Offers Panel */}
      <section className="py-12 bg-gradient-to-r from-yellow-50 to-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-black">Hot Offers</h2>
              <p className="text-gray-600">Curated deals — updated by Admin</p>
            </div>
            {import.meta.env.DEV && (
              <Link to="/admin" className="text-sm underline">Manage offers</Link>
            )}
          </div>

          {activeOffers.length === 0 ? (
            <div className="text-gray-500 py-8 text-center">
              No active offers right now. <Link to="/admin" className="underline">Add some in admin</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="flex gap-4 w-max py-2">
                {activeOffers.map((o, idx) => {
                  // Determine link destination based on offer configuration
                  const linkTo = o.productId 
                    ? `/product/${o.productId}` 
                    : o.categorySlug 
                      ? `/catalog/${o.categorySlug}`
                      : '/catalog';
                  
                  return (
                    <div key={o.id ?? idx} className="min-w-[280px] bg-white rounded-2xl shadow-lg p-4 border hover:shadow-xl transition">
                      {o.image && <img src={o.image} alt={o.title} className="h-36 w-full object-cover rounded-lg mb-3" loading="lazy" decoding="async" />}
                      <div className="text-lg font-semibold">{o.title}</div>
                      {o.subtitle && <div className="text-sm text-gray-500">{o.subtitle}</div>}
                      {o.discount && (
                        <div className="mt-2">
                          <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded">{o.discount}% OFF</span>
                        </div>
                      )}
                      {o.cta && (
                        <div className="mt-3">
                          <Link to={linkTo} className="text-sm text-yellow-600 font-semibold hover:text-yellow-700">
                            {o.cta} →
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Best Offers Section */}
      <section className="py-20 bg-white text-black">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold">Best Offers</h2>
              <p className="text-gray-600">Top discounts across the store — updated live</p>
            </div>
            <Link to="/catalog" className="text-black underline">View all</Link>
          </div>

          {bestOffers.length === 0 ? (
            <div className="text-gray-500">No strong offers found right now. Check back soon.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {bestOffers.map(p => (
                <div key={p.id} className="relative group bg-gray-50 border rounded-lg p-4 hover:shadow-lg transition">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (wishlist.includes(Number(p.id))) {
                        removeFromWishlist(Number(p.id));
                      } else {
                        addToWishlist(Number(p.id));
                      }
                    }}
                    className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-yellow-50 transition z-10"
                    title={wishlist.includes(Number(p.id)) ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <HeartIcon className={`h-5 w-5 transition ${wishlist.includes(Number(p.id)) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                  </button>
                  <Link to={`/product/${p.id}`} className="block">
                    <div className="h-40 bg-gray-200 rounded mb-3 overflow-hidden">
                      {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" loading="lazy" decoding="async" /> : <div className="w-full h-full flex items-center justify-center text-gray-500">No image</div>}
                    </div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-sm text-gray-500 mt-1">Was ₹{p.originalPrice} now ₹{p.price}</div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-20 bg-white text-black">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Why Choose Menzo?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[{
              title: 'Trend-led drops',
              desc: 'Weekly refreshes inspired by street, work, and weekend fits.',
            }, {
              title: 'Swift delivery',
              desc: 'Pan-India shipping with live tracking and hassle-free returns.',
            }, {
              title: 'Built to last',
              desc: 'Quality fabrics, reinforced stitching, and better fits across sizes.',
            }].map(item => (
              <div key={item.title} className="p-8 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-lg text-gray-700">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products Section */}
      <ProductRecommendations title="Trending Now" />
    </div>
  );
};

export default Home;