import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Bars3Icon, HeartIcon } from '@heroicons/react/24/outline';
import { SearchBar } from './SearchBar';
import MobileNav from './MobileNav';

const Header: React.FC = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { user, setUser, promptSignIn } = useAuth();
  const [accountOpen, setAccountOpen] = useState(false);
  const { cart } = useCart();

  const handleSignOut = () => {
    setUser(null);
    // Clear any stored user data
  };

  // Swipe gestures to open mobile nav (left or right edge)
  useEffect(() => {
    let startX = 0;
    let currentX = 0;

    const onStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      currentX = startX;
    };
    const onMove = (e: TouchEvent) => {
      currentX = e.touches[0].clientX;
    };
    const onEnd = () => {
      const deltaX = currentX - startX;
      const fromLeftEdge = startX < 50;
      const fromRightEdge = startX > (window.innerWidth - 50);
      // Open on swipe-right from left edge OR swipe-left from right edge
      if (!mobileNavOpen && ((fromLeftEdge && deltaX > 60) || (fromRightEdge && deltaX < -60))) {
        setMobileNavOpen(true);
      }
    };

    document.addEventListener('touchstart', onStart, { passive: true });
    document.addEventListener('touchmove', onMove, { passive: true });
    document.addEventListener('touchend', onEnd);
    return () => {
      document.removeEventListener('touchstart', onStart);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onEnd);
    };
  }, [mobileNavOpen]);

  return (
    <>
      <header className="bg-white text-black shadow-lg border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex flex-col items-start">
            <Link to="/" className="flex items-center text-xl font-bold text-black">
              <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="Menzo Fashion Logo" className="h-8 w-auto mr-2" loading="lazy" decoding="async" /> 
              Menzo Fashion
            </Link>
            {user && (
              <span className="text-xs text-gray-600 ml-10 mt-0.5">Welcome, {user.name || user.given_name || 'Guest'}</span>
            )}
          </div>
          <div className="hidden md:flex items-center space-x-6 flex-1 mx-6">
            <SearchBar />
            <nav className="flex items-center space-x-6">
              <div className="relative">
                <button
                  onClick={() => setAccountOpen(!accountOpen)}
                  className="hover:text-gray-600 transition-colors duration-300 flex items-center space-x-2"
                  aria-haspopup="true"
                  aria-expanded={accountOpen}
                >
                  {user?.picture ? (
                    <img src={user.picture} alt={user.name ?? 'avatar'} className="h-8 w-8 rounded-full object-cover" loading="lazy" decoding="async" />
                  ) : (
                    <span className="inline-block h-8 w-8 rounded-full bg-gray-200 text-sm flex items-center justify-center">A</span>
                  )}
                </button>
                {accountOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg border rounded py-2 z-20">
                    {user ? (
                      <div className="px-3 py-2">
                        <div className="flex items-center space-x-3">
                          {user.picture ? (
                            <img src={user.picture} alt={user.name ?? 'avatar'} className="h-10 w-10 rounded-full object-cover" loading="lazy" decoding="async" />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">A</div>
                          )}
                          <div>
                            <div className="text-sm font-medium">{user.name}</div>
                            <div className="text-xs text-gray-500">{user.email}</div>
                          </div>
                        </div>
                        <button onClick={handleSignOut} className="mt-3 w-full text-left text-red-600">Sign Out</button>
                      </div>
                      ) : (
                      <button onClick={promptSignIn} className="w-full text-left px-3 py-2 hover:bg-gray-50">Sign in with Google</button>
                    )}
                  </div>
                )}
              </div>
              <Link to="/orders" className="hover:text-gray-600 transition-colors duration-300">Orders</Link>
              <Link to="/returns" className="hover:text-gray-600 transition-colors duration-300">Returns</Link>
              <Link to="/wishlist" className="hover:text-gray-600 transition-colors duration-300">
                <HeartIcon className="h-5 w-5" />
              </Link>
              {import.meta.env.DEV && (
                <Link to="/admin" className="hover:text-gray-600 transition-colors duration-300">Admin</Link>
              )}
              <Link to="/cart" className="hover:text-gray-600 transition-colors duration-300 relative">
                Cart
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Link>
            </nav>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-black focus:outline-none"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open navigation menu"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
    </>
  );
};

export default Header;