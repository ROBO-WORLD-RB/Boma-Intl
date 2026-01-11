'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { CheckoutForm } from '@/components/checkout';
import type { CheckoutFormSchema } from '@/lib/validation';

/**
 * Checkout Page
 * Main checkout page that handles both guest and authenticated checkout
 * 
 * Requirements: 8.1, 8.4
 */

export default function CheckoutPage() {
  const router = useRouter();
  const { items } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const [initialData, setInitialData] = useState<Partial<CheckoutFormSchema> | undefined>();
  const [isHydrated, setIsHydrated] = useState(false);

  // Handle hydration to avoid SSR mismatch
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Pre-fill form for authenticated users (Requirements: 8.4)
  useEffect(() => {
    if (isAuthenticated() && user) {
      setInitialData({
        customerName: [user.firstName, user.lastName].filter(Boolean).join(' ') || '',
        email: user.email || '',
      });
    }
  }, [user, isAuthenticated]);

  // Redirect to cart if cart is empty
  useEffect(() => {
    if (isHydrated && items.length === 0) {
      router.push('/cart');
    }
  }, [isHydrated, items.length, router]);

  // Show loading state during hydration
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-48 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-gray-800 rounded" />
                <div className="h-64 bg-gray-800 rounded" />
                <div className="h-64 bg-gray-800 rounded" />
              </div>
              <div className="h-96 bg-gray-800 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show empty cart message if cart is empty
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-16">
            <svg
              className="mx-auto h-16 w-16 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h2 className="mt-4 text-xl font-bold text-white">Your cart is empty</h2>
            <p className="mt-2 text-gray-400">
              Add some items to your cart before checking out.
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-block px-6 py-3 bg-white text-black font-medium rounded-md hover:bg-gray-200 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Link href="/cart" className="hover:text-white transition-colors">
              Cart
            </Link>
            <span>/</span>
            <span className="text-white">Checkout</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-wider text-white">
            Checkout
          </h1>
          {!isAuthenticated() && (
            <p className="mt-2 text-gray-400">
              <Link href="/auth/login" className="text-white underline hover:no-underline">
                Sign in
              </Link>
              {' '}for a faster checkout experience, or continue as guest.
            </p>
          )}
        </div>

        {/* Checkout Form */}
        <CheckoutForm initialData={initialData} />
      </div>
    </div>
  );
}
