'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { OrderConfirmation } from '@/components/checkout';
import type { OrderConfirmation as OrderConfirmationData } from '@/types/checkout';

/**
 * Order Confirmation Page
 * Displays order confirmation after successful checkout
 * Clears cart and shows option to create account for guests
 * 
 * Requirements: 7.1, 7.8, 8.3
 */

export default function ConfirmationPage() {
  const router = useRouter();
  const { clearCart, items } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [confirmation, setConfirmation] = useState<OrderConfirmationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCleared, setHasCleared] = useState(false);

  // Load confirmation data from session storage
  useEffect(() => {
    const loadConfirmation = () => {
      if (typeof window === 'undefined') return;

      const storedConfirmation = sessionStorage.getItem('orderConfirmation');
      
      if (storedConfirmation) {
        try {
          const parsed = JSON.parse(storedConfirmation) as OrderConfirmationData;
          setConfirmation(parsed);
        } catch {
          // Invalid JSON, redirect to shop
          router.push('/shop');
          return;
        }
      } else {
        // No confirmation data, redirect to shop
        router.push('/shop');
        return;
      }

      setIsLoading(false);
    };

    loadConfirmation();
  }, [router]);

  // Clear cart after displaying confirmation (Requirements: 7.8)
  useEffect(() => {
    if (confirmation && !hasCleared) {
      // Clear cart if it still has items
      if (items.length > 0) {
        clearCart();
      }
      // Clear the session storage confirmation after displaying
      // Keep it for a short time in case user refreshes
      const timeout = setTimeout(() => {
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('orderConfirmation');
        }
      }, 60000); // Clear after 1 minute

      setHasCleared(true);
      return () => clearTimeout(timeout);
    }
  }, [confirmation, hasCleared, items.length, clearCart]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 bg-gray-800 rounded-full" />
            </div>
            <div className="h-8 bg-gray-800 rounded w-64 mx-auto mb-4" />
            <div className="h-4 bg-gray-800 rounded w-48 mx-auto mb-8" />
            <div className="space-y-6">
              <div className="h-32 bg-gray-800 rounded" />
              <div className="h-48 bg-gray-800 rounded" />
              <div className="h-64 bg-gray-800 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No confirmation data
  if (!confirmation) {
    return (
      <div className="min-h-screen bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h2 className="mt-4 text-xl font-bold text-white">No Order Found</h2>
            <p className="mt-2 text-gray-400">
              We couldn&apos;t find your order confirmation. Please check your email or contact support.
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
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/shop" className="hover:text-white transition-colors">
            Shop
          </Link>
          <span>/</span>
          <Link href="/checkout" className="hover:text-white transition-colors">
            Checkout
          </Link>
          <span>/</span>
          <span className="text-white">Confirmation</span>
        </nav>

        {/* Order Confirmation Component */}
        <OrderConfirmation 
          confirmation={confirmation} 
          isGuest={!isAuthenticated()} 
        />
      </div>
    </div>
  );
}
