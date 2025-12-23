import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const Catalog: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState([0, 100]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = category ? `http://localhost:5000/products?category=${category}` : 'http://localhost:5000/products';
        const response = await fetch(url);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    product.price >= priceFilter[0] && product.price <= priceFilter[1]
  );

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-black capitalize">{category} Collection</h1>
      
      {/* Search and Filters */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-3 border border-gray-300 rounded-lg"
        />
        <div className="flex gap-4">
          <label className="flex items-center">
            Min Price: 
            <input
              type="number"
              value={priceFilter[0]}
              onChange={(e) => setPriceFilter([Number(e.target.value), priceFilter[1]])}
              className="ml-2 p-2 border border-gray-300 rounded w-20"
            />
          </label>
          <label className="flex items-center">
            Max Price: 
            <input
              type="number"
              value={priceFilter[1]}
              onChange={(e) => setPriceFilter([priceFilter[0], Number(e.target.value)])}
              className="ml-2 p-2 border border-gray-300 rounded w-20"
            />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="aspect-w-1 aspect-h-1 bg-gray-200 relative">
              <img src={product.image} alt={product.name} className="w-full h-64 object-cover" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 text-black">{product.name}</h3>
              <div className="flex items-center mb-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-600 ml-2">({product.rating})</span>
              </div>
              <p className="text-2xl font-bold text-black mb-4">${product.price}</p>
              <Link
                to={`/product/${product.id}`}
                className="w-full bg-black text-white py-3 px-4 rounded-lg font-bold hover:bg-gray-800 transition-all duration-300 text-center block"
              >
                View Product
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Catalog;