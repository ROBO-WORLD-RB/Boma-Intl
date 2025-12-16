/**
 * Form Validation Schemas
 * Zod schemas for checkout form validation
 * 
 * Requirements: 2.4, 2.5, 2.6, 4.1, 4.2, 4.3, 4.4
 */

import { z } from 'zod';
import { GHANA_REGIONS, type GhanaRegion, type TimeWindow, type PaymentMethod } from '@/types/checkout';

/**
 * Ghana phone number regex pattern
 * Accepts formats: +233XXXXXXXXX or 0XXXXXXXXX (9 digits after prefix)
 * 
 * Requirements: 2.5
 */
export const GHANA_PHONE_REGEX = /^(\+233|0)[0-9]{9}$/;

/**
 * Validates customer name (minimum 2 characters)
 * 
 * Requirements: 2.4
 */
export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters');

/**
 * Validates Ghana phone number format
 * 
 * Requirements: 2.5
 */
export const phoneSchema = z
  .string()
  .regex(GHANA_PHONE_REGEX, 'Please enter a valid Ghana phone number (+233XXXXXXXXX or 0XXXXXXXXX)');

/**
 * Validates email (optional field)
 * Empty string or valid email format
 * 
 * Requirements: 2.3, 2.6
 */
export const emailSchema = z
  .string()
  .optional()
  .refine(
    (val) => !val || val === '' || z.string().email().safeParse(val).success,
    'Please enter a valid email address'
  );

/**
 * Validates Ghana region
 * 
 * Requirements: 4.3
 */
export const regionSchema = z.enum(GHANA_REGIONS as [GhanaRegion, ...GhanaRegion[]], {
  message: 'Please select a valid region',
});

/**
 * Validates delivery address
 * 
 * Requirements: 4.1, 4.2, 4.3, 4.4
 */
export const addressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  region: regionSchema,
  directions: z.string().optional(),
  coordinates: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
});

/**
 * Validates time window selection
 */
export const timeWindowSchema = z.enum(['morning', 'afternoon', 'evening', 'any'] as const);

/**
 * Validates payment method selection
 */
export const paymentMethodSchema = z.enum(['cod', 'paystack'] as const);

/**
 * Complete checkout form validation schema
 * 
 * Requirements: 2.4, 2.5, 2.6, 4.1, 4.2, 4.3, 4.4
 */
export const checkoutFormSchema = z.object({
  customerName: nameSchema,
  phone: phoneSchema,
  email: emailSchema,
  deliveryDate: z.string().min(1, 'Delivery date is required'),
  timeWindow: timeWindowSchema,
  address: addressSchema,
  paymentMethod: paymentMethodSchema,
});

/**
 * Type inference from schema
 */
export type CheckoutFormSchema = z.infer<typeof checkoutFormSchema>;

/**
 * Validation helper functions for individual fields
 */

/**
 * Validates a customer name
 * Returns true if valid, false otherwise
 */
export function validateName(name: string): boolean {
  return nameSchema.safeParse(name).success;
}

/**
 * Validates a Ghana phone number
 * Returns true if valid, false otherwise
 */
export function validatePhone(phone: string): boolean {
  return phoneSchema.safeParse(phone).success;
}

/**
 * Validates an email address (optional field)
 * Returns true if valid (including empty/undefined), false otherwise
 */
export function validateEmail(email: string | undefined): boolean {
  return emailSchema.safeParse(email).success;
}

/**
 * Validates a Ghana region
 * Returns true if valid, false otherwise
 */
export function validateRegion(region: string): region is GhanaRegion {
  return regionSchema.safeParse(region).success;
}

/**
 * Validates the complete checkout form
 * Returns validation result with errors if any
 */
export function validateCheckoutForm(data: unknown): {
  success: boolean;
  data?: CheckoutFormSchema;
  errors?: z.ZodError;
} {
  const result = checkoutFormSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}
