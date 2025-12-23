import React, { useEffect, useRef } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface SizeGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideProps> = ({ isOpen, onClose }) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const lastFocusedEl = useRef<Element | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    // Save last focused element and focus close button
    lastFocusedEl.current = document.activeElement;
    setTimeout(() => closeBtnRef.current?.focus(), 0);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex="0"], input, select, textarea');
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
      if (lastFocusedEl.current instanceof HTMLElement) lastFocusedEl.current.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div ref={dialogRef} className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Size Guide</h2>
          <button ref={closeBtnRef} onClick={onClose} className="p-1 hover:bg-gray-100 rounded" aria-label="Close size guide">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Men's T-Shirts & Casual */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-black">Men's T-Shirts & Casual Wear</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-4 py-2 text-left">Size</th>
                    <th className="border px-4 py-2 text-left">XS</th>
                    <th className="border px-4 py-2 text-left">S</th>
                    <th className="border px-4 py-2 text-left">M</th>
                    <th className="border px-4 py-2 text-left">L</th>
                    <th className="border px-4 py-2 text-left">XL</th>
                    <th className="border px-4 py-2 text-left">XXL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-4 py-2 font-medium">Chest (cm)</td>
                    <td className="border px-4 py-2">34</td>
                    <td className="border px-4 py-2">36</td>
                    <td className="border px-4 py-2">38</td>
                    <td className="border px-4 py-2">42</td>
                    <td className="border px-4 py-2">46</td>
                    <td className="border px-4 py-2">50</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border px-4 py-2 font-medium">Length (cm)</td>
                    <td className="border px-4 py-2">67</td>
                    <td className="border px-4 py-2">69</td>
                    <td className="border px-4 py-2">71</td>
                    <td className="border px-4 py-2">75</td>
                    <td className="border px-4 py-2">78</td>
                    <td className="border px-4 py-2">81</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 font-medium">Sleeve (cm)</td>
                    <td className="border px-4 py-2">18</td>
                    <td className="border px-4 py-2">19</td>
                    <td className="border px-4 py-2">20</td>
                    <td className="border px-4 py-2">22</td>
                    <td className="border px-4 py-2">24</td>
                    <td className="border px-4 py-2">26</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-600 mt-3">💡 Fit: Regular fit. All measurements are approximate and taken flat.</p>
          </div>

          {/* Jeans & Bottoms */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-black">Men's Jeans & Bottoms</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-4 py-2 text-left">Size</th>
                    <th className="border px-4 py-2 text-left">28</th>
                    <th className="border px-4 py-2 text-left">30</th>
                    <th className="border px-4 py-2 text-left">32</th>
                    <th className="border px-4 py-2 text-left">34</th>
                    <th className="border px-4 py-2 text-left">36</th>
                    <th className="border px-4 py-2 text-left">38</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-4 py-2 font-medium">Waist (cm)</td>
                    <td className="border px-4 py-2">72</td>
                    <td className="border px-4 py-2">76</td>
                    <td className="border px-4 py-2">80</td>
                    <td className="border px-4 py-2">84</td>
                    <td className="border px-4 py-2">88</td>
                    <td className="border px-4 py-2">92</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border px-4 py-2 font-medium">Length (cm)</td>
                    <td className="border px-4 py-2">79</td>
                    <td className="border px-4 py-2">79</td>
                    <td className="border px-4 py-2">79</td>
                    <td className="border px-4 py-2">79</td>
                    <td className="border px-4 py-2">79</td>
                    <td className="border px-4 py-2">79</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 font-medium">Inseam (cm)</td>
                    <td className="border px-4 py-2">76</td>
                    <td className="border px-4 py-2">76</td>
                    <td className="border px-4 py-2">76</td>
                    <td className="border px-4 py-2">76</td>
                    <td className="border px-4 py-2">76</td>
                    <td className="border px-4 py-2">76</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-600 mt-3">💡 Fit: Slim fit. Standard length is 34&quot;. Custom length available on request.</p>
          </div>

          {/* Sizing Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">📏 Sizing Tips</h4>
            <ul className="text-sm text-blue-900 space-y-1 list-disc list-inside">
              <li>Measure yourself wearing similar-fitting clothes</li>
              <li>Lay the garment flat and measure across the chest for width</li>
              <li>For jeans, measure the waist of a pair that fits you perfectly</li>
              <li>When in doubt, size up for a more comfortable fit</li>
              <li>Our 7-day return policy lets you exchange sizes easily</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeGuideModal;
