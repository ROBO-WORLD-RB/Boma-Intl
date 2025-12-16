import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OrderHistory } from "../OrderHistory";
import { AddressBook } from "../AddressBook";
import { api } from "@/lib/api";

// Mock the API module
jest.mock("@/lib/api", () => ({
  api: {
    orders: {
      list: jest.fn(),
    },
    addresses: {
      list: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      setDefault: jest.fn(),
    },
  },
}));

// Mock next/link
jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

const mockOrders = [
  {
    id: "order-123456789",
    status: "DELIVERED" as const,
    totalAmount: 75000,
    paymentRef: "PAY-123",
    shippingAddress: {
      id: "addr-1",
      fullName: "John Doe",
      street: "123 Main St",
      city: "Lagos",
      state: "Lagos",
      postalCode: "100001",
      country: "Nigeria",
      phone: "+234 800 000 0000",
      isDefault: true,
    },
    items: [
      {
        id: "item-1",
        quantity: 2,
        priceAtPurchase: 35000,
        variant: {
          id: "v1",
          size: "M",
          color: "Black",
          stockQuantity: 10,
          sku: "TSH-M-BLK",
        },
        product: {
          id: "prod-1",
          title: "Test Hoodie",
          slug: "test-hoodie",
          description: "A test hoodie",
          basePrice: 35000,
          isActive: true,
          category: "hoodies",
          images: [{ id: "img-1", url: "/test.jpg", isMain: true, altText: "Test" }],
          variants: [],
          createdAt: "2025-01-01T00:00:00Z",
          updatedAt: "2025-01-01T00:00:00Z",
        },
      },
    ],
    createdAt: "2025-01-15T10:30:00Z",
    updatedAt: "2025-01-15T10:30:00Z",
  },
  {
    id: "order-987654321",
    status: "SHIPPED" as const,
    totalAmount: 45000,
    paymentRef: "PAY-456",
    shippingAddress: {
      id: "addr-1",
      fullName: "John Doe",
      street: "123 Main St",
      city: "Lagos",
      state: "Lagos",
      postalCode: "100001",
      country: "Nigeria",
      phone: "+234 800 000 0000",
      isDefault: true,
    },
    items: [
      {
        id: "item-2",
        quantity: 1,
        priceAtPurchase: 45000,
        variant: {
          id: "v2",
          size: "L",
          color: "White",
          stockQuantity: 5,
          sku: "TSH-L-WHT",
        },
        product: {
          id: "prod-2",
          title: "Test T-Shirt",
          slug: "test-tshirt",
          description: "A test t-shirt",
          basePrice: 45000,
          isActive: true,
          category: "tshirts",
          images: [{ id: "img-2", url: "/test2.jpg", isMain: true, altText: "Test 2" }],
          variants: [],
          createdAt: "2025-01-01T00:00:00Z",
          updatedAt: "2025-01-01T00:00:00Z",
        },
      },
    ],
    createdAt: "2025-01-10T14:00:00Z",
    updatedAt: "2025-01-10T14:00:00Z",
  },
];

const mockAddresses = [
  {
    id: "addr-1",
    fullName: "John Doe",
    street: "123 Main Street",
    city: "Lagos",
    state: "Lagos",
    postalCode: "100001",
    country: "Nigeria",
    phone: "+234 800 000 0000",
    isDefault: true,
  },
  {
    id: "addr-2",
    fullName: "Jane Doe",
    street: "456 Second Ave",
    city: "Abuja",
    state: "FCT",
    postalCode: "900001",
    country: "Nigeria",
    phone: "+234 800 111 1111",
    isDefault: false,
  },
];

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
}

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

describe("OrderHistory", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("displays loading state initially", () => {
    (api.orders.list as jest.Mock).mockReturnValue(new Promise(() => {}));
    renderWithQueryClient(<OrderHistory />);
    
    // Should show skeleton loaders
    const skeletons = document.querySelectorAll('[class*="animate-pulse"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("displays orders when loaded", async () => {
    (api.orders.list as jest.Mock).mockResolvedValue({ data: mockOrders });
    renderWithQueryClient(<OrderHistory />);

    await waitFor(() => {
      expect(screen.getByText(/56789/i)).toBeInTheDocument();
    });

    expect(screen.getByText("Delivered")).toBeInTheDocument();
    expect(screen.getByText("Shipped")).toBeInTheDocument();
  });

  it("displays empty state when no orders", async () => {
    (api.orders.list as jest.Mock).mockResolvedValue({ data: [] });
    renderWithQueryClient(<OrderHistory />);

    await waitFor(() => {
      expect(screen.getByText("No orders yet")).toBeInTheDocument();
    });

    expect(screen.getByText("Start shopping")).toBeInTheDocument();
  });

  it("displays error state on API failure", async () => {
    (api.orders.list as jest.Mock).mockRejectedValue(new Error("API Error"));
    renderWithQueryClient(<OrderHistory />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load orders/i)).toBeInTheDocument();
    });
  });

  it("displays order item count correctly", async () => {
    (api.orders.list as jest.Mock).mockResolvedValue({ data: mockOrders });
    renderWithQueryClient(<OrderHistory />);

    await waitFor(() => {
      // Both orders have 1 item each
      expect(screen.getAllByText("1 item")).toHaveLength(2);
    });
  });
});

describe("AddressBook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("displays loading state initially", () => {
    (api.addresses.list as jest.Mock).mockReturnValue(new Promise(() => {}));
    renderWithQueryClient(<AddressBook />);
    
    const skeletons = document.querySelectorAll('[class*="animate-pulse"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("displays addresses when loaded", async () => {
    (api.addresses.list as jest.Mock).mockResolvedValue({ data: mockAddresses });
    renderWithQueryClient(<AddressBook />);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("123 Main Street")).toBeInTheDocument();
    expect(screen.getByText("456 Second Ave")).toBeInTheDocument();
  });

  it("displays default badge for default address", async () => {
    (api.addresses.list as jest.Mock).mockResolvedValue({ data: mockAddresses });
    renderWithQueryClient(<AddressBook />);

    await waitFor(() => {
      expect(screen.getByText("Default")).toBeInTheDocument();
    });
  });

  it("displays empty state when no addresses", async () => {
    (api.addresses.list as jest.Mock).mockResolvedValue({ data: [] });
    renderWithQueryClient(<AddressBook />);

    await waitFor(() => {
      expect(screen.getByText("No addresses saved")).toBeInTheDocument();
    });
  });

  it("opens add address modal when clicking Add Address button", async () => {
    (api.addresses.list as jest.Mock).mockResolvedValue({ data: mockAddresses });
    renderWithQueryClient(<AddressBook />);

    await waitFor(() => {
      expect(screen.getByText("Add Address")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Add Address"));

    await waitFor(() => {
      expect(screen.getByText("Add New Address")).toBeInTheDocument();
    });
  });

  it("opens edit modal when clicking Edit button", async () => {
    (api.addresses.list as jest.Mock).mockResolvedValue({ data: mockAddresses });
    renderWithQueryClient(<AddressBook />);

    await waitFor(() => {
      expect(screen.getAllByText("Edit")[0]).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText("Edit")[0]);

    await waitFor(() => {
      expect(screen.getByText("Edit Address")).toBeInTheDocument();
    });
  });

  it("displays error state on API failure", async () => {
    (api.addresses.list as jest.Mock).mockRejectedValue(new Error("API Error"));
    renderWithQueryClient(<AddressBook />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load addresses/i)).toBeInTheDocument();
    });
  });

  it("shows Set as default option for non-default addresses", async () => {
    (api.addresses.list as jest.Mock).mockResolvedValue({ data: mockAddresses });
    renderWithQueryClient(<AddressBook />);

    await waitFor(() => {
      expect(screen.getByText("Set as default")).toBeInTheDocument();
    });
  });
});
