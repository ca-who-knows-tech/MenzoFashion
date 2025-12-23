import { Helmet } from 'react-helmet-async';
import React, { useState } from 'react';
import { useAdmin, Category, Product, Offer } from '../context/AdminContext';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  TagIcon,
  ShoppingBagIcon,
  SparklesIcon,
  LinkIcon
} from '@heroicons/react/24/outline';

// ============ Tab Navigation ============
type TabType = 'categories' | 'products' | 'offers' | 'overview';

const ADMIN_PASSWORD = 'Priya123@at';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const { loading, error, refreshAll, categories, products, offers } = useAdmin();
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(() => {
    try {
      return localStorage.getItem('menzo_admin_auth') === 'true';
    } catch (e) {
      return false;
    }
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthorized(true);
      setAuthError('');
      try {
        localStorage.setItem('menzo_admin_auth', 'true');
      } catch (err) {
        // ignore storage failures; session stays in memory
      }
    } else {
      setAuthError('Incorrect password');
    }
  };

  const handleLogout = () => {
    setIsAuthorized(false);
    setPasswordInput('');
    try {
      localStorage.removeItem('menzo_admin_auth');
    } catch (err) {
      // ignore storage failures
    }
  };

  const tabs: { key: TabType; label: string; icon: React.ReactNode; count?: number }[] = [
    { key: 'overview', label: 'Overview', icon: <SparklesIcon className="h-5 w-5" /> },
    { key: 'categories', label: 'Categories', icon: <TagIcon className="h-5 w-5" />, count: categories.length },
    { key: 'products', label: 'Products', icon: <ShoppingBagIcon className="h-5 w-5" />, count: products.length },
    { key: 'offers', label: 'Offers', icon: <SparklesIcon className="h-5 w-5" />, count: offers.length },
  ];

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Helmet>
          <title>Admin Access — Menzo Fashion</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="w-full max-w-md bg-white border rounded-2xl shadow-lg p-6 space-y-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Enter Admin Password</h1>
            <p className="text-sm text-gray-500">This gate keeps the dashboard private. Share only with trusted staff.</p>
          </div>
          <form className="space-y-3" onSubmit={handleAuth}>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              autoFocus
            />
            {authError && <p className="text-sm text-red-600">{authError}</p>}
            <button
              type="submit"
              className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
            >
              Unlock Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Admin Dashboard — Menzo Fashion</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-500">Manage your store data</p>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => refreshAll()}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition"
              >
                <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh All
              </button>
              <button
                onClick={handleLogout}
                className="ml-3 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
              >
                Lock
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
          notification.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {notification.type === 'success' ? <CheckIcon className="h-5 w-5" /> : <ExclamationTriangleIcon className="h-5 w-5" />}
          {notification.message}
          <button onClick={() => setNotification(null)} className="ml-2">
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-3 text-red-700 flex items-center gap-2">
          <ExclamationTriangleIcon className="h-5 w-5" />
          {error}
        </div>
      )}

      {/* Tab Navigation */}
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                {tab.label}
                {tab.count !== undefined && (
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="container mx-auto px-4 py-6">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <ArrowPathIcon className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        )}

        {!loading && activeTab === 'overview' && <OverviewPanel />}
        {!loading && activeTab === 'categories' && <CategoriesPanel showNotification={showNotification} />}
        {!loading && activeTab === 'products' && <ProductsPanel showNotification={showNotification} />}
        {!loading && activeTab === 'offers' && <OffersPanel showNotification={showNotification} />}
      </main>
    </div>
  );
};

// ============ Overview Panel ============
const OverviewPanel: React.FC = () => {
  const { categories, products, offers, getProductsByCategory } = useAdmin();

  const stats = [
    { label: 'Total Categories', value: categories.length, color: 'bg-blue-500' },
    { label: 'Total Products', value: products.length, color: 'bg-green-500' },
    { label: 'Active Offers', value: offers.filter(o => o.active !== false).length, color: 'bg-yellow-500' },
    { label: 'Products with Discount', value: products.filter(p => p.originalPrice && p.originalPrice > p.price).length, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border p-4">
            <div className={`h-2 w-12 ${stat.color} rounded mb-3`} />
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-xl border p-6">
        <h3 className="font-semibold text-lg mb-4">Products by Category</h3>
        <div className="space-y-3">
          {categories.map(cat => {
            const count = getProductsByCategory(cat.slug).length;
            const percentage = products.length > 0 ? (count / products.length) * 100 : 0;
            return (
              <div key={cat.slug} className="flex items-center gap-3">
                <div className="w-24 text-sm font-medium truncate">{cat.name}</div>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div className="bg-black rounded-full h-2" style={{ width: `${percentage}%` }} />
                </div>
                <div className="w-12 text-right text-sm text-gray-600">{count}</div>
              </div>
            );
          })}
          {categories.length === 0 && (
            <p className="text-gray-500 text-sm">No categories yet. Add some to get started!</p>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-semibold text-lg mb-4">Latest Products</h3>
          <div className="space-y-2">
            {products.slice(-5).reverse().map(p => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <span className="text-sm truncate max-w-[200px]">{p.name}</span>
                <span className="text-sm text-gray-500">₹{p.price}</span>
              </div>
            ))}
            {products.length === 0 && <p className="text-gray-500 text-sm">No products yet.</p>}
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-semibold text-lg mb-4">Active Offers</h3>
          <div className="space-y-2">
            {offers.filter(o => o.active !== false).slice(0, 5).map(o => (
              <div key={o.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <span className="text-sm truncate max-w-[200px]">{o.title}</span>
                {o.productId && <LinkIcon className="h-4 w-4 text-gray-400" title="Linked to product" />}
              </div>
            ))}
            {offers.length === 0 && <p className="text-gray-500 text-sm">No offers yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ Categories Panel ============
interface PanelProps {
  showNotification: (type: 'success' | 'error', message: string) => void;
}

const CategoriesPanel: React.FC<PanelProps> = ({ showNotification }) => {
  const { categories, addCategory, updateCategory, deleteCategory, getProductsByCategory, canDeleteCategory } = useAdmin();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newParentSlug, setNewParentSlug] = useState<string>('');
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editParentSlug, setEditParentSlug] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const buildCategoryTree = (cats: Category[], parentSlug?: string, level = 0): (Category & { level: number })[] => {
    const children = cats.filter(c => c.parentSlug === parentSlug);
    const result: (Category & { level: number })[] = [];
    children.forEach(child => {
      result.push({ ...child, level });
      result.push(...buildCategoryTree(cats, child.slug, level + 1));
    });
    return result;
  };

  const categoryTree = buildCategoryTree(filteredCategories);

  const handleAdd = async () => {
    if (!newCategoryName.trim()) {
      showNotification('error', 'Please enter a category name');
      return;
    }
    const result = await addCategory(newCategoryName.trim(), newParentSlug || undefined);
    if (result) {
      showNotification('success', `Category "${result.name}" added successfully`);
      setNewCategoryName('');
      setNewParentSlug('');
      setShowAddForm(false);
    } else {
      showNotification('error', 'Failed to add category');
    }
  };

  const handleUpdate = async (slug: string) => {
    if (!editName.trim()) {
      showNotification('error', 'Please enter a category name');
      return;
    }
    const result = await updateCategory(slug, editName.trim(), editParentSlug || undefined);
    if (result) {
      showNotification('success', `Category updated to "${result.name}"`);
      setEditingSlug(null);
    } else {
      showNotification('error', 'Failed to update category');
    }
  };

  const handleDelete = async (slug: string) => {
    if (!canDeleteCategory(slug)) {
      showNotification('error', 'Cannot delete category: it has linked products, subcategories, or offers');
      setDeleteConfirm(null);
      return;
    }
    const result = await deleteCategory(slug);
    if (result) {
      showNotification('success', 'Category deleted');
    } else {
      showNotification('error', 'Failed to delete category');
    }
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded-lg w-full sm:w-64"
        />
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          <PlusIcon className="h-4 w-4" />
          Add Category
        </button>
      </div>

      {/* Add Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add New Category</h3>
              <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <input
              type="text"
              placeholder="Category name (e.g., Jackets)"
              value={newCategoryName}
              onChange={e => setNewCategoryName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              className="w-full px-4 py-2 border rounded-lg mb-4"
              autoFocus
            />
            <select
              value={newParentSlug}
              onChange={e => setNewParentSlug(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg mb-4"
            >
              <option value="">Top Level Category</option>
              {categories.map(cat => (
                <option key={cat.slug} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mb-4">
              A URL-friendly slug will be auto-generated from the name.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowAddForm(false)} className="px-4 py-2 border rounded-lg">
                Cancel
              </button>
              <button onClick={handleAdd} className="px-4 py-2 bg-black text-white rounded-lg">
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Name</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Slug</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Products / Parent</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categoryTree.map(cat => {
              const productCount = getProductsByCategory(cat.slug).length;
              const isEditing = editingSlug === cat.slug;
              const isDeleting = deleteConfirm === cat.slug;

              return (
                <tr key={cat.slug} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {Array.from({ length: cat.level }).map((_, i) => (
                        <span key={i} className="w-4 text-gray-300">—</span>
                      ))}
                      {isEditing ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleUpdate(cat.slug)}
                          className="px-2 py-1 border rounded flex-1"
                          autoFocus
                        />
                      ) : (
                        <span className="font-medium">{cat.name}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-sm">{cat.slug}</td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <select
                        value={editParentSlug}
                        onChange={e => setEditParentSlug(e.target.value)}
                        className="px-2 py-1 border rounded text-sm"
                      >
                        <option value="">Top Level Category</option>
                        {categories.filter(c => c.slug !== cat.slug).map(c => (
                          <option key={c.slug} value={c.slug}>{c.name}</option>
                        ))}
                      </select>
                    ) : (
                      <span className={`text-sm ${productCount > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                        {productCount} products
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      {isDeleting ? (
                        <>
                          <span className="text-sm text-red-600 mr-2">Delete?</span>
                          <button
                            onClick={() => handleDelete(cat.slug)}
                            className="p-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
                          >
                            <CheckIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="p-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </>
                      ) : isEditing ? (
                        <>
                          <button
                            onClick={() => handleUpdate(cat.slug)}
                            className="p-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
                          >
                            <CheckIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setEditingSlug(null)}
                            className="p-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditingSlug(cat.slug);
                              setEditName(cat.name);
                              setEditParentSlug(cat.parentSlug || '');
                            }}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            title="Edit"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(cat.slug)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Delete"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {categoryTree.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  {searchTerm ? 'No categories match your search' : 'No categories yet. Add one to get started!'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============ Products Panel ============
const ProductsPanel: React.FC<PanelProps> = ({ showNotification }) => {
  const { products, categories, addProduct, updateProduct, deleteProduct, getCategoryBySlug } = useAdmin();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | number | null>(null);
  
  // Form state
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    sizes: '',
    colors: '',
    image: '',
    stock: '',
  });

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      category: categories[0]?.slug || '',
      sizes: '',
      colors: '',
      image: '',
      stock: '',
    });
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAdd = async () => {
    if (!form.name.trim() || !form.price || !form.category) {
      showNotification('error', 'Please fill in required fields (name, price, category)');
      return;
    }

    const newProduct = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      category: form.category,
      sizes: form.sizes ? form.sizes.split(',').map(s => s.trim()).filter(Boolean) : [],
      colors: form.colors ? form.colors.split(',').map(c => c.trim()).filter(Boolean) : [],
      image: form.image.trim() || undefined,
      stock: form.stock ? Number(form.stock) : undefined,
      rating: 0,
      reviews: 0,
    };

    const result = await addProduct(newProduct);
    if (result) {
      showNotification('success', `Product "${result.name}" added`);
      resetForm();
      setShowAddForm(false);
    } else {
      showNotification('error', 'Failed to add product');
    }
  };

  const handleUpdate = async (id: string | number) => {
    if (!form.name.trim() || !form.price) {
      showNotification('error', 'Please fill in required fields');
      return;
    }

    const updates: Partial<Product> = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      category: form.category,
      sizes: form.sizes ? form.sizes.split(',').map(s => s.trim()).filter(Boolean) : [],
      colors: form.colors ? form.colors.split(',').map(c => c.trim()).filter(Boolean) : [],
      image: form.image.trim() || undefined,
      stock: form.stock ? Number(form.stock) : undefined,
    };

    const result = await updateProduct(id, updates);
    if (result) {
      showNotification('success', 'Product updated');
      setEditingId(null);
      resetForm();
    } else {
      showNotification('error', 'Failed to update product');
    }
  };

  const handleDelete = async (id: string | number) => {
    const result = await deleteProduct(id);
    if (result) {
      showNotification('success', 'Product deleted');
    } else {
      showNotification('error', 'Failed to delete product');
    }
    setDeleteConfirm(null);
  };

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description || '',
      price: String(product.price),
      originalPrice: product.originalPrice ? String(product.originalPrice) : '',
      category: product.category,
      sizes: product.sizes?.join(', ') || '',
      colors: product.colors?.join(', ') || '',
      image: product.image || '',
      stock: product.stock ? String(product.stock) : '',
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="flex gap-2 flex-1">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded-lg flex-1 sm:max-w-xs"
          />
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.slug} value={cat.slug}>{cat.name}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => { resetForm(); setShowAddForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          <PlusIcon className="h-4 w-4" />
          Add Product
        </button>
      </div>

      {/* Add/Edit Form Modal */}
      {(showAddForm || editingId !== null) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button 
                onClick={() => { setShowAddForm(false); setEditingId(null); resetForm(); }} 
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Product name"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg h-24 resize-none"
                  placeholder="Product description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={e => setForm({ ...form, price: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="999"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (₹)</label>
                <input
                  type="number"
                  value={form.originalPrice}
                  onChange={e => setForm({ ...form, originalPrice: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="1299 (for discount display)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={e => setForm({ ...form, stock: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sizes (comma-separated)</label>
                <input
                  type="text"
                  value={form.sizes}
                  onChange={e => setForm({ ...form, sizes: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="S, M, L, XL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Colors (comma-separated)</label>
                <input
                  type="text"
                  value={form.colors}
                  onChange={e => setForm({ ...form, colors: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Black, White, Navy"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={form.image}
                  onChange={e => setForm({ ...form, image: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => { setShowAddForm(false); setEditingId(null); resetForm(); }}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => editingId ? handleUpdate(editingId) : handleAdd()}
                className="px-4 py-2 bg-black text-white rounded-lg"
              >
                {editingId ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map(product => {
          const category = getCategoryBySlug(product.category);
          const isDeleting = deleteConfirm === product.id;
          const discount = product.originalPrice 
            ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
            : 0;

          return (
            <div key={product.id} className="bg-white rounded-xl border overflow-hidden hover:shadow-lg transition">
              {/* Image */}
              <div className="h-40 bg-gray-100 relative">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <ShoppingBagIcon className="h-12 w-12" />
                  </div>
                )}
                {discount > 0 && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    -{discount}%
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{product.name}</h4>
                    <p className="text-sm text-gray-500">{category?.name || product.category}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">₹{product.price}</div>
                    {product.originalPrice && (
                      <div className="text-sm text-gray-400 line-through">₹{product.originalPrice}</div>
                    )}
                  </div>
                </div>

                {/* Meta info */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {product.sizes?.slice(0, 3).map(s => (
                    <span key={s} className="text-xs bg-gray-100 px-2 py-0.5 rounded">{s}</span>
                  ))}
                  {product.sizes && product.sizes.length > 3 && (
                    <span className="text-xs text-gray-400">+{product.sizes.length - 3} more</span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                  {isDeleting ? (
                    <>
                      <span className="text-sm text-red-600 flex-1">Delete this product?</span>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
                      >
                        <CheckIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="p-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="text-xs text-gray-400 flex-1">ID: {product.id}</span>
                      <button
                        onClick={() => startEdit(product)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        title="Edit"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          {searchTerm || categoryFilter 
            ? 'No products match your filters' 
            : 'No products yet. Add one to get started!'}
        </div>
      )}
    </div>
  );
};

// ============ Offers Panel ============
const OffersPanel: React.FC<PanelProps> = ({ showNotification }) => {
  const { offers, products, categories, addOffer, updateOffer, deleteOffer, getProductById } = useAdmin();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | number | null>(null);

  // Form state
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    image: '',
    cta: '',
    productId: '',
    categorySlug: '',
    discount: '',
    active: true,
  });

  const resetForm = () => {
    setForm({
      title: '',
      subtitle: '',
      image: '',
      cta: '',
      productId: '',
      categorySlug: '',
      discount: '',
      active: true,
    });
  };

  const filteredOffers = offers.filter(o =>
    o.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.subtitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = async () => {
    if (!form.title.trim()) {
      showNotification('error', 'Please enter an offer title');
      return;
    }

    const newOffer: Omit<Offer, 'id'> = {
      title: form.title.trim(),
      subtitle: form.subtitle.trim() || undefined,
      image: form.image.trim() || undefined,
      cta: form.cta.trim() || undefined,
      productId: form.productId ? Number(form.productId) : undefined,
      categorySlug: form.categorySlug || undefined,
      discount: form.discount ? Number(form.discount) : undefined,
      active: form.active,
    };

    const result = await addOffer(newOffer);
    if (result) {
      showNotification('success', `Offer "${result.title}" added`);
      resetForm();
      setShowAddForm(false);
    } else {
      showNotification('error', 'Failed to add offer');
    }
  };

  const handleUpdate = async (id: string | number) => {
    if (!form.title.trim()) {
      showNotification('error', 'Please enter an offer title');
      return;
    }

    const updates: Partial<Offer> = {
      title: form.title.trim(),
      subtitle: form.subtitle.trim() || undefined,
      image: form.image.trim() || undefined,
      cta: form.cta.trim() || undefined,
      productId: form.productId ? Number(form.productId) : undefined,
      categorySlug: form.categorySlug || undefined,
      discount: form.discount ? Number(form.discount) : undefined,
      active: form.active,
    };

    const result = await updateOffer(id, updates);
    if (result) {
      showNotification('success', 'Offer updated');
      setEditingId(null);
      resetForm();
    } else {
      showNotification('error', 'Failed to update offer');
    }
  };

  const handleDelete = async (id: string | number) => {
    const result = await deleteOffer(id);
    if (result) {
      showNotification('success', 'Offer deleted');
    } else {
      showNotification('error', 'Failed to delete offer');
    }
    setDeleteConfirm(null);
  };

  const startEdit = (offer: Offer) => {
    setEditingId(offer.id);
    setForm({
      title: offer.title,
      subtitle: offer.subtitle || '',
      image: offer.image || '',
      cta: offer.cta || '',
      productId: offer.productId ? String(offer.productId) : '',
      categorySlug: offer.categorySlug || '',
      discount: offer.discount ? String(offer.discount) : '',
      active: offer.active !== false,
    });
  };

  const toggleActive = async (offer: Offer) => {
    await updateOffer(offer.id, { active: !offer.active });
    showNotification('success', offer.active ? 'Offer deactivated' : 'Offer activated');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <input
          type="text"
          placeholder="Search offers..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded-lg w-full sm:w-64"
        />
        <button
          onClick={() => { resetForm(); setShowAddForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          <PlusIcon className="h-4 w-4" />
          Add Offer
        </button>
      </div>

      {/* Add/Edit Form Modal */}
      {(showAddForm || editingId !== null) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {editingId ? 'Edit Offer' : 'Add New Offer'}
              </h3>
              <button 
                onClick={() => { setShowAddForm(false); setEditingId(null); resetForm(); }} 
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Flat 40% off on Winterwear"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={e => setForm({ ...form, subtitle: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Limited time offer"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={form.image}
                  onChange={e => setForm({ ...form, image: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="https://example.com/offer-banner.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CTA Button Text</label>
                <input
                  type="text"
                  value={form.cta}
                  onChange={e => setForm({ ...form, cta: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Shop Now"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount %</label>
                <input
                  type="number"
                  value={form.discount}
                  onChange={e => setForm({ ...form, discount: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="40"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link to Product</label>
                <select
                  value={form.productId}
                  onChange={e => setForm({ ...form, productId: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="">No specific product</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (₹{p.price})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link to Category</label>
                <select
                  value={form.categorySlug}
                  onChange={e => setForm({ ...form, categorySlug: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="">No specific category</option>
                  {categories.map(cat => (
                    <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="offerActive"
                  checked={form.active}
                  onChange={e => setForm({ ...form, active: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor="offerActive" className="text-sm text-gray-700">
                  Active (visible on website)
                </label>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => { setShowAddForm(false); setEditingId(null); resetForm(); }}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => editingId ? handleUpdate(editingId) : handleAdd()}
                className="px-4 py-2 bg-black text-white rounded-lg"
              >
                {editingId ? 'Update Offer' : 'Add Offer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOffers.map(offer => {
          const linkedProduct = offer.productId ? getProductById(offer.productId) : null;
          const linkedCategory = offer.categorySlug ? categories.find(c => c.slug === offer.categorySlug) : null;
          const isDeleting = deleteConfirm === offer.id;

          return (
            <div 
              key={offer.id} 
              className={`bg-white rounded-xl border overflow-hidden hover:shadow-lg transition ${
                offer.active === false ? 'opacity-60' : ''
              }`}
            >
              {/* Image */}
              <div className="h-32 bg-gradient-to-br from-yellow-100 to-yellow-50 relative">
                {offer.image ? (
                  <img src={offer.image} alt={offer.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-yellow-500">
                    <SparklesIcon className="h-12 w-12" />
                  </div>
                )}
                {offer.active === false && (
                  <span className="absolute top-2 left-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                    Inactive
                  </span>
                )}
                {offer.discount && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    {offer.discount}% OFF
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h4 className="font-semibold">{offer.title}</h4>
                {offer.subtitle && (
                  <p className="text-sm text-gray-500 mt-1">{offer.subtitle}</p>
                )}

                {/* Links */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {linkedProduct && (
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded flex items-center gap-1">
                      <LinkIcon className="h-3 w-3" />
                      {linkedProduct.name}
                    </span>
                  )}
                  {linkedCategory && (
                    <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded flex items-center gap-1">
                      <TagIcon className="h-3 w-3" />
                      {linkedCategory.name}
                    </span>
                  )}
                  {offer.cta && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      CTA: {offer.cta}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                  {isDeleting ? (
                    <>
                      <span className="text-sm text-red-600 flex-1">Delete this offer?</span>
                      <button
                        onClick={() => handleDelete(offer.id)}
                        className="p-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
                      >
                        <CheckIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="p-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => toggleActive(offer)}
                        className={`text-xs px-2 py-1 rounded ${
                          offer.active !== false 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {offer.active !== false ? 'Active' : 'Inactive'}
                      </button>
                      <span className="flex-1" />
                      <button
                        onClick={() => startEdit(offer)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        title="Edit"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(offer.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredOffers.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          {searchTerm ? 'No offers match your search' : 'No offers yet. Add one to get started!'}
        </div>
      )}
    </div>
  );
};

export default Admin;
