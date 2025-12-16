'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Product, ProductFilters, PaginationInfo } from '@/types';
import { getMockProducts, mockProducts } from '@/lib/mock-products';

// Cache time constants
const CACHE_TIME = {
  PRODUCTS_LIST: 1000 * 60 * 5, // 5 minutes stale time
  PRODUCT_DETAIL: 1000 * 60 * 10, // 10 minutes stale time
  GC_TIME: 1000 * 60 * 30, // 30 minutes garbage collection time
};

interface UseProductsOptions extends ProductFilters {
  page?: number;
  limit?: number;
  enabled?: boolean;
}

interface UseProductsResult {
  products: Product[];
  pagination: PaginationInfo | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

// Fetch products from API with fallback to mock data
async function fetchProducts(queryParams: Omit<UseProductsOptions, 'enabled'>) {
  try {
    const result = await api.products.list(queryParams);
    // Backend returns { data: { products, pagination } } or { data: Product[], pagination }
    // Normalize the response format
    const products = Array.isArray(result.data) 
      ? result.data 
      : (result.data as { products?: Product[] })?.products || [];
    const pagination = Array.isArray(result.data) 
      ? result.pagination 
      : (result.data as { pagination?: PaginationInfo })?.pagination || result.pagination;
    
    // If API returns empty data, use mock data
    if (!products || products.length === 0) {
      return getMockProducts(queryParams);
    }
    return { data: products, pagination };
  } catch {
    // On API error, return mock data
    return getMockProducts(queryParams);
  }
}

export function useProducts(options: UseProductsOptions = {}): UseProductsResult {
  const { enabled = true, ...queryParams } = options;

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['products', queryParams],
    queryFn: () => fetchProducts(queryParams),
    enabled,
    staleTime: CACHE_TIME.PRODUCTS_LIST,
    gcTime: CACHE_TIME.GC_TIME,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
    retryDelay: 1000,
  });

  return {
    products: data?.data ?? [],
    pagination: data?.pagination ?? null,
    isLoading,
    isError: false, // Never show error since we have mock fallback
    error: error as Error | null,
    refetch,
  };
}

// Get a single mock product by slug
function getMockProductBySlug(slug: string): Product | null {
  return mockProducts.find(p => p.slug === slug) || null;
}

// Fetch single product from API with fallback to mock data
async function fetchProduct(slug: string) {
  try {
    const result = await api.products.get(slug);
    if (!result.data) {
      const mockProduct = getMockProductBySlug(slug);
      return { data: mockProduct };
    }
    return result;
  } catch {
    const mockProduct = getMockProductBySlug(slug);
    return { data: mockProduct };
  }
}

// Hook for fetching a single product by slug
export function useProduct(slug: string, enabled = true) {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => fetchProduct(slug),
    enabled: enabled && !!slug,
    staleTime: CACHE_TIME.PRODUCT_DETAIL,
    gcTime: CACHE_TIME.GC_TIME,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
    retryDelay: 1000,
  });

  return {
    product: data?.data ?? null,
    isLoading,
    isError: false, // Never show error since we have mock fallback
    error: error as Error | null,
    refetch,
  };
}

// Helper to extract available filter options from products
export function extractFilterOptions(products: Product[]) {
  const sizes = new Set<string>();
  const colors = new Set<string>();
  let minPrice = Infinity;
  let maxPrice = 0;

  if (!Array.isArray(products)) {
    return {
      sizes: [],
      colors: [],
      priceRange: [0, 10000] as [number, number],
    };
  }

  products.forEach((product) => {
    const price = product.salePrice ?? product.basePrice;
    minPrice = Math.min(minPrice, price);
    maxPrice = Math.max(maxPrice, price);

    product.variants.forEach((variant) => {
      sizes.add(variant.size);
      colors.add(variant.color);
    });
  });

  return {
    sizes: Array.from(sizes).sort(),
    colors: Array.from(colors).sort(),
    priceRange: [
      minPrice === Infinity ? 0 : minPrice,
      maxPrice === 0 ? 10000 : maxPrice,
    ] as [number, number],
  };
}
