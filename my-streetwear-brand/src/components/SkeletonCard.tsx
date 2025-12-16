'use client';

import { cn } from '@/lib/utils';

export interface SkeletonCardProps {
  className?: string;
}

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse bg-gray-800 rounded',
        className
      )}
    />
  );
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div className={cn('flex flex-col space-y-3', className)}>
      {/* Image placeholder */}
      <Skeleton className="aspect-[3/4] w-full rounded-lg" />
      
      {/* Title placeholder */}
      <Skeleton className="h-5 w-3/4" />
      
      {/* Price placeholder */}
      <Skeleton className="h-4 w-1/4" />
    </div>
  );
}

// Grid of skeleton cards for loading states
export interface SkeletonGridProps {
  count?: number;
  className?: string;
}

export function SkeletonGrid({ count = 8, className }: SkeletonGridProps) {
  return (
    <div className={cn(
      'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6',
      className
    )}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

// Skeleton for quick view modal content
export function SkeletonQuickView({ className }: { className?: string }) {
  return (
    <div className={cn('p-6 space-y-4', className)}>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Image gallery skeleton */}
        <div className="flex-1 space-y-2">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="w-16 h-16 rounded" />
            ))}
          </div>
        </div>
        
        {/* Product details skeleton */}
        <div className="flex-1 space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-20 w-full" />
          
          {/* Size options */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="w-10 h-10 rounded" />
              ))}
            </div>
          </div>
          
          {/* Add to cart button */}
          <Skeleton className="h-12 w-full rounded" />
        </div>
      </div>
    </div>
  );
}
