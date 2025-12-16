# Implementation Plan

- [x] 1. Backend schema and service updates






  - [x] 1.1 Update Prisma schema for Order model

    - Add scheduledDate (DateTime?), timeWindow (String?), deliveryFee (Decimal)
    - Add customerName (String?), customerPhone (String?), customerEmail (String?)
    - Make userId nullable for guest orders
    - Run prisma migrate to apply changes
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_


  - [x] 1.2 Create delivery fee calculator utility

    - Create src/utils/delivery-calculator.ts with region-based fee lookup
    - Define fees for all 16 Ghana regions
    - _Requirements: 5.3, 12.7_


  - [x] 1.3 Write property test for delivery fee calculation

    - **Property 10: Delivery Fee by Region**
    - **Validates: Requirements 5.3**


  - [x] 1.4 Update OrderService for guest checkout and delivery scheduling

    - Modify createOrder to accept optional userId
    - Add scheduledDate, timeWindow, deliveryFee to order creation
    - Add customerName, customerPhone, customerEmail fields
    - Calculate delivery fee based on region in shippingAddress
    - _Requirements: 8.2, 12.5, 12.6, 12.7_


  - [x] 1.5 Write property test for guest order creation

    - **Property 14: Guest Order Creation**
    - **Validates: Requirements 8.2**


  - [x] 1.6 Write property test for authenticated order association

    - **Property 15: Authenticated Order Association**
    - **Validates: Requirements 8.5**


  - [x] 1.7 Add guest order endpoint

    - Create POST /api/v1/orders/guest endpoint that doesn't require auth
    - Validate required fields: customerName, customerPhone, items, shippingAddress, deliveryDate
    - Return inventory errors with available quantities when stock insufficient
    - _Requirements: 8.1, 6.1, 6.2, 6.3_



  - [x] 1.8 Write property test for inventory validation response

    - **Property 13: Inventory Validation Response**
    - **Validates: Requirements 6.2, 6.3, 6.5**


  - [x] 1.9 Add order lookup endpoint for guests

    - Create GET /api/v1/orders/lookup with orderId and phone query params
    - Return order details if phone matches customerPhone
    - _Requirements: 8.6_

- [x] 2. Checkpoint - Ensure all backend tests pass





  - Ensure all tests pass, ask the user if questions arise.

- [x] 3. Frontend validation utilities







  - [x] 3.1 Create checkout types
    - Create src/types/checkout.ts with CheckoutFormData, DeliveryAddress, TimeWindow, etc.
    - Define GhanaRegion type with all 16 regions
    - _Requirements: 4.3_


  - [x] 3.2 Create form validation schema

    - Create src/lib/validation.ts with Zod schemas for checkout form
    - Include name (min 2 chars), phone (Ghana format), email (optional), address fields
    - _Requirements: 2.4, 2.5, 2.6, 4.1, 4.2, 4.3, 4.4_


  - [x] 3.3 Write property test for name validation

    - **Property 3: Customer Name Validation**
    - **Validates: Requirements 2.4**


  - [x] 3.4 Write property test for phone validation
    - **Property 4: Ghana Phone Number Validation**
    - **Validates: Requirements 2.5**


  - [x] 3.5 Write property test for email validation
    - **Property 5: Email Validation (Optional Field)**
    - **Validates: Requirements 2.3, 2.6**

  - [x] 3.6 Create date utilities


    - Create src/lib/date-utils.ts with isValidDeliveryDate, getMinDeliveryDate, isBlackoutDate
    - Implement past date rejection, 14-day future limit, Sunday blackout
    - Implement lead time logic (tomorrow if before 6PM, day after if after 6PM)
    - _Requirements: 3.2, 3.3, 3.4, 3.7_


  - [x] 3.7 Write property test for past date rejection

    - **Property 6: Delivery Date - Past Date Rejection**
    - **Validates: Requirements 3.2**


  - [x] 3.8 Write property test for future date limit
    - **Property 7: Delivery Date - Future Limit**
    - **Validates: Requirements 3.3**


  - [x] 3.9 Write property test for blackout days
    - **Property 8: Delivery Date - Blackout Days**

    - **Validates: Requirements 3.4**

  - [x] 3.10 Write property test for minimum lead time
    - **Property 9: Minimum Lead Time Calculation**
    - **Validates: Requirements 3.7**

  - [x] 3.11 Create delivery fees module


    - Create src/lib/delivery-fees.ts with DELIVERY_FEES constant and calculateDeliveryFee function
    - Mirror backend fee structure for client-side display
    - _Requirements: 5.3_

- [x] 4. Checkpoint - Ensure all validation tests pass





  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Build Cart Page





  - [x] 5.1 Create CartPage component


    - Create src/components/cart/CartPage.tsx with full cart display
    - Show product image, title, size, color, quantity, line total for each item
    - Include quantity controls (increment/decrement with min 1)
    - Include remove button for each item
    - Display subtotal, delivery fee placeholder, estimated total
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [x] 5.2 Write property test for cart total calculation


    - **Property 1: Cart Total Calculation Consistency**
    - **Validates: Requirements 1.4, 5.2**

  - [x] 5.3 Write property test for quantity minimum bound


    - **Property 2: Quantity Minimum Bound**
    - **Validates: Requirements 1.2**

  - [x] 5.4 Create Cart page route


    - Create app/cart/page.tsx assembling CartPage component
    - Include "Proceed to Checkout" button linking to /checkout
    - Handle empty cart state with link to shop
    - _Requirements: 1.6, 1.7, 1.8_

  - [x] 5.5 Write unit tests for CartPage


    - Test quantity controls, remove functionality, totals display
    - Test empty cart state
    - _Requirements: 1.1, 1.2, 1.3, 1.7_

- [x] 6. Build Checkout Form Components





  - [x] 6.1 Create CustomerInfoSection component


    - Create src/components/checkout/CustomerInfoSection.tsx
    - Include name input (required), phone input (required), email input (optional)
    - Display inline validation errors
    - _Requirements: 2.1, 2.2, 2.3, 2.7_


  - [x] 6.2 Create DeliveryScheduler component

    - Create src/components/checkout/DeliveryScheduler.tsx
    - Include date picker with disabled past dates, future limit, blackout dates
    - Include time window selector (Morning, Afternoon, Evening, Any time)
    - Show minimum lead time info
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_


  - [x] 6.3 Create AddressInput component

    - Create src/components/checkout/AddressInput.tsx
    - Include street, city, region dropdown, directions fields
    - Include "Use My Location" button with geolocation API
    - Handle geolocation permission denied gracefully
    - Store coordinates when available
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8_


  - [x] 6.4 Create PaymentMethodSelector component

    - Create src/components/checkout/PaymentMethodSelector.tsx
    - Display COD and Paystack options with icons and descriptions
    - Default to COD selected
    - _Requirements: 9.1, 9.4, 9.5_


  - [x] 6.5 Create OrderSummary component

    - Create src/components/checkout/OrderSummary.tsx
    - Display cart items with quantities and prices
    - Display subtotal, delivery fee, total
    - Make collapsible on mobile
    - _Requirements: 5.1, 5.2, 5.4, 5.6_


  - [x] 6.6 Write property test for total calculation

    - **Property 11: Total Calculation**
    - **Validates: Requirements 5.4**


  - [x] 6.7 Write unit tests for checkout components

    - Test CustomerInfoSection validation display
    - Test DeliveryScheduler date restrictions
    - Test AddressInput geolocation flow
    - Test PaymentMethodSelector default state
    - _Requirements: 2.7, 3.2, 4.7, 9.5_

- [x] 7. Checkpoint - Ensure all component tests pass





  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Build Checkout Page and Hook





  - [x] 8.1 Create useCheckout hook


    - Create src/hooks/useCheckout.ts
    - Handle form submission to backend
    - Handle inventory error responses
    - Handle success/redirect for different payment methods
    - _Requirements: 6.1, 6.2, 6.4, 9.2, 9.3_

  - [x] 8.2 Write property test for COD payment behavior


    - **Property 16: COD Payment Method Behavior**
    - **Validates: Requirements 9.2**

  - [x] 8.3 Create CheckoutForm container component


    - Create src/components/checkout/CheckoutForm.tsx
    - Assemble all checkout sections with react-hook-form
    - Handle form validation with Zod schema
    - Display inventory errors with adjustment options
    - Show loading state during submission
    - _Requirements: 6.4, 10.1, 10.4, 10.5, 10.7_


  - [x] 8.4 Write property test for required field validation

    - **Property 12: Required Field Validation**
    - **Validates: Requirements 10.1**

  - [x] 8.5 Create Checkout page route


    - Create app/checkout/page.tsx
    - Pre-fill form for authenticated users
    - Handle guest checkout flow
    - Redirect to confirmation on success
    - _Requirements: 8.1, 8.4_

  - [x] 8.6 Write unit tests for CheckoutForm


    - Test form validation, submission flow, error handling
    - _Requirements: 10.1, 10.2, 10.3_




- [x] 9. Build Order Confirmation Page


  - [x] 9.1 Create OrderConfirmation component


    - Create src/components/checkout/OrderConfirmation.tsx
    - Display order ID, scheduled date, time window
    - Display delivery address
    - Display order items and totals
    - Display payment method info
    - Include "Continue Shopping" button
    - _Requirements: 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_

  - [x] 9.2 Write property test for confirmation data completeness


    - **Property 18: Order Confirmation Data Completeness**
    - **Validates: Requirements 7.3, 7.4, 7.5**

  - [x] 9.3 Create Confirmation page route


    - Create app/checkout/confirmation/page.tsx
    - Read order data from URL params or session storage
    - Clear cart after displaying confirmation
    - Show option to create account for guest users
    - _Requirements: 7.1, 7.8, 8.3_

  - [x] 9.4 Write property test for cart clear on confirmation


    - **Property 17: Cart Clear on Confirmation**
    - **Validates: Requirements 7.8**


  - [x] 9.5 Write unit tests for OrderConfirmation

    - Test all required fields displayed
    - Test cart clearing behavior
    - _Requirements: 7.2, 7.8_

- [x] 10. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. Mobile optimization and accessibility






  - [x] 11.1 Ensure mobile responsiveness

    - Verify single-column layout on mobile for checkout form
    - Make OrderSummary collapsible on mobile
    - Ensure date picker is mobile-friendly
    - _Requirements: 11.1, 11.2, 11.4_


  - [x] 11.2 Audit touch targets

    - Ensure all buttons and inputs have minimum 44x44px touch targets
    - _Requirements: 11.3_


  - [x] 11.3 Add accessibility attributes

    - Add proper ARIA labels to form fields
    - Ensure keyboard navigation works
    - Add focus management for error scrolling
    - _Requirements: 10.3_

- [x] 12. Integration and API updates




  - [x] 12.1 Update frontend API client

    - Add createGuestOrder method to src/lib/api.ts
    - Add orderLookup method for guest order retrieval
    - _Requirements: 8.1, 8.6_




  - [x] 12.2 Update CartDrawer checkout link


    - Ensure CartDrawer "Checkout" button links to /checkout
    - _Requirements: 1.6_


  - [x] 12.3 Add cart link to navbar





    - Update navbar cart icon to link to /cart page (currently opens drawer)
    - Ensure cart icon in navbar can navigate to /cart page
    - _Requirements: 1.8_




- [x] 13. Final Checkpoint - Ensure all tests pass


  - Ensure all tests pass, ask the user if questions arise.

