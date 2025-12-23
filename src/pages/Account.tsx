import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { PencilIcon, TrashIcon, PlusIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Helmet } from 'react-helmet-async';

interface Address {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

const Account: React.FC = () => {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'settings'>('profile');
  const [editingProfile, setEditingProfile] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [editingAddress, setEditingAddress] = useState<string | null>(null);
  const [newAddress, setNewAddress] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
  });
  const [addressForm, setAddressForm] = useState<Partial<Address>>({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
  });

  // Load addresses from localStorage
  useEffect(() => {
    const savedAddresses = localStorage.getItem('menzo_addresses');
    if (savedAddresses) {
      setAddresses(JSON.parse(savedAddresses));
    } else {
      // Sample address
      const defaultAddresses: Address[] = [
        {
          id: '1',
          name: 'Home',
          phone: '+91 98765 43210',
          street: '123 Main Street, Apartment 4B',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          isDefault: true,
        },
      ];
      setAddresses(defaultAddresses);
      localStorage.setItem('menzo_addresses', JSON.stringify(defaultAddresses));
    }
  }, []);

  // Save addresses to localStorage
  const saveAddresses = (updatedAddresses: Address[]) => {
    setAddresses(updatedAddresses);
    localStorage.setItem('menzo_addresses', JSON.stringify(updatedAddresses));
  };

  const handleSaveProfile = () => {
    // In a real app, this would sync with backend
    setEditingProfile(false);
  };

  const handleAddAddress = () => {
    if (!addressForm.name || !addressForm.phone || !addressForm.street || !addressForm.city || !addressForm.state || !addressForm.pincode) {
      alert('Please fill all fields');
      return;
    }

    const newAddr: Address = {
      id: Date.now().toString(),
      name: addressForm.name,
      phone: addressForm.phone,
      street: addressForm.street,
      city: addressForm.city,
      state: addressForm.state,
      pincode: addressForm.pincode,
      isDefault: addressForm.isDefault || false,
    };

    saveAddresses([...addresses, newAddr]);
    setAddressForm({
      name: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false,
    });
    setNewAddress(false);
  };

  const handleUpdateAddress = (id: string) => {
    if (!addressForm.name || !addressForm.phone || !addressForm.street || !addressForm.city || !addressForm.state || !addressForm.pincode) {
      alert('Please fill all fields');
      return;
    }

    const updated = addresses.map(addr =>
      addr.id === id
        ? {
            id: addr.id,
            name: addressForm.name || '',
            phone: addressForm.phone || '',
            street: addressForm.street || '',
            city: addressForm.city || '',
            state: addressForm.state || '',
            pincode: addressForm.pincode || '',
            isDefault: addressForm.isDefault || false,
          }
        : addr
    );

    saveAddresses(updated);
    setEditingAddress(null);
    setAddressForm({
      name: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false,
    });
  };

  const handleDeleteAddress = (id: string) => {
    const updated = addresses.filter(addr => addr.id !== id);
    saveAddresses(updated);
  };

  const handleSetDefault = (id: string) => {
    const updated = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id,
    }));
    saveAddresses(updated);
  };

  const startEditingAddress = (address: Address) => {
    setEditingAddress(address.id);
    setAddressForm(address);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">My Account</h1>
          <p className="text-gray-600 mb-6">You are not signed in. Please sign in to view your account.</p>
          <a href="/" className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800">
            Go Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Helmet>
        <title>Account — Menzo Fashion</title>
        <meta name="description" content="Manage your profile, addresses, and settings on Menzo Fashion." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : ''} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Account — Menzo Fashion" />
        <meta property="og:description" content="Manage your profile, addresses, and settings." />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
        <meta property="og:image" content={`${import.meta.env.BASE_URL}logo.svg`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Account — Menzo Fashion" />
        <meta name="twitter:description" content="Manage your profile, addresses, and settings." />
        <meta name="twitter:image" content={`${import.meta.env.BASE_URL}logo.svg`} />
      </Helmet>
      <h1 className="text-3xl font-bold mb-8">My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-black to-gray-600 flex items-center justify-center text-3xl font-bold text-white mb-4">
                {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="font-semibold text-lg">{user.name || 'User'}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </div>

            <div className="space-y-2 mb-6">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-2 rounded-lg transition ${
                  activeTab === 'profile' ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Profile Info
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full text-left px-4 py-2 rounded-lg transition ${
                  activeTab === 'addresses' ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Addresses
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full text-left px-4 py-2 rounded-lg transition ${
                  activeTab === 'settings' ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Settings
              </button>
            </div>

            <button
              onClick={() => setUser(null)}
              className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          {/* Profile Info Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Profile Information</h2>
                {!editingProfile && (
                  <button
                    onClick={() => setEditingProfile(true)}
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                  >
                    <PencilIcon className="w-4 h-4" />
                    Edit
                  </button>
                )}
              </div>

              {editingProfile ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSaveProfile}
                      className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                    >
                      <CheckIcon className="w-4 h-4" />
                      Save Changes
                    </button>
                    <button
                      onClick={() => {
                        setEditingProfile(false);
                        setFormData({
                          name: user.name || '',
                          email: user.email || '',
                          phone: '',
                        });
                      }}
                      className="flex items-center gap-2 bg-gray-200 text-black px-4 py-2 rounded-lg hover:bg-gray-300"
                    >
                      <XMarkIcon className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Full Name</label>
                      <p className="text-lg font-medium">{formData.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Email</label>
                      <p className="text-lg font-medium">{formData.email}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Member Since</label>
                    <p className="text-lg font-medium">January 2025</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Saved Addresses</h2>
                {!newAddress && !editingAddress && (
                  <button
                    onClick={() => setNewAddress(true)}
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                  >
                    <PlusIcon className="w-4 h-4" />
                    Add Address
                  </button>
                )}
              </div>

              {newAddress && (
                <div className="bg-gray-50 p-6 rounded-lg mb-6 border">
                  <h3 className="font-semibold mb-4">Add New Address</h3>
                  <div className="space-y-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Address Name (e.g., Home, Office)"
                      value={addressForm.name || ''}
                      onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                      className="px-3 py-2 border rounded-lg"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={addressForm.phone || ''}
                      onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                      className="px-3 py-2 border rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Street Address"
                      value={addressForm.street || ''}
                      onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                      className="md:col-span-2 px-3 py-2 border rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="City"
                      value={addressForm.city || ''}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      className="px-3 py-2 border rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={addressForm.state || ''}
                      onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                      className="px-3 py-2 border rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Pincode"
                      value={addressForm.pincode || ''}
                      onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                      className="px-3 py-2 border rounded-lg"
                    />
                    <label className="md:col-span-2 flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={addressForm.isDefault || false}
                        onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <span>Set as default address</span>
                    </label>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={handleAddAddress}
                      className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                    >
                      <CheckIcon className="w-4 h-4" />
                      Add Address
                    </button>
                    <button
                      onClick={() => {
                        setNewAddress(false);
                        setAddressForm({
                          name: '',
                          phone: '',
                          street: '',
                          city: '',
                          state: '',
                          pincode: '',
                          isDefault: false,
                        });
                      }}
                      className="flex items-center gap-2 bg-gray-200 text-black px-4 py-2 rounded-lg hover:bg-gray-300"
                    >
                      <XMarkIcon className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {addresses.map((address) => (
                  <div key={address.id} className="border rounded-lg p-4 hover:shadow-md transition">
                    {editingAddress === address.id ? (
                      <div className="space-y-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={addressForm.name || ''}
                          onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                          className="px-3 py-2 border rounded-lg"
                        />
                        <input
                          type="tel"
                          value={addressForm.phone || ''}
                          onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                          className="px-3 py-2 border rounded-lg"
                        />
                        <input
                          type="text"
                          value={addressForm.street || ''}
                          onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                          className="md:col-span-2 px-3 py-2 border rounded-lg"
                        />
                        <input
                          type="text"
                          value={addressForm.city || ''}
                          onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                          className="px-3 py-2 border rounded-lg"
                        />
                        <input
                          type="text"
                          value={addressForm.state || ''}
                          onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                          className="px-3 py-2 border rounded-lg"
                        />
                        <input
                          type="text"
                          value={addressForm.pincode || ''}
                          onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                          className="px-3 py-2 border rounded-lg"
                        />
                        <label className="md:col-span-2 flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={addressForm.isDefault || false}
                            onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                            className="w-4 h-4"
                          />
                          <span>Set as default address</span>
                        </label>

                        <div className="md:col-span-2 flex gap-3">
                          <button
                            onClick={() => handleUpdateAddress(address.id)}
                            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                          >
                            <CheckIcon className="w-4 h-4" />
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingAddress(null);
                              setAddressForm({
                                name: '',
                                phone: '',
                                street: '',
                                city: '',
                                state: '',
                                pincode: '',
                                isDefault: false,
                              });
                            }}
                            className="flex items-center gap-2 bg-gray-200 text-black px-4 py-2 rounded-lg hover:bg-gray-300"
                          >
                            <XMarkIcon className="w-4 h-4" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-semibold flex items-center gap-2">
                              {address.name}
                              {address.isDefault && (
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Default</span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEditingAddress(address)}
                              className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                              <PencilIcon className="w-5 h-5 text-blue-600" />
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(address.id)}
                              className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                              <TrashIcon className="w-5 h-5 text-red-600" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{address.phone}</p>
                        <p className="text-sm text-gray-600">{address.street}</p>
                        <p className="text-sm text-gray-600">
                          {address.city}, {address.state} {address.pincode}
                        </p>
                        {!address.isDefault && (
                          <button
                            onClick={() => handleSetDefault(address.id)}
                            className="mt-2 text-sm text-blue-600 hover:underline"
                          >
                            Set as default
                          </button>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Account Settings</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Notifications</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                      <span>Order updates via email</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                      <span>Promotional emails and offers</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="w-4 h-4" />
                      <span>SMS notifications</span>
                    </label>
                  </div>
                </div>

                <hr />

                <div>
                  <h3 className="font-semibold mb-3">Privacy & Security</h3>
                  <div className="space-y-3">
                    <button className="w-full text-left px-4 py-2 border rounded-lg hover:bg-gray-50">
                      Change Password
                    </button>
                    <button className="w-full text-left px-4 py-2 border rounded-lg hover:bg-gray-50">
                      Two-Factor Authentication
                    </button>
                    <button className="w-full text-left px-4 py-2 border rounded-lg hover:bg-gray-50">
                      Login Activity
                    </button>
                  </div>
                </div>

                <hr />

                <div>
                  <h3 className="font-semibold mb-3 text-red-600">Danger Zone</h3>
                  <button className="w-full bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
