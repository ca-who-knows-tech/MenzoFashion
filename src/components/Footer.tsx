import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-white py-16 border-t border-accent">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <h3 className="text-2xl font-bold mb-6 text-accent">Menzo Fashion</h3>
            <p className="text-gray-300 leading-relaxed">Your premier destination for sophisticated men's clothing and accessories. Crafting timeless elegance since 2025.</p>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-300 hover:text-accent transition-colors duration-300">Home</Link></li>
              <li><Link to="/catalog/tshirts" className="text-gray-300 hover:text-accent transition-colors duration-300">T-Shirts</Link></li>
              <li><Link to="/catalog/shirts" className="text-gray-300 hover:text-accent transition-colors duration-300">Shirts</Link></li>
              <li><Link to="/catalog/pants" className="text-gray-300 hover:text-accent transition-colors duration-300">Pants</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-6">Accessories</h4>
            <ul className="space-y-3">
              <li><Link to="/catalog/wallets" className="text-gray-300 hover:text-accent transition-colors duration-300">Wallets</Link></li>
              <li><Link to="/catalog/belts" className="text-gray-300 hover:text-accent transition-colors duration-300">Belts</Link></li>
              <li><Link to="/catalog/sunglasses" className="text-gray-300 hover:text-accent transition-colors duration-300">Sunglasses</Link></li>
              <li><Link to="/catalog/nightwear" className="text-gray-300 hover:text-accent transition-colors duration-300">Nightwear</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-6">Contact Us</h4>
            <p className="text-gray-300 mb-3">Email: info@menzofashion.com</p>
            <p className="text-gray-300 mb-3">Phone: (555) 123-4567</p>
            <div className="flex space-x-6 mt-6">
              <a href="#" className="text-gray-300 hover:text-accent transition-colors duration-300">Facebook</a>
              <a href="#" className="text-gray-300 hover:text-accent transition-colors duration-300">Instagram</a>
              <a href="#" className="text-gray-300 hover:text-accent transition-colors duration-300">Twitter</a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-12 pt-8 text-center">
          <p className="text-gray-300">&copy; 2025 Menzo Fashion. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;