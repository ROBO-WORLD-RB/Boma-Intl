'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

export interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

const sizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

/**
 * Clamps a rating value to be within valid bounds [1, maxRating]
 * Returns 0 for values <= 0 (no rating)
 */
export function clampRating(value: number, maxRating: number = 5): number {
  if (value <= 0) return 0;
  if (value > maxRating) return maxRating;
  return Math.round(value);
}

/**
 * Validates that a rating is within acceptable bounds for submission
 */
export function isValidRating(rating: number, minRating: number = 1, maxRating: number = 5): boolean {
  return Number.isInteger(rating) && rating >= minRating && rating <= maxRating;
}

function StarIcon({ filled, partial = 0, className }: { filled: boolean; partial?: number; className?: string }) {
  if (partial > 0 && partial < 1) {
    // Partial star for average ratings
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`star-gradient-${partial}`}>
            <stop offset={`${partial * 100}%`} stopColor="currentColor" />
            <stop offset={`${partial * 100}%`} stopColor="transparent" />
          </linearGradient>
        </defs>
        <path
          d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
          fill={`url(#star-gradient-${partial})`}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onChange,
  className,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  
  const displayRating = hoverRating || rating;
  const sizeClass = sizes[size];

  const handleClick = (index: number) => {
    if (interactive && onChange) {
      const newRating = clampRating(index, maxRating);
      if (isValidRating(newRating, 1, maxRating)) {
        onChange(newRating);
      }
    }
  };

  const handleMouseEnter = (index: number) => {
    if (interactive) {
      setHoverRating(index);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  return (
    <div
      className={cn('flex items-center gap-0.5', className)}
      role={interactive ? 'radiogroup' : 'img'}
      aria-label={interactive ? 'Rating selection' : `Rating: ${rating} out of ${maxRating} stars`}
    >
      {Array.from({ length: maxRating }).map((_, index) => {
        const starIndex = index + 1;
        const isFilled = starIndex <= Math.floor(displayRating);
        const partial = !isFilled && starIndex === Math.ceil(displayRating) ? displayRating % 1 : 0;

        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(starIndex)}
            onMouseEnter={() => handleMouseEnter(starIndex)}
            onMouseLeave={handleMouseLeave}
            disabled={!interactive}
            className={cn(
              'text-yellow-400 transition-colors',
              interactive && 'cursor-pointer hover:scale-110 transition-transform',
              !interactive && 'cursor-default'
            )}
            aria-label={interactive ? `Rate ${starIndex} star${starIndex > 1 ? 's' : ''}` : undefined}
            role={interactive ? 'radio' : undefined}
            aria-checked={interactive ? starIndex === rating : undefined}
          >
            <StarIcon filled={isFilled} partial={partial} className={sizeClass} />
          </button>
        );
      })}
    </div>
  );
}

// Display component for showing average rating with count
export interface RatingDisplayProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function RatingDisplay({ rating, reviewCount, size = 'md', className }: RatingDisplayProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <StarRating rating={rating} size={size} />
      <span className="text-gray-400 text-sm">
        {rating.toFixed(1)}
        {reviewCount !== undefined && ` (${reviewCount} review${reviewCount !== 1 ? 's' : ''})`}
      </span>
    </div>
  );
}
