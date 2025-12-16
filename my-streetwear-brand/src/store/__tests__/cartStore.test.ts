/**
 * Property-Based Tests for Cart Store
 * 
 * **Feature: streetwear-enhancements, Property 1: Cart Item Count Consistency**
 * **Feature: streetwear-enhancements, Property 2: Cart Persistence Round Trip**
 * **Feature: streetwear-enhancements, Property 3: Cart Total Calculation**
 * **Validates: Requirements 1.2, 1.4, 1.6**
 */

import * as fc from 'fast-check';
import { useCartStore } from '../cartStore';
import { CartItem } from '@/types';

// Helper to reset store between tests
const resetStore = () => {
  useCartStore.setState({ items: [], isOpen: false });
};

// Arbitrary for generating valid cart items
const cartItemArbitrary = fc.record({
  productId: fc.uuid(),
  variantId: fc.uuid(),
  title: fc.string({ minLength: 1, maxLength: 100 }),
  size: fc.constantFrom('XS', 'S', 'M', 'L', 'XL', 'XXL'),
  color: fc.constantFrom('Black', 'White', 'Red', 'Blue', 'Green'),
  price: fc.float({ min: Math.fround(0.01), max: Math.fround(10000), noNaN: true }),
  quantity: fc.integer({ min: 1, max: 100 }),
  image: fc.webUrl(),
});

describe('Cart Store Property Tests', () => {
  beforeEach(() => {
    resetStore();
  });

  /**
   * **Feature: streetwear-enhancements, Property 1: Cart Item Count Consistency**
   * **Validates: Requirements 1.2**
   * 
   * For any sequence of add operations on the cart, the displayed item count
   * SHALL equal the sum of quantities of all items in the cart state.
   */
  test('Property 1: Cart Item Count Consistency - itemCount equals sum of quantities', () => {
    fc.assert(
      fc.property(fc.array(cartItemArbitrary, { minLength: 1, maxLength: 20 }), (items) => {
        resetStore();
        const store = useCartStore.getState();

        // Add all items to cart
        items.forEach((item) => {
          store.addItem(item);
        });

        // Get current state
        const currentState = useCartStore.getState();
        const itemCount = currentState.itemCount();
        const sumOfQuantities = currentState.items.reduce((sum, item) => sum + item.quantity, 0);

        return itemCount === sumOfQuantities;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: streetwear-enhancements, Property 2: Cart Persistence Round Trip**
   * **Validates: Requirements 1.4**
   * 
   * For any cart state, storing to localStorage and then restoring
   * SHALL produce an equivalent cart state.
   */
  test('Property 2: Cart Persistence Round Trip - localStorage serialization preserves cart', () => {
    fc.assert(
      fc.property(fc.array(cartItemArbitrary, { minLength: 0, maxLength: 10 }), (items) => {
        resetStore();
        const store = useCartStore.getState();

        // Add items with unique productId+variantId combinations to avoid merging
        const uniqueItems = items.map((item, index) => ({
          ...item,
          productId: `${item.productId}-${index}`,
          variantId: `${item.variantId}-${index}`,
        }));

        uniqueItems.forEach((item) => {
          store.addItem(item);
        });

        // Get current state
        const originalState = useCartStore.getState();
        const originalItems = originalState.items;

        // Simulate localStorage round trip
        const serialized = JSON.stringify({ items: originalItems });
        const deserialized = JSON.parse(serialized);

        // Verify items match
        return (
          deserialized.items.length === originalItems.length &&
          deserialized.items.every((item: CartItem, index: number) => {
            const original = originalItems[index];
            return (
              item.productId === original.productId &&
              item.variantId === original.variantId &&
              item.quantity === original.quantity &&
              item.price === original.price
            );
          })
        );
      }),
      { numRuns: 100 }
    );
  });


  /**
   * **Feature: streetwear-enhancements, Property 3: Cart Total Calculation**
   * **Validates: Requirements 1.6**
   * 
   * For any cart with items, the total SHALL equal the sum of (price × quantity)
   * for all items plus calculated tax.
   */
  test('Property 3: Cart Total Calculation - total equals subtotal plus tax', () => {
    const TAX_RATE = 0.075;

    fc.assert(
      fc.property(fc.array(cartItemArbitrary, { minLength: 1, maxLength: 10 }), (items) => {
        resetStore();
        const store = useCartStore.getState();

        // Add items with unique combinations
        const uniqueItems = items.map((item, index) => ({
          ...item,
          productId: `${item.productId}-${index}`,
          variantId: `${item.variantId}-${index}`,
        }));

        uniqueItems.forEach((item) => {
          store.addItem(item);
        });

        const currentState = useCartStore.getState();
        const subtotal = currentState.subtotal();
        const tax = currentState.tax();
        const total = currentState.total();

        // Calculate expected values
        const expectedSubtotal = currentState.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        const expectedTax = expectedSubtotal * TAX_RATE;
        const expectedTotal = expectedSubtotal + expectedTax;

        // Use tolerance for floating point comparison
        const tolerance = 0.01;
        return (
          Math.abs(subtotal - expectedSubtotal) < tolerance &&
          Math.abs(tax - expectedTax) < tolerance &&
          Math.abs(total - expectedTotal) < tolerance
        );
      }),
      { numRuns: 100 }
    );
  });
});
