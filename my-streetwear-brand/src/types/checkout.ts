/**
 * Checkout Types
 * Type definitions for the checkout flow
 * 
 * Requirements: 4.3
 */

import { CartItem } from './index';

/**
 * All 16 Ghana regions for delivery address
 */
export type GhanaRegion =
  | 'greater-accra'
  | 'ashanti'
  | 'western'
  | 'eastern'
  | 'central'
  | 'volta'
  | 'northern'
  | 'upper-east'
  | 'upper-west'
  | 'bono'
  | 'bono-east'
  | 'ahafo'
  | 'savannah'
  | 'north-east'
  | 'oti'
  | 'western-north';

/**
 * List of all valid Ghana regions
 */
export const GHANA_REGIONS: GhanaRegion[] = [
  'greater-accra',
  'ashanti',
  'western',
  'eastern',
  'central',
  'volta',
  'northern',
  'upper-east',
  'upper-west',
  'bono',
  'bono-east',
  'ahafo',
  'savannah',
  'north-east',
  'oti',
  'western-north',
];

/**
 * Human-readable labels for Ghana regions
 */
export const GHANA_REGION_LABELS: Record<GhanaRegion, string> = {
  'greater-accra': 'Greater Accra',
  'ashanti': 'Ashanti',
  'western': 'Western',
  'eastern': 'Eastern',
  'central': 'Central',
  'volta': 'Volta',
  'northern': 'Northern',
  'upper-east': 'Upper East',
  'upper-west': 'Upper West',
  'bono': 'Bono',
  'bono-east': 'Bono East',
  'ahafo': 'Ahafo',
  'savannah': 'Savannah',
  'north-east': 'North East',
  'oti': 'Oti',
  'western-north': 'Western North',
};

/**
 * Time window options for delivery scheduling
 */
export type TimeWindow = 'morning' | 'afternoon' | 'evening' | 'any';

/**
 * Human-readable labels for time windows
 */
export const TIME_WINDOW_LABELS: Record<TimeWindow, string> = {
  morning: 'Morning (9AM - 12PM)',
  afternoon: 'Afternoon (12PM - 4PM)',
  evening: 'Evening (4PM - 7PM)',
  any: 'Any time',
};

/**
 * Payment method options
 */
export type PaymentMethod = 'cod' | 'paystack';

/**
 * Delivery address structure
 */
export interface DeliveryAddress {
  street: string;
  city: string;
  region: GhanaRegion;
  directions?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

/**
 * Complete checkout form data
 */
export interface CheckoutFormData {
  customerName: string;
  phone: string;
  email?: string;
  deliveryDate: string; // ISO date string
  timeWindow: TimeWindow;
  address: DeliveryAddress;
  paymentMethod: PaymentMethod;
}

/**
 * Checkout totals breakdown
 */
export interface CheckoutTotals {
  subtotal: number;
  deliveryFee: number;
  total: number;
}

/**
 * Order confirmation data returned after successful order
 */
export interface OrderConfirmation {
  orderId: string;
  scheduledDate: string;
  timeWindow: TimeWindow;
  address: DeliveryAddress;
  items: CartItem[];
  totals: CheckoutTotals;
  paymentMethod: PaymentMethod;
  paymentUrl?: string; // For Paystack redirect
}

/**
 * Inventory error for items with insufficient stock
 */
export interface InventoryError {
  variantId: string;
  productTitle: string;
  size: string;
  color: string;
  requested: number;
  available: number;
}

/**
 * Create order request payload
 */
export interface CreateOrderRequest {
  items: Array<{
    variantId: string;
    quantity: number;
  }>;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryDate: string;
  timeWindow: TimeWindow;
  shippingAddress: DeliveryAddress;
  paymentMethod: PaymentMethod;
}

/**
 * Create order success response
 */
export interface CreateOrderResponse {
  success: true;
  data: {
    orderId: string;
    status: string;
    scheduledDate: string;
    timeWindow: string;
    totalAmount: number;
    deliveryFee: number;
    paymentMethod: string;
    paymentUrl?: string;
  };
}

/**
 * Inventory error response
 */
export interface InventoryErrorResponse {
  success: false;
  error: 'INVENTORY_ERROR';
  message: string;
  items: InventoryError[];
}
