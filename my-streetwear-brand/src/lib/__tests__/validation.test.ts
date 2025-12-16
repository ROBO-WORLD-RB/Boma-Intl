/**
 * Property-Based Tests for Checkout Validation
 * 
 * **Feature: checkout-flow, Property 3: Customer Name Validation**
 * **Feature: checkout-flow, Property 4: Ghana Phone Number Validation**
 * **Feature: checkout-flow, Property 5: Email Validation (Optional Field)**
 * **Validates: Requirements 2.3, 2.4, 2.5, 2.6**
 */

import * as fc from 'fast-check';
import { validateName, validatePhone, validateEmail, GHANA_PHONE_REGEX } from '../validation';

describe('Checkout Validation Property Tests', () => {
  /**
   * **Feature: checkout-flow, Property 3: Customer Name Validation**
   * **Validates: Requirements 2.4**
   * 
   * For any string with length less than 2 characters, the name validation SHALL fail.
   * For any string with length >= 2 characters, the name validation SHALL pass.
   */
  describe('Property 3: Customer Name Validation', () => {
    test('names with less than 2 characters should fail validation', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 0, maxLength: 1 }),
          (name) => {
            return validateName(name) === false;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('names with 2 or more characters should pass validation', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 2, maxLength: 100 }),
          (name) => {
            return validateName(name) === true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Feature: checkout-flow, Property 4: Ghana Phone Number Validation**
   * **Validates: Requirements 2.5**
   * 
   * For any string matching the pattern ^(\+233|0)[0-9]{9}$, the phone validation SHALL pass.
   * For any string not matching this pattern, the phone validation SHALL fail.
   */
  describe('Property 4: Ghana Phone Number Validation', () => {
    // Helper to generate 9 random digits
    const nineDigitsArbitrary = fc.array(
      fc.constantFrom('0', '1', '2', '3', '4', '5', '6', '7', '8', '9'),
      { minLength: 9, maxLength: 9 }
    ).map(arr => arr.join(''));

    // Arbitrary for valid Ghana phone numbers
    const validGhanaPhoneArbitrary = fc.oneof(
      // +233 format: +233 followed by 9 digits
      nineDigitsArbitrary.map(digits => '+233' + digits),
      // 0 format: 0 followed by 9 digits
      nineDigitsArbitrary.map(digits => '0' + digits)
    );

    test('valid Ghana phone numbers should pass validation', () => {
      fc.assert(
        fc.property(validGhanaPhoneArbitrary, (phone) => {
          return validatePhone(phone) === true;
        }),
        { numRuns: 100 }
      );
    });

    // Arbitrary for invalid phone numbers
    const invalidPhoneArbitrary = fc.oneof(
      // Too short (less than 10 digits total)
      fc.array(
        fc.constantFrom('0', '1', '2', '3', '4', '5', '6', '7', '8', '9'),
        { minLength: 1, maxLength: 9 }
      ).map(arr => arr.join('')),
      // Wrong prefix with 9 digits
      fc.tuple(
        fc.constantFrom('+234', '+1', '1', '00'),
        nineDigitsArbitrary
      ).map(([prefix, digits]) => prefix + digits),
      // Empty string
      fc.constant('')
    );

    test('invalid phone numbers should fail validation', () => {
      fc.assert(
        fc.property(invalidPhoneArbitrary, (phone) => {
          return validatePhone(phone) === false;
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Feature: checkout-flow, Property 5: Email Validation (Optional Field)**
   * **Validates: Requirements 2.3, 2.6**
   * 
   * For any empty string or undefined value, the email validation SHALL pass.
   * For any non-empty string matching valid email format, the validation SHALL pass.
   * For any non-empty string not matching email format, the validation SHALL fail.
   */
  describe('Property 5: Email Validation (Optional Field)', () => {
    test('empty or undefined email should pass validation', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('', undefined),
          (email) => {
            return validateEmail(email) === true;
          }
        ),
        { numRuns: 10 }
      );
    });

    // Helper to generate alphanumeric strings
    const alphanumericChars = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('');
    const alphanumericStringArbitrary = (minLen: number, maxLen: number) =>
      fc.array(fc.constantFrom(...alphanumericChars), { minLength: minLen, maxLength: maxLen })
        .map(arr => arr.join(''));

    // Arbitrary for valid email addresses
    const validEmailArbitrary = fc.tuple(
      alphanumericStringArbitrary(1, 20),
      fc.constantFrom('gmail.com', 'yahoo.com', 'outlook.com', 'example.org', 'test.co.uk')
    ).map(([local, domain]) => `${local}@${domain}`);

    test('valid email addresses should pass validation', () => {
      fc.assert(
        fc.property(validEmailArbitrary, (email) => {
          return validateEmail(email) === true;
        }),
        { numRuns: 100 }
      );
    });

    // Arbitrary for invalid email addresses (non-empty strings without @ or invalid format)
    const invalidEmailArbitrary = fc.oneof(
      // No @ symbol
      alphanumericStringArbitrary(1, 20),
      // @ but no domain
      alphanumericStringArbitrary(1, 10).map(s => `${s}@`),
      // @ but no local part
      fc.constantFrom('gmail.com', 'yahoo.com').map(d => `@${d}`),
      // Multiple @ symbols
      fc.tuple(
        alphanumericStringArbitrary(1, 5),
        alphanumericStringArbitrary(1, 5),
        fc.constantFrom('gmail.com', 'yahoo.com')
      ).map(([a, b, d]) => `${a}@${b}@${d}`)
    );

    test('invalid email addresses should fail validation', () => {
      fc.assert(
        fc.property(invalidEmailArbitrary, (email) => {
          return validateEmail(email) === false;
        }),
        { numRuns: 100 }
      );
    });
  });
});
