import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';

const Returns: React.FC = () => {
  const [orderId, setOrderId] = useState('');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // No backend - simulate submit
    setSubmitted(true);
    setTimeout(() => {
      setOrderId('');
      setReason('');
    }, 800);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Returns — Menzo Fashion</title>
        <meta name="description" content="View return policy and start a return for Menzo Fashion orders." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : ''} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Returns — Menzo Fashion" />
        <meta property="og:description" content="View return policy and start a return." />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
        <meta property="og:image" content={`${import.meta.env.BASE_URL}logo.svg`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Returns — Menzo Fashion" />
        <meta name="twitter:description" content="View return policy and start a return." />
        <meta name="twitter:image" content={`${import.meta.env.BASE_URL}logo.svg`} />
      </Helmet>
      <h1 className="text-2xl font-bold mb-6">Returns & Refunds</h1>

      <div className="max-w-lg bg-white border rounded-lg p-6 shadow-sm">
        {submitted ? (
          <div className="text-green-600">Return request submitted successfully. We'll email you updates.</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700">Order ID</label>
              <input value={orderId} onChange={e => setOrderId(e.target.value)} className="w-full mt-1 p-2 border rounded" placeholder="e.g. ORD-1001" required />
            </div>

            <div>
              <label className="block text-sm text-gray-700">Reason for return</label>
              <select value={reason} onChange={e => setReason(e.target.value)} className="w-full mt-1 p-2 border rounded" required>
                <option value="">Select a reason</option>
                <option value="size">Wrong size</option>
                <option value="defect">Damaged / Defective</option>
                <option value="not_like">Not as expected</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex justify-end">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Submit Return</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Returns;
