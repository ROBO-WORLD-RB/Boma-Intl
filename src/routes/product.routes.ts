import { Router } from 'express';
import { getProducts, getProductBySlug } from '../controllers/product.controller';
import { getProductReviews, createReview, updateReview, deleteReview } from '../controllers/review.controller';
import { verifyToken } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { z } from 'zod';

const router = Router();

// Review validation schemas
const createReviewSchema = z.object({
  body: z.object({
    rating: z.number().int().min(1).max(5),
    comment: z.string().max(1000).optional(),
  }),
});

const updateReviewSchema = z.object({
  body: z.object({
    rating: z.number().int().min(1).max(5).optional(),
    comment: z.string().max(1000).optional(),
  }),
});

// Product routes
router.get('/', getProducts);
router.get('/:slug', getProductBySlug);

// Review routes (nested under products)
router.get('/:slug/reviews', getProductReviews);
router.post('/:slug/reviews', verifyToken, validate(createReviewSchema), createReview);
router.put('/reviews/:reviewId', verifyToken, validate(updateReviewSchema), updateReview);
router.delete('/reviews/:reviewId', verifyToken, deleteReview);

export default router;
