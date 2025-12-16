import { z } from 'zod';

// Auth validators
export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

// Product validators
export const createProductSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
  description: z.string().optional(),
  basePrice: z.number().positive('Price must be positive'),
  isActive: z.boolean().optional().default(true),
  variants: z.array(z.object({
    size: z.enum(['XS', 'S', 'M', 'L', 'XL', 'XXL']),
    color: z.string().min(1),
    stockQuantity: z.number().int().min(0),
    priceOverride: z.number().positive().optional(),
    sku: z.string().min(1),
  })).min(1, 'At least one variant is required'),
  images: z.array(z.object({
    url: z.string().url('Invalid image URL'),
    isMain: z.boolean().optional().default(false),
    altText: z.string().optional(),
  })).optional(),
});

// Order validators
const shippingAddressSchema = z.object({
  fullName: z.string().min(1),
  street: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().min(1),
  phone: z.string().min(1),
});

export const createOrderSchema = z.object({
  items: z.array(z.object({
    variantId: z.string().min(1),
    quantity: z.number().int().positive(),
  })).min(1, 'At least one item is required'),
  shippingAddress: shippingAddressSchema,
});

// Ghana regions for delivery
const ghanaRegions = [
  'greater-accra', 'ashanti', 'western', 'eastern', 'central',
  'volta', 'northern', 'upper-east', 'upper-west', 'bono',
  'bono-east', 'ahafo', 'savannah', 'north-east', 'oti', 'western-north'
] as const;

// Guest checkout shipping address schema
const guestShippingAddressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  region: z.enum(ghanaRegions, { errorMap: () => ({ message: 'Please select a valid Ghana region' }) }),
  directions: z.string().optional(),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }).optional(),
});

// Time window options
const timeWindowSchema = z.enum(['morning', 'afternoon', 'evening', 'any']).default('any');

// Payment method options
const paymentMethodSchema = z.enum(['cod', 'paystack']).default('cod');

// Ghana phone number validation (supports +233 or 0 prefix)
const ghanaPhoneSchema = z.string()
  .refine(
    (val) => /^(\+233|0)[0-9]{9}$/.test(val),
    { message: 'Please enter a valid Ghana phone number (+233XXXXXXXXX or 0XXXXXXXXX)' }
  );

// Guest order schema
export const createGuestOrderSchema = z.object({
  items: z.array(z.object({
    variantId: z.string().min(1, 'Variant ID is required'),
    quantity: z.number().int().positive('Quantity must be at least 1'),
  })).min(1, 'At least one item is required'),
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  customerPhone: ghanaPhoneSchema,
  customerEmail: z.string().email('Invalid email format').optional().or(z.literal('')),
  deliveryDate: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    { message: 'Invalid delivery date format' }
  ),
  timeWindow: timeWindowSchema,
  shippingAddress: guestShippingAddressSchema,
  paymentMethod: paymentMethodSchema,
});

// Order lookup schema for guests
export const orderLookupSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  phone: ghanaPhoneSchema,
});

// Update product schema (partial)
export const updateProductSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200).optional(),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only').optional(),
  description: z.string().optional().nullable(),
  basePrice: z.number().positive('Price must be positive').optional(),
  isActive: z.boolean().optional(),
});

// Update order status schema
export const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
  trackingNumber: z.string().optional(),
  trackingUrl: z.string().url('Invalid tracking URL').optional(),
});
