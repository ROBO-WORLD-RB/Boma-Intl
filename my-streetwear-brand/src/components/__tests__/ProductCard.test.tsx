import { render, screen, fireEvent } from "@testing-library/react";
import ProductCard from "../ProductCard";
import { useWishlistStore } from "@/store/wishlistStore";
import { Product } from "@/types";

// Reset wishlist store before each test
beforeEach(() => {
  useWishlistStore.setState({ items: [] });
});

const mockProduct: Product = {
  id: "test-product-1",
  title: "Test Streetwear Hoodie",
  slug: "test-streetwear-hoodie",
  description: "A premium streetwear hoodie from the BOMA collection",
  basePrice: 45000,
  salePrice: undefined,
  isActive: true,
  category: "hoodies",
  images: [
    {
      id: "img-1",
      url: "/test-image-1.jpg",
      isMain: true,
      altText: "Test Hoodie Front",
    },
    {
      id: "img-2",
      url: "/test-image-2.jpg",
      isMain: false,
      altText: "Test Hoodie Back",
    },
  ],
  variants: [
    { id: "v1", size: "S", color: "Black", stockQuantity: 5, sku: "TSH-S-BLK" },
    { id: "v2", size: "M", color: "Black", stockQuantity: 8, sku: "TSH-M-BLK" },
    { id: "v3", size: "L", color: "Black", stockQuantity: 0, sku: "TSH-L-BLK" },
    { id: "v4", size: "XL", color: "Black", stockQuantity: 2, sku: "TSH-XL-BLK" },
  ],
  averageRating: 4.5,
  reviewCount: 12,
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-01-01T00:00:00Z",
};

const mockProductWithSale: Product = {
  ...mockProduct,
  id: "test-product-2",
  salePrice: 35000,
};

const mockSoldOutProduct: Product = {
  ...mockProduct,
  id: "test-product-3",
  variants: mockProduct.variants.map((v) => ({ ...v, stockQuantity: 0 })),
};

describe("ProductCard", () => {
  it("renders product title", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("Test Streetwear Hoodie")).toBeInTheDocument();
  });

  it("renders product price", () => {
    render(<ProductCard product={mockProduct} />);
    // Price is rendered with GH₵ currency and formatted with toLocaleString
    expect(screen.getByText(/GH₵/)).toBeInTheDocument();
    expect(screen.getByText(/45,000/)).toBeInTheDocument();
  });

  it("renders sale price and original price when on sale", () => {
    render(<ProductCard product={mockProductWithSale} />);
    // Both sale price and original price should be displayed with GH₵ currency
    expect(screen.getByText(/35,000/)).toBeInTheDocument();
    expect(screen.getByText(/45,000/)).toBeInTheDocument();
  });

  it("renders discount badge when product is on sale", () => {
    render(<ProductCard product={mockProductWithSale} />);
    expect(screen.getByText("-22%")).toBeInTheDocument();
  });

  it("renders sold out badge when all variants are out of stock", () => {
    render(<ProductCard product={mockSoldOutProduct} />);
    expect(screen.getByText("SOLD OUT")).toBeInTheDocument();
  });

  it("renders available sizes", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("S")).toBeInTheDocument();
    expect(screen.getByText("M")).toBeInTheDocument();
    expect(screen.getByText("L")).toBeInTheDocument();
    expect(screen.getByText("XL")).toBeInTheDocument();
  });

  it("renders rating when available", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("4.5")).toBeInTheDocument();
    expect(screen.getByText("(12)")).toBeInTheDocument();
  });

  it("renders wishlist button when showWishlist is true", () => {
    render(<ProductCard product={mockProduct} showWishlist={true} />);
    expect(screen.getByRole("button", { name: /add to wishlist/i })).toBeInTheDocument();
  });

  it("does not render wishlist button when showWishlist is false", () => {
    render(<ProductCard product={mockProduct} showWishlist={false} />);
    expect(screen.queryByRole("button", { name: /wishlist/i })).not.toBeInTheDocument();
  });

  it("renders quick view button when onQuickView is provided", () => {
    const mockOnQuickView = jest.fn();
    render(<ProductCard product={mockProduct} onQuickView={mockOnQuickView} />);
    expect(screen.getByRole("button", { name: /quick view/i })).toBeInTheDocument();
  });

  it("calls onQuickView when quick view button is clicked", () => {
    const mockOnQuickView = jest.fn();
    render(<ProductCard product={mockProduct} onQuickView={mockOnQuickView} />);
    
    const quickViewButton = screen.getByRole("button", { name: /quick view/i });
    fireEvent.click(quickViewButton);
    
    expect(mockOnQuickView).toHaveBeenCalledWith(mockProduct);
  });

  it("toggles wishlist when wishlist button is clicked", () => {
    render(<ProductCard product={mockProduct} />);
    
    const wishlistButton = screen.getByRole("button", { name: /add to wishlist/i });
    fireEvent.click(wishlistButton);
    
    expect(useWishlistStore.getState().isInWishlist(mockProduct.id)).toBe(true);
  });
});
