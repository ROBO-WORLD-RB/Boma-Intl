# Design Document: Streetwear Platform Enhancements

## Overview

This design document outlines the technical architecture for comprehensive enhancements to the BOMA 2025 streetwear e-commerce platform. The implementation adds shopping cart functionality, product browsing with filters, user accounts, admin dashboard, and various UX improvements. The architecture maintains the existing Next.js 16 App Router structure while adding Zustand for state management and new API integrations.

## Architecture

```mermaid
graph TD
    subgraph Frontend
        A[app/layout.tsx] --> B[CartProvider]
        A --> C[AuthProvider]
        
        D[app/page.tsx] --> E[Hero]
        D --> F[Marquee]
        D --> G[Gallery]
        D --> H[Newsletter]
        D --> I[Footer]
        
        J[app/shop/page.tsx] --> K[ProductGrid]
        J --> L[FilterSidebar]
        J --> M[SearchBar]
        
        N[app/product/slug/page.tsx] --> O[ProductDetail]
        N --> P[ReviewSection]
        
        Q[app/account/page.tsx] --> R[OrderHistory]
        Q --> S[Wishlist]
        Q --> T[AddressBook]
        
        U[app/admin/page.tsx] --> V[SalesMetrics]
        U --> W[OrderManagement]
        U --> X[ProductManagement]
    end
    
    subgraph State Management
        Y[useCartStore] --> Z[localStorage]
        AA[useWishlistStore] --> Z
        AB[useAuthStore] --> AC[JWT Token]
    end
    
    subgraph Backend API
        AD[/api/products]
        AE[/api/orders]
        AF[/api/auth]
        AG[/api/reviews]
        AH[/api/newsletter]
        AI[/api/admin]
    end
    
    K --> AD
    O --> AD
    R --> AE
    P --> AG
    H --> AH
    V --> AI
```

### Enhanced File Structure

```
my-streetwear-brand/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── shop/
│   │   └── page.tsx              # Product listing with filters
│   ├── product/
│   │   └── [slug]/
│   │       └── page.tsx          # Product detail page
│   ├── account/
│   │   ├── page.tsx              # User dashboard
│   │   ├── orders/
│   │   │   └── [id]/page.tsx     # Order detail
│   │   └── wishlist/
│   │       └── page.tsx          # Wishlist page
│   ├── admin/
│   │   ├── page.tsx              # Admin dashboard
│   │   ├── products/
│   │   │   └── page.tsx          # Product management
│   │   └── orders/
│   │       └── page.tsx          # Order management
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   └── api/                      # API route handlers (if needed)
├── src/
│   ├── components/
│   │   ├── Hero.tsx
│   │   ├── Navbar.tsx
│   │   ├── Gallery.tsx
│   │   ├── Marquee.tsx
│   │   ├── SmoothScroll.tsx
│   │   ├── QuickViewModal.tsx    # NEW: Product quick view
│   │   ├── CartDrawer.tsx        # NEW: Slide-out cart
│   │   ├── Newsletter.tsx        # NEW: Email signup
│   │   ├── Footer.tsx            # NEW: Site footer
│   │   ├── Breadcrumbs.tsx       # NEW: Navigation breadcrumbs
│   │   ├── MobileMenu.tsx        # NEW: Mobile navigation
│   │   ├── ProductCard.tsx       # NEW: Reusable product card
│   │   ├── ProductGrid.tsx       # NEW: Product grid layout
│   │   ├── FilterSidebar.tsx     # NEW: Shop filters
│   │   ├── SearchBar.tsx         # NEW: Product search
│   │   ├── ReviewCard.tsx        # NEW: Review display
│   │   ├── ReviewForm.tsx        # NEW: Review submission
│   │   ├── StarRating.tsx        # NEW: Rating display/input
│   │   ├── WishlistButton.tsx    # NEW: Wishlist toggle
│   │   ├── SkeletonCard.tsx      # NEW: Loading skeleton
│   │   └── ui/                   # NEW: Shared UI components
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       ├── Drawer.tsx
│   │       └── Badge.tsx
│   ├── store/
│   │   ├── cartStore.ts          # NEW: Zustand cart state
│   │   ├── wishlistStore.ts      # NEW: Zustand wishlist state
│   │   └── authStore.ts          # NEW: Zustand auth state
│   ├── lib/
│   │   ├── gallery-data.ts
│   │   ├── utils.ts
│   │   ├── api.ts                # NEW: API client functions
│   │   └── constants.ts          # NEW: App constants
│   ├── types/
│   │   ├── product.ts            # NEW: Product types
│   │   ├── cart.ts               # NEW: Cart types
│   │   ├── order.ts              # NEW: Order types
│   │   └── user.ts               # NEW: User types
│   └── hooks/
│       ├── useProducts.ts        # NEW: Product data hook
│       ├── useAuth.ts            # NEW: Auth hook
│       └── useMediaQuery.ts      # NEW: Responsive hook
```

## Components and Interfaces

### 1. Cart Store (Zustand)

```typescript
// src/store/cartStore.ts
interface CartItem {
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

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  
  // Actions
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  
  // Computed
  itemCount: () => number;
  subtotal: () => number;
  tax: () => number;
  total: () => number;
}
```

### 2. Wishlist Store

```typescript
// src/store/wishlistStore.ts
interface WishlistItem {
  productId: string;
  addedAt: Date;
}

interface WishlistStore {
  items: WishlistItem[];
  
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}
```

### 3. Quick View Modal

```typescript
// src/components/QuickViewModal.tsx
interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

// Features:
// - Image gallery with thumbnails
// - Size/color variant selection
// - Quantity selector
// - Add to cart button
// - Wishlist toggle
// - Framer Motion animations
```

### 4. Product Card

```typescript
// src/components/ProductCard.tsx
interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  showWishlist?: boolean;
}

// Features:
// - Hover image swap
// - Quick view button on hover
// - Wishlist heart icon
// - Price display with sale support
// - Size availability indicators
```

### 5. Filter Sidebar

```typescript
// src/components/FilterSidebar.tsx
interface FilterState {
  priceRange: [number, number];
  sizes: string[];
  colors: string[];
  availability: 'all' | 'in-stock' | 'out-of-stock';
  sortBy: 'newest' | 'price-asc' | 'price-desc' | 'popular';
}

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  availableFilters: {
    sizes: string[];
    colors: string[];
    priceRange: [number, number];
  };
}
```

### 6. Cart Drawer

```typescript
// src/components/CartDrawer.tsx
// Slide-out drawer from right side
// Shows cart items with quantity controls
// Subtotal, tax, total calculation
// Checkout button
// Empty cart state
```

### 7. Newsletter Component

```typescript
// src/components/Newsletter.tsx
interface NewsletterProps {
  variant?: 'footer' | 'popup' | 'inline';
}

// Features:
// - Email validation
// - Loading state
// - Success/error messages
// - Brand messaging
```

### 8. Breadcrumbs

```typescript
// src/components/Breadcrumbs.tsx
interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}
```

### 9. Mobile Menu

```typescript
// src/components/MobileMenu.tsx
// Full-screen overlay menu
// Animated slide-in from left
// Navigation links
// Cart and account access
// Close on navigation
```

## Data Models

### Product Type

```typescript
interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  basePrice: number;
  salePrice?: number;
  isActive: boolean;
  images: ProductImage[];
  variants: ProductVariant[];
  reviews?: Review[];
  averageRating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

interface ProductImage {
  id: string;
  url: string;
  isMain: boolean;
  altText: string;
}

interface ProductVariant {
  id: string;
  size: string;
  color: string;
  stockQuantity: number;
  sku: string;
  priceOverride?: number;
}
```

### Review Type

```typescript
interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  verified: boolean;
}
```

### Order Type

```typescript
interface Order {
  id: string;
  userId: string;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  paymentRef: string;
  shippingAddress: Address;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

interface OrderItem {
  id: string;
  quantity: number;
  priceAtPurchase: number;
  variant: ProductVariant & { product: Pick<Product, 'title' | 'slug'> };
}
```

## API Integration

### API Client

```typescript
// src/lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const api = {
  products: {
    list: (params?: ProductQueryParams) => fetch(...),
    get: (slug: string) => fetch(...),
  },
  cart: {
    sync: (items: CartItem[]) => fetch(...),
  },
  orders: {
    create: (data: CreateOrderData) => fetch(...),
    list: () => fetch(...),
    get: (id: string) => fetch(...),
  },
  reviews: {
    list: (productId: string) => fetch(...),
    create: (data: CreateReviewData) => fetch(...),
  },
  newsletter: {
    subscribe: (email: string) => fetch(...),
  },
  auth: {
    login: (credentials: LoginData) => fetch(...),
    register: (data: RegisterData) => fetch(...),
    me: () => fetch(...),
  },
};
```

## Error Handling

### API Errors
- Display toast notifications for API failures
- Retry logic for transient failures
- Graceful degradation when backend unavailable
- Form validation errors displayed inline

### Loading States
- Skeleton screens for product grids
- Spinner for button actions
- Progress indicator for image uploads
- Optimistic updates for cart actions

### Empty States
- Empty cart with CTA to shop
- Empty wishlist with product suggestions
- No search results with suggestions
- No orders with CTA to browse

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Cart Item Count Consistency
*For any* sequence of add and remove operations on the cart, the displayed item count SHALL equal the sum of quantities of all items in the cart state.
**Validates: Requirements 1.2**

### Property 2: Cart Persistence Round Trip
*For any* cart state, storing to localStorage and then restoring SHALL produce an equivalent cart state.
**Validates: Requirements 1.4**

### Property 3: Cart Total Calculation
*For any* cart with items, the total SHALL equal the sum of (price × quantity) for all items plus calculated tax.
**Validates: Requirements 1.6**

### Property 4: Filter Application Consistency
*For any* set of filter criteria applied to a product list, all displayed products SHALL match all active filter conditions.
**Validates: Requirements 3.4**

### Property 5: Wishlist Toggle Idempotence
*For any* product, adding to wishlist twice SHALL result in the same state as adding once (item present).
**Validates: Requirements 5.2**

### Property 6: Review Rating Bounds
*For any* review submission, the rating value SHALL be between 1 and 5 inclusive.
**Validates: Requirements 6.4**

### Property 7: Breadcrumb Path Validity
*For any* page with breadcrumbs, each breadcrumb link SHALL navigate to a valid page in the site hierarchy.
**Validates: Requirements 10.4**

### Property 8: Mobile Touch Target Size
*For any* interactive element on mobile viewport, the touch target SHALL have minimum dimensions of 44x44 pixels.
**Validates: Requirements 11.6**

## Testing Strategy

### Unit Testing (Jest + React Testing Library)
- Cart store actions and computed values
- Wishlist store operations
- Filter logic and state management
- Utility functions
- Component rendering and interactions

### Property-Based Testing (fast-check)
- Cart calculations with random items
- Filter combinations with random products
- Wishlist operations with random sequences
- Form validation with random inputs

### Integration Testing
- API client with mock server
- Cart persistence with localStorage
- Auth flow with token management
- Filter + search combinations

### E2E Testing (Playwright)
- Add to cart flow
- Checkout process
- User registration and login
- Admin product management
- Mobile navigation

## Performance Considerations

### Image Optimization
- Next.js Image component with automatic optimization
- WebP format with fallbacks
- Responsive srcset for different viewports
- Lazy loading for below-fold images
- Blur placeholder during load

### Data Fetching
- Server components for initial data
- Client-side fetching for dynamic updates
- SWR or React Query for caching
- Pagination with 12 items per page
- Infinite scroll with intersection observer

### Bundle Optimization
- Dynamic imports for modals and drawers
- Route-based code splitting
- Tree shaking for unused code
- Minimize third-party dependencies

### Caching Strategy
- Static generation for product pages
- ISR with 60-second revalidation
- Client-side cache for cart/wishlist
- API response caching headers

## Design Tokens (Extended)

### New Colors
```css
--color-success: #22c55e;
--color-error: #ef4444;
--color-warning: #f59e0b;
--color-info: #3b82f6;
--color-muted: #6b7280;
--color-border: #374151;
```

### New Spacing
```css
--spacing-drawer: 400px;
--spacing-modal: 600px;
--spacing-sidebar: 280px;
```

### New Transitions
```css
--transition-drawer: 300ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-modal: 200ms ease-out;
```

## Dependencies

### New Dependencies to Install
```json
{
  "zustand": "^4.5.0",
  "react-hot-toast": "^2.4.1",
  "@tanstack/react-query": "^5.0.0"
}
```

### Dev Dependencies
```json
{
  "fast-check": "^3.15.0"
}
```

