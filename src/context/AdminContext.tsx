import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Simple fetch helper with an abort-based timeout so the UI does not hang indefinitely when the API is unreachable.
const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeoutMs = 8000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timer);
  }
};

// Types
export interface Category {
  slug: string;
  name: string;
  parentSlug?: string;
}

export interface Product {
  id: number | string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  category: string; // slug reference
  sizes?: string[];
  colors?: string[];
  images?: string[];
  image?: string;
  stock?: number;
  rating?: number;
  reviews?: number;
}

export interface Offer {
  id: number | string;
  title: string;
  subtitle?: string;
  image?: string;
  cta?: string;
  productId?: number | string; // product reference
  categorySlug?: string; // category reference
  discount?: number;
  active?: boolean;
}

export interface Order {
  id: number | string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: Array<{
    productId: number | string;
    productName: string;
    quantity: number;
    price: number;
    size?: string;
    color?: string;
  }>;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  paymentMethod?: string;
  createdAt: string;
  updatedAt?: string;
}

interface AdminContextType {
  // Data
  categories: Category[];
  products: Product[];
  offers: Offer[];
  orders: Order[];
  loading: boolean;
  error: string | null;
  
  // Refresh functions
  refreshCategories: () => Promise<void>;
  refreshProducts: () => Promise<void>;
  refreshOffers: () => Promise<void>;
  refreshOrders: () => Promise<void>;
  refreshAll: () => Promise<void>;
  
  // Category CRUD
  addCategory: (name: string, parentSlug?: string) => Promise<Category | null>;
  updateCategory: (slug: string, name: string, parentSlug?: string) => Promise<Category | null>;
  deleteCategory: (slug: string) => Promise<boolean>;
  
  // Product CRUD
  addProduct: (product: Omit<Product, 'id'>) => Promise<Product | null>;
  updateProduct: (id: number | string, product: Partial<Product>) => Promise<Product | null>;
  deleteProduct: (id: number | string) => Promise<boolean>;
  
  // Offer CRUD
  addOffer: (offer: Omit<Offer, 'id'>) => Promise<Offer | null>;
  updateOffer: (id: number | string, offer: Partial<Offer>) => Promise<Offer | null>;
  deleteOffer: (id: number | string) => Promise<boolean>;
  
  // Order management
  updateOrderStatus: (id: number | string, status: Order['status']) => Promise<Order | null>;
  deleteOrder: (id: number | string) => Promise<boolean>;
  
  // Helpers
  getCategoryBySlug: (slug: string) => Category | undefined;
  getProductById: (id: number | string) => Product | undefined;
  getProductsByCategory: (slug: string) => Product[];
  getOffersByCategory: (slug: string) => Offer[];
  getOffersByProduct: (productId: number | string) => Offer[];
  getSubcategories: (parentSlug: string) => Category[];
  getTopLevelCategories: () => Category[];
  getCategoryHierarchy: (slug: string) => Category[];
  canDeleteCategory: (slug: string) => boolean;
}

const AdminContext = createContext<AdminContextType | null>(null);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refresh functions
  const refreshCategories = useCallback(async () => {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/categories`);
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (e: any) {
      console.error('Error loading categories:', e);
      setError(e.name === 'AbortError' ? 'Category request timed out' : e.message);
    }
  }, []);

  const refreshProducts = useCallback(async () => {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/products`);
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (e: any) {
      console.error('Error loading products:', e);
      setError(e.name === 'AbortError' ? 'Product request timed out' : e.message);
    }
  }, []);

  const refreshOffers = useCallback(async () => {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/offers`);
      if (!res.ok) throw new Error('Failed to fetch offers');
      const data = await res.json();
      setOffers(Array.isArray(data) ? data : []);
    } catch (e: any) {
      console.error('Error loading offers:', e);
      setError(e.name === 'AbortError' ? 'Offer request timed out' : e.message);
    }
  }, []);

  const refreshOrders = useCallback(async () => {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/orders`);
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (e: any) {
      console.error('Error loading orders:', e);
      setError(e.name === 'AbortError' ? 'Order request timed out' : e.message);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([refreshCategories(), refreshProducts(), refreshOffers(), refreshOrders()]);
    } catch (e: any) {
      setError(e?.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  }, [refreshCategories, refreshProducts, refreshOffers, refreshOrders]);

  // Initial load
  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // Helpers
  const getCategoryBySlug = useCallback((slug: string) => {
    return categories.find(c => c.slug === slug);
  }, [categories]);

  const getProductById = useCallback((id: number | string) => {
    return products.find(p => p.id === id);
  }, [products]);

  const getProductsByCategory = useCallback((slug: string) => {
    return products.filter(p => p.category === slug);
  }, [products]);

  const getOffersByCategory = useCallback((slug: string) => {
    return offers.filter(o => o.categorySlug === slug);
  }, [offers]);

  const getOffersByProduct = useCallback((productId: number | string) => {
    return offers.filter(o => o.productId === productId);
  }, [offers]);

  // Subcategory helpers
  const getSubcategories = useCallback((parentSlug: string) => {
    return categories.filter(c => c.parentSlug === parentSlug);
  }, [categories]);

  const getTopLevelCategories = useCallback(() => {
    return categories.filter(c => !c.parentSlug);
  }, [categories]);

  const getCategoryHierarchy = useCallback((slug: string): Category[] => {
    const category = getCategoryBySlug(slug);
    if (!category) return [];
    const hierarchy = [category];
    let current = category;
    while (current.parentSlug) {
      const parent = getCategoryBySlug(current.parentSlug);
      if (!parent) break;
      hierarchy.unshift(parent);
      current = parent;
    }
    return hierarchy;
  }, [categories, getCategoryBySlug]);

  const canDeleteCategory = useCallback((slug: string) => {
    const hasProducts = getProductsByCategory(slug).length > 0;
    const hasSubcategories = getSubcategories(slug).length > 0;
    const hasOffers = getOffersByCategory(slug).length > 0;
    return !hasProducts && !hasSubcategories && !hasOffers;
  }, [getProductsByCategory, getSubcategories, getOffersByCategory]);

  // Category CRUD
  const addCategory = useCallback(async (name: string, parentSlug?: string): Promise<Category | null> => {
    try {
      const res = await fetch(`${API_BASE}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, parentSlug }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to add category');
      }
      const newCat = await res.json();
      await refreshCategories();
      return newCat;
    } catch (e: any) {
      setError(e.message);
      return null;
    }
  }, [refreshCategories]);

  const updateCategory = useCallback(async (slug: string, name: string, parentSlug?: string): Promise<Category | null> => {
    try {
      const res = await fetch(`${API_BASE}/categories/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, parentSlug }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to update category');
      }
      const updated = await res.json();
      // Update products that reference this category if slug changed
      const newSlug = updated.slug;
      if (newSlug !== slug) {
        const productsToUpdate = products.filter(p => p.category === slug);
        for (const p of productsToUpdate) {
          await fetch(`${API_BASE}/products/${p.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ category: newSlug }),
          });
        }
        // Update offers that reference this category
        const offersToUpdate = offers.filter(o => o.categorySlug === slug);
        for (const o of offersToUpdate) {
          await fetch(`${API_BASE}/offers/${o.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ categorySlug: newSlug }),
          });
        }
      }
      await refreshAll();
      return updated;
    } catch (e: any) {
      setError(e.message);
      return null;
    }
  }, [products, offers, refreshAll]);

  const deleteCategory = useCallback(async (slug: string): Promise<boolean> => {
    try {
      if (!canDeleteCategory(slug)) {
        setError('Cannot delete category: it has linked products, subcategories, or offers');
        return false;
      }
      
      const res = await fetch(`${API_BASE}/categories/${slug}`, { method: 'DELETE' });
      if (!res.ok && res.status !== 204) throw new Error('Failed to delete category');
      await refreshCategories();
      return true;
    } catch (e: any) {
      setError(e.message);
      return false;
    }
  }, [canDeleteCategory, refreshCategories]);

  // Product CRUD
  const addProduct = useCallback(async (product: Omit<Product, 'id'>): Promise<Product | null> => {
    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      if (!res.ok) throw new Error('Failed to add product');
      const newProduct = await res.json();
      await refreshProducts();
      return newProduct;
    } catch (e: any) {
      setError(e.message);
      return null;
    }
  }, [refreshProducts]);

  const updateProduct = useCallback(async (id: number | string, product: Partial<Product>): Promise<Product | null> => {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      if (!res.ok) throw new Error('Failed to update product');
      const updated = await res.json();
      await refreshProducts();
      return updated;
    } catch (e: any) {
      setError(e.message);
      return null;
    }
  }, [refreshProducts]);

  const deleteProduct = useCallback(async (id: number | string): Promise<boolean> => {
    try {
      // Remove product references from offers
      const linkedOffers = offers.filter(o => String(o.productId) === String(id));
      for (const o of linkedOffers) {
        await fetch(`${API_BASE}/offers/${o.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: null }),
        });
      }
      
      const res = await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete product');
      await refreshAll();
      return true;
    } catch (e: any) {
      setError(e.message);
      return false;
    }
  }, [offers, refreshAll]);

  // Offer CRUD
  const addOffer = useCallback(async (offer: Omit<Offer, 'id'>): Promise<Offer | null> => {
    try {
      const res = await fetch(`${API_BASE}/offers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(offer),
      });
      if (!res.ok) throw new Error('Failed to add offer');
      const newOffer = await res.json();
      await refreshOffers();
      return newOffer;
    } catch (e: any) {
      setError(e.message);
      return null;
    }
  }, [refreshOffers]);

  const updateOffer = useCallback(async (id: number | string, offer: Partial<Offer>): Promise<Offer | null> => {
    try {
      const res = await fetch(`${API_BASE}/offers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(offer),
      });
      if (!res.ok) throw new Error('Failed to update offer');
      const updated = await res.json();
      await refreshOffers();
      return updated;
    } catch (e: any) {
      setError(e.message);
      return null;
    }
  }, [refreshOffers]);

  const deleteOffer = useCallback(async (id: number | string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/offers/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete offer');
      await refreshOffers();
      return true;
    } catch (e: any) {
      setError(e.message);
      return false;
    }
  }, [refreshOffers]);

  // Order management
  const updateOrderStatus = useCallback(async (id: number | string, status: Order['status']): Promise<Order | null> => {
    try {
      const res = await fetch(`${API_BASE}/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, updatedAt: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error('Failed to update order status');
      const updated = await res.json();
      await refreshOrders();
      return updated;
    } catch (e: any) {
      setError(e.message);
      return null;
    }
  }, [refreshOrders]);

  const deleteOrder = useCallback(async (id: number | string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/orders/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete order');
      await refreshOrders();
      return true;
    } catch (e: any) {
      setError(e.message);
      return false;
    }
  }, [refreshOrders]);

  const value: AdminContextType = {
    categories,
    products,
    offers,
    orders,
    loading,
    error,
    refreshCategories,
    refreshProducts,
    refreshOffers,
    refreshOrders,
    refreshAll,
    addCategory,
    updateCategory,
    deleteCategory,
    addProduct,
    updateProduct,
    deleteProduct,
    addOffer,
    updateOffer,
    deleteOffer,
    updateOrderStatus,
    deleteOrder,
    getCategoryBySlug,
    getProductById,
    getProductsByCategory,
    getOffersByCategory,
    getOffersByProduct,
    getSubcategories,
    getTopLevelCategories,
    getCategoryHierarchy,
    canDeleteCategory,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export default AdminContext;
