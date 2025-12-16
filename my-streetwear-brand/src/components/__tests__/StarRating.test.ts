/**
 * Property-Based Tests for StarRating Component
 * 
 * **Feature: streetwear-enhancements, Property 6: Review Rating Bounds**
 * **Validates: Requirements 6.4**
 */

import * as fc from 'fast-check';
import { clampRating, isValidRating } from '../StarRating';

describe('StarRating Property Tests', () => {
  /**
   * **Feature: streetwear-enhancements, Property 6: Review Rating Bounds**
   * **Validates: Requirements 6.4**
   * 
   * For any review submission, the rating value SHALL be between 1 and 5 inclusive.
   */
  describe('Property 6: Review Rating Bounds', () => {
    test('clampRating always returns a value between 0 and maxRating', () => {
      fc.assert(
        fc.property(
          fc.double({ min: -1000, max: 1000, noNaN: true }),
          fc.integer({ min: 1, max: 10 }),
          (inputRating, maxRating) => {
            const result = clampRating(inputRating, maxRating);
            
            // Result should be 0 (no rating) or between 1 and maxRating
            return result === 0 || (result >= 1 && result <= maxRating);
          }
        ),
        { numRuns: 100 }
      );
    });

    test('clampRating returns 0 for non-positive inputs', () => {
      fc.assert(
        fc.property(
          fc.double({ min: -1000, max: 0, noNaN: true }),
          (inputRating) => {
            const result = clampRating(inputRating, 5);
            return result === 0;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('clampRating caps values exceeding maxRating', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 10 }),
          fc.integer({ min: 1, max: 100 }),
          (maxRating, excess) => {
            const inputRating = maxRating + excess;
            const result = clampRating(inputRating, maxRating);
            return result === maxRating;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('isValidRating returns true only for integers in [1, 5] range', () => {
      fc.assert(
        fc.property(
          fc.double({ min: -100, max: 100, noNaN: true }),
          (inputRating) => {
            const result = isValidRating(inputRating, 1, 5);
            
            // Should be true only if input is an integer between 1 and 5
            const expectedValid = Number.isInteger(inputRating) && inputRating >= 1 && inputRating <= 5;
            return result === expectedValid;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('valid ratings (1-5) pass validation', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 5 }),
          (rating) => {
            return isValidRating(rating, 1, 5) === true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('ratings outside bounds fail validation', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.integer({ min: -100, max: 0 }),
            fc.integer({ min: 6, max: 100 })
          ),
          (rating) => {
            return isValidRating(rating, 1, 5) === false;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('clampRating rounds to nearest integer for valid range inputs', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.5, max: 5.4, noNaN: true }),
          (inputRating) => {
            const result = clampRating(inputRating, 5);
            // Result should be an integer
            return Number.isInteger(result);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
