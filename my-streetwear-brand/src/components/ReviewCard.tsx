'use client';

import { Review } from '@/types';
import { StarRating } from './StarRating';
import { cn } from '@/lib/utils';

export interface ReviewCardProps {
  review: Review;
  className?: string;
}

/**
 * Formats a date string to a human-readable format
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function ReviewCard({ review, className }: ReviewCardProps) {
  return (
    <article
      className={cn(
        'bg-neutral-900 rounded-lg p-6 border border-neutral-800',
        className
      )}
    >
      {/* Header: Rating and Verified Badge */}
      <div className="flex items-center justify-between mb-3">
        <StarRating rating={review.rating} size="sm" />
        {review.verified && (
          <span className="flex items-center gap-1 text-xs text-green-500">
            <VerifiedIcon className="w-4 h-4" />
            Verified Purchase
          </span>
        )}
      </div>

      {/* Review Title */}
      {review.title && (
        <h4 className="text-white font-semibold mb-2">{review.title}</h4>
      )}

      {/* Review Content */}
      <p className="text-neutral-300 text-sm leading-relaxed mb-4">
        {review.content}
      </p>

      {/* Author and Date */}
      <div className="flex items-center justify-between text-sm text-neutral-500">
        <span className="font-medium">{review.userName}</span>
        <time dateTime={review.createdAt}>{formatDate(review.createdAt)}</time>
      </div>
    </article>
  );
}

function VerifiedIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  );
}
