'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading) {
      if (!isAuthenticated) {
        router.push('/auth/login?redirect=/admin');
      } else if (user?.role !== 'ADMIN') {
        router.push('/');
      }
    }
  }, [mounted, isAuthenticated, isLoading, user, router]);

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-6">You need admin privileges to access this page.</p>
          <Link href="/" className="text-blue-400 hover:text-blue-300">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Admin Header */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/admin" className="text-xl font-bold text-white">
                BOMA Admin
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link 
                  href="/admin" 
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/admin/products" 
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Products
                </Link>
                <Link 
                  href="/admin/orders" 
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Orders
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">
                {user?.email}
              </span>
              <Link 
                href="/" 
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                View Store
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
