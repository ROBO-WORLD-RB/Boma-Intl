'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface FilterState {
  priceRange: [number, number];
  sizes: string[];
  colors: string[];
  availability: 'all' | 'in-stock' | 'out-of-stock';
  sortBy: 'newest' | 'price-asc' | 'price-desc' | 'popular';
}

export interface AvailableFilters {
  sizes: string[];
  colors: string[];
  priceRange: [number, number];
}

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  availableFilters: AvailableFilters;
  className?: string;
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

const DEFAULT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const DEFAULT_COLORS = ['Black', 'White', 'Gray', 'Navy', 'Red', 'Green'];

export default function FilterSidebar({
  filters,
  onFilterChange,
  availableFilters,
  className,
  isMobile = false,
  isOpen = true,
  onClose,
}: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    price: true,
    size: true,
    color: true,
    availability: true,
    sort: true,
  });

  const sizes = availableFilters.sizes.length > 0 ? availableFilters.sizes : DEFAULT_SIZES;
  const colors = availableFilters.colors.length > 0 ? availableFilters.colors : DEFAULT_COLORS;
  const [minPrice, maxPrice] = availableFilters.priceRange;

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handlePriceChange = (type: 'min' | 'max', value: number) => {
    const newRange: [number, number] = [...filters.priceRange] as [number, number];
    if (type === 'min') {
      newRange[0] = Math.min(value, newRange[1]);
    } else {
      newRange[1] = Math.max(value, newRange[0]);
    }
    onFilterChange({ ...filters, priceRange: newRange });
  };

  const handleSizeToggle = (size: string) => {
    const newSizes = filters.sizes.includes(size)
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size];
    onFilterChange({ ...filters, sizes: newSizes });
  };

  const handleColorToggle = (color: string) => {
    const newColors = filters.colors.includes(color)
      ? filters.colors.filter((c) => c !== color)
      : [...filters.colors, color];
    onFilterChange({ ...filters, colors: newColors });
  };

  const handleAvailabilityChange = (availability: FilterState['availability']) => {
    onFilterChange({ ...filters, availability });
  };

  const handleSortChange = (sortBy: FilterState['sortBy']) => {
    onFilterChange({ ...filters, sortBy });
  };

  const clearAllFilters = () => {
    onFilterChange({
      priceRange: [minPrice, maxPrice],
      sizes: [],
      colors: [],
      availability: 'all',
      sortBy: 'newest',
    });
  };

  const hasActiveFilters =
    filters.sizes.length > 0 ||
    filters.colors.length > 0 ||
    filters.availability !== 'all' ||
    filters.priceRange[0] !== minPrice ||
    filters.priceRange[1] !== maxPrice;

  const sidebarContent = (
    <div className="space-y-6">
      {/* Header with Clear All */}
      <div className="flex items-center justify-between">
        <h2 className="text-white font-semibold uppercase tracking-wider text-sm">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-neutral-400 hover:text-white transition-colors underline"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Sort By - 44px minimum touch targets */}
      <FilterSection
        title="Sort By"
        isExpanded={expandedSections.sort}
        onToggle={() => toggleSection('sort')}
      >
        <div className="space-y-1">
          {[
            { value: 'newest', label: 'Newest' },
            { value: 'price-asc', label: 'Price: Low to High' },
            { value: 'price-desc', label: 'Price: High to Low' },
            { value: 'popular', label: 'Most Popular' },
          ].map((option) => (
            <label key={option.value} className="flex items-center gap-3 cursor-pointer group min-h-[44px] py-1">
              <input
                type="radio"
                name="sortBy"
                checked={filters.sortBy === option.value}
                onChange={() => handleSortChange(option.value as FilterState['sortBy'])}
                className="w-5 h-5 accent-white"
              />
              <span className="text-sm text-neutral-300 group-hover:text-white transition-colors">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection
        title="Price Range"
        isExpanded={expandedSections.price}
        onToggle={() => toggleSection('price')}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="text-xs text-neutral-500 mb-1 block">Min</label>
              <input
                type="number"
                value={filters.priceRange[0]}
                onChange={(e) => handlePriceChange('min', Number(e.target.value))}
                min={minPrice}
                max={maxPrice}
                className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-neutral-500"
              />
            </div>
            <span className="text-neutral-500 mt-5">-</span>
            <div className="flex-1">
              <label className="text-xs text-neutral-500 mb-1 block">Max</label>
              <input
                type="number"
                value={filters.priceRange[1]}
                onChange={(e) => handlePriceChange('max', Number(e.target.value))}
                min={minPrice}
                max={maxPrice}
                className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-neutral-500"
              />
            </div>
          </div>
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={filters.priceRange[1]}
            onChange={(e) => handlePriceChange('max', Number(e.target.value))}
            className="w-full accent-white"
          />
        </div>
      </FilterSection>

      {/* Size - 44px minimum touch targets */}
      <FilterSection
        title="Size"
        isExpanded={expandedSections.size}
        onToggle={() => toggleSection('size')}
        count={filters.sizes.length}
      >
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => handleSizeToggle(size)}
              className={cn(
                'min-w-[44px] min-h-[44px] px-3 py-2 text-sm border rounded transition-all flex items-center justify-center',
                filters.sizes.includes(size)
                  ? 'bg-white text-black border-white'
                  : 'bg-transparent text-neutral-300 border-neutral-600 hover:border-neutral-400'
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Color - 44px minimum touch targets */}
      <FilterSection
        title="Color"
        isExpanded={expandedSections.color}
        onToggle={() => toggleSection('color')}
        count={filters.colors.length}
      >
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => handleColorToggle(color)}
              className={cn(
                'min-h-[44px] px-3 py-2 text-sm border rounded transition-all flex items-center justify-center',
                filters.colors.includes(color)
                  ? 'bg-white text-black border-white'
                  : 'bg-transparent text-neutral-300 border-neutral-600 hover:border-neutral-400'
              )}
            >
              {color}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Availability - 44px minimum touch targets */}
      <FilterSection
        title="Availability"
        isExpanded={expandedSections.availability}
        onToggle={() => toggleSection('availability')}
      >
        <div className="space-y-1">
          {[
            { value: 'all', label: 'All Products' },
            { value: 'in-stock', label: 'In Stock' },
            { value: 'out-of-stock', label: 'Out of Stock' },
          ].map((option) => (
            <label key={option.value} className="flex items-center gap-3 cursor-pointer group min-h-[44px] py-1">
              <input
                type="radio"
                name="availability"
                checked={filters.availability === option.value}
                onChange={() => handleAvailabilityChange(option.value as FilterState['availability'])}
                className="w-5 h-5 accent-white"
              />
              <span className="text-sm text-neutral-300 group-hover:text-white transition-colors">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  );

  // Mobile drawer version
  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 z-40"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-neutral-900 z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-white font-bold text-lg uppercase tracking-wider">Filters</h2>
                  <button
                    onClick={onClose}
                    className="min-w-[44px] min-h-[44px] flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
                    aria-label="Close filters"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {sidebarContent}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  // Desktop sidebar version
  return (
    <aside className={cn('w-64 shrink-0', className)}>
      {sidebarContent}
    </aside>
  );
}

// Collapsible filter section component
interface FilterSectionProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  count?: number;
  children: React.ReactNode;
}

function FilterSection({ title, isExpanded, onToggle, count, children }: FilterSectionProps) {
  return (
    <div className="border-b border-neutral-800 pb-4">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left min-h-[44px] py-2"
      >
        <span className="text-sm font-medium text-white uppercase tracking-wider">
          {title}
          {count !== undefined && count > 0 && (
            <span className="ml-2 text-xs bg-white text-black px-1.5 py-0.5 rounded">
              {count}
            </span>
          )}
        </span>
        <svg
          className={cn(
            'w-4 h-4 text-neutral-400 transition-transform',
            isExpanded ? 'rotate-180' : ''
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Export filter utility functions for use in tests and other components
export function applyFilters(products: Array<{
  basePrice: number;
  salePrice?: number;
  variants: Array<{ size: string; color: string; stockQuantity: number }>;
}>, filters: FilterState): typeof products {
  return products.filter((product) => {
    const price = product.salePrice ?? product.basePrice;
    
    // Price filter
    if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
      return false;
    }
    
    // Size filter
    if (filters.sizes.length > 0) {
      const productSizes = product.variants.map((v) => v.size);
      if (!filters.sizes.some((size) => productSizes.includes(size))) {
        return false;
      }
    }
    
    // Color filter
    if (filters.colors.length > 0) {
      const productColors = product.variants.map((v) => v.color);
      if (!filters.colors.some((color) => productColors.includes(color))) {
        return false;
      }
    }
    
    // Availability filter
    if (filters.availability !== 'all') {
      const totalStock = product.variants.reduce((sum, v) => sum + v.stockQuantity, 0);
      if (filters.availability === 'in-stock' && totalStock === 0) {
        return false;
      }
      if (filters.availability === 'out-of-stock' && totalStock > 0) {
        return false;
      }
    }
    
    return true;
  });
}
