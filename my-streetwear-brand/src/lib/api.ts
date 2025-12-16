import {
  Product,
  ProductFilters,
  Order,
  Review,
  User,
  Address,
  PaginationInfo,
} from '@/types';
import type {
  CreateOrderRequest,
  CreateOrderResponse,
  InventoryErrorResponse,
} from '@/types/checkout';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

interface ApiResponse<T> {
  data: T;
  message?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

interface CreateOrderData {
  items: Array<{
    variantId: string;
    quantity: number;
  }>;
  shippingAddressId: string;
}

interface CreateReviewData {
  productId: string;
  rating: number;
  comment: string;
}

interface FetchOptions extends RequestInit {
  /**
   * Cache strategy for the request
   * - 'default': Use browser default caching
   * - 'no-store': Don't cache at all
   * - 'force-cache': Always use cache if available
   */
  cacheStrategy?: 'default' | 'no-store' | 'force-cache';
}

async function fetchApi<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const token = typeof window !== 'undefined' 
    ? localStorage.getItem('auth-token') 
    : null;

  const { cacheStrategy = 'default', ...fetchOptions } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...fetchOptions.headers,
  };

  // Configure cache based on strategy
  const cacheConfig: RequestInit = {};
  if (cacheStrategy === 'no-store') {
    cacheConfig.cache = 'no-store';
  } else if (cacheStrategy === 'force-cache') {
    cacheConfig.cache = 'force-cache';
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...fetchOptions,
    ...cacheConfig,
    headers,
    // Enable Next.js fetch caching for GET requests
    next: fetchOptions.method === undefined || fetchOptions.method === 'GET' 
      ? { revalidate: 60 } // Cache for 60 seconds
      : undefined,
  } as RequestInit);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

function buildQueryString(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, String(v)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

export const api = {
  products: {
    list: (filters?: ProductFilters & { page?: number; limit?: number }) =>
      fetchApi<PaginatedResponse<Product>>(`/products${buildQueryString((filters || {}) as Record<string, unknown>)}`),
    
    get: (slug: string) =>
      fetchApi<ApiResponse<Product>>(`/products/${slug}`),
    
    create: (data: Partial<Product>) =>
      fetchApi<ApiResponse<Product>>('/products', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    update: (id: string, data: Partial<Product>) =>
      fetchApi<ApiResponse<Product>>(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    
    delete: (id: string) =>
      fetchApi<ApiResponse<void>>(`/products/${id}`, {
        method: 'DELETE',
      }),
  },


  orders: {
    list: (page?: number, limit?: number) =>
      fetchApi<PaginatedResponse<Order>>(`/orders${buildQueryString({ page, limit })}`),
    
    get: (id: string) =>
      fetchApi<ApiResponse<Order>>(`/orders/${id}`),
    
    create: (data: CreateOrderData) =>
      fetchApi<ApiResponse<Order>>('/orders', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    createGuestOrder: (data: CreateOrderRequest) =>
      fetchApi<CreateOrderResponse | InventoryErrorResponse>('/orders/guest', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    lookup: (orderId: string, phone: string) =>
      fetchApi<ApiResponse<Order>>(`/orders/lookup${buildQueryString({ orderId, phone })}`),
    
    updateStatus: (id: string, status: Order['status']) =>
      fetchApi<ApiResponse<Order>>(`/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
  },

  reviews: {
    list: (productId: string) =>
      fetchApi<ApiResponse<Review[]>>(`/products/${productId}/reviews`),
    
    create: (data: CreateReviewData) =>
      fetchApi<ApiResponse<Review>>(`/products/${data.productId}/reviews`, {
        method: 'POST',
        body: JSON.stringify({ rating: data.rating, comment: data.comment }),
      }),
  },

  wishlist: {
    list: () =>
      fetchApi<ApiResponse<string[]>>('/wishlist'),
    
    add: (productId: string) =>
      fetchApi<ApiResponse<void>>('/wishlist', {
        method: 'POST',
        body: JSON.stringify({ productId }),
      }),
    
    remove: (productId: string) =>
      fetchApi<ApiResponse<void>>(`/wishlist/${productId}`, {
        method: 'DELETE',
      }),
  },

  newsletter: {
    subscribe: (email: string) =>
      fetchApi<ApiResponse<void>>('/newsletter/subscribe', {
        method: 'POST',
        body: JSON.stringify({ email }),
      }),
  },


  auth: {
    login: (credentials: LoginCredentials) =>
      fetchApi<ApiResponse<{ token: string; user: User }>>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    
    register: (data: RegisterData) =>
      fetchApi<ApiResponse<{ token: string; user: User }>>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    me: () =>
      fetchApi<ApiResponse<User>>('/auth/me'),
    
    logout: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-token');
      }
    },
  },

  addresses: {
    list: () =>
      fetchApi<ApiResponse<Address[]>>('/addresses'),
    
    create: (data: Omit<Address, 'id'>) =>
      fetchApi<ApiResponse<Address>>('/addresses', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    update: (id: string, data: Partial<Address>) =>
      fetchApi<ApiResponse<Address>>(`/addresses/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    
    delete: (id: string) =>
      fetchApi<ApiResponse<void>>(`/addresses/${id}`, {
        method: 'DELETE',
      }),
    
    setDefault: (id: string) =>
      fetchApi<ApiResponse<Address>>(`/addresses/${id}/default`, {
        method: 'PATCH',
      }),
  },

  admin: {
    analytics: () =>
      fetchApi<ApiResponse<{
        totalRevenue: number;
        orderCount: number;
        averageOrderValue: number;
        salesByDay: Array<{ date: string; revenue: number; orders: number }>;
      }>>('/admin/analytics'),
    
    lowStockItems: () =>
      fetchApi<ApiResponse<Array<{
        productId: string;
        variantId: string;
        title: string;
        size: string;
        color: string;
        stockQuantity: number;
      }>>>('/admin/inventory/low-stock'),
  },
};

export type { LoginCredentials, RegisterData, CreateOrderData, CreateReviewData };
