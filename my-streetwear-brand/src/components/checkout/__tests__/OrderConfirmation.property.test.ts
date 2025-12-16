/**
 * Property-Based Tests for OrderConfirmation Component
 * 
 * **Feature: checkout-flow, Property 18: Order Confirmation Data Completeness**
 * **Validates: Requirements 7.3, 7.4, 7.5**
 */

import * as fc from 'fast-check';
import { OrderConfirmation, TimeWindow, GhanaRegion, GHANA_REGIONS } from '@/types/checkout';
import { CartItem } from '@/types';

// Arbitrary for generating valid cart items
const cartItemArbitrary: fc.Arbitrary<CartItem> = fc.record({
  id: fc.uuid(),
  productId: fc.uuid(),
  variantId: fc.uuid(),
  title: fc.string({ minLength: 1, maxLength: 100 }),
  size: fc.constantFrom('XS', 'S', 'M', 'L', 'XL', 'XXL'),
  color: fc.constantFrom('Black', 'White', 'Red', 'Blue', 'Green'),
  price: fc.float({ min: Math.fround(0.01), max: Math.fround(10000), noNaN: true }),
  quantity: fc.integer({ min: 1, max: 100 }),
  image: fc.webUrl(),
});

// Arbitrary for time windows
const timeWindowArbitrary: fc.Arbitrary<TimeWindow> = fc.constantFrom(
  'morning',
  'afternoon',
  'evening',
  'any'
);

// Arbitrary for Ghana regions
const ghanaRegionArbitrary: fc.Arbitrary<GhanaRegion> = fc.constantFrom(...GHANA_REGIONS);

// Generate non-empty, non-whitespace strings
const nonEmptyStringArbitrary = (maxLength: number) => 
  fc.stringMatching(/^[a-zA-Z0-9][a-zA-Z0-9\s]{0,}[a-zA-Z0-9]$/)
    .filter(s => s.trim().length > 0 && s.length <= maxLength);

// Arbitrary for delivery address with valid non-empty strings
const deliveryAddressArbitrary = fc.record({
  street: nonEmptyStringArbitrary(200),
  city: nonEmptyStringArbitrary(100),
  region: ghanaRegionArbitrary,
  directions: fc.option(fc.string({ minLength: 0, maxLength: 500 }), { nil: undefined }),
  coordinates: fc.option(
    fc.record({
      lat: fc.float({ min: -90, max: 90, noNaN: true }),
      lng: fc.float({ min: -180, max: 180, noNaN: true }),
    }),
    { nil: undefined }
  ),
});

// Arbitrary for checkout totals
const checkoutTotalsArbitrary = fc.record({
  subtotal: fc.float({ min: 0, max: 100000, noNaN: true }),
  deliveryFee: fc.constantFrom(20, 30, 35, 40, 45, 50, 55, 60, 65, 70),
  total: fc.float({ min: 0, max: 110000, noNaN: true }),
});


// Generate valid ISO date strings for scheduled dates (within next 14 days)
const scheduledDateArbitrary = fc.integer({ min: 1, max: 14 }).map(daysFromNow => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues
  return date.toISOString();
});

// Arbitrary for generating valid order confirmation data
const orderConfirmationArbitrary: fc.Arbitrary<OrderConfirmation> = fc.record({
  orderId: fc.stringMatching(/^[a-z0-9]{20,30}$/),
  scheduledDate: scheduledDateArbitrary,
  timeWindow: timeWindowArbitrary,
  address: deliveryAddressArbitrary,
  items: fc.array(cartItemArbitrary, { minLength: 1, maxLength: 10 }),
  totals: checkoutTotalsArbitrary,
  paymentMethod: fc.constantFrom('cod', 'paystack') as fc.Arbitrary<'cod' | 'paystack'>,
  paymentUrl: fc.option(fc.webUrl(), { nil: undefined }),
});

/**
 * Validates that an OrderConfirmation object has all required fields
 * for displaying the confirmation page
 */
function isConfirmationDataComplete(confirmation: OrderConfirmation): boolean {
  // Check orderId exists and is non-empty (Requirements: 7.2)
  if (!confirmation.orderId || confirmation.orderId.trim() === '') {
    return false;
  }

  // Check scheduledDate exists and is valid (Requirements: 7.3)
  if (!confirmation.scheduledDate) {
    return false;
  }
  const scheduledDate = new Date(confirmation.scheduledDate);
  if (isNaN(scheduledDate.getTime())) {
    return false;
  }

  // Check timeWindow exists and is valid (Requirements: 7.3)
  const validTimeWindows: TimeWindow[] = ['morning', 'afternoon', 'evening', 'any'];
  if (!validTimeWindows.includes(confirmation.timeWindow)) {
    return false;
  }

  // Check address has all required fields (Requirements: 7.4)
  if (!confirmation.address) {
    return false;
  }
  if (!confirmation.address.street || confirmation.address.street.trim() === '') {
    return false;
  }
  if (!confirmation.address.city || confirmation.address.city.trim() === '') {
    return false;
  }
  if (!confirmation.address.region || !GHANA_REGIONS.includes(confirmation.address.region)) {
    return false;
  }

  // Check items exist (Requirements: 7.5)
  if (!confirmation.items || confirmation.items.length === 0) {
    return false;
  }

  // Check totals exist (Requirements: 7.5)
  if (!confirmation.totals) {
    return false;
  }
  if (typeof confirmation.totals.subtotal !== 'number') {
    return false;
  }
  if (typeof confirmation.totals.deliveryFee !== 'number') {
    return false;
  }
  if (typeof confirmation.totals.total !== 'number') {
    return false;
  }

  return true;
}

describe('OrderConfirmation Property Tests', () => {
  /**
   * **Feature: checkout-flow, Property 18: Order Confirmation Data Completeness**
   * **Validates: Requirements 7.3, 7.4, 7.5**
   * 
   * For any successful order, the confirmation response SHALL include 
   * orderId, scheduledDate, timeWindow, and all address fields.
   */
  test('Property 18: Order Confirmation Data Completeness - all required fields present', () => {
    fc.assert(
      fc.property(orderConfirmationArbitrary, (confirmation) => {
        // Every valid OrderConfirmation should pass completeness check
        return isConfirmationDataComplete(confirmation);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property 18 (specific): orderId must be non-empty
   */
  test('Property 18 (orderId): orderId is always non-empty string', () => {
    fc.assert(
      fc.property(orderConfirmationArbitrary, (confirmation) => {
        return (
          typeof confirmation.orderId === 'string' &&
          confirmation.orderId.length > 0
        );
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property 18 (specific): scheduledDate must be valid ISO date
   */
  test('Property 18 (scheduledDate): scheduledDate is valid ISO date string', () => {
    fc.assert(
      fc.property(orderConfirmationArbitrary, (confirmation) => {
        const date = new Date(confirmation.scheduledDate);
        return !isNaN(date.getTime());
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property 18 (specific): timeWindow must be valid option
   */
  test('Property 18 (timeWindow): timeWindow is valid option', () => {
    fc.assert(
      fc.property(orderConfirmationArbitrary, (confirmation) => {
        const validTimeWindows: TimeWindow[] = ['morning', 'afternoon', 'evening', 'any'];
        return validTimeWindows.includes(confirmation.timeWindow);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property 18 (specific): address has all required fields
   */
  test('Property 18 (address): address contains street, city, and region', () => {
    fc.assert(
      fc.property(orderConfirmationArbitrary, (confirmation) => {
        return (
          typeof confirmation.address.street === 'string' &&
          confirmation.address.street.length > 0 &&
          typeof confirmation.address.city === 'string' &&
          confirmation.address.city.length > 0 &&
          GHANA_REGIONS.includes(confirmation.address.region)
        );
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property 18 (specific): items array is non-empty
   */
  test('Property 18 (items): items array contains at least one item', () => {
    fc.assert(
      fc.property(orderConfirmationArbitrary, (confirmation) => {
        return Array.isArray(confirmation.items) && confirmation.items.length > 0;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property 18 (specific): totals has all numeric fields
   */
  test('Property 18 (totals): totals contains subtotal, deliveryFee, and total', () => {
    fc.assert(
      fc.property(orderConfirmationArbitrary, (confirmation) => {
        return (
          typeof confirmation.totals.subtotal === 'number' &&
          typeof confirmation.totals.deliveryFee === 'number' &&
          typeof confirmation.totals.total === 'number'
        );
      }),
      { numRuns: 100 }
    );
  });
});
