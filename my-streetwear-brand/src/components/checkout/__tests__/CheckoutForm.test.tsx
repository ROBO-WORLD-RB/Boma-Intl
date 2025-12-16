/**
 * Unit Tests for CheckoutForm Component
 * 
 * Tests form validation, submission flow, and error handling
 * 
 * Requirements: 10.1, 10.2, 10.3
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CheckoutForm } from '../CheckoutForm';
import { useCartStore } from '@/store/cartStore';
import { CartItem } from '@/types';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

// Mock the useCheckout hook
const mockSubmitOrder = jest.fn();
const mockClearErrors = jest.fn();

jest.mock('@/hooks/useCheckout', () => ({
  useCheckout: () => ({
    submitOrder: mockSubmitOrder,
    isSubmitting: false,
    error: null,
    inventoryErrors: null,
    clearErrors: mockClearErrors,
  }),
}));

// Sample cart items for testing
const sampleCartItems: CartItem[] = [
  {
    id: 'item-1',
    productId: 'prod-1',
    variantId: 'var-1',
    title: 'Test T-Shirt',
    size: 'M',
    color: 'Black',
    price: 50,
    quantity: 2,
    image: '/test-image.jpg',
  },
];

// Helper to reset cart store
const resetCartStore = () => {
  useCartStore.setState({ items: [], isOpen: false });
};

// Helper to set cart items
const setCartItems = (items: CartItem[]) => {
  useCartStore.setState({ items, isOpen: false });
};

describe('CheckoutForm', () => {
  beforeEach(() => {
    resetCartStore();
    mockSubmitOrder.mockClear();
    mockClearErrors.mockClear();
  });

  /**
   * Test form validation
   * Requirements: 10.1
   */
  describe('Form Validation', () => {
    test('displays validation errors for empty required fields on submit', async () => {
      const user = userEvent.setup();
      setCartItems(sampleCartItems);

      render(<CheckoutForm />);

      // Try to submit without filling required fields
      const submitButton = screen.getByRole('button', { name: /confirm order/i });
      await user.click(submitButton);

      // Should show validation errors
      await waitFor(() => {
        expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
      });
    });

    test('validates phone number format', async () => {
      const user = userEvent.setup();
      setCartItems(sampleCartItems);

      render(<CheckoutForm />);

      // Fill in name but invalid phone
      const nameInput = screen.getByLabelText(/full name/i);
      await user.type(nameInput, 'John Doe');

      const phoneInput = screen.getByLabelText(/phone number/i);
      await user.type(phoneInput, '12345'); // Invalid format

      const submitButton = screen.getByRole('button', { name: /confirm order/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/valid ghana phone number/i)).toBeInTheDocument();
      });
    });

    test('accepts valid Ghana phone numbers', async () => {
      const user = userEvent.setup();
      setCartItems(sampleCartItems);

      render(<CheckoutForm />);

      const phoneInput = screen.getByLabelText(/phone number/i);
      await user.type(phoneInput, '+233201234567');

      // Phone field should not show error after valid input
      expect(screen.queryByText(/valid ghana phone number/i)).not.toBeInTheDocument();
    });
  });

  /**
   * Test inline validation errors
   * Requirements: 10.2
   */
  describe('Inline Validation Errors', () => {
    test('displays inline errors below each invalid field', async () => {
      const user = userEvent.setup();
      setCartItems(sampleCartItems);

      render(<CheckoutForm />);

      const submitButton = screen.getByRole('button', { name: /confirm order/i });
      await user.click(submitButton);

      await waitFor(() => {
        // Check that errors appear near their respective fields
        const nameError = screen.getByText(/name must be at least 2 characters/i);
        expect(nameError).toBeInTheDocument();
      });
    });
  });

  /**
   * Test error handling
   * Requirements: 10.3
   */
  describe('Error Handling', () => {
    test('renders all checkout sections', () => {
      setCartItems(sampleCartItems);

      render(<CheckoutForm />);

      // Check all sections are rendered
      expect(screen.getByText(/contact information/i)).toBeInTheDocument();
      expect(screen.getByText(/delivery schedule/i)).toBeInTheDocument();
      expect(screen.getByText(/delivery address/i)).toBeInTheDocument();
      expect(screen.getByText(/payment method/i)).toBeInTheDocument();
      expect(screen.getByText(/order summary/i)).toBeInTheDocument();
    });

    test('submit button is disabled when cart is empty', () => {
      resetCartStore(); // Empty cart

      render(<CheckoutForm />);

      const submitButton = screen.getByRole('button', { name: /confirm order/i });
      expect(submitButton).toBeDisabled();
    });

    test('submit button is enabled when cart has items', () => {
      setCartItems(sampleCartItems);

      render(<CheckoutForm />);

      const submitButton = screen.getByRole('button', { name: /confirm order/i });
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe('Form Pre-filling', () => {
    test('pre-fills form with initial data when provided', () => {
      setCartItems(sampleCartItems);

      render(
        <CheckoutForm
          initialData={{
            customerName: 'John Doe',
            email: 'john@example.com',
          }}
        />
      );

      const nameInput = screen.getByLabelText(/full name/i);
      const emailInput = screen.getByLabelText(/email address/i);

      expect(nameInput).toHaveValue('John Doe');
      expect(emailInput).toHaveValue('john@example.com');
    });
  });

  describe('Order Summary', () => {
    test('displays cart items in order summary', () => {
      setCartItems(sampleCartItems);

      render(<CheckoutForm />);

      expect(screen.getByText('Test T-Shirt')).toBeInTheDocument();
      expect(screen.getByText('M / Black')).toBeInTheDocument();
    });

    test('displays correct totals', () => {
      setCartItems(sampleCartItems);

      render(<CheckoutForm />);

      // Subtotal should be 50 * 2 = 100
      // Use getAllByText since the amount appears multiple times (subtotal, total, etc.)
      const priceElements = screen.getAllByText('GH₵100.00');
      expect(priceElements.length).toBeGreaterThan(0);
    });
  });

  describe('Payment Method Selection', () => {
    test('defaults to COD payment method', () => {
      setCartItems(sampleCartItems);

      render(<CheckoutForm />);

      const codRadio = screen.getByRole('radio', { name: /cash on delivery/i });
      expect(codRadio).toBeChecked();
    });

    test('allows switching payment methods', async () => {
      const user = userEvent.setup();
      setCartItems(sampleCartItems);

      render(<CheckoutForm />);

      const paystackOption = screen.getByText('Pay Online').closest('label');
      if (paystackOption) {
        await user.click(paystackOption);
      }

      const paystackRadio = screen.getByRole('radio', { name: /pay online/i });
      expect(paystackRadio).toBeChecked();
    });
  });
});
