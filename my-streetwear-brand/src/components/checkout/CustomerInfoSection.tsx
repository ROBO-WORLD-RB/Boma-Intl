'use client';

import { Input } from '@/components/ui/Input';

/**
 * CustomerInfoSection Component
 * Collects customer contact information during checkout
 * 
 * Requirements: 2.1, 2.2, 2.3, 2.7
 * Accessibility: 10.3, 11.3
 * - Proper ARIA labels for form fields
 * - Keyboard navigation support
 * - Screen reader friendly error messages
 */

export interface CustomerInfoSectionProps {
  values: {
    customerName: string;
    phone: string;
    email?: string;
  };
  onChange: (field: 'customerName' | 'phone' | 'email', value: string) => void;
  errors?: {
    customerName?: string;
    phone?: string;
    email?: string;
  };
}

export function CustomerInfoSection({ values, onChange, errors }: CustomerInfoSectionProps) {
  return (
    <section 
      className="space-y-4" 
      aria-labelledby="customer-info-heading"
      role="group"
    >
      <h2 id="customer-info-heading" className="text-lg font-bold uppercase tracking-wider text-white">
        Contact Information
      </h2>
      
      {/* Full Name - Required (Requirements: 2.1) */}
      <Input
        label="Full Name"
        id="customerName"
        name="customerName"
        type="text"
        placeholder="Enter your full name"
        value={values.customerName}
        onChange={(e) => onChange('customerName', e.target.value)}
        error={errors?.customerName}
        required
        autoComplete="name"
        aria-required="true"
      />

      {/* Phone Number - Required (Requirements: 2.2) */}
      <Input
        label="Phone Number"
        id="phone"
        name="phone"
        type="tel"
        placeholder="+233XXXXXXXXX or 0XXXXXXXXX"
        value={values.phone}
        onChange={(e) => onChange('phone', e.target.value)}
        error={errors?.phone}
        helperText="Ghana phone number format"
        required
        autoComplete="tel"
        aria-required="true"
      />

      {/* Email - Optional (Requirements: 2.3) */}
      <Input
        label="Email Address (Optional)"
        id="email"
        name="email"
        type="email"
        placeholder="your@email.com"
        value={values.email || ''}
        onChange={(e) => onChange('email', e.target.value)}
        error={errors?.email}
        helperText="For order confirmation and updates"
        autoComplete="email"
      />
    </section>
  );
}

export default CustomerInfoSection;
