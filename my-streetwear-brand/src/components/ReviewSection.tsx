'use client';

import { useState } from 'react';
import { Review } from '@/types';
import ReviewCard from './ReviewCard';
import ReviewForm, { ReviewFormData } from './ReviewForm';
import { RatingDisplay } from './StarRating';
import { cn } from '@/lib/utils';

export interface ReviewSectionProps {
  productId: string;
  reviews: Review[];
  averageRating: number;
  reviewCount: number;
  canReview?: boolean;
  onSubmitReview?: (data: ReviewFormData) => Promise<void>;
  className?: string;
}

export default function ReviewSection({
  productId,
  reviews,
  averageRating,
  reviewCount,
  canReview = false,
  onSubmitReview,
  className,
}: ReviewSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest'>('newest');

  // Sort reviews based on selected option (Requirements 6.6: newest first by default)
  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      case 'newest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const handleSubmitReview = async (data: ReviewFormData) => {
    if (onSubmitReview) {
      await onSubmitReview(data);
      setShowForm(false);
    }
  };

  return (
    <section className={cn('', className)}>
      {/* Header with Rating Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-white text-2xl font-bold mb-2">Customer Reviews</h2>
          <RatingDisplay
            rating={averageRating}
            reviewCount={reviewCount}
            size="md"
          />
        </div>

        <div className="flex items-center gap-4">
          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className={cn(
              'px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg',
              'text-white text-sm',
              'focus:outline-none focus:ring-2 focus:ring-white/20'
            )}
          >
            <option value="newest">Newest First</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>

          {/* Write Review Button */}
          {canReview && !showForm && (
            <button
              onClick={() => setShowForm(true)}
              className={cn(
                'px-4 py-2 bg-white text-black font-medium rounded-lg',
                'hover:bg-neutral-200 transition-colors'
              )}
            >
              Write a Review
            </button>
          )}
        </div>
      </div>

      {/* Review Form */}
      {showForm && canReview && (
        <div className="mb-8">
          <ReviewForm
            productId={productId}
            onSubmit={handleSubmitReview}
          />
          <button
            onClick={() => setShowForm(false)}
            className="mt-2 text-neutral-400 text-sm hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>
      )}


      {/* Reviews List */}
      {sortedReviews.length > 0 ? (
        <div className="space-y-4">
          {sortedReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-neutral-900 rounded-lg border border-neutral-800">
          <p className="text-neutral-400 mb-4">No reviews yet</p>
          {canReview && !showForm && (
            <button
              onClick={() => setShowForm(true)}
              className={cn(
                'px-4 py-2 bg-white text-black font-medium rounded-lg',
                'hover:bg-neutral-200 transition-colors'
              )}
            >
              Be the first to review
            </button>
          )}
        </div>
      )}
    </section>
  );
}
