'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';
import Link from 'next/link';

/**
 * CartPage Component
 * Full cart page display with product details, quantity controls, and totals
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5
 * Accessibility: 10.3, 11.3
 * - Proper ARIA labels for interactive elements
 * - Keyboard navigation support
 * - Screen reader friendly announcements
 */
export function CartPage() {
  const [isHydrated, setIsHydrated] = useState(false);
  const { items, removeItem, updateQuantity, subtotal } = useCartStore();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const formatPrice = (price: number) => {
    return `GH₵${price.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Calculate line total for an item
  const getLineTotal = (price: number, quantity: number) => price * quantity;

  // Delivery fee placeholder (will be calculated based on region in checkout)
  const deliveryFeePlaceholder = 'Calculated at checkout';

  // Estimated total (subtotal only, delivery fee added at checkout)
  const estimatedTotal = subtotal();

  if (!isHydrated) {
    return <CartPageSkeleton />;
  }

  if (items.length === 0) {
    return <EmptyCartState />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-wider mb-8">
          Shopping Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <section 
            className="lg:col-span-2 space-y-4"
            aria-label="Cart items"
            role="region"
          >
            {items.map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                onRemove={() => removeItem(item.id)}
                onUpdateQuantity={(qty) => updateQuantity(item.id, qty)}
                formatPrice={formatPrice}
                lineTotal={getLineTotal(item.price, item.quantity)}
              />
            ))}
          </section>

          {/* Order Summary */}
          <aside className="lg:col-span-1" aria-label="Order summary">
            <div className="bg-gray-900 rounded-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold uppercase tracking-wider mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal())}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Delivery Fee</span>
                  <span className="text-right">{deliveryFeePlaceholder}</span>
                </div>
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between text-white text-lg font-bold">
                    <span>Estimated Total</span>
                    <span>{formatPrice(estimatedTotal)}</span>
                  </div>
                  <p className="text-gray-500 text-xs mt-1">
                    Delivery fee will be added based on your location
                  </p>
                </div>
              </div>

              <Link
                href="/checkout"
                className="block w-full bg-white text-black text-center py-4 mt-6 font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors min-h-[44px] flex items-center justify-center"
              >
                Proceed to Checkout
              </Link>

              <Link
                href="/shop"
                className="block w-full text-center text-gray-400 hover:text-white text-sm mt-4 py-3 min-h-[44px] flex items-center justify-center transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

interface CartItemRowProps {
  item: {
    id: string;
    title: string;
    size: string;
    color: string;
    price: number;
    quantity: number;
    image: string;
  };
  onRemove: () => void;
  onUpdateQuantity: (quantity: number) => void;
  formatPrice: (price: number) => string;
  lineTotal: number;
}

function CartItemRow({ item, onRemove, onUpdateQuantity, formatPrice, lineTotal }: CartItemRowProps) {
  // Ensure quantity never goes below 1 (Requirements: 1.2)
  const handleDecrement = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.quantity - 1);
    }
  };

  const handleIncrement = () => {
    onUpdateQuantity(item.quantity + 1);
  };

  return (
    <article 
      className="flex flex-col sm:flex-row gap-4 bg-gray-900 rounded-lg p-4 sm:p-6"
      aria-label={`${item.title}, Size: ${item.size}, Color: ${item.color}, Quantity: ${item.quantity}`}
    >
      {/* Product Image (Requirements: 1.1) */}
      <div className="relative w-full sm:w-32 h-40 sm:h-32 flex-shrink-0 bg-gray-800 rounded overflow-hidden">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 128px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Product Details (Requirements: 1.1) */}
      <div className="flex-1 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-white font-semibold text-lg">{item.title}</h3>
          <p className="text-gray-400 text-sm mt-1">
            Size: {item.size} | Color: {item.color}
          </p>
          <p className="text-white font-bold mt-2">{formatPrice(item.price)}</p>
        </div>

        {/* Quantity Controls and Actions */}
        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4">
          {/* Quantity Controls (Requirements: 1.2) */}
          <div className="flex items-center gap-2" role="group" aria-label={`Quantity controls for ${item.title}`}>
            <button
              onClick={handleDecrement}
              disabled={item.quantity <= 1}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={`Decrease quantity of ${item.title}`}
              aria-disabled={item.quantity <= 1}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span 
              className="text-white w-10 text-center font-medium" 
              aria-live="polite"
              aria-atomic="true"
            >
              {item.quantity}
            </span>
            <button
              onClick={handleIncrement}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
              aria-label={`Increase quantity of ${item.title}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          {/* Line Total (Requirements: 1.4) */}
          <div className="text-right">
            <p className="text-gray-400 text-xs uppercase">Line Total</p>
            <p className="text-white font-bold text-lg">{formatPrice(lineTotal)}</p>
          </div>

          {/* Remove Button (Requirements: 1.3) */}
          <button
            onClick={onRemove}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
            aria-label={`Remove ${item.title} from cart`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}

/**
 * Empty cart state component
 * Requirements: 1.7
 */
function EmptyCartState() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center px-4">
        <svg
          className="w-24 h-24 text-gray-600 mx-auto mb-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
        <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-wider mb-4">
          Your Cart is Empty
        </h1>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Looks like you haven&apos;t added anything to your cart yet. 
          Browse our collection and find something you love.
        </p>
        <Link
          href="/shop"
          className="inline-block bg-white text-black px-8 py-4 font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors min-h-[44px]"
        >
          Start Shopping
        </Link>
      </div>
    </div>
  );
}

/**
 * Skeleton loader for cart page during hydration
 */
function CartPageSkeleton() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        <div className="h-8 bg-gray-800 rounded w-48 mb-8 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-900 rounded-lg p-6 h-32 animate-pulse" />
            ))}
          </div>
          <div className="bg-gray-900 rounded-lg p-6 h-64 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default CartPage;
