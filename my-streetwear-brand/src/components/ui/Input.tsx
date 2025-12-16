'use client';

import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

/**
 * Input Component
 * Accessible form input with label, error, and helper text support
 * 
 * Mobile Optimization:
 * - Minimum 44px height for touch targets (Requirements: 11.3)
 * - Full width on mobile for easy tapping
 * 
 * Accessibility:
 * - Proper ARIA labels and descriptions
 * - Error announcements via role="alert"
 * - Required field indication
 */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, required, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-200 mb-1"
          >
            {label}
            {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          required={required}
          className={cn(
            // Base styles
            'w-full px-4 py-3 bg-gray-900 border rounded-md text-white placeholder-gray-500',
            // Focus styles
            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black',
            // Transition
            'transition-colors duration-200',
            // Mobile touch target - minimum 44px height (Requirements: 11.3)
            'min-h-[44px]',
            // Error state
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-700 focus:ring-white focus:border-white',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-required={required ? 'true' : undefined}
          aria-describedby={
            error 
              ? `${inputId}-error` 
              : helperText 
                ? `${inputId}-helper` 
                : undefined
          }
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="mt-1 text-sm text-red-500" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="mt-1 text-sm text-gray-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
