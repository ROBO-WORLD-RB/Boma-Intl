'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Validates that a breadcrumb path is valid (non-empty label, valid href if present)
 */
export function isValidBreadcrumbItem(item: BreadcrumbItem): boolean {
  if (!item.label || item.label.trim() === '') {
    return false;
  }
  if (item.href !== undefined && item.href.trim() === '') {
    return false;
  }
  return true;
}

/**
 * Validates that all breadcrumb items in a path are valid
 */
export function isValidBreadcrumbPath(items: BreadcrumbItem[]): boolean {
  if (items.length === 0) return false;
  return items.every(isValidBreadcrumbItem);
}

/**
 * Generates a breadcrumb path from segments
 */
export function generateBreadcrumbPath(
  segments: Array<{ label: string; slug?: string }>,
  basePath: string = ''
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [{ label: 'Home', href: '/' }];
  
  let currentPath = basePath;
  segments.forEach((segment, index) => {
    if (segment.slug) {
      currentPath = `${currentPath}/${segment.slug}`;
    }
    
    // Last item doesn't have href (current page)
    const isLast = index === segments.length - 1;
    items.push({
      label: segment.label,
      href: isLast ? undefined : currentPath || undefined,
    });
  });
  
  return items;
}

export default function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center', className)}>
      <ol className="flex items-center flex-wrap gap-1 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronIcon className="mx-2 h-4 w-4 text-neutral-500 flex-shrink-0" />
              )}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    isLast ? 'text-white font-medium' : 'text-neutral-400'
                  )}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}
