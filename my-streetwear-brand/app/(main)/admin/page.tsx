'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Order } from '@/types';
import { SalesMetrics, SalesMetricsData } from '@/components/admin/SalesMetrics';
import { SalesChart, SalesDataPoint } from '@/components/admin/SalesChart';
import { OrderTable } from '@/components/admin/OrderTable';
import { InventoryAlerts, LowStockItem } from '@/components/admin/InventoryAlerts';

interface AnalyticsData {
  totalRevenue: number;
  orderCount: number;
  averageOrderValue: number;
  salesByDay: SalesDataPoint[];
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [lowStockItems, setLowStockItems] = useState<LowStockItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch all dashboard data in parallel
        const [analyticsRes, ordersRes, inventoryRes] = await Promise.allSettled([
          api.admin.analytics(),
          api.orders.list(1, 10),
          api.admin.lowStockItems(),
        ]);

        if (analyticsRes.status === 'fulfilled') {
          setAnalytics(analyticsRes.value.data);
        }

        if (ordersRes.status === 'fulfilled') {
          setRecentOrders(ordersRes.value.data);
        }

        if (inventoryRes.status === 'fulfilled') {
          setLowStockItems(inventoryRes.value.data);
        }
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const handleViewOrder = (orderId: string) => {
    router.push(`/admin/orders?id=${orderId}`);
  };

  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      await api.orders.updateStatus(orderId, status);
      // Refresh orders
      const ordersRes = await api.orders.list(1, 10);
      setRecentOrders(ordersRes.data);
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  const metricsData: SalesMetricsData = analytics ? {
    totalRevenue: analytics.totalRevenue,
    orderCount: analytics.orderCount,
    averageOrderValue: analytics.averageOrderValue,
  } : {
    totalRevenue: 0,
    orderCount: 0,
    averageOrderValue: 0,
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Welcome back! Here&apos;s what&apos;s happening with your store.</p>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-400">
          {error}
        </div>
      )}

      {/* Sales Metrics */}
      <SalesMetrics data={metricsData} isLoading={isLoading} />

      {/* Charts and Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart 
            data={analytics?.salesByDay || []} 
            isLoading={isLoading} 
          />
        </div>
        <div>
          <InventoryAlerts 
            items={lowStockItems} 
            isLoading={isLoading}
            onRestock={(productId) => router.push(`/admin/products?edit=${productId}`)}
          />
        </div>
      </div>

      {/* Recent Orders */}
      <OrderTable 
        orders={recentOrders} 
        isLoading={isLoading}
        onViewOrder={handleViewOrder}
        onUpdateStatus={handleUpdateOrderStatus}
      />
    </div>
  );
}
