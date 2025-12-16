/**
 * Property-Based Tests for Cart Clear on Confirmation
 * 
 * **Feature: checkout-flow, Property 17: Cart Clear on Confirmation**
 * **Validates: Requirements 7.8**
 */

import * as fc from 'fast-check';
import { useCartStore } from '@/store/cartStore';

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

describe('Cart Clear on Confirmation Property Tests', () => {
  beforeEach(() => {
    resetStore();
  });

  /**
   * **Feature: checkout-flow, Property 17: Cart Clear on Confirmation**
   * **Validates: Requirements 7.8**
   * 
   * For any successful order creation, after displaying the confirmation page,
   * the cart state SHALL be empty (0 items).
   */
  test('Property 17: Cart Clear on Confirmation - clearCart results in empty cart', () => {
    fc.assert(
      fc.property(
        fc.array(cartItemArbitrary, { minLength: 1, maxLength: 20 }),
        (items) => {
          resetStore();
          const store = useCartStore.getState();

          // Add items with unique productId+variantId combinations
          const uniqueItems = items.map((item, index) => ({
            ...item,
            productId: `${item.productId}-${index}`,
            variantId: `${item.variantId}-${index}`,
          }));

          // Add all items to cart
          uniqueItems.forEach((item) => {
            store.addItem(item);
          });

          // Verify cart has items before clearing
          const stateBeforeClear = useCartStore.getState();
          const hadItems = stateBeforeClear.items.length > 0;

          // Simulate order confirmation by clearing cart
          stateBeforeClear.clearCart();

          // Verify cart is empty after clearing
          const stateAfterClear = useCartStore.getState();
          const isEmpty = stateAfterClear.items.length === 0;
          const itemCountIsZero = stateAfterClear.itemCount() === 0;

          return hadItems && isEmpty && itemCountIsZero;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 17 (invariant): clearCart always results in zero items
   */
  test('Property 17 (invariant): clearCart always results in zero items regardless of initial state', () => {
    fc.assert(
      fc.property(
        fc.array(cartItemArbitrary, { minLength: 0, maxLength: 20 }),
        (items) => {
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

          // Clear cart
          useCartStore.getState().clearCart();

          // Verify cart is empty
          const finalState = useCartStore.getState();
          return (
            finalState.items.length === 0 &&
            finalState.itemCount() === 0 &&
            finalState.subtotal() === 0
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 17 (idempotence): Clearing an already empty cart keeps it empty
   */
  test('Property 17 (idempotence): Clearing empty cart keeps it empty', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 5 }), (clearCount) => {
        resetStore();

        // Clear cart multiple times
        for (let i = 0; i < clearCount; i++) {
          useCartStore.getState().clearCart();
        }

        // Verify cart is still empty
        const finalState = useCartStore.getState();
        return (
          finalState.items.length === 0 &&
          finalState.itemCount() === 0
        );
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property 17 (sequence): Add items then clear always results in empty cart
   */
  test('Property 17 (sequence): Any sequence of adds followed by clear results in empty cart', () => {
    fc.assert(
      fc.property(
        fc.array(cartItemArbitrary, { minLength: 1, maxLength: 10 }),
        fc.array(cartItemArbitrary, { minLength: 0, maxLength: 5 }),
        (firstBatch, secondBatch) => {
          resetStore();
          const store = useCartStore.getState();

          // Add first batch
          firstBatch.forEach((item, index) => {
            store.addItem({
              ...item,
              productId: `first-${item.productId}-${index}`,
              variantId: `first-${item.variantId}-${index}`,
            });
          });

          // Add second batch
          secondBatch.forEach((item, index) => {
            useCartStore.getState().addItem({
              ...item,
              productId: `second-${item.productId}-${index}`,
              variantId: `second-${item.variantId}-${index}`,
            });
          });

          // Clear cart (simulating order confirmation)
          useCartStore.getState().clearCart();

          // Verify cart is empty
          const finalState = useCartStore.getState();
          return finalState.items.length === 0;
        }
      ),
      { numRuns: 100 }
    );
  });
});
