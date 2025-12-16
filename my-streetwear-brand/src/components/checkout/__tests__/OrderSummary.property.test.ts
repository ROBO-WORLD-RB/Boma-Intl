/**
 * Property-Based Tests for OrderSummary Component
 * 
 * **Feature: checkout-flow, Property 11: Total Calculation**
 * **Validates: Requirements 5.4**
 */

import * as fc from 'fast-check';
import { calculateCheckoutTotals } from '../OrderSummary';
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

// Arbitrary for generating valid delivery fees (based on Ghana regions)
const deliveryFeeArbitrary = fc.constantFrom(20, 30, 35, 40, 45, 50, 55, 60, 65, 70);

describe('OrderSummary Property Tests', () => {
  /**
   * **Feature: checkout-flow, Property 11: Total Calculation**
   * **Validates: Requirements 5.4**
   * 
   * For any checkout state with subtotal and delivery fee, 
   * the total SHALL equal subtotal + delivery fee.
   */
  test('Property 11: Total Calculation - total equals subtotal plus delivery fee', () => {
    fc.assert(
      fc.property(
        fc.array(cartItemArbitrary, { minLength: 0, maxLength: 20 }),
        deliveryFeeArbitrary,
        (items, deliveryFee) => {
          // Calculate totals using the component's function
          const totals = calculateCheckoutTotals(items, deliveryFee);

          // Calculate expected subtotal
          const expectedSubtotal = items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );

          // Calculate expected total
          const expectedTotal = expectedSubtotal + deliveryFee;

          // Use tolerance for floating point comparison
          const tolerance = 0.01;

          // Verify subtotal calculation
          const subtotalCorrect = Math.abs(totals.subtotal - expectedSubtotal) < tolerance;

          // Verify delivery fee is passed through correctly
          const deliveryFeeCorrect = totals.deliveryFee === deliveryFee;

          // Verify total calculation: total = subtotal + deliveryFee
          const totalCorrect = Math.abs(totals.total - expectedTotal) < tolerance;

          return subtotalCorrect && deliveryFeeCorrect && totalCorrect;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Additional property: Empty cart should have zero subtotal
   */
  test('Property 11 (edge case): Empty cart has zero subtotal', () => {
    fc.assert(
      fc.property(deliveryFeeArbitrary, (deliveryFee) => {
        const totals = calculateCheckoutTotals([], deliveryFee);

        return (
          totals.subtotal === 0 &&
          totals.deliveryFee === deliveryFee &&
          totals.total === deliveryFee
        );
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Additional property: Total is always >= delivery fee
   */
  test('Property 11 (invariant): Total is always greater than or equal to delivery fee', () => {
    fc.assert(
      fc.property(
        fc.array(cartItemArbitrary, { minLength: 0, maxLength: 20 }),
        deliveryFeeArbitrary,
        (items, deliveryFee) => {
          const totals = calculateCheckoutTotals(items, deliveryFee);
          
          // Total should always be at least the delivery fee
          // (since subtotal is always >= 0 for valid items)
          return totals.total >= deliveryFee - 0.01; // tolerance for floating point
        }
      ),
      { numRuns: 100 }
    );
  });
});
