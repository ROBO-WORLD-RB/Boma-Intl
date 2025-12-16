# Requirements Document

## Introduction

This document defines the requirements for a complete checkout flow for the BOMA 2025 streetwear e-commerce platform. The checkout flow enables customers to complete purchases by providing delivery information, scheduling delivery dates/times, and confirming orders. The implementation extends the existing cart functionality (Zustand store with localStorage persistence) and integrates with the existing backend order service while adding delivery scheduling capabilities.

## Glossary

- **Checkout_Page**: The page where customers enter delivery information and confirm their order
- **Checkout_Form**: The form component collecting customer name, delivery date, time window, and address
- **Delivery_Scheduler**: UI components for selecting delivery date and optional time window
- **Address_Input**: Form fields for entering delivery address with optional geolocation support
- **Order_Confirmation_Page**: The page displayed after successful order placement showing order details
- **Cart_Page**: A dedicated page view of the shopping cart (alternative to cart drawer)
- **Inventory_Check**: Server-side validation ensuring requested quantities are available before order confirmation
- **Guest_Checkout**: Checkout flow that does not require user authentication
- **Delivery_Fee**: Additional charge added to order total based on delivery location

## Requirements

### Requirement 1: Cart Page

**User Story:** As a customer, I want a dedicated cart page where I can review and modify my cart items before checkout, so that I can ensure my order is correct.

#### Acceptance Criteria

1. THE Cart_Page SHALL display all cart items with product image, title, size, color, quantity, and line total.
2. THE Cart_Page SHALL provide quantity controls (increment, decrement) for each cart item with minimum quantity of 1.
3. THE Cart_Page SHALL provide a remove button for each cart item.
4. WHEN quantity is updated, THE Cart_Page SHALL recalculate and display updated line totals and cart totals immediately.
5. THE Cart_Page SHALL display subtotal, delivery fee placeholder, and estimated total.
6. THE Cart_Page SHALL include a "Proceed to Checkout" button that navigates to the Checkout_Page.
7. WHEN cart is empty, THE Cart_Page SHALL display an empty state with a link to the shop page.
8. THE Cart_Page SHALL be accessible at the `/cart` route.

### Requirement 2: Checkout Form - Customer Information

**User Story:** As a customer, I want to enter my contact information during checkout, so that the store can reach me about my order.

#### Acceptance Criteria

1. THE Checkout_Form SHALL collect customer full name as a required field.
2. THE Checkout_Form SHALL collect customer phone number as a required field.
3. THE Checkout_Form SHALL collect customer email address as an optional field.
4. THE Checkout_Form SHALL validate that full name contains at least 2 characters.
5. THE Checkout_Form SHALL validate phone number format for Ghana phone numbers (+233 or 0 prefix).
6. IF email is provided, THE Checkout_Form SHALL validate email format.
7. THE Checkout_Form SHALL display inline validation errors below each invalid field.

### Requirement 3: Delivery Date and Time Scheduling

**User Story:** As a customer, I want to schedule when my order should be delivered, so that I can ensure someone is available to receive it.

#### Acceptance Criteria

1. THE Delivery_Scheduler SHALL display a date picker for selecting delivery date.
2. THE Delivery_Scheduler SHALL disable all past dates in the date picker.
3. THE Delivery_Scheduler SHALL disable dates more than 14 days in the future.
4. THE Delivery_Scheduler SHALL disable blackout dates (Sundays and public holidays).
5. THE Delivery_Scheduler SHALL provide an optional time window selector with options: Morning (9AM-12PM), Afternoon (12PM-4PM), Evening (4PM-7PM).
6. WHEN no time window is selected, THE system SHALL default to "Any time" for delivery.
7. THE Delivery_Scheduler SHALL show the minimum lead time (next available date is tomorrow for orders before 6PM, day after for orders after 6PM).

### Requirement 4: Delivery Address Input

**User Story:** As a customer, I want to enter my delivery address easily, so that my order arrives at the correct location.

#### Acceptance Criteria

1. THE Address_Input SHALL collect street address as a required field.
2. THE Address_Input SHALL collect city/area as a required field.
3. THE Address_Input SHALL collect region/state as a required field with dropdown of Ghana regions.
4. THE Address_Input SHALL collect additional directions/landmarks as an optional field.
5. THE Address_Input SHALL provide a "Use My Location" button that requests browser geolocation.
6. WHEN geolocation is granted, THE Address_Input SHALL reverse-geocode coordinates to pre-fill address fields.
7. IF geolocation is denied, THE Address_Input SHALL display a message prompting manual entry.
8. THE Address_Input SHALL store GPS coordinates when available for delivery optimization.

### Requirement 5: Order Summary and Totals

**User Story:** As a customer, I want to see a clear summary of my order and costs before confirming, so that I know exactly what I'm paying for.

#### Acceptance Criteria

1. THE Checkout_Page SHALL display an order summary showing all cart items with quantities and prices.
2. THE Checkout_Page SHALL display subtotal (sum of all item prices × quantities).
3. THE Checkout_Page SHALL calculate and display delivery fee based on selected region.
4. THE Checkout_Page SHALL display total amount (subtotal + delivery fee).
5. THE Checkout_Page SHALL update totals in real-time when delivery region changes.
6. THE order summary SHALL be visible alongside the checkout form on desktop and collapsible on mobile.

### Requirement 6: Inventory Validation

**User Story:** As a customer, I want to be notified if items become unavailable during checkout, so that I can adjust my order accordingly.

#### Acceptance Criteria

1. WHEN the customer clicks "Confirm Order", THE system SHALL validate inventory for all cart items.
2. IF any item has insufficient stock, THE system SHALL display an error message identifying the affected items.
3. THE error message SHALL show current available quantity for each affected item.
4. THE system SHALL provide options to update quantity to available amount or remove the item.
5. THE system SHALL prevent order submission until all inventory issues are resolved.
6. THE inventory check SHALL use atomic database transactions to prevent overselling.

### Requirement 7: Order Confirmation

**User Story:** As a customer, I want confirmation that my order was placed successfully, so that I have peace of mind and a reference for my purchase.

#### Acceptance Criteria

1. WHEN order is successfully created, THE system SHALL navigate to the Order_Confirmation_Page.
2. THE Order_Confirmation_Page SHALL display the order ID prominently.
3. THE Order_Confirmation_Page SHALL display scheduled delivery date and time window.
4. THE Order_Confirmation_Page SHALL display the delivery address.
5. THE Order_Confirmation_Page SHALL display order items and total amount.
6. THE Order_Confirmation_Page SHALL display payment method (Cash on Delivery or Paystack redirect info).
7. THE Order_Confirmation_Page SHALL provide a "Continue Shopping" button linking to the shop page.
8. THE Order_Confirmation_Page SHALL clear the cart after displaying confirmation.
9. THE system SHALL send order confirmation email if customer provided email address.

### Requirement 8: Guest Checkout Support

**User Story:** As a guest visitor, I want to complete a purchase without creating an account, so that I can buy quickly without friction.

#### Acceptance Criteria

1. THE Checkout_Page SHALL allow order placement without requiring user authentication.
2. FOR guest checkout, THE system SHALL create a guest order record with provided contact information.
3. THE Checkout_Page SHALL display an option to create an account after order confirmation.
4. FOR authenticated users, THE Checkout_Form SHALL pre-fill name and email from user profile.
5. FOR authenticated users, THE system SHALL associate the order with their user account.
6. THE system SHALL provide order lookup by order ID and phone number for guest orders.

### Requirement 9: Payment Method Selection

**User Story:** As a customer, I want to choose how to pay for my order, so that I can use my preferred payment method.

#### Acceptance Criteria

1. THE Checkout_Page SHALL display payment method options: Cash on Delivery and Online Payment (Paystack).
2. WHEN Cash on Delivery is selected, THE system SHALL create order with PENDING status and skip payment redirect.
3. WHEN Online Payment is selected, THE system SHALL redirect to Paystack payment page after order creation.
4. THE system SHALL display payment method icons and brief descriptions for each option.
5. Cash on Delivery SHALL be the default selected payment method.

### Requirement 10: Form Validation and Error Handling

**User Story:** As a customer, I want clear feedback when I make mistakes in the checkout form, so that I can correct them easily.

#### Acceptance Criteria

1. THE Checkout_Form SHALL validate all required fields before allowing submission.
2. THE Checkout_Form SHALL display validation errors inline below each invalid field.
3. THE Checkout_Form SHALL scroll to the first error when submission fails validation.
4. THE Checkout_Form SHALL disable the submit button while submission is in progress.
5. IF order creation fails, THE system SHALL display a user-friendly error message.
6. THE system SHALL implement rate limiting to prevent duplicate order submissions.
7. THE submit button SHALL show loading state during order processing.

### Requirement 11: Mobile Responsiveness

**User Story:** As a mobile user, I want the checkout process to work smoothly on my phone, so that I can complete purchases on the go.

#### Acceptance Criteria

1. THE Checkout_Page SHALL use a single-column layout on mobile viewports.
2. THE order summary SHALL be collapsible on mobile with an expand/collapse toggle.
3. ALL form inputs SHALL have minimum 44x44 pixel touch targets.
4. THE date picker SHALL be mobile-friendly with large touch targets.
5. THE Checkout_Page SHALL not require horizontal scrolling on any mobile viewport.
6. THE "Use My Location" button SHALL be prominently displayed on mobile.

### Requirement 12: Backend Order Enhancement

**User Story:** As a system, I need to store delivery scheduling information with orders, so that fulfillment can be planned accordingly.

#### Acceptance Criteria

1. THE Order model SHALL include scheduledDate field for delivery date.
2. THE Order model SHALL include timeWindow field for delivery time preference.
3. THE Order model SHALL include deliveryFee field for the calculated delivery charge.
4. THE Order model SHALL support shippingAddress as inline JSON (not just address ID reference).
5. THE order creation endpoint SHALL accept guest orders without userId.
6. THE order creation endpoint SHALL validate delivery date is within allowed range.
7. THE order creation endpoint SHALL calculate delivery fee based on region.

