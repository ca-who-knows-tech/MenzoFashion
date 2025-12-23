import React from 'react';
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface StockIndicatorProps {
  stock: number;
  size?: string;
}

export const StockIndicator: React.FC<StockIndicatorProps> = ({ stock, size = '' }) => {
  const isInStock = stock > 0;
  const isLowStock = stock > 0 && stock <= 5;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${
      isInStock
        ? isLowStock
          ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
          : 'bg-green-50 text-green-800 border border-green-200'
        : 'bg-red-50 text-red-800 border border-red-200'
    }`}>
      {isInStock ? (
        <>
          <CheckCircleIcon className="h-4 w-4" />
          <span>
            {isLowStock ? `Only ${stock} left in ${size || 'this size'}` : `In Stock ${size ? `(${size})` : ''}`}
          </span>
        </>
      ) : (
        <>
          <ExclamationTriangleIcon className="h-4 w-4" />
          <span>Out of Stock {size ? `(${size})` : ''}</span>
        </>
      )}
    </div>
  );
};

export default StockIndicator;
