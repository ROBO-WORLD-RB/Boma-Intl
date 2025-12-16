# Implementation Plan

- [x] 1. Set up state management foundation






  - [x] 1.1 Install Zustand, react-hot-toast, and @tanstack/react-query dependencies

    - Run npm install in my-streetwear-brand directory
    - _Requirements: 1.1_


  - [x] 1.2 Create TypeScript type definitions for Product, Cart, Order, User, and Review


    - Create files in src/types/ directory
    - _Requirements: 1.3, 6.4_
  - [x] 1.3 Implement cart store with Zustand

    - Create src/store/cartStore.ts with add, remove, update, clear actions
    - Include localStorage persistence middleware
    - _Requirements: 1.1, 1.3, 1.4, 1.5_
  - [x] 1.4 Write property test for cart store



    - **Property 1: Cart Item Count Consistency**
    - **Property 2: Cart Persistence Round Trip**
    - **Property 3: Cart Total Calculation**
    - **Validates: Requirements 1.2, 1.4, 1.6**
  - [x] 1.5 Implement wishlist store with Zustand


    - Create src/store/wishlistStore.ts with add, remove, toggle, isInWishlist
    - Include localStorage persistence
    - _Requirements: 5.2, 5.3, 5.4_
  - [x] 1.6 Write property test for wishlist store


    - **Property 5: Wishlist Toggle Idempotence**
    - **Validates: Requirements 5.2**

  - [x] 1.7 Create API client utility

    - Create src/lib/api.ts with typed fetch functions for all endpoints
    - _Requirements: 3.8, 6.4_

- [x] 2. Checkpoint - Ensure all tests pass





  - Ensure all tests pass, ask the user if questions arise.

- [x] 3. Build shared UI components







  - [x] 3.1 Create Button component with variants
    - Create src/components/ui/Button.tsx with primary, secondary, outline variants
    - Include loading state support
    - _Requirements: 9.4_
  - [x] 3.2 Create Input component with validation

    - Create src/components/ui/Input.tsx with error state and label support
    - _Requirements: 4.2_

  - [x] 3.3 Create Modal component with Framer Motion

    - Create src/components/ui/Modal.tsx with backdrop, close button, animations
    - _Requirements: 2.6, 2.7_

  - [x] 3.4 Create Drawer component for cart and mobile menu

    - Create src/components/ui/Drawer.tsx with slide animation from left/right
    - _Requirements: 11.5_

  - [x] 3.5 Create Badge component for cart count and stock status

    - Create src/components/ui/Badge.tsx
    - _Requirements: 1.2, 14.5_
  - [x] 3.6 Create SkeletonCard component for loading states


    - Create src/components/SkeletonCard.tsx matching product card dimensions
    - Include pulse animation
    - _Requirements: 9.1, 9.3, 9.4_
  - [x] 3.7 Create StarRating component for display and input


    - Create src/components/StarRating.tsx with interactive and read-only modes
    - _Requirements: 6.1, 6.4_
  - [x] 3.8 Write property test for StarRating


    - **Property 6: Review Rating Bounds**
    - **Validates: Requirements 6.4**

- [x] 4. Implement cart and navbar enhancements






  - [x] 4.1 Create CartDrawer component


    - Create src/components/CartDrawer.tsx with item list, quantity controls, totals
    - Include empty cart state
    - _Requirements: 1.2, 1.5, 1.6_

  - [x] 4.2 Update Navbar with cart count badge

    - Modify src/components/Navbar.tsx to show item count from cart store
    - Add click handler to open cart drawer
    - _Requirements: 1.2_

  - [x] 4.3 Create MobileMenu component

    - Create src/components/MobileMenu.tsx with hamburger trigger and slide-out menu
    - _Requirements: 11.1_

  - [x] 4.4 Update Navbar with mobile menu toggle

    - Add hamburger button visible on mobile viewports
    - Integrate MobileMenu component
    - _Requirements: 11.1_

  - [x] 4.5 Write unit tests for Navbar and CartDrawer

    - Test cart count display, mobile menu toggle
    - _Requirements: 1.2, 11.1_

- [x] 5. Checkpoint - Ensure all tests pass





  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Build product components






  - [x] 6.1 Create ProductCard component

    - Create src/components/ProductCard.tsx with image, title, price, hover effects
    - Include wishlist button and quick view trigger
    - _Requirements: 5.1, 2.1_

  - [x] 6.2 Create WishlistButton component

    - Create src/components/WishlistButton.tsx with heart icon toggle
    - Connect to wishlist store
    - _Requirements: 5.1, 5.2_
  - [x] 6.3 Create QuickViewModal component


    - Create src/components/QuickViewModal.tsx with product details, variant selection
    - Include image gallery, size/color pickers, add to cart
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_
  - [x] 6.4 Update Gallery to open QuickViewModal on click


    - Modify src/components/Gallery.tsx to handle click events
    - Pass selected product to modal
    - _Requirements: 2.1_
  - [x] 6.5 Write unit tests for ProductCard and QuickViewModal


    - Test variant selection, add to cart functionality
    - _Requirements: 2.4, 2.5_

- [x] 7. Build shop page with filtering



  - [x] 7.1 Create FilterSidebar component


    - Create src/components/FilterSidebar.tsx with price range, size, color, availability filters
    - Include clear filters functionality
    - _Requirements: 3.2, 3.5_

  - [x] 7.2 Create SearchBar component

    - Create src/components/SearchBar.tsx with debounced search input
    - _Requirements: 3.3_

  - [x] 7.3 Create ProductGrid component

    - Create src/components/ProductGrid.tsx with responsive grid layout
    - Include loading skeleton state
    - _Requirements: 3.1, 9.1_
  - [x] 7.4 Create useProducts hook for data fetching


    - Create src/hooks/useProducts.ts with React Query integration
    - Support filter and search parameters
    - _Requirements: 3.4, 3.8_

  - [x] 7.5 Build Shop page








    - Create app/shop/page.tsx assembling FilterSidebar, SearchBar, ProductGrid
    - Implement URL-based filter state
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_
  - [x] 7.6 Write property test for filter logic








    - **Property 4: Filter Application Consistency**
    - **Validates: Requirements 3.4**
  - [x] 7.7 Write unit tests for Shop page components





    - Test filter application, search, pagination
    - _Requirements: 3.4, 3.6_

- [x] 8. Checkpoint - Ensure all tests pass





  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Build product detail page





  - [x] 9.1 Create Breadcrumbs component


    - Create src/components/Breadcrumbs.tsx with navigation links
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_
  - [x] 9.2 Write property test for Breadcrumbs


    - **Property 7: Breadcrumb Path Validity**
    - **Validates: Requirements 10.4**
  - [x] 9.3 Create ReviewCard component


    - Create src/components/ReviewCard.tsx displaying rating, comment, author, date
    - _Requirements: 6.2_
  - [x] 9.4 Create ReviewForm component


    - Create src/components/ReviewForm.tsx with star rating input and comment textarea
    - _Requirements: 6.3, 6.4_
  - [x] 9.5 Create ReviewSection component


    - Create src/components/ReviewSection.tsx combining ReviewCard list and ReviewForm
    - _Requirements: 6.1, 6.2, 6.3, 6.6_
  - [x] 9.6 Build Product detail page


    - Create app/product/[slug]/page.tsx with full product info, variants, reviews
    - Include breadcrumbs, add to cart, wishlist
    - _Requirements: 6.1, 6.2, 10.2_
  - [x] 9.7 Write unit tests for product detail page


    - Test variant selection, review display, add to cart
    - _Requirements: 6.1, 6.2_

- [x] 10. Build newsletter and footer





  - [x] 10.1 Create Newsletter component


    - Create src/components/Newsletter.tsx with email input, validation, submit
    - Include success/error states
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

  - [x] 10.2 Create Footer component


    - Create src/components/Footer.tsx with newsletter, links, social icons
    - _Requirements: 4.1_

  - [x] 10.3 Add Footer to layout

    - Update app/layout.tsx to include Footer component
    - _Requirements: 4.1_

  - [x] 10.4 Write unit tests for Newsletter

    - Test email validation, submission states
    - _Requirements: 4.2, 4.3, 4.4_

- [x]  11. Checkpoint - Ensure all tests pass





  - Ensure all tests pass, ask the user if questions arise.

- [x] 12. Build user account pages






  - [x] 12.1 Create auth store with Zustand

    - Create src/store/authStore.ts with login, logout, token management
    - _Requirements: 7.6_

  - [x] 12.2 Create useAuth hook

    - Create src/hooks/useAuth.ts for authentication state and actions
    - _Requirements: 7.6_

  - [x] 12.3 Build Login page

    - Create app/auth/login/page.tsx with email/password form
    - _Requirements: 7.6_

  - [x] 12.4 Build Register page

    - Create app/auth/register/page.tsx with registration form
    - _Requirements: 7.6_

  - [x] 12.5 Create OrderHistory component

    - Create src/components/OrderHistory.tsx displaying user orders
    - _Requirements: 7.1_

  - [x] 12.6 Create AddressBook component

    - Create src/components/AddressBook.tsx for managing saved addresses
    - _Requirements: 7.3_

  - [x] 12.7 Build Account dashboard page

    - Create app/account/page.tsx with tabs for orders, wishlist, addresses, settings
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

  - [x] 12.8 Build Order detail page

    - Create app/account/orders/[id]/page.tsx with full order information
    - _Requirements: 7.2_
  - [x] 12.9 Build Wishlist page


    - Create app/account/wishlist/page.tsx displaying saved products
    - _Requirements: 7.4_
  - [x] 12.10 Write unit tests for account pages


    - Test order display, address management
    - _Requirements: 7.1, 7.3_


- [x] 13. Checkpoint - Ensure all tests pass




  - Ensure all tests pass, ask the user if questions arise.


- [x] 14. Build admin dashboard





  - [x] 14.1 Create SalesMetrics component

    - Create src/components/admin/SalesMetrics.tsx with revenue, orders, AOV cards
    - _Requirements: 8.2_

  - [x] 14.2 Create SalesChart component

    - Create src/components/admin/SalesChart.tsx with time-series chart
    - _Requirements: 8.6_

  - [x] 14.3 Create OrderTable component

    - Create src/components/admin/OrderTable.tsx with recent orders list
    - _Requirements: 8.3_

  - [x] 14.4 Create ProductTable component

    - Create src/components/admin/ProductTable.tsx with product list and actions
    - _Requirements: 8.4_
  - [x] 14.5 Create InventoryAlerts component


    - Create src/components/admin/InventoryAlerts.tsx showing low stock items
    - _Requirements: 8.5, 14.1, 14.2_

  - [x] 14.6 Build Admin dashboard page

    - Create app/admin/page.tsx assembling all admin components
    - Add admin role check middleware
    - _Requirements: 8.1, 8.2, 8.3, 8.5, 8.6_

  - [x] 14.7 Build Admin products page

    - Create app/admin/products/page.tsx with CRUD operations
    - _Requirements: 8.4_

  - [x] 14.8 Build Admin orders page

    - Create app/admin/orders/page.tsx with order management
    - _Requirements: 8.3_
  - [x] 14.9 Write unit tests for admin components


    - Test metrics display, table rendering
    - _Requirements: 8.2, 8.3_

- [x] 15. Checkpoint - Ensure all tests pass

  - Ensure all tests pass, ask the user if questions arise.
  - Fix currency formatting in tests (tests expect ₦ but code uses GH₵)
  - Fix Homepage.test.tsx CartDrawer totals test
  - Fix Homepage.test.tsx Gallery lazy loading test
  - Fix QuickViewModal.test.tsx price rendering test
  - Fix ProductCard.test.tsx price rendering tests

- [x] 16. Mobile optimization






  - [x] 16.1 Add touch swipe to Hero slideshow

    - Update src/components/Hero.tsx with touch event handlers
    - _Requirements: 11.2_

  - [x] 16.2 Make Gallery responsive for mobile

    - Update src/components/Gallery.tsx grid for single/two column on mobile
    - _Requirements: 11.3_

  - [x] 16.3 Make QuickViewModal full-screen on mobile

    - Update QuickViewModal.tsx with mobile-specific styles
    - _Requirements: 11.4_
  - [x] 16.4 Make FilterSidebar a drawer on mobile


    - Update FilterSidebar.tsx to use Drawer component on mobile
    - _Requirements: 11.5_
  - [x] 16.5 Audit and fix touch target sizes


    - Review all interactive elements for 44x44px minimum
    - _Requirements: 11.6_

  - [x] 16.6 Write property test for touch targets

    - **Property 8: Mobile Touch Target Size**
    - **Validates: Requirements 11.6**





- [x] 17. Performance optimization


  - [x] 17.1 Convert images to Next.js Image component

    - Update all img tags to use next/image with optimization
    - _Requirements: 12.1, 12.3, 12.4_

  - [x] 17.2 Implement lazy loading for images

    - Add loading="lazy" and priority flags appropriately
    - _Requirements: 12.2_

  - [x] 17.3 Add API response caching

    - Configure cache headers in API routes
    - Set up React Query caching
    - _Requirements: 12.5_

  - [x] 17.4 Implement pagination on Shop page

    - Add page parameter and pagination UI
    - _Requirements: 12.6, 3.6_

- [x] 18. Backend enhancements
  - [x] 18.1 Add Prisma schema updates for reviews, wishlist, and newsletter
    - Add Review model with productId, userId, rating, comment fields
    - Add Wishlist model with userId and productId fields
    - Add NewsletterSubscription model with email field
    - Run prisma migrate to apply changes
    - _Requirements: 6.2, 5.3, 4.3_
  - [x] 18.2 Add newsletter subscription endpoint

    - Create src/services/newsletter.service.ts with subscribe logic
    - Create src/controllers/newsletter.controller.ts
    - Create src/routes/newsletter.routes.ts with POST /subscribe
    - Register route in src/routes/index.ts
    - _Requirements: 4.3, 4.4, 4.5_

  - [x] 18.3 Add reviews endpoints

    - Create src/services/review.service.ts with CRUD operations
    - Create src/controllers/review.controller.ts
    - Add GET /api/v1/products/:slug/reviews to product routes
    - Add POST /api/v1/products/:slug/reviews (authenticated) to product routes
    - Validate user has purchased product before allowing review
    - _Requirements: 6.2, 6.3, 6.5_

  - [x] 18.4 Add wishlist endpoints

    - Create src/services/wishlist.service.ts with add/remove/list operations
    - Create src/controllers/wishlist.controller.ts
    - Create src/routes/wishlist.routes.ts with GET/POST/DELETE endpoints
    - Register route in src/routes/index.ts
    - _Requirements: 5.3_

  - [x] 18.5 Add admin analytics endpoint

    - Create src/services/analytics.service.ts with sales metrics calculation
    - Add GET /api/v1/admin/analytics to admin routes
    - Return total revenue, order count, average order value, sales over time
    - _Requirements: 8.2, 8.6_

  - [x] 18.6 Add inventory alerts logic

    - Add lowStockThreshold field to Product model in Prisma schema
    - Create src/services/inventory.service.ts with low stock detection
    - Add GET /api/v1/admin/inventory/alerts to admin routes
    - Return products where stockQuantity < lowStockThreshold
    - _Requirements: 14.1, 14.2, 14.4_

  - [x] 18.7 Add email notification service


    - Install nodemailer or resend package
    - Create src/services/email.service.ts with send functions
    - Create email templates for order confirmation and shipping
    - Integrate email sending in order service on status changes
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_
  - [x] 18.8 Write unit tests for backend endpoints






    - Create test suite for newsletter subscription endpoint (valid/invalid emails)
    - Create test suite for review endpoints (create, list, validation)
    - Create test suite for wishlist endpoints (add, remove, list operations)
    - Create test suite for admin analytics endpoint (calculations, data aggregation)
    - Set up Jest configuration for backend tests if not already configured
    - _Requirements: 4.3, 6.3, 5.3, 8.2_


- [x] 19. Final Checkpoint - Ensure all tests pass




  - Ensure all tests pass, ask the user if questions arise.

