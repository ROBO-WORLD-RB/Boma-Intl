'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Order } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { SkeletonCard } from '@/components/SkeletonCard';

const statusColors: Record<Order['status'], 'default' | 'success' | 'warning' | 'error'> = {
  PENDING: 'warning',
  PAID: 'default',
  PROCESSING: 'default',
  SHIPPED: 'success',
  DELIVERED: 'success',
  CANCELLED: 'error',
};

const statusLabels: Record<Order['status'], string> = {
  PENDING: 'Pending',
  PAID: 'Paid',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(amount);
}

export function OrderHistory() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['orders'],
    queryFn: () => api.orders.list(),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <SkeletonCard key={i} className="h-24" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Failed to load orders. Please try again.</p>
      </div>
    );
  }

  const orders = data?.data || [];

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-white">No orders yet</h3>
        <p className="mt-2 text-gray-400">
          When you place an order, it will appear here.
        </p>
        <Link
          href="/shop"
          className="mt-4 inline-block text-white underline hover:no-underline"
        >
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/account/orders/${order.id}`}
          className="block p-4 bg-gray-900 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">
                Order #{order.id.slice(-8).toUpperCase()}
              </span>
              <Badge variant={statusColors[order.status]}>
                {statusLabels[order.status]}
              </Badge>
            </div>
            <span className="text-sm text-gray-400">
              {formatDate(order.createdAt)}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-300">
              {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
            </div>
            <div className="text-lg font-semibold text-white">
              {formatCurrency(order.totalAmount)}
            </div>
          </div>
          
          {order.items.length > 0 && (
            <div className="mt-3 flex gap-2 overflow-hidden">
              {order.items.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="w-12 h-12 bg-gray-800 rounded flex-shrink-0"
                >
                  {item.product?.images?.[0] && (
                    <img
                      src={item.product.images[0].url}
                      alt={item.product.title}
                      className="w-full h-full object-cover rounded"
                    />
                  )}
                </div>
              ))}
              {order.items.length > 4 && (
                <div className="w-12 h-12 bg-gray-800 rounded flex-shrink-0 flex items-center justify-center text-sm text-gray-400">
                  +{order.items.length - 4}
                </div>
              )}
            </div>
          )}
        </Link>
      ))}
    </div>
  );
}
