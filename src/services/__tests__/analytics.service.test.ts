import { AnalyticsService } from '../analytics.service';
import * as prismaModule from '../../utils/prisma';
import { Decimal } from '@prisma/client/runtime/library';

// Mock Prisma
jest.mock('../../utils/prisma', () => ({
  __esModule: true,
  default: {
    order: {
      findMany: jest.fn(),
      groupBy: jest.fn(),
      count: jest.fn(),
    },
    user: {
      count: jest.fn(),
    },
  },
}));

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  beforeEach(() => {
    service = new AnalyticsService();
    jest.clearAllMocks();
  });

  describe('getSalesAnalytics', () => {
    it('should calculate total revenue correctly', async () => {
      const mockOrders = [
        {
          id: 'order-1',
          userId: 'user-1',
          status: 'PAID',
          totalAmount: new Decimal('100'),
          createdAt: new Date(),
          items: [
            {
              quantity: 1,
              priceAtPurchase: new Decimal('100'),
              variant: {
                product: { id: 'prod-1', title: 'Product 1' },
              },
            },
          ],
        },
        {
          id: 'order-2',
          userId: 'user-2',
          status: 'SHIPPED',
          totalAmount: new Decimal('200'),
          createdAt: new Date(),
          items: [
            {
              quantity: 2,
              priceAtPurchase: new Decimal('100'),
              variant: {
                product: { id: 'prod-2', title: 'Product 2' },
              },
            },
          ],
        },
      ];

      const prisma = prismaModule.default as any;
      prisma.order.findMany.mockResolvedValue(mockOrders);
      prisma.order.groupBy.mockResolvedValue([
        { status: 'PAID', _count: { status: 1 } },
        { status: 'SHIPPED', _count: { status: 1 } },
      ]);

      const result = await service.getSalesAnalytics(30);

      expect(result.totalRevenue).toBe(300);
      expect(result.orderCount).toBe(2);
      expect(result.averageOrderValue).toBe(150);
    });

    it('should calculate average order value correctly', async () => {
      const mockOrders = [
        {
          id: 'order-1',
          userId: 'user-1',
          status: 'PAID',
          totalAmount: new Decimal('100'),
          createdAt: new Date(),
          items: [],
        },
        {
          id: 'order-2',
          userId: 'user-2',
          status: 'PAID',
          totalAmount: new Decimal('200'),
          createdAt: new Date(),
          items: [],
        },
        {
          id: 'order-3',
          userId: 'user-3',
          status: 'PAID',
          totalAmount: new Decimal('300'),
          createdAt: new Date(),
          items: [],
        },
      ];

      const prisma = prismaModule.default as any;
      prisma.order.findMany.mockResolvedValue(mockOrders);
      prisma.order.groupBy.mockResolvedValue([
        { status: 'PAID', _count: { status: 3 } },
      ]);

      const result = await service.getSalesAnalytics(30);

      expect(result.averageOrderValue).toBe(200);
    });

    it('should return zero average for no orders', async () => {
      const prisma = prismaModule.default as any;
      prisma.order.findMany.mockResolvedValue([]);
      prisma.order.groupBy.mockResolvedValue([]);

      const result = await service.getSalesAnalytics(30);

      expect(result.totalRevenue).toBe(0);
      expect(result.orderCount).toBe(0);
      expect(result.averageOrderValue).toBe(0);
    });

    it('should identify top products by revenue', async () => {
      const mockOrders = [
        {
          id: 'order-1',
          userId: 'user-1',
          status: 'PAID',
          totalAmount: new Decimal('500'),
          createdAt: new Date(),
          items: [
            {
              quantity: 5,
              priceAtPurchase: new Decimal('100'),
              variant: {
                product: { id: 'prod-1', title: 'Popular Product' },
              },
            },
          ],
        },
        {
          id: 'order-2',
          userId: 'user-2',
          status: 'PAID',
          totalAmount: new Decimal('100'),
          createdAt: new Date(),
          items: [
            {
              quantity: 1,
              priceAtPurchase: new Decimal('100'),
              variant: {
                product: { id: 'prod-2', title: 'Less Popular' },
              },
            },
          ],
        },
      ];

      const prisma = prismaModule.default as any;
      prisma.order.findMany.mockResolvedValue(mockOrders);
      prisma.order.groupBy.mockResolvedValue([
        { status: 'PAID', _count: { status: 2 } },
      ]);

      const result = await service.getSalesAnalytics(30);

      expect(result.topProducts).toHaveLength(2);
      expect(result.topProducts[0].productId).toBe('prod-1');
      expect(result.topProducts[0].totalSold).toBe(5);
      expect(result.topProducts[0].revenue).toBe(500);
    });

    it('should include only PAID, SHIPPED, DELIVERED orders', async () => {
      const prisma = prismaModule.default as any;
      prisma.order.findMany.mockResolvedValue([]);
      prisma.order.groupBy.mockResolvedValue([]);

      await service.getSalesAnalytics(30);

      expect(prisma.order.findMany).toHaveBeenCalledWith({
        where: {
          status: { in: ['PAID', 'SHIPPED', 'DELIVERED'] },
          createdAt: { gte: expect.any(Date) },
        },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: { select: { id: true, title: true } },
                },
              },
            },
          },
        },
      });
    });

    it('should generate daily sales data', async () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const mockOrders = [
        {
          id: 'order-1',
          userId: 'user-1',
          status: 'PAID',
          totalAmount: new Decimal('100'),
          createdAt: yesterday,
          items: [],
        },
        {
          id: 'order-2',
          userId: 'user-2',
          status: 'PAID',
          totalAmount: new Decimal('200'),
          createdAt: today,
          items: [],
        },
      ];

      const prisma = prismaModule.default as any;
      prisma.order.findMany.mockResolvedValue(mockOrders);
      prisma.order.groupBy.mockResolvedValue([
        { status: 'PAID', _count: { status: 2 } },
      ]);

      const result = await service.getSalesAnalytics(30);

      expect(result.salesOverTime.length).toBeGreaterThan(0);
      expect(result.salesOverTime[0]).toHaveProperty('date');
      expect(result.salesOverTime[0]).toHaveProperty('revenue');
      expect(result.salesOverTime[0]).toHaveProperty('orderCount');
    });
  });

  describe('getQuickMetrics', () => {
    it('should calculate this month revenue', async () => {
      const mockThisMonthOrders = [
        { totalAmount: new Decimal('100') },
        { totalAmount: new Decimal('200') },
      ];
      const mockLastMonthOrders = [
        { totalAmount: new Decimal('150') },
      ];

      const prisma = prismaModule.default as any;
      prisma.order.findMany
        .mockResolvedValueOnce(mockThisMonthOrders)
        .mockResolvedValueOnce(mockLastMonthOrders);
      prisma.order.count.mockResolvedValue(5);
      prisma.user.count.mockResolvedValue(10);

      const result = await service.getQuickMetrics();

      expect(result.thisMonthRevenue).toBe(300);
      expect(result.lastMonthRevenue).toBe(150);
    });

    it('should calculate revenue growth percentage', async () => {
      const mockThisMonthOrders = [
        { totalAmount: new Decimal('200') },
      ];
      const mockLastMonthOrders = [
        { totalAmount: new Decimal('100') },
      ];

      const prisma = prismaModule.default as any;
      prisma.order.findMany
        .mockResolvedValueOnce(mockThisMonthOrders)
        .mockResolvedValueOnce(mockLastMonthOrders);
      prisma.order.count.mockResolvedValue(0);
      prisma.user.count.mockResolvedValue(0);

      const result = await service.getQuickMetrics();

      expect(result.revenueGrowth).toBe(100);
    });

    it('should return 100% growth when last month was zero', async () => {
      const mockThisMonthOrders = [
        { totalAmount: new Decimal('100') },
      ];
      const mockLastMonthOrders: any[] = [];

      const prisma = prismaModule.default as any;
      prisma.order.findMany
        .mockResolvedValueOnce(mockThisMonthOrders)
        .mockResolvedValueOnce(mockLastMonthOrders);
      prisma.order.count.mockResolvedValue(0);
      prisma.user.count.mockResolvedValue(0);

      const result = await service.getQuickMetrics();

      expect(result.revenueGrowth).toBe(100);
    });

    it('should count pending orders', async () => {
      const prisma = prismaModule.default as any;
      prisma.order.findMany.mockResolvedValue([]);
      prisma.order.count.mockResolvedValue(3);
      prisma.user.count.mockResolvedValue(10);

      const result = await service.getQuickMetrics();

      expect(result.pendingOrders).toBe(3);
    });

    it('should count total customers', async () => {
      const prisma = prismaModule.default as any;
      prisma.order.findMany.mockResolvedValue([]);
      prisma.order.count.mockResolvedValue(0);
      prisma.user.count.mockResolvedValue(42);

      const result = await service.getQuickMetrics();

      expect(result.totalCustomers).toBe(42);
    });
  });
});
