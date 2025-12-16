'use client';

import Link from 'next/link';
import Image from 'next/image';
import { OrderConfirmation as OrderConfirmationData } from '@/types/checkout';
import { TIME_WINDOW_LABELS, GHANA_REGION_LABELS } from '@/types/checkout';

/**
 * OrderConfirmation Component
 * Displays order confirmation details after successful order placement
 * 
 * Requirements: 7.2, 7.3, 7.4, 7.5, 7.6, 7.7
 */

export interface OrderConfirmationProps {
  confirmation: OrderConfirmationData;
  isGuest?: boolean;
}

export function OrderConfirmation({ confirmation, isGuest = false }: OrderConfirmationProps) {
  const formatPrice = (price: number) => {
    return `GH₵${price.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'cod':
        return 'Cash on Delivery';
      case 'paystack':
        return 'Online Payment (Paystack)';
      default:
        return method;
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
          <svg
            className="w-8 h-8 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-wider text-white mb-2">
          Order Confirmed!
        </h1>
        <p className="text-gray-400">
          Thank you for your order. We&apos;ll start preparing it right away.
        </p>
      </div>

      {/* Order ID - Requirements: 7.2 */}
      <div className="bg-gray-900 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-gray-400 text-sm">Order ID</p>
            <p className="text-white text-xl font-mono font-bold">{confirmation.orderId}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-sm">Status</p>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-500/20 text-yellow-400">
              {confirmation.paymentMethod === 'cod' ? 'Pending Payment' : 'Processing'}
            </span>
          </div>
        </div>
      </div>

      {/* Delivery Details - Requirements: 7.3, 7.4 */}
      <div className="bg-gray-900 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-bold uppercase tracking-wider text-white mb-4">
          Delivery Details
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Scheduled Date - Requirements: 7.3 */}
          <div>
            <p className="text-gray-400 text-sm mb-1">Scheduled Date</p>
            <p className="text-white font-medium">{formatDate(confirmation.scheduledDate)}</p>
            <p className="text-gray-400 text-sm mt-1">
              {TIME_WINDOW_LABELS[confirmation.timeWindow]}
            </p>
          </div>

          {/* Delivery Address - Requirements: 7.4 */}
          <div>
            <p className="text-gray-400 text-sm mb-1">Delivery Address</p>
            <p className="text-white font-medium">{confirmation.address.street}</p>
            <p className="text-gray-400 text-sm">
              {confirmation.address.city}, {GHANA_REGION_LABELS[confirmation.address.region]}
            </p>
            {confirmation.address.directions && (
              <p className="text-gray-500 text-sm mt-1 italic">
                {confirmation.address.directions}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Order Items - Requirements: 7.5 */}
      <div className="bg-gray-900 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-bold uppercase tracking-wider text-white mb-4">
          Order Items
        </h2>
        
        <div className="space-y-4">
          {confirmation.items.map((item) => (
            <div key={item.id} className="flex gap-4">
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
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium truncate">{item.title}</h3>
                <p className="text-gray-400 text-sm">
                  {item.size} / {item.color} × {item.quantity}
                </p>
              </div>

              {/* Price */}
              <div className="text-white font-medium flex-shrink-0">
                {formatPrice(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t border-gray-700 mt-6 pt-4 space-y-2">
          <div className="flex justify-between text-gray-400">
            <span>Subtotal</span>
            <span>{formatPrice(confirmation.totals.subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Delivery Fee</span>
            <span>{formatPrice(confirmation.totals.deliveryFee)}</span>
          </div>
          <div className="flex justify-between text-white text-lg font-bold pt-2 border-t border-gray-700">
            <span>Total</span>
            <span>{formatPrice(confirmation.totals.total)}</span>
          </div>
        </div>
      </div>

      {/* Payment Method - Requirements: 7.6 */}
      <div className="bg-gray-900 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-bold uppercase tracking-wider text-white mb-4">
          Payment Method
        </h2>
        
        <div className="flex items-center gap-3">
          {confirmation.paymentMethod === 'cod' ? (
            <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          )}
          <div>
            <p className="text-white font-medium">
              {getPaymentMethodLabel(confirmation.paymentMethod)}
            </p>
            {confirmation.paymentMethod === 'cod' && (
              <p className="text-gray-400 text-sm">
                Please have the exact amount ready upon delivery
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Guest Account Creation Option - Requirements: 8.3 */}
      {isGuest && (
        <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-medium mb-1">Create an Account</h3>
              <p className="text-gray-400 text-sm mb-3">
                Save your details for faster checkout next time and track all your orders in one place.
              </p>
              <Link
                href="/auth/register"
                className="inline-flex items-center px-4 py-2 bg-white text-black text-sm font-medium rounded-md hover:bg-gray-200 transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Continue Shopping Button - Requirements: 7.7 */}
      <div className="text-center">
        <Link
          href="/shop"
          className="inline-flex items-center justify-center px-8 py-3 bg-white text-black font-bold uppercase tracking-wider rounded-md hover:bg-gray-200 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default OrderConfirmation;
