'use client';

import { cn } from '@/lib/utils';
import { Order } from '@/types';
import { Badge } from '@/components/ui/Badge';

export interface OrderTableProps {
  orders: Order[];
  isLoading?: boolean;
  onViewOrder?: (orderId: string) => void;
  onUpdateStatus?: (orderId: string, status: Order['status']) => void;
  className?: string;
}

const statusVariants: Record<Order['status'], 'default' | 'success' | 'warning' | 'error' | 'info'> = {
  PENDING: 'warning',
  PAID: 'info',
  PROCESSING: 'info',
  SHIPPED: 'default',
  DELIVERED: 'success',
  CANCELLED: 'error',
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-gray-800/50 rounded animate-pulse">
          <div className="h-4 w-24 bg-gray-700 rounded" />
          <div className="h-4 w-32 bg-gray-700 rounded" />
          <div className="h-4 w-20 bg-gray-700 rounded" />
          <div className="h-4 w-16 bg-gray-700 rounded" />
          <div className="h-4 w-24 bg-gray-700 rounded ml-auto" />
        </div>
      ))}
    </div>
  );
}

export function OrderTable({ orders, isLoading, onViewOrder, onUpdateStatus, className }: OrderTableProps) {
  if (isLoading) {
    return (
      <div className={cn('bg-gray-900 border border-gray-800 rounded-lg p-6', className)}>
        <h3 className="text-lg font-semibold text-white mb-4">Recent Orders</h3>
        <LoadingSkeleton />
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className={cn('bg-gray-900 border border-gray-800 rounded-lg p-6', className)}>
        <h3 className="text-lg font-semibold text-white mb-4">Recent Orders</h3>
        <div className="text-center py-8 text-gray-500">
          No orders found
        </div>
      </div>
    );
  }

  return (
    <div className={cn('bg-gray-900 border border-gray-800 rounded-lg overflow-hidden', className)}>
      <div className="p-6 border-b border-gray-800">
        <h3 className="text-lg font-semibold text-white">Recent Orders</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800 text-left">
              <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-800/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-mono text-white">
                    #{order.id.slice(0, 8)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-300">
                    {order.shippingAddress?.fullName || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-400">
                    {formatDate(order.createdAt)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={statusVariants[order.status]} size="sm">
                    {order.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-white">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewOrder?.(order.id)}
                      className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      View
                    </button>
                    {onUpdateStatus && order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                      <select
                        value={order.status}
                        onChange={(e) => onUpdateStatus(order.id, e.target.value as Order['status'])}
                        className="text-xs bg-gray-800 border border-gray-700 rounded px-2 py-1 text-gray-300 focus:outline-none focus:border-gray-600"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="PAID">Paid</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
