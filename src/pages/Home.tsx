import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const categories = [
    { name: 'T-Shirts', slug: 'tshirts' },
    { name: 'Shirts', slug: 'shirts' },
    { name: 'Pants', slug: 'pants' },
    { name: 'Nightwear', slug: 'nightwear' },
    { name: 'Wallets', slug: 'wallets' },
    { name: 'Belts', slug: 'belts' },
    { name: 'Sunglasses', slug: 'sunglasses' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-yellow-400 to-black text-white py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-6xl font-bold mb-4">Elevate Your Style</h1>
          <p className="text-2xl mb-8">Discover the latest in men's fashion</p>
          <Link to="/catalog" className="bg-black text-white px-10 py-4 rounded-full font-bold text-xl hover:bg-gray-800 transition-all duration-300">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-black">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map(category => (
              <Link
                key={category.slug}
                to={`/catalog/${category.slug}`}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-center"
              >
                <h3 className="text-2xl font-bold text-black">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-20 bg-white text-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-12">Why Choose Menzo?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="p-8 bg-gray-50 rounded-2xl">
              <h3 className="text-2xl font-bold mb-4">Trendy Designs</h3>
              <p className="text-lg">Stay ahead with the latest fashion trends</p>
            </div>
            <div className="p-8 bg-gray-50 rounded-2xl">
              <h3 className="text-2xl font-bold mb-4">Fast Delivery</h3>
              <p className="text-lg">Quick and reliable shipping to your door</p>
            </div>
            <div className="p-8 bg-gray-50 rounded-2xl">
              <h3 className="text-2xl font-bold mb-4">Premium Quality</h3>
              <p className="text-lg">High-quality materials for lasting comfort</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;