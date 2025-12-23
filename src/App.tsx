import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import CategoryPanel from './components/CategoryPanel';
import Footer from './components/Footer';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { ReviewProvider } from './context/ReviewContext';
import { SearchProvider } from './context/SearchContext';
import { RecommendationProvider } from './context/RecommendationContext';
import { ToastProvider } from './context/ToastContext';
import { AdminProvider } from './context/AdminContext';
import './App.css';
import ErrorBoundary from './components/ErrorBoundary';
import { HelmetProvider } from 'react-helmet-async';

const Home = React.lazy(() => import('./pages/Home').then(m => ({ default: m.default || (m as any) })));
const Catalog = React.lazy(() => import('./pages/Catalog').then(m => ({ default: m.default || (m as any) })));
const ProductDetail = React.lazy(() => import('./pages/ProductDetail').then(m => ({ default: m.default || (m as any) })));
const Cart = React.lazy(() => import('./pages/Cart').then(m => ({ default: m.default || (m as any) })));
const WishlistPage = React.lazy(() => import('./pages/Wishlist').then(m => ({ default: m.default || (m as any) })));
const Account = React.lazy(() => import('./pages/Account').then(m => ({ default: m.default || (m as any) })));
const Orders = React.lazy(() => import('./pages/Orders').then(m => ({ default: m.default || (m as any) })));
const Returns = React.lazy(() => import('./pages/Returns').then(m => ({ default: m.default || (m as any) })));
const Admin = React.lazy(() => import('./pages/Admin').then(m => ({ default: m.default || (m as any) })));
const NotFound = React.lazy(() => import('./pages/NotFound').then(m => ({ default: m.default || (m as any) })));
const Checkout = React.lazy(() => import('./pages/Checkout').then(m => ({ default: m.default || (m as any) })));

function App() {
  return (
    <HelmetProvider>
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <ReviewProvider>
            <SearchProvider>
              <RecommendationProvider>
                <ToastProvider>
                  <AdminProvider>
                    <Router basename={import.meta.env.BASE_URL}>
                      <div className="min-h-screen flex flex-col">
                        <Header />
                        <CategoryPanel />
                        <main className="flex-grow">
                          <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
                            <Routes>
                              <Route path="/" element={<ErrorBoundary><Home /></ErrorBoundary>} />
                              <Route path="/catalog" element={<ErrorBoundary><Catalog /></ErrorBoundary>} />
                              <Route path="/catalog/:category" element={<ErrorBoundary><Catalog /></ErrorBoundary>} />
                              <Route path="/product/:id" element={<ErrorBoundary><ProductDetail /></ErrorBoundary>} />
                              <Route path="/cart" element={<ErrorBoundary><Cart /></ErrorBoundary>} />
                              <Route path="/wishlist" element={<ErrorBoundary><WishlistPage /></ErrorBoundary>} />
                              <Route path="/account" element={<ErrorBoundary><Account /></ErrorBoundary>} />
                              <Route path="/orders" element={<ErrorBoundary><Orders /></ErrorBoundary>} />
                              <Route path="/returns" element={<ErrorBoundary><Returns /></ErrorBoundary>} />
                              <Route path="/checkout" element={<ErrorBoundary><Checkout /></ErrorBoundary>} />
                              <Route path="/admin" element={<ErrorBoundary><Admin /></ErrorBoundary>} />
                              <Route path="*" element={<ErrorBoundary><NotFound /></ErrorBoundary>} />
                            </Routes>
                          </Suspense>
                        </main>
                        <Footer />
                      </div>
                    </Router>
                  </AdminProvider>
                </ToastProvider>
              </RecommendationProvider>
            </SearchProvider>
          </ReviewProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
    </HelmetProvider>
  );
}

export default App;