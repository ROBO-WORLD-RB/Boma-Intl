/**
 * Unit Tests for CartPage Component
 * 
 * Tests quantity controls, remove functionality, totals display, and empty cart state
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.7
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { CartPage } from '../CartPage';
import { useCartStore } from '@/store/cartStore';

// Reset cart store before each test
beforeEach(() => {
  useCartStore.setState({ items: [], isOpen: false });
});

const mockCartItem = {
  productId: 'product-1',
  variantId: 'variant-1',
  title: 'Test Streetwear Hoodie',
  size: 'M',
  color: 'Black',
  price: 150,
  quantity: 2,
  image: '/test-image.jpg',
};

const mockCartItem2 = {
  productId: 'product-2',
  variantId: 'variant-2',
  title: 'Test T-Shirt',
  size: 'L',
  color: 'White',
  price: 75,
  quantity: 1,
  image: '/test-image-2.jpg',
};

describe('CartPage', () => {
  describe('Empty Cart State (Requirements: 1.7)', () => {
    it('displays empty cart message when cart is empty', () => {
      render(<CartPage />);
      expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    });

    it('displays link to shop page when cart is empty', () => {
      render(<CartPage />);
      const shopLink = screen.getByRole('link', { name: /start shopping/i });
      expect(shopLink).toBeInTheDocument();
      expect(shopLink).toHaveAttribute('href', '/shop');
    });
  });

  describe('Cart Items Display (Requirements: 1.1)', () => {
    beforeEach(() => {
      useCartStore.getState().addItem(mockCartItem);
    });

    it('displays product title', () => {
      render(<CartPage />);
      expect(screen.getByText('Test Streetwear Hoodie')).toBeInTheDocument();
    });

    it('displays product size and color', () => {
      render(<CartPage />);
      expect(screen.getByText(/Size: M/)).toBeInTheDocument();
      expect(screen.getByText(/Color: Black/)).toBeInTheDocument();
    });

    it('displays product price', () => {
      render(<CartPage />);
      expect(screen.getByText(/GH₵150/)).toBeInTheDocument();
    });

    it('displays product quantity', () => {
      render(<CartPage />);
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('displays line total for item', () => {
      render(<CartPage />);
      // Line total = 150 * 2 = 300
      expect(screen.getByText('Line Total')).toBeInTheDocument();
      expect(screen.getAllByText(/GH₵300/).length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Quantity Controls (Requirements: 1.2)', () => {
    beforeEach(() => {
      useCartStore.getState().addItem(mockCartItem);
    });

    it('increments quantity when plus button is clicked', () => {
      render(<CartPage />);
      
      const incrementButton = screen.getByRole('button', { name: /increase quantity/i });
      fireEvent.click(incrementButton);
      
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('decrements quantity when minus button is clicked', () => {
      render(<CartPage />);
      
      const decrementButton = screen.getByRole('button', { name: /decrease quantity/i });
      fireEvent.click(decrementButton);
      
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('does not decrement quantity below 1', () => {
      // Set quantity to 1
      useCartStore.setState({ items: [], isOpen: false });
      useCartStore.getState().addItem({ ...mockCartItem, quantity: 1 });
      
      render(<CartPage />);
      
      const decrementButton = screen.getByRole('button', { name: /decrease quantity/i });
      fireEvent.click(decrementButton);
      
      // Quantity should still be 1
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('disables decrement button when quantity is 1', () => {
      useCartStore.setState({ items: [], isOpen: false });
      useCartStore.getState().addItem({ ...mockCartItem, quantity: 1 });
      
      render(<CartPage />);
      
      const decrementButton = screen.getByRole('button', { name: /decrease quantity/i });
      expect(decrementButton).toBeDisabled();
    });
  });

  describe('Remove Item (Requirements: 1.3)', () => {
    beforeEach(() => {
      useCartStore.getState().addItem(mockCartItem);
    });

    it('removes item when remove button is clicked', () => {
      render(<CartPage />);
      
      // Updated to match new accessible aria-label format: "Remove {item.title} from cart"
      const removeButton = screen.getByRole('button', { name: /remove.*from cart/i });
      fireEvent.click(removeButton);
      
      // Should show empty cart state
      expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    });
  });

  describe('Totals Display (Requirements: 1.4, 1.5)', () => {
    beforeEach(() => {
      useCartStore.getState().addItem(mockCartItem);
      useCartStore.getState().addItem(mockCartItem2);
    });

    it('displays subtotal correctly', () => {
      render(<CartPage />);
      // Subtotal = (150 * 2) + (75 * 1) = 375
      // Both subtotal and estimated total show 375, so use getAllByText
      const priceElements = screen.getAllByText(/GH₵375/);
      expect(priceElements.length).toBeGreaterThanOrEqual(1);
    });

    it('displays delivery fee placeholder', () => {
      render(<CartPage />);
      expect(screen.getByText(/calculated at checkout/i)).toBeInTheDocument();
    });

    it('displays estimated total', () => {
      render(<CartPage />);
      // Estimated total = subtotal (delivery fee added at checkout)
      expect(screen.getByText(/estimated total/i)).toBeInTheDocument();
    });

    it('updates totals when quantity changes', () => {
      render(<CartPage />);
      
      // Initial subtotal = 375 (appears twice: subtotal and estimated total)
      expect(screen.getAllByText(/GH₵375/).length).toBeGreaterThanOrEqual(1);
      
      // Increment first item quantity
      const incrementButtons = screen.getAllByRole('button', { name: /increase quantity/i });
      fireEvent.click(incrementButtons[0]);
      
      // New subtotal = (150 * 3) + (75 * 1) = 525
      expect(screen.getAllByText(/GH₵525/).length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Navigation Links (Requirements: 1.6)', () => {
    beforeEach(() => {
      useCartStore.getState().addItem(mockCartItem);
    });

    it('displays proceed to checkout button', () => {
      render(<CartPage />);
      const checkoutLink = screen.getByRole('link', { name: /proceed to checkout/i });
      expect(checkoutLink).toBeInTheDocument();
      expect(checkoutLink).toHaveAttribute('href', '/checkout');
    });

    it('displays continue shopping link', () => {
      render(<CartPage />);
      const shopLink = screen.getByRole('link', { name: /continue shopping/i });
      expect(shopLink).toBeInTheDocument();
      expect(shopLink).toHaveAttribute('href', '/shop');
    });
  });

  describe('Item Count Display', () => {
    it('displays correct item count in header', () => {
      useCartStore.getState().addItem(mockCartItem);
      useCartStore.getState().addItem(mockCartItem2);
      
      render(<CartPage />);
      expect(screen.getByText(/shopping cart \(2 items\)/i)).toBeInTheDocument();
    });

    it('displays singular "item" for single item', () => {
      useCartStore.getState().addItem(mockCartItem);
      
      render(<CartPage />);
      expect(screen.getByText(/shopping cart \(1 item\)/i)).toBeInTheDocument();
    });
  });
});
