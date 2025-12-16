import prisma from '../utils/prisma';
import { Decimal } from '@prisma/client/runtime/library';

interface SalesOverTime {
  date: string;
  revenue: number;
  orderCount: number;
}

interface AnalyticsResult {
  totalRevenue: number;
  orderCount: number;
  averageOrderValue: number;
  salesOverTime: SalesOverTime[];
  topProducts: {
    productId: string;
    title: string;
    totalSold: number;
    revenue: number;
  }[];
  ordersByStatus: {
    status: string;
    count: number;
  }[];
}

export class AnalyticsService {
  /**
   * Get comprehensive sales analytics for the admin dashboard.
   */
  async getSalesAnalytics(days = 30): Promise<AnalyticsResult> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    // Get all paid/shipped/delivered orders within the date range
    const orders = await prisma.order.findMany({
      where: {
        status: { in: ['PAID', 'SHIPPED', 'DELIVERED'] },
        createdAt: { gte: startDate },
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

    // Calculate total revenue and order count
    let totalRevenue = new Decimal(0);
    for (const order of orders) {
      totalRevenue = totalRevenue.add(order.totalAmount);
    }

    const orderCount = orders.length;
    const averageOrderValue = orderCount > 0 
      ? totalRevenue.div(orderCount).toNumber() 
      : 0;

    // Calculate sales over time (daily)
    const salesByDate = new Map<string, { revenue: Decimal; orderCount: number }>();
    
    for (const order of orders) {
      const dateKey = order.createdAt.toISOString().split('T')[0];
      const existing = salesByDate.get(dateKey) || { revenue: new Decimal(0), orderCount: 0 };
      salesByDate.set(dateKey, {
        revenue: existing.revenue.add(order.totalAmount),
        orderCount: existing.orderCount + 1,
      });
    }

    // Fill in missing dates with zeros
    const salesOverTime: SalesOverTime[] = [];
    const currentDate = new Date(startDate);
    const today = new Date();
    
    while (currentDate <= today) {
      const dateKey = currentDate.toISOString().split('T')[0];
      const dayData = salesByDate.get(dateKey);
      salesOverTime.push({
        date: dateKey,
        revenue: dayData ? dayData.revenue.toNumber() : 0,
        orderCount: dayData ? dayData.orderCount : 0,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Calculate top products
    const productSales = new Map<string, { title: string; totalSold: number; revenue: Decimal }>();
    
    for (const order of orders) {
      for (const item of order.items) {
        const productId = item.variant.product.id;
        const existing = productSales.get(productId) || {
          title: item.variant.product.title,
          totalSold: 0,
          revenue: new Decimal(0),
        };
        productSales.set(productId, {
          title: existing.title,
          totalSold: existing.totalSold + item.quantity,
          revenue: existing.revenue.add(item.priceAtPurchase.mul(item.quantity)),
        });
      }
    }

    const topProducts = Array.from(productSales.entries())
      .map(([productId, data]) => ({
        productId,
        title: data.title,
        totalSold: data.totalSold,
        revenue: data.revenue.toNumber(),
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Get orders by status (all time)
    const ordersByStatus = await prisma.order.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    return {
      totalRevenue: totalRevenue.toNumber(),
      orderCount,
      averageOrderValue: Number(averageOrderValue.toFixed(2)),
      salesOverTime,
      topProducts,
      ordersByStatus: ordersByStatus.map((item) => ({
        status: item.status,
        count: item._count.status,
      })),
    };
  }

  /**
   * Get quick summary metrics for dashboard cards.
   */
  async getQuickMetrics() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

    // This month's metrics
    const thisMonthOrders = await prisma.order.findMany({
      where: {
        status: { in: ['PAID', 'SHIPPED', 'DELIVERED'] },
        createdAt: { gte: thisMonth },
      },
      select: { totalAmount: true },
    });

    // Last month's metrics
    const lastMonthOrders = await prisma.order.findMany({
      where: {
        status: { in: ['PAID', 'SHIPPED', 'DELIVERED'] },
        createdAt: { gte: lastMonth, lte: lastMonthEnd },
      },
      select: { totalAmount: true },
    });

    const thisMonthRevenue = thisMonthOrders.reduce(
      (sum, order) => sum.add(order.totalAmount),
      new Decimal(0)
    );

    const lastMonthRevenue = lastMonthOrders.reduce(
      (sum, order) => sum.add(order.totalAmount),
      new Decimal(0)
    );

    // Calculate growth percentage
    const revenueGrowth = lastMonthRevenue.isZero()
      ? 100
      : thisMonthRevenue.sub(lastMonthRevenue).div(lastMonthRevenue).mul(100).toNumber();

    // Today's orders
    const todayOrders = await prisma.order.count({
      where: { createdAt: { gte: today } },
    });

    // Pending orders
    const pendingOrders = await prisma.order.count({
      where: { status: 'PENDING' },
    });

    // Total customers
    const totalCustomers = await prisma.user.count({
      where: { role: 'CUSTOMER' },
    });

    return {
      thisMonthRevenue: thisMonthRevenue.toNumber(),
      lastMonthRevenue: lastMonthRevenue.toNumber(),
      revenueGrowth: Number(revenueGrowth.toFixed(1)),
      thisMonthOrders: thisMonthOrders.length,
      lastMonthOrders: lastMonthOrders.length,
      todayOrders,
      pendingOrders,
      totalCustomers,
    };
  }
}

export const analyticsService = new AnalyticsService();
