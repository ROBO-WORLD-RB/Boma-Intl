import { Request, Response } from 'express';
import { reviewService } from '../services/review.service';
import { asyncHandler } from '../utils/asyncHandler';

export const getProductReviews = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const { page, limit } = req.query;

  const result = await reviewService.getReviewsByProductSlug(
    slug,
    page ? parseInt(page as string, 10) : undefined,
    limit ? parseInt(limit as string, 10) : undefined
  );

  res.json({
    success: true,
    data: result,
  });
});

export const createReview = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user!.userId;

  const review = await reviewService.createReview(slug, {
    userId,
    rating,
    comment,
  });

  res.status(201).json({
    success: true,
    message: 'Review submitted successfully',
    data: review,
  });
});

export const updateReview = asyncHandler(async (req: Request, res: Response) => {
  const { reviewId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user!.userId;

  const review = await reviewService.updateReview(reviewId, userId, { rating, comment });

  res.json({
    success: true,
    message: 'Review updated successfully',
    data: review,
  });
});

export const deleteReview = asyncHandler(async (req: Request, res: Response) => {
  const { reviewId } = req.params;
  const userId = req.user!.userId;
  const isAdmin = req.user!.role === 'ADMIN';

  const result = await reviewService.deleteReview(reviewId, userId, isAdmin);

  res.json({
    success: true,
    message: result.message,
  });
});
