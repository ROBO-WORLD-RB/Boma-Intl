import { render, screen } from "@testing-library/react";
import { SalesMetrics, SalesMetricsData } from "../admin/SalesMetrics";
import { SalesChart, SalesDataPoint } from "../admin/SalesChart";
import { OrderTable } from "../admin/OrderTable";
import { ProductTable } from "../admin/ProductTable";
import { InventoryAlerts, LowStockItem } from "../admin/InventoryAlerts";
import { Order, Product } from "@/types";

// Mock data
const mockMetricsData: SalesMetricsData = {
  totalRevenue: 1500000,
  orderCount: 45,
  averageOrderValue: 33333,
};

const mockSalesData: SalesDataPoint[] = [
  { date: "2025-12-01", revenue: 150000, orders: 5 },
  { date: "2025-12-02", revenue: 200000, orders: 7 },
  { date: "2025-12-03", revenue: 180000, orders: 6 },
  { date: "2025-12-04", revenue: 250000, orders: 8 },
  { date: "2025-12-05", revenue: 220000, orders: 7 },
];

const mockOrders: Order[] = [
  {
    id: "order-123456789",
    status: "PAID",
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
      phone: "+234123456789",
      isDefault: true,
    },
    items: [],
    createdAt: "2025-12-10T10:00:00Z",
    updatedAt: "2025-12-10T10:00:00Z",
  },
  {
    id: "order-987654321",
    status: "PENDING",
    totalAmount: 45000,
    paymentRef: "PAY-456",
    shippingAddress: {
      id: "addr-2",
      fullName: "Jane Smith",
      street: "456 Oak Ave",
      city: "Accra",
      state: "Greater Accra",
      postalCode: "00233",
      country: "Ghana",
      phone: "+233123456789",
      isDefault: false,
    },
    items: [],
    createdAt: "2025-12-09T15:30:00Z",
    updatedAt: "2025-12-09T15:30:00Z",
  },
];

const mockProducts: Product[] = [
  {
    id: "prod-1",
    title: "BOMA Hoodie",
    slug: "boma-hoodie",
    description: "Premium streetwear hoodie",
    basePrice: 45000,
    isActive: true,
    category: "Hoodies",
    images: [{ id: "img-1", url: "/hoodie.jpg", isMain: true, altText: "Hoodie" }],
    variants: [
      { id: "v1", size: "M", color: "Black", stockQuantity: 10, sku: "BH-M-BLK" },
      { id: "v2", size: "L", color: "Black", stockQuantity: 5, sku: "BH-L-BLK" },
    ],
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "prod-2",
    title: "BOMA T-Shirt",
    slug: "boma-tshirt",
    description: "Classic streetwear tee",
    basePrice: 25000,
    salePrice: 20000,
    isActive: false,
    category: "T-Shirts",
    images: [{ id: "img-2", url: "/tshirt.jpg", isMain: true, altText: "T-Shirt" }],
    variants: [
      { id: "v3", size: "S", color: "White", stockQuantity: 0, sku: "BT-S-WHT" },
    ],
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
];

const mockLowStockItems: LowStockItem[] = [
  {
    productId: "prod-1",
    variantId: "v1",
    title: "BOMA Hoodie",
    size: "M",
    color: "Black",
    stockQuantity: 2,
  },
  {
    productId: "prod-2",
    variantId: "v2",
    title: "BOMA T-Shirt",
    size: "L",
    color: "White",
    stockQuantity: 1,
  },
];

describe("SalesMetrics", () => {
  it("renders revenue metric", () => {
    render(<SalesMetrics data={mockMetricsData} />);
    expect(screen.getByText("Total Revenue")).toBeInTheDocument();
    expect(screen.getByText("₦1,500,000")).toBeInTheDocument();
  });

  it("renders order count metric", () => {
    render(<SalesMetrics data={mockMetricsData} />);
    expect(screen.getByText("Total Orders")).toBeInTheDocument();
    expect(screen.getByText("45")).toBeInTheDocument();
  });

  it("renders average order value metric", () => {
    render(<SalesMetrics data={mockMetricsData} />);
    expect(screen.getByText("Average Order Value")).toBeInTheDocument();
    expect(screen.getByText("₦33,333")).toBeInTheDocument();
  });

  it("renders loading state", () => {
    render(<SalesMetrics data={mockMetricsData} isLoading={true} />);
    const skeletons = document.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });
});

describe("SalesChart", () => {
  it("renders chart title", () => {
    render(<SalesChart data={mockSalesData} />);
    expect(screen.getByText("Sales Over Time")).toBeInTheDocument();
  });

  it("renders summary stats", () => {
    render(<SalesChart data={mockSalesData} />);
    expect(screen.getByText("Total Revenue")).toBeInTheDocument();
    expect(screen.getByText("Total Orders")).toBeInTheDocument();
    expect(screen.getByText("Avg Daily Revenue")).toBeInTheDocument();
  });

  it("renders empty state when no data", () => {
    render(<SalesChart data={[]} />);
    expect(screen.getByText("No sales data available")).toBeInTheDocument();
  });

  it("renders loading state", () => {
    render(<SalesChart data={mockSalesData} isLoading={true} />);
    const skeletons = document.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });
});

describe("OrderTable", () => {
  it("renders table header", () => {
    render(<OrderTable orders={mockOrders} />);
    expect(screen.getByText("Recent Orders")).toBeInTheDocument();
  });

  it("renders order IDs", () => {
    render(<OrderTable orders={mockOrders} />);
    expect(screen.getByText("#order-12")).toBeInTheDocument();
    expect(screen.getByText("#order-98")).toBeInTheDocument();
  });

  it("renders customer names", () => {
    render(<OrderTable orders={mockOrders} />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it("renders order statuses", () => {
    render(<OrderTable orders={mockOrders} />);
    expect(screen.getByText("PAID")).toBeInTheDocument();
    expect(screen.getByText("PENDING")).toBeInTheDocument();
  });

  it("renders order totals", () => {
    render(<OrderTable orders={mockOrders} />);
    expect(screen.getByText("₦75,000")).toBeInTheDocument();
    expect(screen.getByText("₦45,000")).toBeInTheDocument();
  });

  it("renders empty state when no orders", () => {
    render(<OrderTable orders={[]} />);
    expect(screen.getByText("No orders found")).toBeInTheDocument();
  });

  it("renders loading state", () => {
    render(<OrderTable orders={[]} isLoading={true} />);
    const skeletons = document.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });
});

describe("ProductTable", () => {
  it("renders table header", () => {
    render(<ProductTable products={mockProducts} />);
    expect(screen.getByText("Products")).toBeInTheDocument();
  });

  it("renders product titles", () => {
    render(<ProductTable products={mockProducts} />);
    expect(screen.getByText("BOMA Hoodie")).toBeInTheDocument();
    expect(screen.getByText("BOMA T-Shirt")).toBeInTheDocument();
  });

  it("renders product categories", () => {
    render(<ProductTable products={mockProducts} />);
    expect(screen.getByText("Hoodies")).toBeInTheDocument();
    expect(screen.getByText("T-Shirts")).toBeInTheDocument();
  });

  it("renders product prices", () => {
    render(<ProductTable products={mockProducts} />);
    expect(screen.getByText("₦45,000")).toBeInTheDocument();
    expect(screen.getByText("₦20,000")).toBeInTheDocument();
  });

  it("renders active/inactive status", () => {
    render(<ProductTable products={mockProducts} />);
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Inactive")).toBeInTheDocument();
  });

  it("renders empty state when no products", () => {
    render(<ProductTable products={[]} />);
    expect(screen.getByText("No products found")).toBeInTheDocument();
  });

  it("renders loading state", () => {
    render(<ProductTable products={[]} isLoading={true} />);
    const skeletons = document.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });
});

describe("InventoryAlerts", () => {
  it("renders alert header", () => {
    render(<InventoryAlerts items={mockLowStockItems} />);
    expect(screen.getByText("Low Stock Alerts")).toBeInTheDocument();
  });

  it("renders item count badge", () => {
    render(<InventoryAlerts items={mockLowStockItems} />);
    expect(screen.getByText("2 items")).toBeInTheDocument();
  });

  it("renders low stock item titles", () => {
    render(<InventoryAlerts items={mockLowStockItems} />);
    expect(screen.getByText("BOMA Hoodie")).toBeInTheDocument();
    expect(screen.getByText("BOMA T-Shirt")).toBeInTheDocument();
  });

  it("renders stock quantities", () => {
    render(<InventoryAlerts items={mockLowStockItems} />);
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("renders healthy inventory state when no low stock items", () => {
    render(<InventoryAlerts items={[]} />);
    expect(screen.getByText("All inventory levels are healthy")).toBeInTheDocument();
  });

  it("renders loading state", () => {
    render(<InventoryAlerts items={[]} isLoading={true} />);
    const skeletons = document.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("marks critical items correctly", () => {
    render(<InventoryAlerts items={mockLowStockItems} criticalThreshold={3} />);
    expect(screen.getAllByText("Critical").length).toBe(2);
  });
});
