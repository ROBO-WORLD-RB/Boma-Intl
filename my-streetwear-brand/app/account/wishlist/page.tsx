'use client';

import Link from 'next/link';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRequireAuth } from '@/hooks/useAuth';
import { useWishlistStore } from '@/store/wishlistStore';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/ProductCard';
import Breadcrumbs from '@/components/Breadcrumbs';
import { SkeletonCard } from '@/components/SkeletonCard';
import { Button } from '@/components/ui/Button';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

function WishlistPageContent() {
  useRequireAuth();
  
  const { items, clearWishlist } = useWishlistStore();
  const productIds = items.map((item) => item.productId);
  const { products, isLoading } = useProducts({ enabled: productIds.length > 0 });
  
  const wishlistProducts = products.filter((p) => productIds.includes(p.id));

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Account', href: '/account' },
            { label: 'Wishlist' },
          ]}
        />

        <div className="mt-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">My Wishlist</h1>
              <p className="text-gray-400 mt-1">
                {items.length} {items.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
            {items.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (confirm('Are you sure you want to clear your wishlist?')) {
                    clearWishlist();
                  }
                }}
              >
                Clear All
              </Button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="text-center py-16 bg-gray-900 rounded-lg border border-gray-800">
              <svg
                className="mx-auto h-16 w-16 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <h2 className="mt-6 text-xl font-semibold text-white">
                Your wishlist is empty
              </h2>
              <p className="mt-2 text-gray-400 max-w-md mx-auto">
                Start adding items you love by clicking the heart icon on any product.
                Your saved items will appear here.
              </p>
              <Link href="/shop">
                <Button className="mt-6">
                  Browse Products
                </Button>
              </Link>
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: items.length }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {wishlistProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showWishlist
                />
              ))}
            </div>
          )}

          {items.length > 0 && wishlistProducts.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-gray-400">
                Some items in your wishlist may no longer be available.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={clearWishlist}
              >
                Clear Unavailable Items
              </Button>
            </div>
          )}
        </div>

        {/* Back to Account Link */}
        <div className="mt-12">
          <Link
            href="/account"
            className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Account
          </Link>
        </div>
      </div>
    </div>
  );
}


export default function WishlistPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <WishlistPageContent />
    </QueryClientProvider>
  );
}
