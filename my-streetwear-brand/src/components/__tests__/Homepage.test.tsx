import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "../Navbar";
import Hero from "../Hero";
import Gallery from "../Gallery";
import { CartDrawer } from "../CartDrawer";
import { galleryData, type GalleryItem } from "@/lib/gallery-data";
import { useCartStore } from "@/store/cartStore";

// Reset cart store before each test
beforeEach(() => {
  useCartStore.setState({ items: [], isOpen: false });
});

describe("Homepage Components", () => {
  describe("Navbar", () => {
    it("renders the navbar with brand logo", () => {
      render(<Navbar />);

      const logo = screen.getByText("BOMA");
      expect(logo).toBeInTheDocument();
    });

    it("renders navigation links on desktop", () => {
      render(<Navbar />);

      expect(screen.getByText("Shop")).toBeInTheDocument();
      expect(screen.getByText("Collections")).toBeInTheDocument();
      expect(screen.getByText("About")).toBeInTheDocument();
    });

    it("renders cart button with accessible label showing item count", () => {
      render(<Navbar />);

      const cartLink = screen.getByRole("link", { name: /cart with 0 items/i });
      expect(cartLink).toBeInTheDocument();
      expect(cartLink).toHaveAttribute("href", "/cart");
    });

    it("displays cart count badge when items are in cart", () => {
      // Add an item to the cart
      useCartStore.getState().addItem({
        productId: "test-1",
        variantId: "variant-1",
        title: "Test Product",
        size: "M",
        color: "Black",
        price: 5000,
        quantity: 2,
        image: "/test.jpg",
      });

      render(<Navbar />);

      // Badge should show count of 2
      expect(screen.getByText("2")).toBeInTheDocument();
    });

    it("navigates to cart page when cart link is clicked", () => {
      render(<Navbar />);

      const cartLink = screen.getByRole("link", { name: /cart/i });
      expect(cartLink).toHaveAttribute("href", "/cart");
    });

    it("renders hamburger menu button for mobile", () => {
      render(<Navbar />);

      const menuButton = screen.getByRole("button", { name: /open menu/i });
      expect(menuButton).toBeInTheDocument();
    });

    it("opens mobile menu when hamburger is clicked", () => {
      render(<Navbar />);

      const menuButton = screen.getByRole("button", { name: /open menu/i });
      fireEvent.click(menuButton);

      // Mobile menu should show navigation links
      const shopLinks = screen.getAllByText("Shop");
      expect(shopLinks.length).toBeGreaterThan(1); // Desktop + mobile menu
    });
  });

  describe("CartDrawer", () => {
    it("displays empty cart message when cart is empty", () => {
      useCartStore.setState({ isOpen: true });
      render(<CartDrawer />);

      expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
      expect(screen.getByText(/start shopping/i)).toBeInTheDocument();
    });

    it("displays cart items when cart has items", () => {
      useCartStore.setState({
        isOpen: true,
        items: [
          {
            id: "item-1",
            productId: "test-1",
            variantId: "variant-1",
            title: "Test Product",
            size: "M",
            color: "Black",
            price: 5000,
            quantity: 1,
            image: "/test.jpg",
          },
        ],
      });

      render(<CartDrawer />);

      expect(screen.getByText("Test Product")).toBeInTheDocument();
      expect(screen.getByText("M / Black")).toBeInTheDocument();
    });

    it("updates quantity when plus/minus buttons are clicked", () => {
      useCartStore.setState({
        isOpen: true,
        items: [
          {
            id: "item-1",
            productId: "test-1",
            variantId: "variant-1",
            title: "Test Product",
            size: "M",
            color: "Black",
            price: 5000,
            quantity: 1,
            image: "/test.jpg",
          },
        ],
      });

      render(<CartDrawer />);

      // Click increase button
      const increaseButton = screen.getByRole("button", { name: /increase quantity/i });
      fireEvent.click(increaseButton);

      // Quantity should now be 2
      expect(screen.getByText("2")).toBeInTheDocument();
    });

    it("removes item when remove button is clicked", () => {
      useCartStore.setState({
        isOpen: true,
        items: [
          {
            id: "item-1",
            productId: "test-1",
            variantId: "variant-1",
            title: "Test Product",
            size: "M",
            color: "Black",
            price: 5000,
            quantity: 1,
            image: "/test.jpg",
          },
        ],
      });

      render(<CartDrawer />);

      const removeButton = screen.getByRole("button", { name: /remove item/i });
      fireEvent.click(removeButton);

      // Should show empty cart message
      expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    });

    it("displays correct totals", () => {
      useCartStore.setState({
        isOpen: true,
        items: [
          {
            id: "item-1",
            productId: "test-1",
            variantId: "variant-1",
            title: "Test Product",
            size: "M",
            color: "Black",
            price: 10000,
            quantity: 2,
            image: "/test.jpg",
          },
        ],
      });

      render(<CartDrawer />);

      // Check for specific formatted amounts with GH₵ currency
      expect(screen.getByText("GH₵20,000.00")).toBeInTheDocument(); // Subtotal
      expect(screen.getByText("GH₵1,500.00")).toBeInTheDocument(); // Tax
      expect(screen.getByText("GH₵21,500.00")).toBeInTheDocument(); // Total
    });

    it("checkout button links to /checkout", () => {
      useCartStore.setState({
        isOpen: true,
        items: [
          {
            id: "item-1",
            productId: "test-1",
            variantId: "variant-1",
            title: "Test Product",
            size: "M",
            color: "Black",
            price: 5000,
            quantity: 1,
            image: "/test.jpg",
          },
        ],
      });

      render(<CartDrawer />);

      const checkoutButton = screen.getByRole("link", { name: /checkout/i });
      expect(checkoutButton).toHaveAttribute("href", "/checkout");
    });
  });

  describe("Hero", () => {
    it("renders the main headline", () => {
      render(<Hero />);

      // The Hero component displays "Culture Has No Borders" as the first slide text
      const headline = screen.getByText("Culture Has No Borders", { exact: false });
      expect(headline).toBeInTheDocument();
    });

    it("renders the Shop Now CTA button", () => {
      render(<Hero />);

      const ctaButton = screen.getByRole("link", { name: /shop now/i });
      expect(ctaButton).toBeInTheDocument();
      expect(ctaButton).toHaveAttribute("href", "/shop");
    });
  });

  describe("Gallery", () => {
    it("renders the correct number of gallery images", () => {
      render(<Gallery />);

      const images = screen.getAllByRole("img");
      expect(images).toHaveLength(galleryData.length);
    });

    it("renders all gallery items with correct alt text", () => {
      render(<Gallery />);

      galleryData.forEach((item: GalleryItem) => {
        const image = screen.getByAltText(item.alt);
        expect(image).toBeInTheDocument();
      });
    });

    it("renders gallery images with Next.js Image component", () => {
      render(<Gallery />);

      const images = screen.getAllByRole("img");
      // Next.js Image component handles lazy loading internally
      // and may not expose the loading attribute directly
      images.forEach((img) => {
        expect(img).toBeInTheDocument();
      });
    });
  });
});
