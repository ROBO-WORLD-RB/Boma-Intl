'use client';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

export interface LowStockItem {
  productId: string;
  variantId: string;
  title: string;
  size: string;
  color: string;
  stockQuantity: number;
}

export interface InventoryAlertsProps {
  items: LowStockItem[];
  isLoading?: boolean;
  criticalThreshold?: number;
  onRestock?: (productId: string, variantId: string) => void;
  className?: string;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded animate-pulse">
          <div className="h-8 w-8 bg-gray-700 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 bg-gray-700 rounded" />
            <div className="h-3 w-20 bg-gray-700 rounded" />
          </div>
          <div className="h-6 w-16 bg-gray-700 rounded" />
        </div>
      ))}
    </div>
  );
}

export function InventoryAlerts({ 
  items, 
  isLoading, 
  criticalThreshold = 3,
  onRestock,
  className 
}: InventoryAlertsProps) {
  if (isLoading) {
    return (
      <div className={cn('bg-gray-900 border border-gray-800 rounded-lg p-6', className)}>
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-lg font-semibold text-white">Low Stock Alerts</h3>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className={cn('bg-gray-900 border border-gray-800 rounded-lg p-6', className)}>
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-white">Inventory Status</h3>
        </div>
        <div className="text-center py-6 text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-3 text-green-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <p>All inventory levels are healthy</p>
        </div>
      </div>
    );
  }

  // Sort by stock quantity (lowest first)
  const sortedItems = [...items].sort((a, b) => a.stockQuantity - b.stockQuantity);

  return (
    <div className={cn('bg-gray-900 border border-gray-800 rounded-lg p-6', className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-lg font-semibold text-white">Low Stock Alerts</h3>
        </div>
        <Badge variant="warning" size="sm">
          {items.length} items
        </Badge>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {sortedItems.map((item) => {
          const isCritical = item.stockQuantity <= criticalThreshold;
          
          return (
            <div 
              key={`${item.productId}-${item.variantId}`}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg border transition-colors',
                isCritical 
                  ? 'bg-red-900/20 border-red-800/50' 
                  : 'bg-yellow-900/20 border-yellow-800/50'
              )}
            >
              <div className={cn(
                'h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold',
                isCritical ? 'bg-red-900/50 text-red-400' : 'bg-yellow-900/50 text-yellow-400'
              )}>
                {item.stockQuantity}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{item.title}</p>
                <p className="text-xs text-gray-400">
                  {item.size} / {item.color}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Badge 
                  variant={isCritical ? 'error' : 'warning'} 
                  size="sm"
                >
                  {isCritical ? 'Critical' : 'Low'}
                </Badge>
                
                {onRestock && (
                  <button
                    onClick={() => onRestock(item.productId, item.variantId)}
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors whitespace-nowrap"
                  >
                    Restock
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {items.length > 5 && (
        <div className="mt-4 pt-4 border-t border-gray-800 text-center">
          <p className="text-xs text-gray-500">
            Showing {Math.min(items.length, 10)} of {items.length} low stock items
          </p>
        </div>
      )}
    </div>
  );
}
