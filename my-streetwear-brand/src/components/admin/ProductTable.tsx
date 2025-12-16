'use client';

import { cn } from '@/lib/utils';
import { Product } from '@/types';
import { Badge, StockBadge } from '@/components/ui/Badge';

export interface ProductTableProps {
  products: Product[];
  isLoading?: boolean;
  onEdit?: (productId: string) => void;
  onDelete?: (productId: string) => void;
  onToggleActive?: (productId: string, isActive: boolean) => void;
  className?: string;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function getTotalStock(product: Product): number {
  return product.variants.reduce((sum, v) => sum + v.stockQuantity, 0);
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-gray-800/50 rounded animate-pulse">
          <div className="h-12 w-12 bg-gray-700 rounded" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-48 bg-gray-700 rounded" />
            <div className="h-3 w-24 bg-gray-700 rounded" />
          </div>
          <div className="h-4 w-20 bg-gray-700 rounded" />
          <div className="h-4 w-16 bg-gray-700 rounded" />
        </div>
      ))}
    </div>
  );
}

export function ProductTable({ products, isLoading, onEdit, onDelete, onToggleActive, className }: ProductTableProps) {
  if (isLoading) {
    return (
      <div className={cn('bg-gray-900 border border-gray-800 rounded-lg p-6', className)}>
        <h3 className="text-lg font-semibold text-white mb-4">Products</h3>
        <LoadingSkeleton />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className={cn('bg-gray-900 border border-gray-800 rounded-lg p-6', className)}>
        <h3 className="text-lg font-semibold text-white mb-4">Products</h3>
        <div className="text-center py-8 text-gray-500">
          No products found
        </div>
      </div>
    );
  }

  return (
    <div className={cn('bg-gray-900 border border-gray-800 rounded-lg overflow-hidden', className)}>
      <div className="p-6 border-b border-gray-800">
        <h3 className="text-lg font-semibold text-white">Products</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800 text-left">
              <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {products.map((product) => {
              const totalStock = getTotalStock(product);
              const mainImage = product.images.find(img => img.isMain) || product.images[0];
              
              return (
                <tr key={product.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {mainImage && (
                        <img
                          src={mainImage.url}
                          alt={mainImage.altText || product.title}
                          className="h-12 w-12 object-cover rounded"
                        />
                      )}
                      <div>
                        <p className="text-sm font-medium text-white">{product.title}</p>
                        <p className="text-xs text-gray-500">{product.variants.length} variants</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-400">{product.category}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      {product.salePrice ? (
                        <>
                          <span className="text-white font-medium">{formatCurrency(product.salePrice)}</span>
                          <span className="text-gray-500 line-through ml-2">{formatCurrency(product.basePrice)}</span>
                        </>
                      ) : (
                        <span className="text-white font-medium">{formatCurrency(product.basePrice)}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StockBadge quantity={totalStock} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={product.isActive ? 'success' : 'default'} size="sm">
                      {product.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onEdit?.(product.id)}
                        className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onToggleActive?.(product.id, !product.isActive)}
                        className="text-sm text-yellow-400 hover:text-yellow-300 transition-colors"
                      >
                        {product.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => onDelete?.(product.id)}
                        className="text-sm text-red-400 hover:text-red-300 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
