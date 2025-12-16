'use client';

import { useState, useCallback, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FilterSidebar, { FilterState, AvailableFilters } from '@/components/FilterSidebar';
import SearchBar from '@/components/SearchBar';
import ProductGrid from '@/components/ProductGrid';
import QuickViewModal from '@/components/QuickViewModal';
import { Product } from '@/types';
import { useProducts, extractFilterOptions } from '@/hooks/useProducts';
import { cn } from '@/lib/utils';

// Create a client with optimized caching defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes garbage collection
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

function ShopPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Mobile filter drawer state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Quick view modal state
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  
  // Pagination state - initialize from URL
  const pageFromUrl = Number(searchParams.get('page')) || 1;
  const [page, setPage] = useState(pageFromUrl);
  const limit = 12;

  // Sync page state with URL when URL changes
  useEffect(() => {
    const urlPage = Number(searchParams.get('page')) || 1;
    if (urlPage !== page) {
      setPage(urlPage);
    }
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  // Parse filters from URL
  const filters = useMemo((): FilterState => {
    const sizes = searchParams.get('sizes')?.split(',').filter(Boolean) || [];
    const colors = searchParams.get('colors')?.split(',').filter(Boolean) || [];
    const minPrice = Number(searchParams.get('minPrice')) || 0;
    const maxPrice = Number(searchParams.get('maxPrice')) || 100000;
    const availability = (searchParams.get('availability') as FilterState['availability']) || 'all';
    const sortBy = (searchParams.get('sortBy') as FilterState['sortBy']) || 'newest';
    
    return {
      priceRange: [minPrice, maxPrice],
      sizes,
      colors,
      availability,
      sortBy,
    };
  }, [searchParams]);

  // Search state from URL
  const searchFromUrl = searchParams.get('search') || '';
  const [search, setSearch] = useState(searchFromUrl);

  // Sync URL with filters
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.sizes.length > 0) params.set('sizes', filters.sizes.join(','));
    if (filters.colors.length > 0) params.set('colors', filters.colors.join(','));
    if (filters.priceRange[0] > 0) params.set('minPrice', String(filters.priceRange[0]));
    if (filters.priceRange[1] < 100000) params.set('maxPrice', String(filters.priceRange[1]));
    if (filters.availability !== 'all') params.set('availability', filters.availability);
    if (filters.sortBy !== 'newest') params.set('sortBy', filters.sortBy);
    if (search) params.set('search', search);
    if (page > 1) params.set('page', String(page));
    
    const queryString = params.toString();
    const newUrl = queryString ? `/shop?${queryString}` : '/shop';
    
    // Only update if URL actually changed
    if (window.location.pathname + window.location.search !== newUrl) {
      router.replace(newUrl, { scroll: false });
    }
  }, [filters, search, page, router]);

  // Fetch products from API
  const { products, pagination, isLoading, isError } = useProducts({
    page,
    limit,
    search: search || undefined,
    minPrice: filters.priceRange[0] > 0 ? filters.priceRange[0] : undefined,
    maxPrice: filters.priceRange[1] < 100000 ? filters.priceRange[1] : undefined,
    sizes: filters.sizes.length > 0 ? filters.sizes : undefined,
    colors: filters.colors.length > 0 ? filters.colors : undefined,
    sortBy: filters.sortBy,
  });


  // Client-side filtering for availability (if API doesn't support it)
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) return [];
    if (filters.availability === 'all') return products;
    return products.filter((product) => {
      const totalStock = product.variants.reduce((sum, v) => sum + v.stockQuantity, 0);
      if (filters.availability === 'in-stock') return totalStock > 0;
      if (filters.availability === 'out-of-stock') return totalStock === 0;
      return true;
    });
  }, [products, filters.availability]);

  // Sort products client-side if needed
  const sortedProducts = useMemo(() => {
    if (!Array.isArray(filteredProducts) || filteredProducts.length === 0) return [];
    const sorted = [...filteredProducts];
    switch (filters.sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => (a.salePrice ?? a.basePrice) - (b.salePrice ?? b.basePrice));
        break;
      case 'price-desc':
        sorted.sort((a, b) => (b.salePrice ?? b.basePrice) - (a.salePrice ?? a.basePrice));
        break;
      case 'popular':
        sorted.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0));
        break;
      case 'newest':
      default:
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }
    return sorted;
  }, [filteredProducts, filters.sortBy]);

  // Available filter options (from products)
  const availableFilters: AvailableFilters = useMemo(() => {
    return extractFilterOptions(products);
  }, [products]);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setPage(1); // Reset to first page when filters change
    // Update URL with new filters
    const params = new URLSearchParams();
    if (newFilters.sizes.length > 0) params.set('sizes', newFilters.sizes.join(','));
    if (newFilters.colors.length > 0) params.set('colors', newFilters.colors.join(','));
    if (newFilters.priceRange[0] > 0) params.set('minPrice', String(newFilters.priceRange[0]));
    if (newFilters.priceRange[1] < 100000) params.set('maxPrice', String(newFilters.priceRange[1]));
    if (newFilters.availability !== 'all') params.set('availability', newFilters.availability);
    if (newFilters.sortBy !== 'newest') params.set('sortBy', newFilters.sortBy);
    if (search) params.set('search', search);
    
    const queryString = params.toString();
    router.replace(queryString ? `/shop?${queryString}` : '/shop', { scroll: false });
  }, [router, search]);

  // Handle search changes
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1); // Reset to first page when search changes
  }, []);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.sizes.length > 0) count += filters.sizes.length;
    if (filters.colors.length > 0) count += filters.colors.length;
    if (filters.availability !== 'all') count += 1;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 100000) count += 1;
    return count;
  }, [filters]);

  const totalProducts = pagination?.total || sortedProducts.length;
  const totalPages = pagination?.totalPages || 1;

  return (
    <main className="min-h-screen bg-black pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1
            className="text-white uppercase font-bold tracking-tight mb-4"
            style={{
              fontFamily: 'var(--font-heading), sans-serif',
              fontSize: 'clamp(2.5rem, 8vw, 5rem)',
            }}
          >
            Shop
          </h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            Premium streetwear crafted for those who define the culture.
          </p>
        </motion.div>


        {/* Search and Filter Controls */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <SearchBar
                value={search}
                onChange={handleSearchChange}
                placeholder="Search products..."
              />
            </div>
            
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className={cn(
                'md:hidden',
                'flex items-center justify-center gap-2',
                'bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3',
                'text-white hover:border-neutral-500 transition-colors'
              )}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="bg-white text-black text-xs font-bold px-1.5 py-0.5 rounded">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between text-sm text-neutral-400">
            <span>
              {isLoading ? 'Loading...' : `${totalProducts} product${totalProducts !== 1 ? 's' : ''}`}
              {search && (
                <span>
                  {' '}for &quot;{search}&quot;
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden md:block">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              availableFilters={availableFilters}
            />
          </div>

          {/* Mobile Filter Drawer */}
          <FilterSidebar
            isMobile
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            filters={filters}
            onFilterChange={handleFilterChange}
            availableFilters={availableFilters}
          />

          {/* Product Grid */}
          <div className="flex-1">
            {isError ? (
              <div className="text-center py-16">
                <p className="text-red-400 mb-4">Failed to load products</p>
                <button
                  onClick={() => window.location.reload()}
                  className="text-white underline hover:no-underline"
                >
                  Try again
                </button>
              </div>
            ) : (
              <>
                <ProductGrid
                  products={sortedProducts}
                  isLoading={isLoading}
                  onQuickView={setQuickViewProduct}
                  showWishlist
                  emptyMessage={search ? `No products found for "${search}"` : 'No products found'}
                />


                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 space-y-4">
                    {/* Page info */}
                    <p className="text-center text-sm text-neutral-400">
                      Showing {((page - 1) * limit) + 1}-{Math.min(page * limit, totalProducts)} of {totalProducts} products
                    </p>
                    
                    {/* Pagination controls */}
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        aria-label="Previous page"
                        className={cn(
                          'min-w-[44px] min-h-[44px] px-4 border rounded transition-colors flex items-center justify-center',
                          page === 1
                            ? 'border-neutral-800 text-neutral-600 cursor-not-allowed'
                            : 'border-neutral-600 text-white hover:border-white'
                        )}
                      >
                        <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="hidden sm:inline">Previous</span>
                      </button>
                      
                      {/* Page numbers */}
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum: number;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (page < 3) {
                            pageNum = i + 1;
                          } else if (page >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = page - 2 + i;
                          }
                          
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setPage(pageNum)}
                              aria-label={`Go to page ${pageNum}`}
                              aria-current={page === pageNum ? 'page' : undefined}
                              className={cn(
                                'min-w-[44px] min-h-[44px] rounded transition-colors flex items-center justify-center font-medium',
                                page === pageNum
                                  ? 'bg-white text-black'
                                  : 'text-white hover:bg-neutral-800'
                              )}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>
                      
                      <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        aria-label="Next page"
                        className={cn(
                          'min-w-[44px] min-h-[44px] px-4 border rounded transition-colors flex items-center justify-center',
                          page === totalPages
                            ? 'border-neutral-800 text-neutral-600 cursor-not-allowed'
                            : 'border-neutral-600 text-white hover:border-white'
                        )}
                      >
                        <span className="hidden sm:inline">Next</span>
                        <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Back to Home Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16"
        >
          <Link
            href="/"
            className="inline-block text-white/60 hover:text-white text-sm uppercase tracking-widest transition-colors"
          >
            ← Back to Home
          </Link>
        </motion.div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </main>
  );
}

function ShopPageLoading() {
  return (
    <main className="min-h-screen bg-black pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <div className="h-16 bg-neutral-800 rounded w-48 mx-auto mb-4 animate-pulse" />
          <div className="h-6 bg-neutral-800 rounded w-96 mx-auto animate-pulse" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-neutral-800 rounded-lg aspect-[3/4] animate-pulse" />
          ))}
        </div>
      </div>
    </main>
  );
}

export default function ShopPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<ShopPageLoading />}>
        <ShopPageContent />
      </Suspense>
    </QueryClientProvider>
  );
}
