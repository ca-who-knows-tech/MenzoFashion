import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

interface AddressForm {
  fullName: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
}

type Step = 'address' | 'shipping' | 'payment' | 'review' | 'success';

const Checkout: React.FC = () => {
  const { cart, getTotal, clearCart } = useCart();
  const { user, promptSignIn } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>('address');
  const [saving, setSaving] = useState(false);
  const [addr, setAddr] = useState<AddressForm>({
    fullName: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: ''
  });
  const [shipping, setShipping] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card' | 'upi'>('cod');
  const [error, setError] = useState<string | null>(null);

  const subtotal = useMemo(() => getTotal(), [getTotal]);
  const shippingCost = shipping === 'standard' ? 99 : 199;
  const total = subtotal + (subtotal > 0 ? shippingCost : 0);

  if (cart.length === 0 && step !== 'success') {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Checkout</h1>
        <p className="mb-4">Your cart is empty.</p>
        <Link to="/catalog" className="inline-block bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800">Continue Shopping</Link>
      </div>
    );
  }

  const proceed = (next: Step) => setStep(next);

  const placeOrder = async () => {
    setError(null);
    if (!user) {
      setError('Please sign in to place an order.');
      try { promptSignIn(); } catch {}
      return;
    }
    if (!addr.fullName || !addr.phone || !addr.line1 || !addr.city || !addr.state || !addr.postalCode) {
      setError('Please complete the shipping address.');
      return;
    }

    const orderId = `ORD-${Date.now()}`;
    const order = {
      id: orderId,
      userId: user.email || user.sub || 'guest',
      date: new Date().toISOString(),
      status: 'pending',
      items: cart.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, image: i.image })),
      total: total,
      shippingAddress: `${addr.fullName}, ${addr.line1}${addr.line2 ? ', ' + addr.line2 : ''}, ${addr.city}, ${addr.state} ${addr.postalCode}`,
      shippingMethod: shipping,
      paymentMethod,
    } as any;

    setSaving(true);
    try {
      const res = await fetch('http://localhost:5000/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });
      if (!res.ok) throw new Error('Failed to place order');
      clearCart();
      setStep('success');
      // Redirect to orders after a short confirmation
      setTimeout(() => navigate('/orders'), 1200);
    } catch (e: any) {
      setError(e?.message || 'Failed to place order');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Checkout — Menzo Fashion</title>
        <meta name="description" content="Complete your order with address, shipping and payment." />
      </Helmet>
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {/* Steps Indicator */}
      <div className="flex items-center mb-6 text-sm">
        {['address','shipping','payment','review'].map((s, idx) => (
          <div key={s} className="flex items-center">
            <div className={`px-3 py-1 rounded-full border ${step===s? 'bg-black text-white border-black':'bg-white text-gray-700'}`}>{idx+1}. {s.charAt(0).toUpperCase()+s.slice(1)}</div>
            {idx<3 && <div className="w-8 h-[1px] bg-gray-300 mx-2" />}
          </div>
        ))}
      </div>

      {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">{error}</div>}

      {step === 'address' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-3">Shipping Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input className="border p-2 rounded" placeholder="Full Name" value={addr.fullName} onChange={e=>setAddr({...addr, fullName:e.target.value})} />
              <input className="border p-2 rounded" placeholder="Phone" value={addr.phone} onChange={e=>setAddr({...addr, phone:e.target.value})} />
              <input className="border p-2 rounded md:col-span-2" placeholder="Address Line 1" value={addr.line1} onChange={e=>setAddr({...addr, line1:e.target.value})} />
              <input className="border p-2 rounded md:col-span-2" placeholder="Address Line 2 (optional)" value={addr.line2} onChange={e=>setAddr({...addr, line2:e.target.value})} />
              <input className="border p-2 rounded" placeholder="City" value={addr.city} onChange={e=>setAddr({...addr, city:e.target.value})} />
              <input className="border p-2 rounded" placeholder="State" value={addr.state} onChange={e=>setAddr({...addr, state:e.target.value})} />
              <input className="border p-2 rounded" placeholder="Postal Code" value={addr.postalCode} onChange={e=>setAddr({...addr, postalCode:e.target.value})} />
            </div>
            <div className="flex justify-end mt-4">
              <button onClick={()=>proceed('shipping')} className="bg-black text-white px-5 py-2 rounded hover:bg-gray-800">Continue</button>
            </div>
          </div>
          <SummaryPanel subtotal={subtotal} shippingCost={shippingCost} total={total} />
        </div>
      )}

      {step === 'shipping' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-3">Shipping Method</h2>
            <div className="space-y-3">
              <label className={`flex items-center justify-between border rounded p-3 cursor-pointer ${shipping==='standard'?'border-black':''}`}>
                <span>
                  <span className="font-medium">Standard (3-5 days)</span>
                  <span className="block text-sm text-gray-500">Reliable delivery</span>
                </span>
                <span className="flex items-center gap-3">
                  <span>₹99</span>
                  <input type="radio" name="ship" checked={shipping==='standard'} onChange={()=>setShipping('standard')} />
                </span>
              </label>
              <label className={`flex items-center justify-between border rounded p-3 cursor-pointer ${shipping==='express'?'border-black':''}`}>
                <span>
                  <span className="font-medium">Express (1-2 days)</span>
                  <span className="block text-sm text-gray-500">Fastest delivery</span>
                </span>
                <span className="flex items-center gap-3">
                  <span>₹199</span>
                  <input type="radio" name="ship" checked={shipping==='express'} onChange={()=>setShipping('express')} />
                </span>
              </label>
            </div>
            <div className="flex justify-between mt-4">
              <button onClick={()=>proceed('address')} className="px-5 py-2 border rounded">Back</button>
              <button onClick={()=>proceed('payment')} className="bg-black text-white px-5 py-2 rounded hover:bg-gray-800">Continue</button>
            </div>
          </div>
          <SummaryPanel subtotal={subtotal} shippingCost={shippingCost} total={total} />
        </div>
      )}

      {step === 'payment' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-3">Payment</h2>
            <p className="text-sm text-gray-600 mb-4">Payment is a placeholder for now — select a method and continue.</p>
            <div className="space-y-3">
              <label className={`flex items-center justify-between border rounded p-3 cursor-pointer ${paymentMethod==='cod'?'border-black':''}`}>
                <span>Cash on Delivery</span>
                <input type="radio" name="pay" checked={paymentMethod==='cod'} onChange={()=>setPaymentMethod('cod')} />
              </label>
              <label className={`flex items-center justify-between border rounded p-3 cursor-pointer ${paymentMethod==='card'?'border-black':''}`}>
                <span>Credit/Debit Card (placeholder)</span>
                <input type="radio" name="pay" checked={paymentMethod==='card'} onChange={()=>setPaymentMethod('card')} />
              </label>
              <label className={`flex items-center justify-between border rounded p-3 cursor-pointer ${paymentMethod==='upi'?'border-black':''}`}>
                <span>UPI (placeholder)</span>
                <input type="radio" name="pay" checked={paymentMethod==='upi'} onChange={()=>setPaymentMethod('upi')} />
              </label>
            </div>
            <div className="flex justify-between mt-4">
              <button onClick={()=>proceed('shipping')} className="px-5 py-2 border rounded">Back</button>
              <button onClick={()=>proceed('review')} className="bg-black text-white px-5 py-2 rounded hover:bg-gray-800">Review Order</button>
            </div>
          </div>
          <SummaryPanel subtotal={subtotal} shippingCost={shippingCost} total={total} />
        </div>
      )}

      {step === 'review' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-3">Review & Place Order</h2>
            <div className="mb-4">
              <h3 className="font-medium mb-1">Shipping to</h3>
              <p className="text-sm text-gray-700">{addr.fullName}, {addr.line1}{addr.line2?`, ${addr.line2}`:''}, {addr.city}, {addr.state} {addr.postalCode}</p>
              <p className="text-sm text-gray-500">Phone: {addr.phone}</p>
            </div>
            <div className="mb-4">
              <h3 className="font-medium mb-1">Shipping Method</h3>
              <p className="text-sm text-gray-700">{shipping==='standard'?'Standard (₹99, 3-5 days)':'Express (₹199, 1-2 days)'}</p>
            </div>
            <div className="mb-4">
              <h3 className="font-medium mb-1">Payment</h3>
              <p className="text-sm text-gray-700">{paymentMethod.toUpperCase()}</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Items</h3>
              <div className="space-y-2">
                {cart.map(i => (
                  <div key={`${i.id}-${i.size}-${i.color}`} className="flex justify-between text-sm">
                    <div>
                      <div className="font-medium">{i.name}</div>
                      <div className="text-gray-500">Qty {i.quantity} · {i.size} · {i.color}</div>
                    </div>
                    <div>₹{(i.price * i.quantity).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <button onClick={()=>proceed('payment')} className="px-5 py-2 border rounded">Back</button>
              <button disabled={saving} onClick={placeOrder} className="bg-black text-white px-5 py-2 rounded hover:bg-gray-800 disabled:opacity-60">{saving? 'Placing...' : 'Place Order'}</button>
            </div>
          </div>
          <SummaryPanel subtotal={subtotal} shippingCost={shippingCost} total={total} />
        </div>
      )}

      {step === 'success' && (
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-2">Order placed successfully!</h2>
          <p className="text-gray-600 mb-6">Taking you to your orders...</p>
          <Link to="/orders" className="inline-block bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800">Go to Orders</Link>
        </div>
      )}
    </div>
  );
};

const SummaryPanel: React.FC<{ subtotal: number; shippingCost: number; total: number; }> = ({ subtotal, shippingCost, total }) => (
  <div className="bg-gray-50 p-4 rounded-lg border h-fit">
    <h3 className="text-lg font-semibold mb-3">Summary</h3>
    <div className="flex justify-between mb-2"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
    <div className="flex justify-between mb-2"><span>Shipping</span><span>₹{subtotal>0? shippingCost.toFixed(2) : '0.00'}</span></div>
    <div className="flex justify-between border-t pt-2 font-bold text-lg"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
  </div>
);

export default Checkout;
