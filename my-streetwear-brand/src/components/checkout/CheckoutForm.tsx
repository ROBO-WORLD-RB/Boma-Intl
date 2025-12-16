'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCartStore } from '@/store/cartStore';
import { useCheckout } from '@/hooks/useCheckout';
import { checkoutFormSchema, type CheckoutFormSchema } from '@/lib/validation';
import { calculateDeliveryFee } from '@/lib/delivery-fees';
import { calculateCheckoutTotals } from './OrderSummary';
import {
  CustomerInfoSection,
  DeliveryScheduler,
  AddressInput,
  PaymentMethodSelector,
  OrderSummary,
} from './index';
import { Button } from '@/components/ui/Button';
import { DeliveryAddress, InventoryError, TimeWindow, PaymentMethod } from '@/types/checkout';

/**
 * CheckoutForm Container Component
 * Assembles all checkout sections with react-hook-form
 * Handles form validation with Zod schema
 * 
 * Requirements: 6.4, 10.1, 10.4, 10.5, 10.7
 */

export interface CheckoutFormProps {
  initialData?: Partial<CheckoutFormSchema>;
}

export function CheckoutForm({ initialData }: CheckoutFormProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const { items } = useCartStore();
  const { submitOrder, isSubmitting, error, inventoryErrors, clearErrors } = useCheckout();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Initialize form with react-hook-form and Zod validation
  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormSchema>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      customerName: initialData?.customerName || '',
      phone: initialData?.phone || '',
      email: initialData?.email || '',
      deliveryDate: '',
      timeWindow: 'any' as TimeWindow,
      address: {
        street: '',
        city: '',
        region: '' as DeliveryAddress['region'],
        directions: '',
        coordinates: undefined,
      },
      paymentMethod: 'cod' as PaymentMethod,
    },
  });

  // Watch form values for real-time updates
  const formValues = watch();
  const selectedRegion = formValues.address?.region;

  // Calculate totals based on selected region
  const deliveryFee = selectedRegion ? calculateDeliveryFee(selectedRegion) : 0;
  const totals = calculateCheckoutTotals(items, deliveryFee);

  // Scroll to first error on validation failure (Requirements: 10.3)
  // Enhanced focus management for accessibility
  useEffect(() => {
    const errorKeys = Object.keys(errors);
    if (errorKeys.length > 0 && formRef.current) {
      // Handle nested errors (e.g., address.street)
      const firstErrorKey = errorKeys[0];
      let selector = `[name="${firstErrorKey}"], [id="${firstErrorKey}"]`;
      
      // Check for nested address errors
      if (firstErrorKey === 'address' && errors.address) {
        const addressErrorKeys = Object.keys(errors.address);
        if (addressErrorKeys.length > 0) {
          selector = `[name="${addressErrorKeys[0]}"], [id="${addressErrorKeys[0]}"]`;
        }
      }
      
      const firstErrorField = formRef.current.querySelector(selector);
      if (firstErrorField) {
        // scrollIntoView may not be available in test environments
        if (typeof firstErrorField.scrollIntoView === 'function') {
          firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        // Focus the field for screen reader announcement
        setTimeout(() => {
          (firstErrorField as HTMLElement).focus?.();
        }, 100);
      }
    }
  }, [errors]);

  // Handle form submission
  const onSubmit = async (data: CheckoutFormSchema) => {
    clearErrors();
    try {
      await submitOrder(data);
    } catch {
      // Error is handled by useCheckout hook
    }
  };

  // Handle customer info field changes
  const handleCustomerInfoChange = (
    field: 'customerName' | 'phone' | 'email',
    value: string
  ) => {
    setValue(field, value, { shouldValidate: true });
  };

  // Handle delivery scheduler field changes
  const handleDeliveryChange = (
    field: 'deliveryDate' | 'timeWindow',
    value: string
  ) => {
    if (field === 'timeWindow') {
      setValue(field, value as TimeWindow, { shouldValidate: true });
    } else {
      setValue(field, value, { shouldValidate: true });
    }
  };

  // Handle address field changes
  const handleAddressChange = (
    field: keyof DeliveryAddress,
    value: string | { lat: number; lng: number } | undefined
  ) => {
    setValue(`address.${field}` as keyof CheckoutFormSchema, value as string, {
      shouldValidate: true,
    });
  };

  // Handle payment method change
  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setValue('paymentMethod', method, { shouldValidate: true });
  };

  if (!isHydrated) {
    return <CheckoutFormSkeleton />;
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 sm:space-y-8"
      noValidate
      aria-label="Checkout form"
    >
      {/* Global Error Display */}
      {error && !inventoryErrors && (
        <div
          className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg"
          role="alert"
        >
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Inventory Errors Display (Requirements: 6.4) */}
      {inventoryErrors && inventoryErrors.length > 0 && (
        <InventoryErrorAlert
          errors={inventoryErrors}
          onDismiss={clearErrors}
        />
      )}

      {/* Order Summary - Top on mobile, sidebar on desktop */}
      <div className="lg:hidden">
        <OrderSummary
          items={items}
          totals={calculateCheckoutTotals(items, selectedRegion ? calculateDeliveryFee(selectedRegion) : 0)}
          isLoading={false}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Customer Information Section */}
          <CustomerInfoSection
            values={{
              customerName: formValues.customerName,
              phone: formValues.phone,
              email: formValues.email,
            }}
            onChange={handleCustomerInfoChange}
            errors={{
              customerName: errors.customerName?.message,
              phone: errors.phone?.message,
              email: errors.email?.message,
            }}
          />

          {/* Delivery Scheduler Section */}
          <DeliveryScheduler
            values={{
              deliveryDate: formValues.deliveryDate,
              timeWindow: formValues.timeWindow,
            }}
            onChange={handleDeliveryChange}
            errors={{
              deliveryDate: errors.deliveryDate?.message,
              timeWindow: errors.timeWindow?.message,
            }}
          />

          {/* Address Input Section */}
          <AddressInput
            values={formValues.address}
            onChange={handleAddressChange}
            errors={{
              street: errors.address?.street?.message,
              city: errors.address?.city?.message,
              region: errors.address?.region?.message,
              directions: errors.address?.directions?.message,
            }}
          />

          {/* Payment Method Section */}
          <PaymentMethodSelector
            value={formValues.paymentMethod}
            onChange={handlePaymentMethodChange}
            error={errors.paymentMethod?.message}
          />

          {/* Submit Button (Requirements: 10.4, 10.7) */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            disabled={isSubmitting || items.length === 0}
            className="w-full"
          >
            {isSubmitting ? 'Processing...' : 'Confirm Order'}
          </Button>
        </div>

        {/* Order Summary Sidebar - Desktop only */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="lg:sticky lg:top-4">
            <OrderSummary
              items={items}
              totals={totals}
              isLoading={false}
            />
          </div>
        </div>
      </div>
    </form>
  );
}


/**
 * Inventory Error Alert Component
 * Displays inventory errors with options to adjust quantities
 */
interface InventoryErrorAlertProps {
  errors: InventoryError[];
  onDismiss: () => void;
}

function InventoryErrorAlert({ errors, onDismiss }: InventoryErrorAlertProps) {
  const { updateQuantity, removeItem, items } = useCartStore();

  const handleAdjustQuantity = (variantId: string, available: number) => {
    const cartItem = items.find((item) => item.variantId === variantId);
    if (cartItem) {
      if (available > 0) {
        updateQuantity(cartItem.id, available);
      } else {
        removeItem(cartItem.id);
      }
    }
    onDismiss();
  };

  const handleRemoveItem = (variantId: string) => {
    const cartItem = items.find((item) => item.variantId === variantId);
    if (cartItem) {
      removeItem(cartItem.id);
    }
    onDismiss();
  };

  return (
    <div
      className="bg-yellow-900/50 border border-yellow-500 text-yellow-200 px-4 py-4 rounded-lg"
      role="alert"
    >
      <div className="flex items-start gap-3">
        <svg
          className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <div className="flex-1">
          <p className="font-medium text-yellow-100">
            Some items have limited stock
          </p>
          <p className="text-sm mt-1 text-yellow-200/80">
            Please adjust quantities or remove items to continue.
          </p>

          <div className="mt-4 space-y-3">
            {errors.map((err) => (
              <div
                key={err.variantId}
                className="bg-black/30 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center gap-3"
              >
                <div className="flex-1">
                  <p className="font-medium text-white">{err.productTitle}</p>
                  <p className="text-sm text-yellow-200/70">
                    {err.size} / {err.color}
                  </p>
                  <p className="text-sm mt-1">
                    Requested: {err.requested} • Available: {err.available}
                  </p>
                </div>
                <div className="flex gap-2">
                  {err.available > 0 && (
                    <button
                      type="button"
                      onClick={() => handleAdjustQuantity(err.variantId, err.available)}
                      className="px-3 py-1.5 text-sm bg-yellow-600 hover:bg-yellow-500 text-black font-medium rounded transition-colors min-h-[44px]"
                    >
                      Update to {err.available}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(err.variantId)}
                    className="px-3 py-1.5 text-sm bg-red-600 hover:bg-red-500 text-white font-medium rounded transition-colors min-h-[44px]"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton loader for checkout form during hydration
 */
function CheckoutFormSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-800 rounded-lg h-40 animate-pulse" />
          ))}
        </div>
        <div className="bg-gray-800 rounded-lg h-64 animate-pulse" />
      </div>
    </div>
  );
}

export default CheckoutForm;
