import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { XMarkIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement | null>(null);
  const startX = useRef(0);
  const currentX = useRef(0);

  // Handle swipe to close
  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    currentX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    // Swipe right to close
    if (startX.current - currentX.current < -50) {
      onClose();
    }
  };

  // Close on escape key and trap focus within the drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      if (e.key === 'Tab' && isOpen && navRef.current) {
        const focusable = navRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex="0"]'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      // Set initial focus to the close button
      setTimeout(() => {
        firstFocusableRef.current?.focus();
      }, 0);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const categories = [
    { name: 'Men', subcategories: ['T-Shirts', 'Jeans', 'Hoodies', 'Jackets'] },
    { name: 'Women', subcategories: ['Dresses', 'Tops', 'Jeans', 'Accessories'] },
    { name: 'Accessories', subcategories: ['Bags', 'Caps', 'Belts', 'Watches'] },
    { name: 'Sale', link: '/sale' },
  ];

  const mainLinks = [
    { name: 'Home', link: '/' },
    { name: 'Shop', link: '/catalog' },
    { name: 'Wishlist', link: '/wishlist' },
    { name: 'Cart', link: '/cart' },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        onClick={onClose}
      />

      {/* Mobile Navigation Drawer */}
      <div
        ref={navRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        role="dialog"
        aria-modal="true"
        className="fixed top-0 left-0 h-full w-80 bg-white z-50 shadow-lg overflow-y-auto md:hidden"
      >
        {/* Header */}
        <div className="bg-black text-white p-4 flex justify-between items-center sticky top-0">
          <h2 className="text-xl font-bold">Menzo Fashion</h2>
          <button ref={firstFocusableRef} onClick={onClose} className="p-1" aria-label="Close navigation">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* User Info */}
        {user && (
          <div className="bg-gray-50 p-4 border-b">
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
        )}

        {/* Main Links */}
        <nav className="space-y-1 py-2">
          {mainLinks.map((link) => (
            <Link
              key={link.name}
              to={link.link}
              onClick={onClose}
              className="block px-4 py-3 text-gray-700 hover:bg-gray-100 border-b"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Categories */}
        <div className="border-t pt-2">
          <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Categories</p>
          {categories.map((category) => (
            <div key={category.name}>
              <button
                onClick={() =>
                  setExpandedMenu(expandedMenu === category.name ? null : category.name)
                }
                className="w-full flex justify-between items-center px-4 py-3 text-gray-700 hover:bg-gray-100 border-b"
              >
                <span>{category.name}</span>
                {category.subcategories && (
                  <ChevronRightIcon
                    className={`w-4 h-4 transition-transform ${
                      expandedMenu === category.name ? 'rotate-90' : ''
                    }`}
                  />
                )}
              </button>

              {/* Subcategories */}
              {expandedMenu === category.name && category.subcategories && (
                <div className="bg-gray-50">
                  {category.subcategories.map((sub) => (
                    <Link
                      key={sub}
                      to={`/catalog?category=${sub.toLowerCase()}`}
                      onClick={onClose}
                      className="block px-8 py-2 text-sm text-gray-600 hover:bg-gray-200 border-b"
                    >
                      {sub}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Account Links */}
        <div className="border-t pt-2 mt-4">
          <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Account</p>
          <Link
            to="/account"
            onClick={onClose}
            className="block px-4 py-3 text-gray-700 hover:bg-gray-100 border-b"
          >
            My Account
          </Link>
          <Link
            to="/orders"
            onClick={onClose}
            className="block px-4 py-3 text-gray-700 hover:bg-gray-100 border-b"
          >
            Orders
          </Link>
          <Link
            to="/returns"
            onClick={onClose}
            className="block px-4 py-3 text-gray-700 hover:bg-gray-100"
          >
            Returns
          </Link>
        </div>
      </div>
    </>
  );
};

export default MobileNav;
