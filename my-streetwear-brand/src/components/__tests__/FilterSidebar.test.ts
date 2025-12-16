/**
 * Property-Based Tests for Filter Logic
 * 
 * **Feature: streetwear-enhancements, Property 4: Filter Application Consistency**
 * **Validates: Requirements 3.4**
 */

import * as fc from 'fast-check';
import { applyFilters, FilterState } from '../FilterSidebar';

// Type definitions for test products
type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
type Color = 'Black' | 'White' | 'Gray' | 'Navy' | 'Red' | 'Green';

interface TestVariant {
  size: string;
  color: string;
  stockQuantity: number;
}

interface TestProduct {
  basePrice: number;
  salePrice?: number;
  variants: TestVariant[];
}

// Arbitrary for generating product variants
const variantArbitrary: fc.Arbitrary<TestVariant> = fc.record({
  size: fc.constantFrom<Size>('XS', 'S', 'M', 'L', 'XL', 'XXL').map(s => s as string),
  color: fc.constantFrom<Color>('Black', 'White', 'Gray', 'Navy', 'Red', 'Green').map(c => c as string),
  stockQuantity: fc.integer({ min: 0, max: 100 }),
});

// Arbitrary for generating products
const productArbitrary: fc.Arbitrary<TestProduct> = fc.record({
  basePrice: fc.float({ min: Math.fround(1), max: Math.fround(1000), noNaN: true }),
  salePrice: fc.option(fc.float({ min: Math.fround(1), max: Math.fround(1000), noNaN: true }), { nil: undefined }),
  variants: fc.array(variantArbitrary, { minLength: 1, maxLength: 5 }),
});

// Arbitrary for generating filter state
const filterStateArbitrary: fc.Arbitrary<FilterState> = fc.record({
  priceRange: fc.tuple(
    fc.float({ min: Math.fround(0), max: Math.fround(500), noNaN: true }),
    fc.float({ min: Math.fround(500), max: Math.fround(1000), noNaN: true })
  ) as fc.Arbitrary<[number, number]>,
  sizes: fc.subarray(['XS', 'S', 'M', 'L', 'XL', 'XXL'] as string[]),
  colors: fc.subarray(['Black', 'White', 'Gray', 'Navy', 'Red', 'Green'] as string[]),
  availability: fc.constantFrom('all', 'in-stock', 'out-of-stock') as fc.Arbitrary<'all' | 'in-stock' | 'out-of-stock'>,
  sortBy: fc.constantFrom('newest', 'price-asc', 'price-desc', 'popular') as fc.Arbitrary<'newest' | 'price-asc' | 'price-desc' | 'popular'>,
});

describe('Filter Logic Property Tests', () => {
  /**
   * **Feature: streetwear-enhancements, Property 4: Filter Application Consistency**
   * **Validates: Requirements 3.4**
   * 
   * For any set of filter criteria applied to a product list, all displayed products
   * SHALL match all active filter conditions.
   */
  test('Property 4: Filter Application Consistency - all filtered products match all active filter conditions', () => {
    fc.assert(
      fc.property(
        fc.array(productArbitrary, { minLength: 0, maxLength: 20 }),
        filterStateArbitrary,
        (products, filters) => {
          const filteredProducts = applyFilters(products, filters);

          // Every filtered product must satisfy ALL filter conditions
          return filteredProducts.every((product) => {
            const price = product.salePrice ?? product.basePrice;

            // Check price range filter
            const matchesPrice = price >= filters.priceRange[0] && price <= filters.priceRange[1];
            if (!matchesPrice) return false;

            // Check size filter (if any sizes selected)
            if (filters.sizes.length > 0) {
              const productSizes = product.variants.map((v) => v.size);
              const matchesSize = filters.sizes.some((size) => productSizes.includes(size));
              if (!matchesSize) return false;
            }

            // Check color filter (if any colors selected)
            if (filters.colors.length > 0) {
              const productColors = product.variants.map((v) => v.color);
              const matchesColor = filters.colors.some((color) => productColors.includes(color));
              if (!matchesColor) return false;
            }

            // Check availability filter
            if (filters.availability !== 'all') {
              const totalStock = product.variants.reduce((sum, v) => sum + v.stockQuantity, 0);
              if (filters.availability === 'in-stock' && totalStock === 0) return false;
              if (filters.availability === 'out-of-stock' && totalStock > 0) return false;
            }

            return true;
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Additional property: Products excluded by filters should NOT match at least one filter condition
   */
  test('Property 4b: Excluded products fail at least one filter condition', () => {
    fc.assert(
      fc.property(
        fc.array(productArbitrary, { minLength: 1, maxLength: 20 }),
        filterStateArbitrary,
        (products, filters) => {
          const filteredProducts = applyFilters(products, filters);
          const excludedProducts = products.filter((p) => !filteredProducts.includes(p));

          // Every excluded product must fail at least one filter condition
          return excludedProducts.every((product) => {
            const price = product.salePrice ?? product.basePrice;

            // Check if fails price range
            const failsPrice = price < filters.priceRange[0] || price > filters.priceRange[1];
            if (failsPrice) return true;

            // Check if fails size filter
            if (filters.sizes.length > 0) {
              const productSizes = product.variants.map((v) => v.size);
              const failsSize = !filters.sizes.some((size) => productSizes.includes(size));
              if (failsSize) return true;
            }

            // Check if fails color filter
            if (filters.colors.length > 0) {
              const productColors = product.variants.map((v) => v.color);
              const failsColor = !filters.colors.some((color) => productColors.includes(color));
              if (failsColor) return true;
            }

            // Check if fails availability filter
            if (filters.availability !== 'all') {
              const totalStock = product.variants.reduce((sum, v) => sum + v.stockQuantity, 0);
              if (filters.availability === 'in-stock' && totalStock === 0) return true;
              if (filters.availability === 'out-of-stock' && totalStock > 0) return true;
            }

            return false;
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Empty filters should return all products
   */
  test('Empty filters return all products', () => {
    fc.assert(
      fc.property(
        fc.array(productArbitrary, { minLength: 0, maxLength: 20 }),
        (products) => {
          const emptyFilters: FilterState = {
            priceRange: [0, 10000],
            sizes: [],
            colors: [],
            availability: 'all',
            sortBy: 'newest',
          };

          const filteredProducts = applyFilters(products, emptyFilters);
          return filteredProducts.length === products.length;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Filter result is always a subset of original products
   */
  test('Filtered products are always a subset of original products', () => {
    fc.assert(
      fc.property(
        fc.array(productArbitrary, { minLength: 0, maxLength: 20 }),
        filterStateArbitrary,
        (products, filters) => {
          const filteredProducts = applyFilters(products, filters);
          
          // Result length should be <= original length
          if (filteredProducts.length > products.length) return false;
          
          // Every filtered product should exist in original
          return filteredProducts.every((fp) => products.includes(fp));
        }
      ),
      { numRuns: 100 }
    );
  });
});
