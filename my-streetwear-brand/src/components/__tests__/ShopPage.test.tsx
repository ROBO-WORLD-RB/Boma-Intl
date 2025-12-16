/**
 * Unit Tests for Shop Page Components
 * 
 * Tests filter application, search, and pagination functionality
 * **Validates: Requirements 3.4, 3.6**
 */

import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../SearchBar';
import ProductGrid from '../ProductGrid';
import FilterSidebar, { applyFilters, FilterState, AvailableFilters } from '../FilterSidebar';
import { Product } from '@/types';

// Mock product data for testing
const createMockProduct = (overrides: Partial<Product> = {}): Product => ({
  id: `product-${Math.random().toString(36).substr(2, 9)}`,
  title: 'Test Product',
  slug: 'test-product',
  description: 'A test product description',
  basePrice: 5000,
  isActive: true,
  category: 'Tops',
  images: [{ id: '1', url: '/test.jpg', isMain: true, altText: 'Test' }],
  variants: [
    { id: 'v1', size: 'M', color: 'Black', stockQuantity: 10, sku: 'TEST-M-BLK' },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

const mockProducts: Product[] = [
  createMockProduct({ id: '1', title: 'Black Hoodie', basePrice: 8000, variants: [{ id: 'v1', size: 'M', color: 'Black', stockQuantity: 5, sku: 'BH-M' }] }),
  createMockProduct({ id: '2', title: 'White T-Shirt', basePrice: 3000, variants: [{ id: 'v2', size: 'L', color: 'White', stockQuantity: 10, sku: 'WT-L' }] }),
  createMockProduct({ id: '3', title: 'Gray Pants', basePrice: 6000, variants: [{ id: 'v3', size: 'S', color: 'Gray', stockQuantity: 0, sku: 'GP-S' }] }),
  createMockProduct({ id: '4', title: 'Navy Jacket', basePrice: 12000, variants: [{ id: 'v4', size: 'XL', color: 'Navy', stockQuantity: 3, sku: 'NJ-XL' }] }),
];

const defaultFilters: FilterState = {
  priceRange: [0, 100000],
  sizes: [],
  colors: [],
  availability: 'all',
  sortBy: 'newest',
};

const defaultAvailableFilters: AvailableFilters = {
  sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  colors: ['Black', 'White', 'Gray', 'Navy', 'Red', 'Green'],
  priceRange: [0, 100000],
};

describe('Shop Page Components', () => {
  describe('SearchBar', () => {
    it('renders with placeholder text', () => {
      const onChange = jest.fn();
      render(<SearchBar value="" onChange={onChange} placeholder="Search products..." />);
      
      expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument();
    });

    it('displays the current search value', () => {
      const onChange = jest.fn();
      render(<SearchBar value="hoodie" onChange={onChange} />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('hoodie');
    });

    it('shows clear button when value is present', () => {
      const onChange = jest.fn();
      render(<SearchBar value="test" onChange={onChange} />);
      
      expect(screen.getByRole('button', { name: /clear search/i })).toBeInTheDocument();
    });

    it('does not show clear button when value is empty', () => {
      const onChange = jest.fn();
      render(<SearchBar value="" onChange={onChange} />);
      
      expect(screen.queryByRole('button', { name: /clear search/i })).not.toBeInTheDocument();
    });

    it('clears input when clear button is clicked', async () => {
      const onChange = jest.fn();
      render(<SearchBar value="test" onChange={onChange} />);
      
      const clearButton = screen.getByRole('button', { name: /clear search/i });
      fireEvent.click(clearButton);
      
      expect(onChange).toHaveBeenCalledWith('');
    });

    it('calls onChange with debounced value', async () => {
      jest.useFakeTimers();
      const onChange = jest.fn();
      render(<SearchBar value="" onChange={onChange} debounceMs={300} />);
      
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'hoodie' } });
      
      // Should not call immediately
      expect(onChange).not.toHaveBeenCalled();
      
      // Fast-forward timers
      jest.advanceTimersByTime(300);
      
      expect(onChange).toHaveBeenCalledWith('hoodie');
      jest.useRealTimers();
    });
  });

  describe('ProductGrid', () => {
    it('renders products in a grid', () => {
      render(<ProductGrid products={mockProducts} />);
      
      expect(screen.getByText('Black Hoodie')).toBeInTheDocument();
      expect(screen.getByText('White T-Shirt')).toBeInTheDocument();
      expect(screen.getByText('Gray Pants')).toBeInTheDocument();
      expect(screen.getByText('Navy Jacket')).toBeInTheDocument();
    });

    it('shows empty message when no products', () => {
      render(<ProductGrid products={[]} emptyMessage="No products found" />);
      
      expect(screen.getByText('No products found')).toBeInTheDocument();
    });

    it('shows loading skeleton when isLoading is true', () => {
      const { container } = render(<ProductGrid products={[]} isLoading={true} skeletonCount={4} />);
      
      // When loading, the grid should contain skeleton elements (divs with animate-pulse class)
      // The SkeletonGrid renders a grid with skeleton cards
      const gridElement = container.querySelector('.grid');
      expect(gridElement).toBeInTheDocument();
      
      // Should have 4 skeleton cards (based on skeletonCount)
      const skeletonCards = gridElement?.children;
      expect(skeletonCards?.length).toBe(4);
    });

    it('calls onQuickView when quick view is triggered', () => {
      const onQuickView = jest.fn();
      render(<ProductGrid products={mockProducts} onQuickView={onQuickView} />);
      
      // Find and click quick view button on first product
      const quickViewButtons = screen.getAllByRole('button', { name: /quick view/i });
      if (quickViewButtons.length > 0) {
        fireEvent.click(quickViewButtons[0]);
        expect(onQuickView).toHaveBeenCalled();
      }
    });
  });

  describe('FilterSidebar', () => {
    it('renders all filter sections', () => {
      const onFilterChange = jest.fn();
      render(
        <FilterSidebar
          filters={defaultFilters}
          onFilterChange={onFilterChange}
          availableFilters={defaultAvailableFilters}
        />
      );
      
      expect(screen.getByText('Filters')).toBeInTheDocument();
      expect(screen.getByText('Sort By')).toBeInTheDocument();
      expect(screen.getByText('Price Range')).toBeInTheDocument();
      expect(screen.getByText('Size')).toBeInTheDocument();
      expect(screen.getByText('Color')).toBeInTheDocument();
      expect(screen.getByText('Availability')).toBeInTheDocument();
    });

    it('calls onFilterChange when size is selected', () => {
      const onFilterChange = jest.fn();
      render(
        <FilterSidebar
          filters={defaultFilters}
          onFilterChange={onFilterChange}
          availableFilters={defaultAvailableFilters}
        />
      );
      
      const sizeButton = screen.getByRole('button', { name: 'M' });
      fireEvent.click(sizeButton);
      
      expect(onFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({ sizes: ['M'] })
      );
    });

    it('calls onFilterChange when color is selected', () => {
      const onFilterChange = jest.fn();
      render(
        <FilterSidebar
          filters={defaultFilters}
          onFilterChange={onFilterChange}
          availableFilters={defaultAvailableFilters}
        />
      );
      
      const colorButton = screen.getByRole('button', { name: 'Black' });
      fireEvent.click(colorButton);
      
      expect(onFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({ colors: ['Black'] })
      );
    });

    it('calls onFilterChange when sort option is changed', () => {
      const onFilterChange = jest.fn();
      render(
        <FilterSidebar
          filters={defaultFilters}
          onFilterChange={onFilterChange}
          availableFilters={defaultAvailableFilters}
        />
      );
      
      const priceAscRadio = screen.getByLabelText('Price: Low to High');
      fireEvent.click(priceAscRadio);
      
      expect(onFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({ sortBy: 'price-asc' })
      );
    });

    it('calls onFilterChange when availability is changed', () => {
      const onFilterChange = jest.fn();
      render(
        <FilterSidebar
          filters={defaultFilters}
          onFilterChange={onFilterChange}
          availableFilters={defaultAvailableFilters}
        />
      );
      
      const inStockRadio = screen.getByLabelText('In Stock');
      fireEvent.click(inStockRadio);
      
      expect(onFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({ availability: 'in-stock' })
      );
    });

    it('shows Clear All button when filters are active', () => {
      const onFilterChange = jest.fn();
      const activeFilters: FilterState = {
        ...defaultFilters,
        sizes: ['M'],
      };
      
      render(
        <FilterSidebar
          filters={activeFilters}
          onFilterChange={onFilterChange}
          availableFilters={defaultAvailableFilters}
        />
      );
      
      expect(screen.getByText('Clear All')).toBeInTheDocument();
    });

    it('clears all filters when Clear All is clicked', () => {
      const onFilterChange = jest.fn();
      const activeFilters: FilterState = {
        ...defaultFilters,
        sizes: ['M'],
        colors: ['Black'],
      };
      
      render(
        <FilterSidebar
          filters={activeFilters}
          onFilterChange={onFilterChange}
          availableFilters={defaultAvailableFilters}
        />
      );
      
      const clearButton = screen.getByText('Clear All');
      fireEvent.click(clearButton);
      
      expect(onFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({
          sizes: [],
          colors: [],
          availability: 'all',
        })
      );
    });
  });

  describe('applyFilters function', () => {
    it('filters products by price range', () => {
      const filters: FilterState = {
        ...defaultFilters,
        priceRange: [4000, 9000],
      };
      
      const result = applyFilters(mockProducts, filters) as Product[];
      
      // Should include products with price between 4000 and 9000
      expect(result.length).toBe(2);
      expect(result.find(p => p.title === 'Black Hoodie')).toBeDefined();
      expect(result.find(p => p.title === 'Gray Pants')).toBeDefined();
    });

    it('filters products by size', () => {
      const filters: FilterState = {
        ...defaultFilters,
        sizes: ['M'],
      };
      
      const result = applyFilters(mockProducts, filters) as Product[];
      
      expect(result.length).toBe(1);
      expect(result[0].title).toBe('Black Hoodie');
    });

    it('filters products by color', () => {
      const filters: FilterState = {
        ...defaultFilters,
        colors: ['White'],
      };
      
      const result = applyFilters(mockProducts, filters) as Product[];
      
      expect(result.length).toBe(1);
      expect(result[0].title).toBe('White T-Shirt');
    });

    it('filters products by in-stock availability', () => {
      const filters: FilterState = {
        ...defaultFilters,
        availability: 'in-stock',
      };
      
      const result = applyFilters(mockProducts, filters) as Product[];
      
      // Gray Pants has 0 stock, should be excluded
      expect(result.length).toBe(3);
      expect(result.find(p => p.title === 'Gray Pants')).toBeUndefined();
    });

    it('filters products by out-of-stock availability', () => {
      const filters: FilterState = {
        ...defaultFilters,
        availability: 'out-of-stock',
      };
      
      const result = applyFilters(mockProducts, filters) as Product[];
      
      expect(result.length).toBe(1);
      expect(result[0].title).toBe('Gray Pants');
    });

    it('applies multiple filters together', () => {
      const filters: FilterState = {
        priceRange: [0, 10000],
        sizes: ['M', 'L'],
        colors: ['Black', 'White'],
        availability: 'in-stock',
        sortBy: 'newest',
      };
      
      const result = applyFilters(mockProducts, filters);
      
      // Should match Black Hoodie (M, Black, in-stock, price 8000)
      // and White T-Shirt (L, White, in-stock, price 3000)
      expect(result.length).toBe(2);
    });

    it('returns all products when no filters are active', () => {
      const result = applyFilters(mockProducts, defaultFilters);
      
      expect(result.length).toBe(mockProducts.length);
    });
  });
});
