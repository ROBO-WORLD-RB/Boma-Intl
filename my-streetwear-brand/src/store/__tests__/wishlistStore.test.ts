/**
 * Property-Based Tests for Wishlist Store
 * 
 * **Feature: streetwear-enhancements, Property 5: Wishlist Toggle Idempotence**
 * **Validates: Requirements 5.2**
 */

import * as fc from 'fast-check';
import { useWishlistStore } from '../wishlistStore';

// Helper to reset store between tests
const resetStore = () => {
  useWishlistStore.setState({ items: [] });
};

describe('Wishlist Store Property Tests', () => {
  beforeEach(() => {
    resetStore();
  });

  /**
   * **Feature: streetwear-enhancements, Property 5: Wishlist Toggle Idempotence**
   * **Validates: Requirements 5.2**
   * 
   * For any product, adding to wishlist twice SHALL result in the same state
   * as adding once (item present).
   */
  test('Property 5: Wishlist Toggle Idempotence - adding twice equals adding once', () => {
    fc.assert(
      fc.property(fc.uuid(), (productId) => {
        resetStore();
        const store = useWishlistStore.getState();

        // Add item once
        store.addItem(productId);
        const stateAfterFirstAdd = useWishlistStore.getState();
        const itemsAfterFirstAdd = stateAfterFirstAdd.items.length;
        const isInWishlistAfterFirstAdd = stateAfterFirstAdd.isInWishlist(productId);

        // Add same item again
        store.addItem(productId);
        const stateAfterSecondAdd = useWishlistStore.getState();
        const itemsAfterSecondAdd = stateAfterSecondAdd.items.length;
        const isInWishlistAfterSecondAdd = stateAfterSecondAdd.isInWishlist(productId);

        // Both should have same result - item present, count unchanged
        return (
          itemsAfterFirstAdd === itemsAfterSecondAdd &&
          isInWishlistAfterFirstAdd === true &&
          isInWishlistAfterSecondAdd === true &&
          itemsAfterFirstAdd === 1
        );
      }),
      { numRuns: 100 }
    );
  });

  test('Wishlist add then remove results in empty wishlist', () => {
    fc.assert(
      fc.property(fc.uuid(), (productId) => {
        resetStore();
        const store = useWishlistStore.getState();

        store.addItem(productId);
        store.removeItem(productId);

        const finalState = useWishlistStore.getState();
        return (
          finalState.items.length === 0 &&
          finalState.isInWishlist(productId) === false
        );
      }),
      { numRuns: 100 }
    );
  });
});
