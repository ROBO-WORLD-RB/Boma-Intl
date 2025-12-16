'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const variants = {
  default: 'bg-gray-700 text-white',
  success: 'bg-green-600 text-white',
  warning: 'bg-yellow-500 text-black',
  error: 'bg-red-600 text-white',
  info: 'bg-blue-600 text-white',
};

const sizes = {
  sm: 'px-1.5 py-0.5 text-xs',
  md: 'px-2 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

export function Badge({ children, variant = 'default', size = 'md', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-full',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}

// Specialized cart count badge
export interface CartBadgeProps {
  count: number;
  className?: string;
}

export function CartBadge({ count, className }: CartBadgeProps) {
  if (count <= 0) return null;
  
  return (
    <span
      className={cn(
        'absolute -top-2 -right-2 min-w-[20px] h-5 px-1.5',
        'flex items-center justify-center',
        'bg-white text-black text-xs font-bold rounded-full',
        className
      )}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
}

// Stock status badge
export interface StockBadgeProps {
  quantity: number;
  lowStockThreshold?: number;
  className?: string;
}

export function StockBadge({ quantity, lowStockThreshold = 5, className }: StockBadgeProps) {
  if (quantity <= 0) {
    return (
      <Badge variant="error" size="sm" className={className}>
        Out of Stock
      </Badge>
    );
  }
  
  if (quantity <= lowStockThreshold) {
    return (
      <Badge variant="warning" size="sm" className={className}>
        Only {quantity} left
      </Badge>
    );
  }
  
  return (
    <Badge variant="success" size="sm" className={className}>
      In Stock
    </Badge>
  );
}
