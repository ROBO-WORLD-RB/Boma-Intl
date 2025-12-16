import { render, screen, fireEvent } from "@testing-library/react";
import QuickViewModal from "../QuickViewModal";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { Product } from "@/types";

// Reset stores before each test
beforeEach(() => {
  useCartStore.setState({ items: [], isOpen: false });
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
    { id: "v4", size: "S", color: "White", stockQuantity: 3, sku: "TSH-S-WHT" },
    { id: "v5", size: "M", color: "White", stockQuantity: 6, sku: "TSH-M-WHT" },
  ],
  averageRating: 4.5,
  reviewCount: 12,
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-01-01T00:00:00Z",
};

describe("QuickViewModal", () => {
  it("renders nothing when product is null", () => {
    const { container } = render(
      <QuickViewModal product={null} isOpen={true} onClose={jest.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when isOpen is false", () => {
    const { container } = render(
      <QuickViewModal product={mockProduct} isOpen={false} onClose={jest.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders product title when open", () => {
    render(
      <QuickViewModal product={mockProduct} isOpen={true} onClose={jest.fn()} />
    );
    expect(screen.getByText("Test Streetwear Hoodie")).toBeInTheDocument();
  });

  it("renders product description", () => {
    render(
      <QuickViewModal product={mockProduct} isOpen={true} onClose={jest.fn()} />
    );
    expect(screen.getByText(/premium streetwear hoodie/i)).toBeInTheDocument();
  });

  it("renders product price", () => {
    render(
      <QuickViewModal product={mockProduct} isOpen={true} onClose={jest.fn()} />
    );
    // Price is rendered with GH₵ currency
    expect(screen.getByText(/GH₵/)).toBeInTheDocument();
    expect(screen.getByText(/45,000/)).toBeInTheDocument();
  });

  it("renders size selection buttons", () => {
    render(
      <QuickViewModal product={mockProduct} isOpen={true} onClose={jest.fn()} />
    );
    expect(screen.getByRole("button", { name: "S" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "M" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "L" })).toBeInTheDocument();
  });

  it("renders color selection buttons", () => {
    render(
      <QuickViewModal product={mockProduct} isOpen={true} onClose={jest.fn()} />
    );
    expect(screen.getByRole("button", { name: "Black" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "White" })).toBeInTheDocument();
  });

  it("allows selecting a size", () => {
    render(
      <QuickViewModal product={mockProduct} isOpen={true} onClose={jest.fn()} />
    );
    
    const mediumButton = screen.getByRole("button", { name: "M" });
    fireEvent.click(mediumButton);
    
    // Button should have selected styling (bg-white)
    expect(mediumButton).toHaveClass("bg-white");
  });

  it("allows selecting a color", () => {
    render(
      <QuickViewModal product={mockProduct} isOpen={true} onClose={jest.fn()} />
    );
    
    const whiteButton = screen.getByRole("button", { name: "White" });
    fireEvent.click(whiteButton);
    
    expect(whiteButton).toHaveClass("bg-white");
  });

  it("disables out of stock size options", () => {
    render(
      <QuickViewModal product={mockProduct} isOpen={true} onClose={jest.fn()} />
    );
    
    // L size has 0 stock
    const largeButton = screen.getByRole("button", { name: "L" });
    expect(largeButton).toBeDisabled();
  });

  it("renders quantity controls", () => {
    render(
      <QuickViewModal product={mockProduct} isOpen={true} onClose={jest.fn()} />
    );
    
    expect(screen.getByRole("button", { name: /decrease quantity/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /increase quantity/i })).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument(); // Default quantity
  });

  it("increases quantity when plus button is clicked", () => {
    render(
      <QuickViewModal product={mockProduct} isOpen={true} onClose={jest.fn()} />
    );
    
    const increaseButton = screen.getByRole("button", { name: /increase quantity/i });
    fireEvent.click(increaseButton);
    
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("decreases quantity when minus button is clicked", () => {
    render(
      <QuickViewModal product={mockProduct} isOpen={true} onClose={jest.fn()} />
    );
    
    // First increase to 2
    const increaseButton = screen.getByRole("button", { name: /increase quantity/i });
    fireEvent.click(increaseButton);
    
    // Then decrease back to 1
    const decreaseButton = screen.getByRole("button", { name: /decrease quantity/i });
    fireEvent.click(decreaseButton);
    
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("does not decrease quantity below 1", () => {
    render(
      <QuickViewModal product={mockProduct} isOpen={true} onClose={jest.fn()} />
    );
    
    const decreaseButton = screen.getByRole("button", { name: /decrease quantity/i });
    fireEvent.click(decreaseButton);
    fireEvent.click(decreaseButton);
    
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("adds item to cart when Add to Cart is clicked", () => {
    const mockOnClose = jest.fn();
    render(
      <QuickViewModal product={mockProduct} isOpen={true} onClose={mockOnClose} />
    );
    
    // Select size and color (S and Black are default)
    const addToCartButton = screen.getByRole("button", { name: /add to cart/i });
    fireEvent.click(addToCartButton);
    
    // Check cart has the item
    const cartItems = useCartStore.getState().items;
    expect(cartItems).toHaveLength(1);
    expect(cartItems[0].productId).toBe(mockProduct.id);
    expect(cartItems[0].size).toBe("S");
    expect(cartItems[0].color).toBe("Black");
  });

  it("closes modal after adding to cart", () => {
    const mockOnClose = jest.fn();
    render(
      <QuickViewModal product={mockProduct} isOpen={true} onClose={mockOnClose} />
    );
    
    const addToCartButton = screen.getByRole("button", { name: /add to cart/i });
    fireEvent.click(addToCartButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("opens cart drawer after adding to cart", () => {
    render(
      <QuickViewModal product={mockProduct} isOpen={true} onClose={jest.fn()} />
    );
    
    const addToCartButton = screen.getByRole("button", { name: /add to cart/i });
    fireEvent.click(addToCartButton);
    
    expect(useCartStore.getState().isOpen).toBe(true);
  });

  it("calls onClose when close button is clicked", () => {
    const mockOnClose = jest.fn();
    render(
      <QuickViewModal product={mockProduct} isOpen={true} onClose={mockOnClose} />
    );
    
    const closeButton = screen.getByRole("button", { name: /close modal/i });
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("calls onClose when backdrop is clicked", () => {
    const mockOnClose = jest.fn();
    const { container } = render(
      <QuickViewModal product={mockProduct} isOpen={true} onClose={mockOnClose} />
    );
    
    // Click the backdrop (the div with aria-hidden="true")
    const backdrop = container.querySelector('[aria-hidden="true"]');
    expect(backdrop).toBeInTheDocument();
    fireEvent.click(backdrop!);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("renders wishlist button", () => {
    render(
      <QuickViewModal product={mockProduct} isOpen={true} onClose={jest.fn()} />
    );
    
    expect(screen.getByRole("button", { name: /add to wishlist/i })).toBeInTheDocument();
  });

  it("renders image thumbnails for products with multiple images", () => {
    render(
      <QuickViewModal product={mockProduct} isOpen={true} onClose={jest.fn()} />
    );
    
    // Should have thumbnail buttons for each image
    const images = screen.getAllByRole("img");
    expect(images.length).toBeGreaterThanOrEqual(2);
  });
});
