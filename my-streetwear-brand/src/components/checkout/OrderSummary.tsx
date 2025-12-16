'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { CartItem } from '@/types';
import { CheckoutTotals } from '@/types/checkout';

/**
 * OrderSummary Component
 * Displays cart items and order totals during checkout
 * Collapsible on mobile, always expanded on desktop
 * 
 * Requirements: 5.1, 5.2, 5.4, 5.6
 * Mobile Optimization: 11.1, 11.2
 */

export interface OrderSummaryProps {
  items: CartItem[];
  totals: CheckoutTotals;
  isLoading?: boolean;
}

export function OrderSummary({ items, totals, isLoading = false }: OrderSummaryProps) {
  // Start collapsed on mobile for better UX (Requirements: 11.2)
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport for accessibility
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const formatPrice = (price: number) => {
    return `GH₵${price.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <section
      className="bg-gray-900 rounded-lg overflow-hidden"
      aria-labelledby="order-summary-heading"
    >
      {/* Header - Clickable on mobile for collapse/expand (Requirements: 5.6, 11.2) */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          w-full p-4 sm:p-6 flex items-center justify-between
          min-h-[44px]
          ${isMobile ? 'cursor-pointer active:bg-gray-800' : 'lg:cursor-default'}
          transition-colors duration-200
        `}
        aria-expanded={isMobile ? isExpanded : true}
        aria-controls="order-summary-content"
        aria-label={`Order summary with ${itemCount} ${itemCount === 1 ? 'item' : 'items'}. ${isMobile ? (isExpanded ? 'Click to collapse' : 'Click to expand') : ''}`}
      >
        <h2
          id="order-summary-heading"
          className="text-lg font-bold uppercase tracking-wider text-white"
        >
          Order Summary ({itemCount} {itemCount === 1 ? 'item' : 'items'})
        </h2>
        
        {/* Collapse indicator - visible on mobile only (Requirements: 11.2) */}
        <span className="lg:hidden text-gray-400" aria-hidden="true">
          <svg
            className={`w-6 h-6 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      {/* Content - Collapsible on mobile, always visible on desktop */}
      <div
        id="order-summary-content"
        className={`
          px-4 sm:px-6 pb-4 sm:pb-6
          lg:block
          ${isExpanded ? 'block' : 'hidden lg:block'}
        `}
      >
        {/* Cart Items (Requirements: 5.1) */}
        <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3">
              {/* Product Image */}
              <div className="relative w-16 h-16 flex-shrink-0 bg-gray-800 rounded overflow-hidden">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
                
                {/* Quantity badge */}
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-black text-xs font-bold rounded-full flex items-center justify-center">
                  {item.quantity}
                </span>
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <h3 className="text-white text-sm font-medium truncate">{item.title}</h3>
                <p className="text-gray-400 text-xs mt-0.5">
                  {item.size} / {item.color}
                </p>
              </div>

              {/* Price */}
              <div className="text-white text-sm font-medium flex-shrink-0">
                {formatPrice(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-4" />

        {/* Totals (Requirements: 5.2, 5.4) */}
        <div className="space-y-3 text-sm">
          {/* Subtotal */}
          <div className="flex justify-between text-gray-400">
            <span>Subtotal</span>
            <span>{formatPrice(totals.subtotal)}</span>
          </div>

          {/* Delivery Fee */}
          <div className="flex justify-between text-gray-400">
            <span>Delivery Fee</span>
            {isLoading ? (
              <span className="animate-pulse bg-gray-700 h-4 w-16 rounded" />
            ) : totals.deliveryFee > 0 ? (
              <span>{formatPrice(totals.deliveryFee)}</span>
            ) : (
              <span className="text-gray-500">Select region</span>
            )}
          </div>

          {/* Total */}
          <div className="border-t border-gray-700 pt-3">
            <div className="flex justify-between text-white text-lg font-bold">
              <span>Total</span>
              {isLoading ? (
                <span className="animate-pulse bg-gray-700 h-6 w-24 rounded" />
              ) : (
                <span>{formatPrice(totals.total)}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile collapsed summary - shows total only */}
      <div className={`px-4 pb-4 lg:hidden ${isExpanded ? 'hidden' : 'block'}`}>
        <div className="flex justify-between text-white font-bold">
          <span>Total</span>
          <span>{formatPrice(totals.total)}</span>
        </div>
      </div>
    </section>
  );
}

/**
 * Calculates checkout totals from cart items and delivery fee
 * 
 * Requirements: 5.2, 5.4
 */
export function calculateCheckoutTotals(items: CartItem[], deliveryFee: number): CheckoutTotals {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return {
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
  };
}

export default OrderSummary;
