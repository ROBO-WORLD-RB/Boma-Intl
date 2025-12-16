/**
 * Property-Based Tests for Breadcrumbs Component
 * 
 * **Feature: streetwear-enhancements, Property 7: Breadcrumb Path Validity**
 * **Validates: Requirements 10.4**
 */

import * as fc from 'fast-check';
import {
  isValidBreadcrumbItem,
  isValidBreadcrumbPath,
  generateBreadcrumbPath,
  BreadcrumbItem,
} from '../Breadcrumbs';

describe('Breadcrumbs Property Tests', () => {
  /**
   * **Feature: streetwear-enhancements, Property 7: Breadcrumb Path Validity**
   * **Validates: Requirements 10.4**
   * 
   * For any page with breadcrumbs, each breadcrumb link SHALL navigate to a valid page.
   */
  describe('Property 7: Breadcrumb Path Validity', () => {
    // Arbitrary for valid breadcrumb items
    const validBreadcrumbItem = fc.record({
      label: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
      href: fc.option(
        fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
        { nil: undefined }
      ),
    });

    // Arbitrary for invalid breadcrumb items (empty label)
    const invalidLabelItem = fc.record({
      label: fc.constantFrom('', '   ', '\t', '\n'),
      href: fc.option(fc.string(), { nil: undefined }),
    });


    test('valid breadcrumb items have non-empty labels', () => {
      fc.assert(
        fc.property(validBreadcrumbItem, (item) => {
          return isValidBreadcrumbItem(item) === true;
        }),
        { numRuns: 100 }
      );
    });

    test('items with empty labels are invalid', () => {
      fc.assert(
        fc.property(invalidLabelItem, (item) => {
          return isValidBreadcrumbItem(item) === false;
        }),
        { numRuns: 100 }
      );
    });

    test('items with empty href strings are invalid', () => {
      fc.assert(
        fc.property(
          fc.record({
            label: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
            href: fc.constantFrom('', '   ', '\t'),
          }),
          (item) => {
            return isValidBreadcrumbItem(item) === false;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('valid paths contain only valid items', () => {
      fc.assert(
        fc.property(
          fc.array(validBreadcrumbItem, { minLength: 1, maxLength: 5 }),
          (items) => {
            return isValidBreadcrumbPath(items) === true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('empty paths are invalid', () => {
      expect(isValidBreadcrumbPath([])).toBe(false);
    });

    test('paths with any invalid item are invalid', () => {
      fc.assert(
        fc.property(
          fc.array(validBreadcrumbItem, { minLength: 0, maxLength: 3 }),
          invalidLabelItem,
          fc.array(validBreadcrumbItem, { minLength: 0, maxLength: 3 }),
          (before, invalid, after) => {
            const items = [...before, invalid, ...after];
            return isValidBreadcrumbPath(items) === false;
          }
        ),
        { numRuns: 100 }
      );
    });


    test('generateBreadcrumbPath always starts with Home', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              label: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
              slug: fc.option(
                fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
                { nil: undefined }
              ),
            }),
            { minLength: 0, maxLength: 5 }
          ),
          (segments) => {
            const path = generateBreadcrumbPath(segments);
            return path.length > 0 && path[0].label === 'Home' && path[0].href === '/';
          }
        ),
        { numRuns: 100 }
      );
    });

    test('generateBreadcrumbPath last item has no href', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              label: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
              slug: fc.option(
                fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
                { nil: undefined }
              ),
            }),
            { minLength: 1, maxLength: 5 }
          ),
          (segments) => {
            const path = generateBreadcrumbPath(segments);
            const lastItem = path[path.length - 1];
            return lastItem.href === undefined;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('generated paths are always valid', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              label: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
              slug: fc.option(
                fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
                { nil: undefined }
              ),
            }),
            { minLength: 0, maxLength: 5 }
          ),
          (segments) => {
            const path = generateBreadcrumbPath(segments);
            return isValidBreadcrumbPath(path);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
