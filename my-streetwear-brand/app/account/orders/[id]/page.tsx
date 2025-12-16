'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useRequireAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { Order } from '@/types';
import { Badge } from '@/components/ui/Badge';
import Breadcrumbs from '@/components/Breadcrumbs';
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
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(amount);
}

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  
  useRequireAuth();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => api.orders.get(orderId),
    enabled: !!orderId,
  });

  const order = data?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <SkeletonCard className="h-8 w-48 mb-8" />
          <SkeletonCard className="h-64" />
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-screen bg-black">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Order Not Found</h1>
          <p className="text-gray-400 mb-6">
            We couldn&apos;t find the order you&apos;re looking for.
          </p>
          <Link
            href="/account"
            className="text-white underline hover:no-underline"
          >
            Back to Account
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = order.items.reduce(
    (sum, item) => sum + item.priceAtPurchase * item.quantity,
    0
  );
  const tax = order.totalAmount - subtotal;

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Account', href: '/account' },
            { label: `Order #${orderId.slice(-8).toUpperCase()}` },
          ]}
        />

        <div className="mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Order #{orderId.slice(-8).toUpperCase()}
              </h1>
              <p className="text-gray-400 mt-1">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <Badge variant={statusColors[order.status]} className="self-start">
              {statusLabels[order.status]}
            </Badge>
          </div>

          {/* Order Items */}
          <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden mb-6">
            <div className="p-4 border-b border-gray-800">
              <h2 className="font-medium text-white">Order Items</h2>
            </div>
            <div className="divide-y divide-gray-800">
              {order.items.map((item) => (
                <div key={item.id} className="p-4 flex gap-4">
                  <div className="w-20 h-20 bg-gray-800 rounded flex-shrink-0">
                    {item.product?.images?.[0] && (
                      <img
                        src={item.product.images[0].url}
                        alt={item.product.title}
                        className="w-full h-full object-cover rounded"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/product/${item.product?.slug}`}
                      className="font-medium text-white hover:underline"
                    >
                      {item.product?.title || 'Product'}
                    </Link>
                    <p className="text-sm text-gray-400 mt-1">
                      Size: {item.variant.size} | Color: {item.variant.color}
                    </p>
                    <p className="text-sm text-gray-400">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-white">
                      {formatCurrency(item.priceAtPurchase * item.quantity)}
                    </p>
                    <p className="text-sm text-gray-400">
                      {formatCurrency(item.priceAtPurchase)} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Shipping Address */}
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-4">
              <h2 className="font-medium text-white mb-3">Shipping Address</h2>
              <div className="text-gray-400 text-sm space-y-1">
                <p className="text-white">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
                <p className="pt-2">{order.shippingAddress.phone}</p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-4">
              <h2 className="font-medium text-white mb-3">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Tax</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-white font-medium pt-2 border-t border-gray-800">
                  <span>Total</span>
                  <span>{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="mt-6 bg-gray-900 rounded-lg border border-gray-800 p-4">
            <h2 className="font-medium text-white mb-3">Payment Information</h2>
            <div className="text-sm text-gray-400">
              <p>Payment Reference: {order.paymentRef}</p>
              <p className="mt-1">
                Status:{' '}
                <span className={order.status === 'PENDING' ? 'text-yellow-500' : 'text-green-500'}>
                  {order.status === 'PENDING' ? 'Awaiting Payment' : 'Paid'}
                </span>
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex gap-4">
            <Link
              href="/account"
              className="px-4 py-2 border border-gray-700 text-gray-300 rounded hover:border-white hover:text-white transition-colors"
            >
              Back to Orders
            </Link>
            {order.status === 'DELIVERED' && (
              <Link
                href="/shop"
                className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors"
              >
                Shop Again
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
