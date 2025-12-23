import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const NotFound: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <Helmet>
        <title>Page Not Found — Menzo Fashion</title>
        <meta name="description" content="The page you are looking for doesn't exist." />
      </Helmet>
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-gray-600 mb-6">The page you're looking for doesn't exist or was moved.</p>
      <div className="flex gap-3 justify-center">
        <Link className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800" to="/">Go Home</Link>
        <Link className="px-4 py-2 rounded border" to="/catalog">Browse Catalog</Link>
      </div>
    </div>
  );
};

export default NotFound;
