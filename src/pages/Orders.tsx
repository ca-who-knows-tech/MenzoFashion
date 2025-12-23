import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, TruckIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { Helmet } from 'react-helmet-async';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  userId: string;
  date: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  total: number;
  shippingAddress: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

const Orders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:5000/orders');
        const allOrders: Order[] = await response.json();
        // Filter orders for current user
        const userOrders = allOrders.filter(o => o.userId === (user?.email || user?.sub));
        setOrders(userOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      } catch (error) {
        console.error('Error fetching orders:', error);
        // Use sample data if backend not available
        setSampleOrders();
      } finally {
        setLoading(false);
      }
    };

    const setSampleOrders = () => {
      setOrders([
        {
          id: 'ORD-1001',
          userId: user?.email || '',
          date: '2025-11-02',
          status: 'delivered',
          total: 2499,
          shippingAddress: '123 Main St, Mumbai, MH 400001',
          trackingNumber: 'TRK123456789',
          estimatedDelivery: '2025-11-05',
          items: [
            { id: 1, name: 'Menzo Tee', price: 499, quantity: 1, image: 'https://via.placeholder.com/150' },
            { id: 2, name: 'Denim Jeans', price: 2000, quantity: 1, image: 'https://via.placeholder.com/150' },
          ],
        },
        {
          id: 'ORD-1002',
          userId: user?.email || '',
          date: '2025-12-05',
          status: 'shipped',
          total: 1299,
          shippingAddress: '456 Oak Ave, Bangalore, KA 560001',
          trackingNumber: 'TRK987654321',
          estimatedDelivery: '2025-12-12',
          items: [
            { id: 3, name: 'Hoodie', price: 1299, quantity: 1, image: 'https://via.placeholder.com/150' },
          ],
        },
      ]);
    };

    if (user?.email || user?.sub) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'shipped':
        return <TruckIcon className="h-5 w-5 text-blue-600" />;
      case 'pending':
      case 'confirmed':
        return <ClockIcon className="h-5 w-5 text-yellow-600" />;
      case 'cancelled':
        return <XCircleIcon className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'shipped':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'pending':
      case 'confirmed':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'cancelled':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <p className="text-blue-800 mb-4">Please sign in to view your orders.</p>
          <a href="/" className="text-blue-600 hover:text-blue-800 underline">
            Return to home
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-12">Loading your orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        <div className="bg-white border border-gray-200 rounded-lg p-10 text-center">
          <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
          <a
            href="/catalog"
            className="inline-block bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Helmet>
        <title>Orders — Menzo Fashion</title>
        <meta name="description" content="Track your orders and view order history on Menzo Fashion." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : ''} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Orders — Menzo Fashion" />
        <meta property="og:description" content="Track your orders and view order history." />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
        <meta property="og:image" content={`${import.meta.env.BASE_URL}logo.svg`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Orders — Menzo Fashion" />
        <meta name="twitter:description" content="Track your orders and view order history." />
        <meta name="twitter:image" content={`${import.meta.env.BASE_URL}logo.svg`} />
      </Helmet>
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      <div className="space-y-6">
        {orders.map(order => (
          <div key={order.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
            {/* Order Header */}
            <div className={`border-b p-6 flex justify-between items-start ${getStatusColor(order.status)}`}>
              <div>
                <h3 className="text-lg font-semibold">Order {order.id}</h3>
                <p className="text-sm text-gray-600">Placed on {new Date(order.date).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(order.status)}
                <span className="font-semibold">{getStatusText(order.status)}</span>
              </div>
            </div>

            {/* Order Details */}
            <div className="p-6 space-y-6">
              {/* Items */}
              <div>
                <h4 className="font-semibold mb-4">Items</h4>
                <div className="space-y-3">
                  {order.items.map(item => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-12 w-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping & Tracking */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
                <div>
                  <h4 className="font-semibold mb-2">Shipping Address</h4>
                  <p className="text-sm text-gray-600">{order.shippingAddress}</p>
                </div>
                {order.trackingNumber && (
                  <div>
                    <h4 className="font-semibold mb-2">Tracking Information</h4>
                    <p className="text-sm text-gray-600">
                      <strong>Tracking #:</strong> {order.trackingNumber}
                    </p>
                    {order.estimatedDelivery && (
                      <p className="text-sm text-gray-600 mt-1">
                        <strong>Est. Delivery:</strong> {new Date(order.estimatedDelivery).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Order Total & Actions */}
              <div className="border-t pt-6 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Order Total</p>
                  <p className="text-2xl font-bold">₹{order.total.toLocaleString()}</p>
                </div>
                <div className="space-x-3">
                  <button className="px-4 py-2 border border-black text-black rounded-lg hover:bg-black hover:text-white transition">
                    View Details
                  </button>
                  {order.status === 'delivered' && (
                    <button className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition font-medium">
                      Buy Again
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
