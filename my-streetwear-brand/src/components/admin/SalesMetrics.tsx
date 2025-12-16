'use client';

import { cn } from '@/lib/utils';

export interface SalesMetricsData {
  totalRevenue: number;
  orderCount: number;
  averageOrderValue: number;
}

export interface SalesMetricsProps {
  data: SalesMetricsData;
  isLoading?: boolean;
  className?: string;
}

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  isLoading?: boolean;
}

function MetricCard({ title, value, icon, trend, isLoading }: MetricCardProps) {
  if (isLoading) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <div className="h-4 w-24 bg-gray-800 rounded animate-pulse" />
            <div className="h-8 w-32 bg-gray-800 rounded animate-pulse" />
          </div>
          <div className="h-12 w-12 bg-gray-800 rounded-full animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400 font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {trend && (
            <p className={cn(
              'text-sm mt-2 flex items-center gap-1',
              trend.isPositive ? 'text-green-500' : 'text-red-500'
            )}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              <span className="text-gray-500">vs last period</span>
            </p>
          )}
        </div>
        <div className="h-12 w-12 bg-gray-800 rounded-full flex items-center justify-center text-gray-400">
          {icon}
        </div>
      </div>
    </div>
  );
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function SalesMetrics({ data, isLoading, className }: SalesMetricsProps) {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-3 gap-6', className)}>
      <MetricCard
        title="Total Revenue"
        value={formatCurrency(data.totalRevenue)}
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
        isLoading={isLoading}
      />
      <MetricCard
        title="Total Orders"
        value={data.orderCount.toLocaleString()}
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        }
        isLoading={isLoading}
      />
      <MetricCard
        title="Average Order Value"
        value={formatCurrency(data.averageOrderValue)}
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        }
        isLoading={isLoading}
      />
    </div>
  );
}
