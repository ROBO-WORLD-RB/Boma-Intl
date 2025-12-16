'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Order } from '@/types';
import { OrderTable } from '@/components/admin/OrderTable';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';

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
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminOrdersPage() {
  const searchParams = useSearchParams();
  const viewId = searchParams.get('id');

  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.orders.list(page, 20);
      setOrders(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    if (viewId && orders.length > 0) {
      const order = orders.find(o => o.id === viewId);
      if (order) {
        setSelectedOrder(order);
        setIsModalOpen(true);
      }
    }
  }, [viewId, orders]);

  const handleViewOrder = async (orderId: string) => {
    try {
      const response = await api.orders.get(orderId);
      setSelectedOrder(response.data);
      setIsModalOpen(true);
    } catch (err) {
      console.error('Failed to fetch order details:', err);
      // Fallback to local data
      const order = orders.find(o => o.id === orderId);
      if (order) {
        setSelectedOrder(order);
        setIsModalOpen(true);
      }
    }
  };

  const handleUpdateStatus = async (orderId: string, status: Order['status']) => {
    try {
      await api.orders.updateStatus(orderId, status);
      await fetchOrders();
      
      // Update selected order if it's the one being updated
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status } : null);
      }
    } catch (err) {
      console.error('Failed to update order status:', err);
      setError('Failed to update order status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Orders</h1>
        <p className="text-gray-400 mt-1">Manage and track customer orders</p>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-400">
          {error}
          <button 
            onClick={() => setError(null)} 
            className="ml-4 text-red-300 hover:text-red-200"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Orders Table */}
      <OrderTable
        orders={orders}
        isLoading={isLoading}
        onViewOrder={handleViewOrder}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm bg-gray-800 text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-gray-400">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 text-sm bg-gray-800 text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Order Detail Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedOrder(null);
        }}
        title={`Order #${selectedOrder?.id.slice(0, 8) || ''}`}
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Order Status */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Status</p>
                <Badge variant={statusVariants[selectedOrder.status]} size="md">
                  {selectedOrder.status}
                </Badge>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Order Date</p>
                <p className="text-white">{formatDate(selectedOrder.createdAt)}</p>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-400 mb-2">Shipping Address</h4>
              {selectedOrder.shippingAddress ? (
                <div className="text-white">
                  <p className="font-medium">{selectedOrder.shippingAddress.fullName}</p>
                  <p className="text-sm text-gray-300">{selectedOrder.shippingAddress.street}</p>
                  <p className="text-sm text-gray-300">
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}
                  </p>
                  <p className="text-sm text-gray-300">{selectedOrder.shippingAddress.country}</p>
                  <p className="text-sm text-gray-400 mt-1">{selectedOrder.shippingAddress.phone}</p>
                </div>
              ) : (
                <p className="text-gray-500">No shipping address</p>
              )}
            </div>

            {/* Order Items */}
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-3">Order Items</h4>
              <div className="space-y-3">
                {selectedOrder.items.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex items-center gap-4 bg-gray-800/50 rounded-lg p-3"
                  >
                    <div className="flex-1">
                      <p className="text-white font-medium">
                        {item.product?.title || 'Product'}
                      </p>
                      <p className="text-sm text-gray-400">
                        {item.variant?.size} / {item.variant?.color} × {item.quantity}
                      </p>
                    </div>
                    <p className="text-white font-medium">
                      {formatCurrency(item.priceAtPurchase * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Total */}
            <div className="border-t border-gray-800 pt-4">
              <div className="flex items-center justify-between text-lg">
                <span className="text-gray-400">Total</span>
                <span className="text-white font-bold">
                  {formatCurrency(selectedOrder.totalAmount)}
                </span>
              </div>
            </div>

            {/* Payment Reference */}
            {selectedOrder.paymentRef && (
              <div className="text-sm">
                <span className="text-gray-400">Payment Ref: </span>
                <span className="text-gray-300 font-mono">{selectedOrder.paymentRef}</span>
              </div>
            )}

            {/* Status Update */}
            {selectedOrder.status !== 'DELIVERED' && selectedOrder.status !== 'CANCELLED' && (
              <div className="border-t border-gray-800 pt-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Update Status
                </label>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value as Order['status'])}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-gray-600"
                >
                  <option value="PENDING">Pending</option>
                  <option value="PAID">Paid</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
