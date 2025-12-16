import { Metadata } from 'next';
import CartPage from '@/components/cart/CartPage';

/**
 * Cart Page Route
 * Displays the full shopping cart with items, totals, and checkout link
 * 
 * Requirements: 1.6, 1.7, 1.8
 */

export const metadata: Metadata = {
  title: 'Shopping Cart | BOMA 2025',
  description: 'Review your shopping cart and proceed to checkout',
};

export default function Cart() {
  return <CartPage />;
}
