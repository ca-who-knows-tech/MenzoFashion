import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBagIcon,
  TagIcon,
  ShoppingCartIcon,
  StarIcon,
  SunIcon,
  MoonIcon,
  GiftIcon,
} from '@heroicons/react/24/outline';
import { useAdmin } from '../context/AdminContext';

const iconFor = (slug: string): JSX.Element => {
  const classes = 'h-6 w-6';
  switch (slug) {
    case 'tshirts':
      return <ShoppingBagIcon className={classes} aria-hidden />;
    case 'shirts':
      return <TagIcon className={classes} aria-hidden />;
    case 'pants':
      return <ShoppingCartIcon className={classes} aria-hidden />;
    case 'jeans':
      return <StarIcon className={classes} aria-hidden />;
    case 'hoodies':
      return <GiftIcon className={classes} aria-hidden />;
    case 'winterwear':
      return <SunIcon className={classes} aria-hidden />;
    case 'sleepwear':
      return <MoonIcon className={classes} aria-hidden />;
    case 'accessories':
      return <GiftIcon className={classes} aria-hidden />;
    default:
      return <ShoppingBagIcon className={classes} aria-hidden />;
  }
};

const CategoryPanel: React.FC = () => {
  const { getTopLevelCategories } = useAdmin();
  const [top, setTop] = useState<number>(64);

  useEffect(() => {
    const computeTop = () => {
      // Try to find a header element; fall back to 64px if not found
      const hdr = document.querySelector('header');
      if (hdr) setTop(Math.ceil((hdr as HTMLElement).getBoundingClientRect().height));
    };
    computeTop();
    window.addEventListener('resize', computeTop);
    // also watch for dynamic changes (e.g., avatar loaded) using a MutationObserver
    const hdrEl = document.querySelector('header');
    let mo: MutationObserver | null = null;
    if (hdrEl) {
      mo = new MutationObserver(() => computeTop());
      mo.observe(hdrEl, { childList: true, subtree: true, attributes: true });
    }
    return () => {
      window.removeEventListener('resize', computeTop);
      if (mo) mo.disconnect();
    };
  }, []);

  // Use top-level categories from context (real-time updates from admin)
  const cats = getTopLevelCategories();

  if (cats.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white border-b border-gray-200 z-40 py-4" style={{ position: 'sticky', top }}>
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2">
          {cats.map(cat => (
            <Link
              key={cat.slug}
              to={`/catalog/${cat.slug}`}
              className="flex-shrink-0 min-w-[140px] px-6 py-4 rounded-xl bg-white hover:bg-gradient-to-br hover:from-yellow-50 hover:to-white border border-gray-200 hover:border-yellow-300 text-sm font-semibold text-gray-800 hover:text-black shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center gap-2 transform hover:-translate-y-1"
            >
              <span className="text-yellow-600">{iconFor(cat.slug)}</span>
              <span className="text-center">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryPanel;