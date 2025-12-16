'use client';

import { useState } from 'react';
import { StarRating, isValidRating } from './StarRating';
import { Button } from './ui/Button';
import { cn } from '@/lib/utils';

export interface ReviewFormData {
  rating: number;
  title: string;
  content: string;
}

export interface ReviewFormProps {
  productId: string;
  onSubmit: (data: ReviewFormData) => Promise<void>;
  className?: string;
}

export default function ReviewForm({
  productId,
  onSubmit,
  className,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate rating (Requirements 6.4: rating must be 1-5)
    if (!isValidRating(rating, 1, 5)) {
      setError('Please select a rating between 1 and 5 stars');
      return;
    }

    if (content.trim().length < 10) {
      setError('Review must be at least 10 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ rating, title: title.trim(), content: content.trim() });
      // Reset form on success
      setRating(0);
      setTitle('');
      setContent('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('bg-neutral-900 rounded-lg p-6 border border-neutral-800', className)}
    >
      <h3 className="text-white text-lg font-semibold mb-4">Write a Review</h3>

      {/* Rating Selection */}
      <div className="mb-4">
        <label className="block text-neutral-300 text-sm mb-2">
          Your Rating <span className="text-red-500">*</span>
        </label>
        <StarRating
          rating={rating}
          interactive
          onChange={setRating}
          size="lg"
        />
      </div>

      {/* Review Title */}
      <div className="mb-4">
        <label htmlFor="review-title" className="block text-neutral-300 text-sm mb-2">
          Review Title
        </label>
        <input
          id="review-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarize your experience"
          className={cn(
            'w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg',
            'text-white placeholder-neutral-500',
            'focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent'
          )}
          maxLength={100}
        />
      </div>


      {/* Review Content */}
      <div className="mb-4">
        <label htmlFor="review-content" className="block text-neutral-300 text-sm mb-2">
          Your Review <span className="text-red-500">*</span>
        </label>
        <textarea
          id="review-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your experience with this product..."
          rows={4}
          className={cn(
            'w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg',
            'text-white placeholder-neutral-500 resize-none',
            'focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent'
          )}
          minLength={10}
          maxLength={1000}
        />
        <p className="text-neutral-500 text-xs mt-1">
          {content.length}/1000 characters
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-sm mb-4">{error}</p>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        isLoading={isSubmitting}
        disabled={isSubmitting || rating === 0 || content.trim().length < 10}
        className="w-full"
      >
        Submit Review
      </Button>
    </form>
  );
}
