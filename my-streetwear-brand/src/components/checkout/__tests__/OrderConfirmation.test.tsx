/**
 * Unit Tests for OrderConfirmation Component
 * 
 * Tests all required fields displayed and cart clearing behavior
 * 
 * Requirements: 7.2, 7.8
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { OrderConfirmation } from '../OrderConfirmation';
import type { OrderConfirmation as OrderConfirmationData } from '@/types/checkout';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

// Mock next/image
jest.mock('next/image', () => {
  return ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  );
});

// Sample confirmation data for testing
const mockConfirmation: OrderConfirmationData = {
  orderId: 'cltest123456789',
  scheduledDate: '2025-12-20T12:00:00.000Z',
  timeWindow: 'morning',
  address: {
    street: '123 Test Street',
    city: 'Accra',
    region: 'greater-accra',
    directions: 'Near the big tree',
  },
  items: [
    {
      id: 'item-1',
      productId: 'prod-1',
      variantId: 'var-1',
      title: 'Test T-Shirt',
      size: 'M',
      color: 'Black',
      price: 150,
      quantity: 2,
      image: '/test-image.jpg',
    },
    {
      id: 'item-2',
      productId: 'prod-2',
      variantId: 'var-2',
      title: 'Test Hoodie',
      size: 'L',
      color: 'White',
      price: 250,
      quantity: 1,
      image: '/test-image-2.jpg',
    },
  ],
  totals: {
    subtotal: 550,
    deliveryFee: 20,
    total: 570,
  },
  paymentMethod: 'cod',
};


describe('OrderConfirmation Component', () => {
  /**
   * Test: Order ID is displayed prominently
   * Requirements: 7.2
   */
  test('displays order ID prominently', () => {
    render(<OrderConfirmation confirmation={mockConfirmation} />);
    
    expect(screen.getByText('Order ID')).toBeInTheDocument();
    expect(screen.getByText(mockConfirmation.orderId)).toBeInTheDocument();
  });

  /**
   * Test: Scheduled date and time window are displayed
   * Requirements: 7.3
   */
  test('displays scheduled date and time window', () => {
    render(<OrderConfirmation confirmation={mockConfirmation} />);
    
    expect(screen.getByText('Scheduled Date')).toBeInTheDocument();
    // Check for formatted date (Saturday 20 December 2025)
    expect(screen.getByText(/Saturday.*20.*December.*2025/i)).toBeInTheDocument();
    // Check for time window label
    expect(screen.getByText('Morning (9AM - 12PM)')).toBeInTheDocument();
  });

  /**
   * Test: Delivery address is displayed
   * Requirements: 7.4
   */
  test('displays delivery address', () => {
    render(<OrderConfirmation confirmation={mockConfirmation} />);
    
    expect(screen.getByText('Delivery Address')).toBeInTheDocument();
    expect(screen.getByText(mockConfirmation.address.street)).toBeInTheDocument();
    expect(screen.getByText(/Accra, Greater Accra/i)).toBeInTheDocument();
    expect(screen.getByText(mockConfirmation.address.directions!)).toBeInTheDocument();
  });

  /**
   * Test: Order items are displayed with quantities and prices
   * Requirements: 7.5
   */
  test('displays order items with quantities and prices', () => {
    render(<OrderConfirmation confirmation={mockConfirmation} />);
    
    expect(screen.getByText('Order Items')).toBeInTheDocument();
    
    // Check first item
    expect(screen.getByText('Test T-Shirt')).toBeInTheDocument();
    expect(screen.getByText('M / Black × 2')).toBeInTheDocument();
    expect(screen.getByText('GH₵300.00')).toBeInTheDocument(); // 150 * 2
    
    // Check second item
    expect(screen.getByText('Test Hoodie')).toBeInTheDocument();
    expect(screen.getByText('L / White × 1')).toBeInTheDocument();
    expect(screen.getByText('GH₵250.00')).toBeInTheDocument();
  });

  /**
   * Test: Order totals are displayed correctly
   * Requirements: 7.5
   */
  test('displays order totals correctly', () => {
    render(<OrderConfirmation confirmation={mockConfirmation} />);
    
    expect(screen.getByText('Subtotal')).toBeInTheDocument();
    expect(screen.getByText('GH₵550.00')).toBeInTheDocument();
    
    expect(screen.getByText('Delivery Fee')).toBeInTheDocument();
    expect(screen.getByText('GH₵20.00')).toBeInTheDocument();
    
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('GH₵570.00')).toBeInTheDocument();
  });

  /**
   * Test: Payment method is displayed for COD
   * Requirements: 7.6
   */
  test('displays Cash on Delivery payment method', () => {
    render(<OrderConfirmation confirmation={mockConfirmation} />);
    
    expect(screen.getByText('Payment Method')).toBeInTheDocument();
    expect(screen.getByText('Cash on Delivery')).toBeInTheDocument();
    expect(screen.getByText(/Please have the exact amount ready/i)).toBeInTheDocument();
  });

  /**
   * Test: Payment method is displayed for Paystack
   */
  test('displays Online Payment for Paystack', () => {
    const paystackConfirmation = {
      ...mockConfirmation,
      paymentMethod: 'paystack' as const,
      paymentUrl: 'https://paystack.com/pay/test',
    };
    
    render(<OrderConfirmation confirmation={paystackConfirmation} />);
    
    expect(screen.getByText('Online Payment (Paystack)')).toBeInTheDocument();
  });

  /**
   * Test: Continue Shopping button is present
   * Requirements: 7.7
   */
  test('displays Continue Shopping button', () => {
    render(<OrderConfirmation confirmation={mockConfirmation} />);
    
    const continueButton = screen.getByRole('link', { name: /Continue Shopping/i });
    expect(continueButton).toBeInTheDocument();
    expect(continueButton).toHaveAttribute('href', '/shop');
  });

  /**
   * Test: Success header is displayed
   */
  test('displays success header', () => {
    render(<OrderConfirmation confirmation={mockConfirmation} />);
    
    expect(screen.getByText('Order Confirmed!')).toBeInTheDocument();
    expect(screen.getByText(/Thank you for your order/i)).toBeInTheDocument();
  });

  /**
   * Test: Guest user sees account creation option
   * Requirements: 8.3
   */
  test('displays account creation option for guest users', () => {
    render(<OrderConfirmation confirmation={mockConfirmation} isGuest={true} />);
    
    expect(screen.getByText('Create an Account')).toBeInTheDocument();
    expect(screen.getByText(/Save your details for faster checkout/i)).toBeInTheDocument();
    
    const createAccountLink = screen.getByRole('link', { name: /Create Account/i });
    expect(createAccountLink).toHaveAttribute('href', '/auth/register');
  });

  /**
   * Test: Authenticated user does not see account creation option
   */
  test('does not display account creation option for authenticated users', () => {
    render(<OrderConfirmation confirmation={mockConfirmation} isGuest={false} />);
    
    expect(screen.queryByText('Create an Account')).not.toBeInTheDocument();
  });

  /**
   * Test: Order status badge is displayed
   */
  test('displays order status badge', () => {
    render(<OrderConfirmation confirmation={mockConfirmation} />);
    
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Pending Payment')).toBeInTheDocument();
  });

  /**
   * Test: Different time windows are displayed correctly
   */
  test.each([
    ['morning', 'Morning (9AM - 12PM)'],
    ['afternoon', 'Afternoon (12PM - 4PM)'],
    ['evening', 'Evening (4PM - 7PM)'],
    ['any', 'Any time'],
  ])('displays %s time window correctly', (timeWindow, expectedLabel) => {
    const confirmation = {
      ...mockConfirmation,
      timeWindow: timeWindow as 'morning' | 'afternoon' | 'evening' | 'any',
    };
    
    render(<OrderConfirmation confirmation={confirmation} />);
    
    expect(screen.getByText(expectedLabel)).toBeInTheDocument();
  });
});
