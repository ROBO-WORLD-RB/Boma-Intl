'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';

export interface SalesDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface SalesChartProps {
  data: SalesDataPoint[];
  isLoading?: boolean;
  className?: string;
}

function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `GH₵${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `GH₵${(amount / 1000).toFixed(0)}K`;
  }
  return `GH₵${amount}`;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function SalesChart({ data, isLoading, className }: SalesChartProps) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return { maxRevenue: 0, points: [] };
    
    const maxRevenue = Math.max(...data.map(d => d.revenue));
    const points = data.map((d, i) => ({
      ...d,
      x: (i / (data.length - 1 || 1)) * 100,
      y: maxRevenue > 0 ? ((maxRevenue - d.revenue) / maxRevenue) * 100 : 50,
    }));
    
    return { maxRevenue, points };
  }, [data]);

  if (isLoading) {
    return (
      <div className={cn('bg-gray-900 border border-gray-800 rounded-lg p-6', className)}>
        <div className="h-6 w-32 bg-gray-800 rounded animate-pulse mb-6" />
        <div className="h-64 bg-gray-800 rounded animate-pulse" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={cn('bg-gray-900 border border-gray-800 rounded-lg p-6', className)}>
        <h3 className="text-lg font-semibold text-white mb-4">Sales Over Time</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          No sales data available
        </div>
      </div>
    );
  }

  const pathD = chartData.points.length > 1
    ? `M ${chartData.points.map(p => `${p.x},${p.y}`).join(' L ')}`
    : '';

  const areaD = chartData.points.length > 1
    ? `M 0,100 L ${chartData.points.map(p => `${p.x},${p.y}`).join(' L ')} L 100,100 Z`
    : '';

  return (
    <div className={cn('bg-gray-900 border border-gray-800 rounded-lg p-6', className)}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Sales Over Time</h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <span className="text-gray-400">Revenue</span>
          </div>
        </div>
      </div>

      <div className="relative h-64">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-8 w-16 flex flex-col justify-between text-xs text-gray-500">
          <span>{formatCurrency(chartData.maxRevenue)}</span>
          <span>{formatCurrency(chartData.maxRevenue / 2)}</span>
          <span>GH₵0</span>
        </div>

        {/* Chart area */}
        <div className="ml-16 h-full pb-8 relative">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[0, 1, 2].map(i => (
              <div key={i} className="border-t border-gray-800 w-full" />
            ))}
          </div>

          {/* SVG Chart */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            {/* Gradient fill */}
            <defs>
              <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Area fill */}
            {areaD && (
              <path
                d={areaD}
                fill="url(#chartGradient)"
              />
            )}

            {/* Line */}
            {pathD && (
              <path
                d={pathD}
                fill="none"
                stroke="rgb(59, 130, 246)"
                strokeWidth="0.5"
                vectorEffect="non-scaling-stroke"
              />
            )}

            {/* Data points */}
            {chartData.points.map((point, i) => (
              <circle
                key={i}
                cx={point.x}
                cy={point.y}
                r="1"
                fill="rgb(59, 130, 246)"
                className="hover:r-2 transition-all"
              />
            ))}
          </svg>

          {/* X-axis labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500">
            {data.filter((_, i) => i % Math.ceil(data.length / 5) === 0 || i === data.length - 1).map((d, i) => (
              <span key={i}>{formatDate(d.date)}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="mt-4 pt-4 border-t border-gray-800 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-xs text-gray-500">Total Revenue</p>
          <p className="text-sm font-semibold text-white">
            {formatCurrency(data.reduce((sum, d) => sum + d.revenue, 0))}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Total Orders</p>
          <p className="text-sm font-semibold text-white">
            {data.reduce((sum, d) => sum + d.orders, 0)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Avg Daily Revenue</p>
          <p className="text-sm font-semibold text-white">
            {formatCurrency(data.reduce((sum, d) => sum + d.revenue, 0) / data.length)}
          </p>
        </div>
      </div>
    </div>
  );
}
