import * as fc from 'fast-check';
import {
  calculateDeliveryFee,
  DELIVERY_FEES,
  DEFAULT_DELIVERY_FEE,
  GHANA_REGIONS,
  GhanaRegion,
  isValidGhanaRegion,
  getDeliveryFeeFromAddress,
} from '../delivery-calculator';

/**
 * Property-Based Tests for Delivery Fee Calculator
 * 
 * **Feature: checkout-flow, Property 10: Delivery Fee by Region**
 * **Validates: Requirements 5.3**
 * 
 * Property: For any valid Ghana region, the calculated delivery fee 
 * SHALL match the predefined fee for that region.
 */
describe('Delivery Fee Calculator - Property Tests', () => {
  // Arbitrary for valid Ghana regions
  const ghanaRegionArb = fc.constantFrom(...GHANA_REGIONS);

  // Arbitrary for invalid region strings (not in GHANA_REGIONS)
  const invalidRegionArb = fc.string().filter(
    (s) => !GHANA_REGIONS.includes(s as GhanaRegion)
  );

  describe('Property 10: Delivery Fee by Region', () => {
    it('should return the predefined fee for any valid Ghana region', () => {
      fc.assert(
        fc.property(ghanaRegionArb, (region) => {
          const fee = calculateDeliveryFee(region);
          const expectedFee = DELIVERY_FEES[region];
          return fee === expectedFee;
        }),
        { numRuns: 100 }
      );
    });

    it('should return default fee for any invalid region string', () => {
      fc.assert(
        fc.property(invalidRegionArb, (region) => {
          const fee = calculateDeliveryFee(region);
          return fee === DEFAULT_DELIVERY_FEE;
        }),
        { numRuns: 100 }
      );
    });

    it('should always return a positive number for any region', () => {
      fc.assert(
        fc.property(fc.string(), (region) => {
          const fee = calculateDeliveryFee(region);
          return typeof fee === 'number' && fee > 0;
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('isValidGhanaRegion', () => {
    it('should return true for all valid Ghana regions', () => {
      fc.assert(
        fc.property(ghanaRegionArb, (region) => {
          return isValidGhanaRegion(region) === true;
        }),
        { numRuns: 100 }
      );
    });

    it('should return false for invalid region strings', () => {
      fc.assert(
        fc.property(invalidRegionArb, (region) => {
          return isValidGhanaRegion(region) === false;
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('getDeliveryFeeFromAddress', () => {
    it('should extract region and calculate correct fee', () => {
      fc.assert(
        fc.property(ghanaRegionArb, (region) => {
          const address = { region };
          const fee = getDeliveryFeeFromAddress(address);
          return fee === DELIVERY_FEES[region];
        }),
        { numRuns: 100 }
      );
    });

    it('should return default fee when region is missing', () => {
      const fee = getDeliveryFeeFromAddress({});
      expect(fee).toBe(DEFAULT_DELIVERY_FEE);
    });
  });
});

describe('Delivery Fee Calculator - Unit Tests', () => {
  it('should have fees defined for all 16 Ghana regions', () => {
    expect(GHANA_REGIONS.length).toBe(16);
    GHANA_REGIONS.forEach((region) => {
      expect(DELIVERY_FEES[region]).toBeDefined();
      expect(typeof DELIVERY_FEES[region]).toBe('number');
    });
  });

  it('should have Greater Accra as the cheapest region', () => {
    const greaterAccraFee = DELIVERY_FEES['greater-accra'];
    const allFees = Object.values(DELIVERY_FEES);
    const minFee = Math.min(...allFees);
    expect(greaterAccraFee).toBe(minFee);
  });
});
