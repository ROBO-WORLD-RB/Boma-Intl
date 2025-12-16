'use client';

import { PaymentMethod } from '@/types/checkout';

/**
 * PaymentMethodSelector Component
 * Payment method selection with COD and Paystack options
 * 
 * Requirements: 9.1, 9.4, 9.5
 */

export interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
  error?: string;
}

interface PaymentOption {
  id: PaymentMethod;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const paymentOptions: PaymentOption[] = [
  {
    id: 'cod',
    name: 'Cash on Delivery',
    description: 'Pay when your order arrives',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
  {
    id: 'paystack',
    name: 'Pay Online',
    description: 'Secure payment via Paystack (Card, Mobile Money)',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
        />
      </svg>
    ),
  },
];

export function PaymentMethodSelector({ value, onChange, error }: PaymentMethodSelectorProps) {
  return (
    <section 
      className="space-y-4" 
      aria-labelledby="payment-method-heading"
      role="group"
    >
      <h2 id="payment-method-heading" className="text-lg font-bold uppercase tracking-wider text-white">
        Payment Method
      </h2>

      <div 
        className="space-y-3" 
        role="radiogroup" 
        aria-labelledby="payment-method-heading"
        aria-required="true"
      >
        {paymentOptions.map((option) => {
          const isSelected = value === option.id;
          
          return (
            <label
              key={option.id}
              className={`
                flex items-start gap-3 sm:gap-4 p-4 rounded-lg border-2 cursor-pointer
                transition-all duration-200
                min-h-[72px]
                active:scale-[0.99]
                ${isSelected
                  ? 'border-white bg-gray-800'
                  : 'border-gray-700 bg-gray-900 hover:border-gray-500'
                }
              `}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={option.id}
                checked={isSelected}
                onChange={() => onChange(option.id)}
                onKeyDown={(e) => {
                  // Handle keyboard navigation for radio buttons
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onChange(option.id);
                  }
                }}
                className="sr-only peer"
                aria-describedby={`${option.id}-description`}
                aria-checked={isSelected}
              />
              
              {/* Custom radio indicator */}
              <div
                className={`
                  flex-shrink-0 w-5 h-5 rounded-full border-2 mt-0.5
                  flex items-center justify-center
                  ${isSelected ? 'border-white' : 'border-gray-500'}
                `}
              >
                {isSelected && (
                  <div className="w-2.5 h-2.5 rounded-full bg-white" />
                )}
              </div>

              {/* Icon */}
              <div className={`flex-shrink-0 ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                {option.icon}
              </div>

              {/* Content */}
              <div className="flex-1">
                <span className={`block font-medium ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                  {option.name}
                </span>
                <span
                  id={`${option.id}-description`}
                  className="block text-sm text-gray-400 mt-0.5"
                >
                  {option.description}
                </span>
              </div>

              {/* Selected checkmark */}
              {isSelected && (
                <svg
                  className="w-5 h-5 text-white flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </label>
          );
        })}
      </div>

      {error && (
        <p className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}

      {/* Payment method info */}
      {value === 'cod' && (
        <p className="text-sm text-gray-400 bg-gray-800 p-3 rounded-lg">
          💵 Please have the exact amount ready when your order arrives. Our delivery personnel may not have change.
        </p>
      )}
      
      {value === 'paystack' && (
        <p className="text-sm text-gray-400 bg-gray-800 p-3 rounded-lg">
          🔒 You will be redirected to Paystack&apos;s secure payment page after confirming your order.
        </p>
      )}
    </section>
  );
}

export default PaymentMethodSelector;
