import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface Coupon {
  id: number;
  code: string;
  description: string;
  discount: number;
  type: 'percentage' | 'fixed';
  minAmount: number;
  expiryDate: string;
  active: boolean;
}

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, getTotal, clearCart } = useCart();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [shippingCost] = useState(99); // Fixed shipping cost for demo
  const [couponToast, setCouponToast] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await fetch('http://localhost:5000/coupons');
        const data: Coupon[] = await response.json();
        setCoupons(data.filter(c => c.active && new Date(c.expiryDate) > new Date()));
      } catch (error) {
        console.error('Error fetching coupons:', error);
      }
    };
    fetchCoupons();
  }, []);

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    const subtotal = getTotal();
    if (subtotal < appliedCoupon.minAmount) return 0;
    
    if (appliedCoupon.type === 'percentage') {
      return (subtotal * appliedCoupon.discount) / 100;
    } else {
      return appliedCoupon.discount;
    }
  };

  const handleApplyCoupon = () => {
    setCouponError('');
    
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    const found = coupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase());
    if (!found) {
      setCouponError('Invalid coupon code');
      return;
    }

    if (getTotal() < found.minAmount) {
      setCouponError(`Minimum amount ₹${found.minAmount} required`);
      return;
    }

    setAppliedCoupon(found);
    setCouponCode('');
    setCouponToast('Coupon applied successfully');
    setTimeout(() => setCouponToast(null), 2500);
  };

  const subtotal = getTotal();
  const discount = calculateDiscount();
  const total = subtotal - discount + (subtotal > 0 ? shippingCost : 0);

  if (cart.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Shopping Cart</h2>
        <p className="mb-4">Your cart is empty.</p>
        <Link to="/catalog" className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Helmet>
        <title>Cart — Menzo Fashion</title>
        <meta name="description" content="Review your items, apply coupons, and proceed to checkout on Menzo Fashion." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : ''} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Cart — Menzo Fashion" />
        <meta property="og:description" content="Review your items and checkout." />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
        <meta property="og:image" content={`${import.meta.env.BASE_URL}logo.svg`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Cart — Menzo Fashion" />
        <meta name="twitter:description" content="Review your items and checkout." />
        <meta name="twitter:image" content={`${import.meta.env.BASE_URL}logo.svg`} />
      </Helmet>
      <h2 className="text-3xl font-bold mb-4">Shopping Cart</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {cart.map((item) => (
            <div key={`${item.id}-${item.size}-${item.color}`} className="flex items-center border-b py-4">
              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover mr-4" loading="lazy" decoding="async" />
              <div className="flex-grow">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-600">Size: {item.size}, Color: {item.color}</p>
                <p className="font-bold">₹{item.price}</p>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                  className="px-2 py-1 border rounded"
                >
                  -
                </button>
                <span className="px-4">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                  className="px-2 py-1 border rounded"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => removeFromCart(item.id, item.size, item.color)}
                className="ml-4 text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={clearCart}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Clear Cart
          </button>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Order Summary</h3>
          {couponToast && (
            <div className="mb-4 bg-green-100 text-green-800 px-3 py-2 rounded">
              {couponToast}
            </div>
          )}
          
          {/* Coupon Input */}
          <div className="mb-4 pb-4 border-b">
            {appliedCoupon ? (
                <div className="bg-green-50 border border-green-200 rounded p-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-green-700">{appliedCoupon.code}</p>
                  <p className="text-sm text-green-600">{appliedCoupon.description}</p>
                </div>
                <button
                  onClick={() => setAppliedCoupon(null)}
                  className="text-red-500 hover:text-red-700"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-grow px-3 py-2 border rounded-lg"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                  >
                    Apply
                  </button>
                </div>
                {couponError && (
                  <p className="text-red-500 text-sm mt-2">{couponError}</p>
                )}
              </div>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="flex justify-between mb-2">
            <span>Subtotal:</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between mb-2 text-green-600">
              <span>Discount:</span>
              <span>-₹{discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between mb-2">
            <span>Shipping:</span>
            <span className={subtotal > 0 ? '' : 'line-through'}>
              {subtotal > 0 ? `₹${shippingCost}` : 'Free'}
            </span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total:</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          <Link
            to={subtotal > 0 ? '/checkout' : '#'}
            className={`block text-center w-full py-3 rounded-lg mt-4 transition ${subtotal > 0 ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-300 text-gray-600 cursor-not-allowed pointer-events-none'}`}
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;