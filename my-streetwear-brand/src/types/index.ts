// Product Types
export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  stockQuantity: number;
  priceOverride?: number;
  sku: string;
}

export interface ProductImage {
  id: string;
  url: string;
  isMain: boolean;
  altText: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  basePrice: number;
  salePrice?: number;
  isActive: boolean;
  category: string;
  images: ProductImage[];
  variants: ProductVariant[];
  averageRating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

// Cart Types
export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  title: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
}

// Wishlist Types
export interface WishlistItem {
  id: string;
  product: Product;
  addedAt: string;
}

// Review Types
export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  content: string;
  verified: boolean;
  createdAt: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'CUSTOMER' | 'ADMIN';
}

export interface Address {
  id: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

// Order Types
export interface OrderItem {
  id: string;
  quantity: number;
  priceAtPurchase: number;
  variant: ProductVariant;
  product: Product;
}

export interface Order {
  id: string;
  status: 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  paymentRef: string;
  shippingAddress: Address;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

// Filter Types
export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'popular';
}

// Pagination
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Newsletter
export interface NewsletterSubscription {
  email: string;
  subscribedAt: string;
}
