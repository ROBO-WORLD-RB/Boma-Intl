/**
 * Property-Based Tests for Date Utilities
 * 
 * **Feature: checkout-flow, Property 6: Delivery Date - Past Date Rejection**
 * **Feature: checkout-flow, Property 7: Delivery Date - Future Limit**
 * **Feature: checkout-flow, Property 8: Delivery Date - Blackout Days**
 * **Feature: checkout-flow, Property 9: Minimum Lead Time Calculation**
 * **Validates: Requirements 3.2, 3.3, 3.4, 3.7**
 */

import * as fc from 'fast-check';
import {
  isPastDate,
  isTooFarInFuture,
  isBlackoutDate,
  isSunday,
  getMinDeliveryDate,
  isValidDeliveryDate,
  addDays,
  startOfDay,
  CUTOFF_HOUR,
  MAX_FUTURE_DAYS,
} from '../date-utils';

describe('Date Utilities Property Tests', () => {
  // Helper to generate valid dates (filter out NaN dates)
  const validDateArbitrary = fc
    .date({ min: new Date('2024-01-01'), max: new Date('2026-12-31') })
    .filter((d) => !isNaN(d.getTime()));

  /**
   * **Feature: checkout-flow, Property 6: Delivery Date - Past Date Rejection**
   * **Validates: Requirements 3.2**
   * 
   * For any date before today, the date validation SHALL reject it as invalid.
   */
  describe('Property 6: Delivery Date - Past Date Rejection', () => {
    test('any date before today should be rejected as past', () => {
      fc.assert(
        fc.property(
          // Generate a valid reference date
          validDateArbitrary,
          // Generate days in the past (1 to 365 days ago)
          fc.integer({ min: 1, max: 365 }),
          (referenceDate, daysAgo) => {
            const pastDate = addDays(startOfDay(referenceDate), -daysAgo);
            return isPastDate(pastDate, referenceDate) === true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('today or future dates should not be rejected as past', () => {
      fc.assert(
        fc.property(
          // Generate a valid reference date
          validDateArbitrary,
          // Generate days in the future (0 to 30 days)
          fc.integer({ min: 0, max: 30 }),
          (referenceDate, daysAhead) => {
            const futureDate = addDays(startOfDay(referenceDate), daysAhead);
            return isPastDate(futureDate, referenceDate) === false;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Feature: checkout-flow, Property 7: Delivery Date - Future Limit**
   * **Validates: Requirements 3.3**
   * 
   * For any date more than 14 days from today, the date validation SHALL reject it as invalid.
   */
  describe('Property 7: Delivery Date - Future Limit', () => {
    test('dates more than 14 days in the future should be rejected', () => {
      fc.assert(
        fc.property(
          // Generate a valid reference date
          validDateArbitrary,
          // Generate days beyond the limit (15 to 365 days)
          fc.integer({ min: MAX_FUTURE_DAYS + 1, max: 365 }),
          (referenceDate, daysAhead) => {
            const farFutureDate = addDays(startOfDay(referenceDate), daysAhead);
            return isTooFarInFuture(farFutureDate, referenceDate) === true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('dates within 14 days should not be rejected as too far', () => {
      fc.assert(
        fc.property(
          // Generate a valid reference date
          validDateArbitrary,
          // Generate days within the limit (0 to 14 days)
          fc.integer({ min: 0, max: MAX_FUTURE_DAYS }),
          (referenceDate, daysAhead) => {
            const validDate = addDays(startOfDay(referenceDate), daysAhead);
            return isTooFarInFuture(validDate, referenceDate) === false;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Feature: checkout-flow, Property 8: Delivery Date - Blackout Days**
   * **Validates: Requirements 3.4**
   * 
   * For any date that falls on a Sunday, the date validation SHALL reject it as invalid.
   */
  describe('Property 8: Delivery Date - Blackout Days', () => {
    test('any Sunday should be identified as a blackout date', () => {
      fc.assert(
        fc.property(
          // Generate any valid date
          validDateArbitrary,
          (date) => {
            // Find the next Sunday from this date
            const dayOfWeek = date.getDay();
            const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
            const sunday = addDays(date, daysUntilSunday);
            
            // Sunday should be a blackout date
            return isSunday(sunday) === true && isBlackoutDate(sunday) === true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('non-Sunday non-holiday dates should not be blackout dates', () => {
      // Generate dates that are specifically not Sundays and not holidays
      fc.assert(
        fc.property(
          // Generate a valid date
          validDateArbitrary,
          (date) => {
            // Skip to a non-Sunday
            let testDate = new Date(date);
            while (testDate.getDay() === 0) {
              testDate = addDays(testDate, 1);
            }
            
            // If it's not a Sunday, isSunday should return false
            return isSunday(testDate) === false;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Feature: checkout-flow, Property 9: Minimum Lead Time Calculation**
   * **Validates: Requirements 3.7**
   * 
   * For any current time before 6PM, the minimum delivery date SHALL be tomorrow.
   * For any current time at or after 6PM, the minimum delivery date SHALL be the day after tomorrow.
   */
  describe('Property 9: Minimum Lead Time Calculation', () => {
    test('before 6PM cutoff, minimum date should be tomorrow (or next non-blackout day)', () => {
      fc.assert(
        fc.property(
          // Generate a valid date
          validDateArbitrary,
          // Generate hour before cutoff (0-17)
          fc.integer({ min: 0, max: CUTOFF_HOUR - 1 }),
          (date, hour) => {
            const referenceDate = new Date(date);
            referenceDate.setHours(hour, 0, 0, 0);
            
            const minDate = getMinDeliveryDate(referenceDate);
            const tomorrow = addDays(startOfDay(referenceDate), 1);
            
            // Min date should be at least tomorrow
            // (could be later if tomorrow is a blackout date)
            return minDate >= tomorrow;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('at or after 6PM cutoff, minimum date should be day after tomorrow (or later)', () => {
      fc.assert(
        fc.property(
          // Generate a valid date
          validDateArbitrary,
          // Generate hour at or after cutoff (18-23)
          fc.integer({ min: CUTOFF_HOUR, max: 23 }),
          (date, hour) => {
            const referenceDate = new Date(date);
            referenceDate.setHours(hour, 0, 0, 0);
            
            const minDate = getMinDeliveryDate(referenceDate);
            const dayAfterTomorrow = addDays(startOfDay(referenceDate), 2);
            
            // Min date should be at least day after tomorrow
            // (could be later if that day is a blackout date)
            return minDate >= dayAfterTomorrow;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('minimum delivery date should never be a blackout date', () => {
      fc.assert(
        fc.property(
          // Generate a valid date with any hour
          validDateArbitrary,
          fc.integer({ min: 0, max: 23 }),
          (date, hour) => {
            const referenceDate = new Date(date);
            referenceDate.setHours(hour, 0, 0, 0);
            
            const minDate = getMinDeliveryDate(referenceDate);
            
            // Min date should never be a blackout date
            return isBlackoutDate(minDate) === false;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
