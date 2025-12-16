'use client';

import { useState, useEffect } from 'react';
import { Drawer } from '@/components/ui/Drawer';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const navLinks = [
  { href: '/shop', label: 'Shop' },
  { href: '/collections', label: 'Collections' },
  { href: '/about', label: 'About' },
];

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const { toggleCart, itemCount } = useCartStore();
  const count = isHydrated ? itemCount() : 0;

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleCartClick = () => {
    onClose();
    toggleCart();
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} side="left" showCloseButton={false}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <Link 
            href="/" 
            onClick={onClose}
            className="text-white font-bold text-xl tracking-wider min-h-[44px] flex items-center"
          >
            BOMA
          </Link>
          <button
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Links - 44px minimum touch targets */}
        <nav className="flex-1 p-6">
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="block text-2xl font-bold text-white uppercase tracking-wider hover:text-gray-300 transition-colors min-h-[44px] flex items-center"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer Actions - 44px minimum touch targets */}
        <div className="p-6 border-t border-gray-800 space-y-2">
          <button
            onClick={handleCartClick}
            className="flex items-center justify-between w-full text-white hover:text-gray-300 transition-colors min-h-[44px]"
          >
            <span className="text-lg font-medium">Cart</span>
            {count > 0 && (
              <span className="bg-white text-black px-3 py-1 rounded-full text-sm font-bold">
                {count}
              </span>
            )}
          </button>
          
          <Link
            href="/account"
            onClick={onClose}
            className="flex items-center gap-3 text-white hover:text-gray-300 transition-colors min-h-[44px]"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-lg font-medium">Account</span>
          </Link>
        </div>
      </div>
    </Drawer>
  );
}

// Hamburger button component for use in Navbar
interface HamburgerButtonProps {
  onClick: () => void;
  className?: string;
}

export function HamburgerButton({ onClick, className = '' }: HamburgerButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`min-w-[44px] min-h-[44px] flex items-center justify-center text-white hover:opacity-70 transition-opacity ${className}`}
      aria-label="Open menu"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>
  );
}
