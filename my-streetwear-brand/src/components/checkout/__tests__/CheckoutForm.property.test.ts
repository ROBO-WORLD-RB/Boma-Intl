/**
 * Property-Based Tests for CheckoutForm Component
 * 
 * **Feature: checkout-flow, Property 12: Required Field Validation**
 * **Validates: Requirements 10.1**
 */

import * as fc from 'fast-check';
import { validateCheckoutForm } from '@/lib/validation';
import { GhanaRegion, TimeWindow, PaymentMethod } from '@/types/checkout';

// Valid Ghana regions for testing
const validRegions: GhanaRegion[] = [
  'greater-accra', 'ashanti', 'western', 'eastern', 'central',
  'volta', 'northern', 'upper-east', 'upper-west', 'bono',
  'bono-east', 'ahafo', 'savannah', 'north-east', 'oti', 'western-north',
];

// Valid time windows
const validTimeWindows: TimeWindow[] = ['morning', 'afternoon', 'evening', 'any'];

// Valid payment methods
const validPaymentMethods: PaymentMethod[] = ['cod', 'paystack'];

// Helper to generate non-whitespace strings
const nonWhitespaceString = (minLength: number, maxLength: number) =>
  fc.string({ minLength, maxLength }).filter((s) => s.trim().length >= minLength);

// Generate valid emails that pass Zod validation (more restrictive than fc.emailAddress)
const validEmailArbitrary = fc.tuple(
  fc.stringMatching(/^[a-z][a-z0-9]{1,10}$/),
  fc.constantFrom('gmail.com', 'yahoo.com', 'outlook.com', 'example.com')
).map(([local, domain]) => `${local}@${domain}`);

// Arbitrary for generating valid checkout form data
const validCheckoutFormArbitrary = fc.record({
  customerName: nonWhitespaceString(2, 100),
  phone: fc.constantFrom('+233201234567', '0201234567', '+233551234567', '0551234567'),
  email: fc.option(validEmailArbitrary, { nil: undefined }),
  deliveryDate: fc.integer({ min: 1, max: 14 }).map((days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }),
  timeWindow: fc.constantFrom(...validTimeWindows),
  address: fc.record({
    street: nonWhitespaceString(1, 200),
    city: nonWhitespaceString(1, 100),
    region: fc.constantFrom(...validRegions),
    directions: fc.option(fc.string({ maxLength: 500 }), { nil: undefined }),
    coordinates: fc.option(
      fc.record({
        lat: fc.float({ min: 4.5, max: 11.5, noNaN: true }),
        lng: fc.float({ min: -3.5, max: 1.5, noNaN: true }),
      }),
      { nil: undefined }
    ),
  }),
  paymentMethod: fc.constantFrom(...validPaymentMethods),
});

describe('CheckoutForm Property Tests', () => {
  /**
   * **Feature: checkout-flow, Property 12: Required Field Validation**
   * **Validates: Requirements 10.1**
   * 
   * For any checkout form submission with any required field 
   * (name, phone, street, city, region, deliveryDate) empty, 
   * the form validation SHALL fail and prevent submission.
   */
  describe('Property 12: Required Field Validation', () => {
    test('Valid form data passes validation', () => {
      fc.assert(
        fc.property(validCheckoutFormArbitrary, (formData) => {
          const result = validateCheckoutForm(formData);
          return result.success === true;
        }),
        { numRuns: 100 }
      );
    });

    test('Empty customerName fails validation', () => {
      fc.assert(
        fc.property(validCheckoutFormArbitrary, (formData) => {
          // Make customerName empty
          const invalidData = { ...formData, customerName: '' };
          const result = validateCheckoutForm(invalidData);
          return result.success === false;
        }),
        { numRuns: 100 }
      );
    });

    test('Single character customerName fails validation (min 2 chars)', () => {
      fc.assert(
        fc.property(validCheckoutFormArbitrary, (formData) => {
          // Make customerName single character
          const invalidData = { ...formData, customerName: 'A' };
          const result = validateCheckoutForm(invalidData);
          return result.success === false;
        }),
        { numRuns: 100 }
      );
    });

    test('Empty phone fails validation', () => {
      fc.assert(
        fc.property(validCheckoutFormArbitrary, (formData) => {
          // Make phone empty
          const invalidData = { ...formData, phone: '' };
          const result = validateCheckoutForm(invalidData);
          return result.success === false;
        }),
        { numRuns: 100 }
      );
    });

    test('Empty deliveryDate fails validation', () => {
      fc.assert(
        fc.property(validCheckoutFormArbitrary, (formData) => {
          // Make deliveryDate empty
          const invalidData = { ...formData, deliveryDate: '' };
          const result = validateCheckoutForm(invalidData);
          return result.success === false;
        }),
        { numRuns: 100 }
      );
    });

    test('Empty street address fails validation', () => {
      fc.assert(
        fc.property(validCheckoutFormArbitrary, (formData) => {
          // Make street empty
          const invalidData = {
            ...formData,
            address: { ...formData.address, street: '' },
          };
          const result = validateCheckoutForm(invalidData);
          return result.success === false;
        }),
        { numRuns: 100 }
      );
    });

    test('Empty city fails validation', () => {
      fc.assert(
        fc.property(validCheckoutFormArbitrary, (formData) => {
          // Make city empty
          const invalidData = {
            ...formData,
            address: { ...formData.address, city: '' },
          };
          const result = validateCheckoutForm(invalidData);
          return result.success === false;
        }),
        { numRuns: 100 }
      );
    });

    test('Empty region fails validation', () => {
      fc.assert(
        fc.property(validCheckoutFormArbitrary, (formData) => {
          // Make region empty
          const invalidData = {
            ...formData,
            address: { ...formData.address, region: '' },
          };
          const result = validateCheckoutForm(invalidData);
          return result.success === false;
        }),
        { numRuns: 100 }
      );
    });

    test('Invalid region fails validation', () => {
      fc.assert(
        fc.property(
          validCheckoutFormArbitrary,
          fc.string({ minLength: 1, maxLength: 50 }).filter(
            (s) => !validRegions.includes(s as GhanaRegion)
          ),
          (formData, invalidRegion) => {
            // Use invalid region
            const invalidData = {
              ...formData,
              address: { ...formData.address, region: invalidRegion },
            };
            const result = validateCheckoutForm(invalidData);
            return result.success === false;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('Any single required field being empty causes validation failure', () => {
      const requiredFields = [
        'customerName',
        'phone',
        'deliveryDate',
      ] as const;

      const addressRequiredFields = ['street', 'city', 'region'] as const;

      fc.assert(
        fc.property(
          validCheckoutFormArbitrary,
          fc.constantFrom(...requiredFields, ...addressRequiredFields.map(f => `address.${f}`)),
          (formData, fieldToEmpty) => {
            let invalidData: Record<string, unknown>;

            if (fieldToEmpty.startsWith('address.')) {
              const addressField = fieldToEmpty.replace('address.', '') as keyof typeof formData.address;
              invalidData = {
                ...formData,
                address: { ...formData.address, [addressField]: '' },
              };
            } else {
              invalidData = { ...formData, [fieldToEmpty]: '' };
            }

            const result = validateCheckoutForm(invalidData);
            return result.success === false;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
