/**
 * Unit Tests for Checkout Components
 * 
 * Tests CustomerInfoSection, DeliveryScheduler, AddressInput, PaymentMethodSelector
 * 
 * Requirements: 2.7, 3.2, 4.7, 9.5
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CustomerInfoSection } from '../CustomerInfoSection';
import { DeliveryScheduler } from '../DeliveryScheduler';
import { AddressInput } from '../AddressInput';
import { PaymentMethodSelector } from '../PaymentMethodSelector';
import { DeliveryAddress, TimeWindow, PaymentMethod } from '@/types/checkout';

// Mock geolocation API
const mockGeolocation = {
  getCurrentPosition: jest.fn(),
};

Object.defineProperty(global.navigator, 'geolocation', {
  value: mockGeolocation,
  writable: true,
});

describe('CustomerInfoSection', () => {
  const defaultValues = {
    customerName: '',
    phone: '',
    email: '',
  };

  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  /**
   * Test CustomerInfoSection validation display
   * Requirements: 2.7
   */
  test('displays inline validation errors for invalid fields', () => {
    const errors = {
      customerName: 'Name must be at least 2 characters',
      phone: 'Please enter a valid Ghana phone number',
      email: 'Please enter a valid email address',
    };

    render(
      <CustomerInfoSection
        values={defaultValues}
        onChange={mockOnChange}
        errors={errors}
      />
    );

    expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument();
    expect(screen.getByText('Please enter a valid Ghana phone number')).toBeInTheDocument();
    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
  });

  test('renders all required fields', () => {
    render(
      <CustomerInfoSection
        values={defaultValues}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
  });

  test('calls onChange when input values change', async () => {
    const user = userEvent.setup();
    
    render(
      <CustomerInfoSection
        values={defaultValues}
        onChange={mockOnChange}
      />
    );

    const nameInput = screen.getByLabelText(/full name/i);
    await user.type(nameInput, 'J');

    expect(mockOnChange).toHaveBeenCalledWith('customerName', 'J');
  });

  test('marks required fields with aria-required', () => {
    render(
      <CustomerInfoSection
        values={defaultValues}
        onChange={mockOnChange}
      />
    );

    const nameInput = screen.getByLabelText(/full name/i);
    const phoneInput = screen.getByLabelText(/phone number/i);

    expect(nameInput).toHaveAttribute('aria-required', 'true');
    expect(phoneInput).toHaveAttribute('aria-required', 'true');
  });
});

describe('DeliveryScheduler', () => {
  const defaultValues = {
    deliveryDate: '',
    timeWindow: 'any' as TimeWindow,
  };

  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  /**
   * Test DeliveryScheduler date restrictions
   * Requirements: 3.2
   */
  test('renders date picker with min and max date restrictions', () => {
    render(
      <DeliveryScheduler
        values={defaultValues}
        onChange={mockOnChange}
      />
    );

    const dateInput = screen.getByLabelText(/delivery date/i);
    
    // Should have min and max attributes set
    expect(dateInput).toHaveAttribute('min');
    expect(dateInput).toHaveAttribute('max');
  });

  test('renders all time window options', () => {
    render(
      <DeliveryScheduler
        values={defaultValues}
        onChange={mockOnChange}
      />
    );

    const timeSelect = screen.getByLabelText(/preferred time window/i);
    
    expect(timeSelect).toBeInTheDocument();
    expect(screen.getByText('Any time')).toBeInTheDocument();
    expect(screen.getByText('Morning (9AM - 12PM)')).toBeInTheDocument();
    expect(screen.getByText('Afternoon (12PM - 4PM)')).toBeInTheDocument();
    expect(screen.getByText('Evening (4PM - 7PM)')).toBeInTheDocument();
  });

  test('displays lead time information', () => {
    render(
      <DeliveryScheduler
        values={defaultValues}
        onChange={mockOnChange}
      />
    );

    // Should show lead time message
    expect(
      screen.getByText(/orders placed (before|after) 6pm/i)
    ).toBeInTheDocument();
  });

  test('displays validation error when provided', () => {
    render(
      <DeliveryScheduler
        values={defaultValues}
        onChange={mockOnChange}
        errors={{ deliveryDate: 'Delivery date is required' }}
      />
    );

    expect(screen.getByText('Delivery date is required')).toBeInTheDocument();
  });

  test('calls onChange when date is selected', async () => {
    const user = userEvent.setup();
    
    render(
      <DeliveryScheduler
        values={defaultValues}
        onChange={mockOnChange}
      />
    );

    const dateInput = screen.getByLabelText(/delivery date/i);
    await user.clear(dateInput);
    fireEvent.change(dateInput, { target: { value: '2025-12-20' } });

    expect(mockOnChange).toHaveBeenCalledWith('deliveryDate', '2025-12-20');
  });
});

describe('AddressInput', () => {
  const defaultValues: DeliveryAddress = {
    street: '',
    city: '',
    region: 'greater-accra',
    directions: '',
  };

  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
    mockGeolocation.getCurrentPosition.mockClear();
  });

  /**
   * Test AddressInput geolocation flow
   * Requirements: 4.7
   */
  test('handles geolocation permission denied gracefully', async () => {
    const user = userEvent.setup();
    
    // Mock geolocation error
    mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
      error({
        code: 1, // PERMISSION_DENIED
        message: 'User denied geolocation',
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3,
      });
    });

    render(
      <AddressInput
        values={defaultValues}
        onChange={mockOnChange}
      />
    );

    const locationButton = screen.getByRole('button', { name: /use my location/i });
    await user.click(locationButton);

    await waitFor(() => {
      expect(screen.getByText(/location access denied/i)).toBeInTheDocument();
    });
  });

  test('renders all address fields', () => {
    render(
      <AddressInput
        values={defaultValues}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByLabelText(/street address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/region/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/additional directions/i)).toBeInTheDocument();
  });

  test('renders Use My Location button', () => {
    render(
      <AddressInput
        values={defaultValues}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByRole('button', { name: /use my location/i })).toBeInTheDocument();
  });

  test('displays all Ghana regions in dropdown', () => {
    render(
      <AddressInput
        values={defaultValues}
        onChange={mockOnChange}
      />
    );

    const regionSelect = screen.getByLabelText(/region/i);
    
    // Check for some key regions
    expect(regionSelect).toContainHTML('Greater Accra');
    expect(regionSelect).toContainHTML('Ashanti');
    expect(regionSelect).toContainHTML('Northern');
  });

  test('displays validation errors', () => {
    render(
      <AddressInput
        values={defaultValues}
        onChange={mockOnChange}
        errors={{
          street: 'Street address is required',
          city: 'City is required',
        }}
      />
    );

    expect(screen.getByText('Street address is required')).toBeInTheDocument();
    expect(screen.getByText('City is required')).toBeInTheDocument();
  });

  test('shows GPS coordinates indicator when coordinates are available', () => {
    const valuesWithCoords: DeliveryAddress = {
      ...defaultValues,
      coordinates: { lat: 5.6037, lng: -0.1870 },
    };

    render(
      <AddressInput
        values={valuesWithCoords}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText(/gps coordinates saved/i)).toBeInTheDocument();
  });
});

describe('PaymentMethodSelector', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  /**
   * Test PaymentMethodSelector default state
   * Requirements: 9.5
   */
  test('COD is the default selected payment method', () => {
    render(
      <PaymentMethodSelector
        value="cod"
        onChange={mockOnChange}
      />
    );

    const codRadio = screen.getByRole('radio', { name: /cash on delivery/i });
    expect(codRadio).toBeChecked();
  });

  test('renders both payment options with icons and descriptions', () => {
    render(
      <PaymentMethodSelector
        value="cod"
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('Cash on Delivery')).toBeInTheDocument();
    expect(screen.getByText('Pay when your order arrives')).toBeInTheDocument();
    expect(screen.getByText('Pay Online')).toBeInTheDocument();
    expect(screen.getByText(/secure payment via paystack/i)).toBeInTheDocument();
  });

  test('calls onChange when payment method is selected', async () => {
    const user = userEvent.setup();
    
    render(
      <PaymentMethodSelector
        value="cod"
        onChange={mockOnChange}
      />
    );

    const paystackOption = screen.getByText('Pay Online').closest('label');
    if (paystackOption) {
      await user.click(paystackOption);
    }

    expect(mockOnChange).toHaveBeenCalledWith('paystack');
  });

  test('displays COD info message when COD is selected', () => {
    render(
      <PaymentMethodSelector
        value="cod"
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText(/please have the exact amount ready/i)).toBeInTheDocument();
  });

  test('displays Paystack info message when Paystack is selected', () => {
    render(
      <PaymentMethodSelector
        value="paystack"
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText(/you will be redirected to paystack/i)).toBeInTheDocument();
  });

  test('displays error message when provided', () => {
    render(
      <PaymentMethodSelector
        value="cod"
        onChange={mockOnChange}
        error="Please select a payment method"
      />
    );

    expect(screen.getByText('Please select a payment method')).toBeInTheDocument();
  });
});
