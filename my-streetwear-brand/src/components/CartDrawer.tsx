'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { Drawer } from '@/components/ui/Drawer';
import Image from 'next/image';
import Link from 'next/link';

export function CartDrawer() {
  const [isHydrated, setIsHydrated] = useState(false);
  const { items, isOpen, setCartOpen, removeItem, updateQuantity, subtotal, tax, total, itemCount } = useCartStore();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleClose = () => setCartOpen(false);

  const formatPrice = (price: number) => {
    return `GH₵${price.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <Drawer isOpen={isOpen} onClose={handleClose} side="right" showCloseButton={false}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white uppercase tracking-wider">
            Your Cart ({isHydrated ? itemCount() : 0})
          </h2>
          <button
            onClick={handleClose}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            aria-label="Close cart"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        {items.length === 0 ? (
          <EmptyCart onClose={handleClose} />
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  onRemove={() => removeItem(item.id)}
                  onUpdateQuantity={(qty) => updateQuantity(item.id, qty)}
                  formatPrice={formatPrice}
                />
              ))}
            </div>

            {/* Cart Summary */}
            <div className="border-t border-gray-800 p-6 space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal())}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Tax (7.5%)</span>
                  <span>{formatPrice(tax())}</span>
                </div>
                <div className="flex justify-between text-white text-lg font-bold pt-2 border-t border-gray-800">
                  <span>Total</span>
                  <span>{formatPrice(total())}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                onClick={handleClose}
                className="block w-full bg-white text-black text-center py-4 font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors"
              >
                Checkout
              </Link>

              <button
                onClick={handleClose}
                className="block w-full text-center text-gray-400 hover:text-white text-sm transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </Drawer>
  );
}

interface CartItemCardProps {
  item: {
    id: string;
    title: string;
    size: string;
    color: string;
    price: number;
    quantity: number;
    image: string;
  };
  onRemove: () => void;
  onUpdateQuantity: (quantity: number) => void;
  formatPrice: (price: number) => string;
}

function CartItemCard({ item, onRemove, onUpdateQuantity, formatPrice }: CartItemCardProps) {
  return (
    <div className="flex gap-4 bg-gray-800/50 rounded-lg p-4">
      {/* Product Image */}
      <div className="relative w-20 h-20 flex-shrink-0 bg-gray-700 rounded overflow-hidden">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-medium truncate">{item.title}</h3>
        <p className="text-gray-400 text-sm">
          {item.size} / {item.color}
        </p>
        <p className="text-white font-bold mt-1">{formatPrice(item.price)}</p>
      </div>

      {/* Quantity Controls */}
      <div className="flex flex-col items-end justify-between">
        <button
          onClick={onRemove}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Remove item"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onUpdateQuantity(item.quantity - 1)}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="text-white w-8 text-center">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.quantity + 1)}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

interface EmptyCartProps {
  onClose: () => void;
}

function EmptyCart({ onClose }: EmptyCartProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <svg
        className="w-24 h-24 text-gray-600 mb-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
      <h3 className="text-xl font-bold text-white mb-2">Your cart is empty</h3>
      <p className="text-gray-400 mb-6">
        Looks like you haven&apos;t added anything to your cart yet.
      </p>
      <Link
        href="/shop"
        onClick={onClose}
        className="bg-white text-black px-8 py-3 font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors"
      >
        Start Shopping
      </Link>
    </div>
  );
}
