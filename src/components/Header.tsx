import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Initialize Google Sign-In
    const initializeGoogleSignIn = () => {
      if ((window as any).google) {
        (window as any).google.accounts.id.initialize({
          client_id: import.meta.env.REACT_APP_GOOGLE_CLIENT_ID || 'YOUR_CLIENT_ID_HERE',
          callback: handleCredentialResponse,
        });
        (window as any).google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          { theme: 'outline', size: 'medium' }
        );
        (window as any).google.accounts.id.renderButton(
          document.getElementById('google-signin-button-mobile'),
          { theme: 'outline', size: 'medium' }
        );
      }
    };

    const handleCredentialResponse = (response: any) => {
      const userObject = JSON.parse(atob(response.credential.split('.')[1]));
      setUser(userObject);
      console.log('User signed in:', userObject);
    };

    // Wait for Google script to load
    const checkGoogleLoaded = () => {
      if ((window as any).google) {
        initializeGoogleSignIn();
      } else {
        setTimeout(checkGoogleLoaded, 100);
      }
    };
    checkGoogleLoaded();
  }, []);

  const handleSignOut = () => {
    setUser(null);
    // Clear any stored user data
  };

  return (
    <header className="bg-white text-black shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-black">Menzo Fashion</Link>
        <div className="hidden md:flex items-center space-x-6">
          <input
            type="text"
            placeholder="Search..."
            className="p-2 border border-gray-300 rounded-lg w-64"
          />
          <nav className="flex space-x-6">
            <Link to="/" className="hover:text-gray-600 transition-colors duration-300">Home</Link>
            <Link to="/catalog" className="hover:text-gray-600 transition-colors duration-300">Shop</Link>
            <Link to="/cart" className="hover:text-gray-600 transition-colors duration-300">Cart</Link>
          </nav>
          {user ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm">Hello, {user.name}</span>
              <button onClick={handleSignOut} className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                Sign Out
              </button>
            </div>
          ) : (
            <div id="google-signin-button"></div>
          )}
        </div>
        <button
          className="md:hidden text-black focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>
      {isOpen && (
        <div className="md:hidden bg-white px-4 pb-4 border-t border-gray-200">
          <input
            type="text"
            placeholder="Search..."
            className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          />
          <Link to="/" className="block py-2 hover:text-gray-600 transition-colors duration-300" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/catalog" className="block py-2 hover:text-gray-600 transition-colors duration-300" onClick={() => setIsOpen(false)}>Shop</Link>
          <Link to="/cart" className="block py-2 hover:text-gray-600 transition-colors duration-300" onClick={() => setIsOpen(false)}>Cart</Link>
          {user ? (
            <div className="flex items-center space-x-2 py-2">
              <span className="text-sm">Hello, {user.name}</span>
              <button onClick={handleSignOut} className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                Sign Out
              </button>
            </div>
          ) : (
            <div id="google-signin-button-mobile" className="py-2"></div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;