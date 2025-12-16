'use client';

import { motion } from 'framer-motion';
import { Product } from '@/types';
import ProductCard from './ProductCard';
import { SkeletonGrid } from './SkeletonCard';
import { cn } from '@/lib/utils';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  onQuickView?: (product: Product) => void;
  showWishlist?: boolean;
  emptyMessage?: string;
  className?: string;
  skeletonCount?: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

export default function ProductGrid({
  products,
  isLoading = false,
  onQuickView,
  showWishlist = true,
  emptyMessage = 'No products found',
  className,
  skeletonCount = 8,
}: ProductGridProps) {
  // Show skeleton loading state
  if (isLoading) {
    return <SkeletonGrid count={skeletonCount} className={className} />;
  }

  // Show empty state
  if (products.length === 0) {
    return (
      <div className={cn('flex flex-col items-center justify-center py-16', className)}>
        <svg
          className="w-16 h-16 text-neutral-600 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
        <p className="text-neutral-400 text-lg">{emptyMessage}</p>
        <p className="text-neutral-500 text-sm mt-2">
          Try adjusting your filters or search terms
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6',
        className
      )}
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={itemVariants}>
          <ProductCard
            product={product}
            onQuickView={onQuickView}
            showWishlist={showWishlist}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
