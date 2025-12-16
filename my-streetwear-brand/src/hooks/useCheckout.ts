'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import {
  CheckoutFormData,
  OrderConfirmation,
  InventoryError,
  CreateOrderRequest,
  CreateOrderResponse,
  InventoryErrorResponse,
} from '@/types/checkout';
import { calculateDeliveryFee } from '@/lib/delivery-fees';

/**
 * useCheckout Hook
 * Handles checkout form submission, inventory errors, and payment flow
 * 
 * Requirements: 6.1, 6.2, 6.4, 9.2, 9.3
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export interface UseCheckoutReturn {
  submitOrder: (data: CheckoutFormData) => Promise<OrderConfirmation>;
  isSubmitting: boolean;
  error: string | null;
  inventoryErrors: InventoryError[] | null;
  clearErrors: () => void;
}

/**
 * Creates a guest order via the API
 */
async function createGuestOrder(
  request: CreateOrderRequest
): Promise<CreateOrderResponse | InventoryErrorResponse> {
  const response = await fetch(`${API_BASE}/orders/guest`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  let data;
  try {
    data = await response.json();
  } catch (e) {
    console.error('Failed to parse response JSON:', {
      status: response.status,
      statusText: response.statusText,
      responseText: await response.text(),
      requestSent: request,
    });
    throw new Error(`Failed to parse server response (${response.status})`);
  }

  if (!response.ok) {
    // Check if it's an inventory error
    if (data.error === 'INVENTORY_ERROR') {
      return data as InventoryErrorResponse;
    }
    // Log full response for debugging
    console.error('Order creation failed:', {
      status: response.status,
      statusText: response.statusText,
      fullResponse: data,
      requestSent: request,
    });
    throw new Error(data.message || `Failed to create order (${response.status})`);
  }

  return data as CreateOrderResponse;
}

/**
 * Creates an authenticated order via the API
 */
async function createAuthenticatedOrder(
  request: CreateOrderRequest
): Promise<CreateOrderResponse | InventoryErrorResponse> {
  const token = typeof window !== 'undefined' 
    ? localStorage.getItem('auth-token') 
    : null;

  const response = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(request),
  });

  const data = await response.json();

  if (!response.ok) {
    // Check if it's an inventory error
    if (data.error === 'INVENTORY_ERROR') {
      return data as InventoryErrorResponse;
    }
    throw new Error(data.message || 'Failed to create order');
  }

  return data as CreateOrderResponse;
}

export function useCheckout(): UseCheckoutReturn {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inventoryErrors, setInventoryErrors] = useState<InventoryError[] | null>(null);

  const clearErrors = useCallback(() => {
    setError(null);
    setInventoryErrors(null);
  }, []);

  /**
   * Submit order to backend
   * Handles inventory validation, COD orders, and Paystack redirects
   * 
   * Requirements: 6.1, 6.2, 6.4, 9.2, 9.3
   */
  const submitOrder = useCallback(async (data: CheckoutFormData): Promise<OrderConfirmation> => {
    setIsSubmitting(true);
    clearErrors();

    try {
      // Build order request from form data and cart items
      const orderRequest: CreateOrderRequest = {
        items: items.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
        })),
        customerName: data.customerName,
        customerPhone: data.phone,
        customerEmail: data.email || undefined,
        deliveryDate: data.deliveryDate,
        timeWindow: data.timeWindow,
        shippingAddress: data.address,
        paymentMethod: data.paymentMethod,
      };

      // Check if user is authenticated
      const token = typeof window !== 'undefined' 
        ? localStorage.getItem('auth-token') 
        : null;

      // Call appropriate endpoint based on auth status
      const response = token
        ? await createAuthenticatedOrder(orderRequest)
        : await createGuestOrder(orderRequest);

      // Handle inventory errors (Requirements: 6.2)
      if ('error' in response && response.error === 'INVENTORY_ERROR') {
        setInventoryErrors(response.items);
        throw new Error(response.message);
      }

      // Success response
      const successResponse = response as CreateOrderResponse;
      const deliveryFee = successResponse.data.deliveryFee || calculateDeliveryFee(data.address.region);
      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      // Build confirmation object
      const confirmation: OrderConfirmation = {
        orderId: successResponse.data.orderId,
        scheduledDate: successResponse.data.scheduledDate || new Date().toISOString(),
        timeWindow: data.timeWindow,
        address: data.address,
        items: [...items], // Copy items before clearing cart
        totals: {
          subtotal,
          deliveryFee,
          total: successResponse.data.totalAmount || subtotal + deliveryFee,
        },
        paymentMethod: data.paymentMethod,
        paymentUrl: successResponse.data.paymentUrl,
      };

      // Handle payment method specific behavior
      if (data.paymentMethod === 'cod') {
        // COD: Order created with PENDING status, no redirect (Requirements: 9.2)
        // Store confirmation in session storage for the confirmation page
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('orderConfirmation', JSON.stringify(confirmation));
        }
        
        // Clear cart and redirect to confirmation
        clearCart();
        router.push('/checkout/confirmation');
      } else if (data.paymentMethod === 'paystack' && successResponse.data.paymentUrl) {
        // Paystack: Redirect to payment page (Requirements: 9.3)
        // Store confirmation for after payment
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('orderConfirmation', JSON.stringify(confirmation));
        }
        
        // Redirect to Paystack
        window.location.href = successResponse.data.paymentUrl;
      } else {
        // Fallback: treat as COD
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('orderConfirmation', JSON.stringify(confirmation));
        }
        clearCart();
        router.push('/checkout/confirmation');
      }

      return confirmation;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [items, clearCart, router, clearErrors]);

  return {
    submitOrder,
    isSubmitting,
    error,
    inventoryErrors,
    clearErrors,
  };
}

export default useCheckout;
