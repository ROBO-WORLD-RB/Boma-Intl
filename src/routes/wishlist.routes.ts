import { Router } from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  checkWishlist,
} from '../controllers/wishlist.controller';
import { verifyToken } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { z } from 'zod';

const router = Router();

// All wishlist routes require authentication
router.use(verifyToken);

// Validation schema for product ID
const productIdSchema = z.object({
  body: z.object({
    productId: z.string().min(1, 'Product ID is required'),
  }),
});

// Get user's wishlist
router.get('/', getWishlist);

// Add product to wishlist
router.post('/', validate(productIdSchema), addToWishlist);

// Toggle product in wishlist (add if not present, remove if present)
router.post('/toggle', validate(productIdSchema), toggleWishlist);

// Check if product is in wishlist
router.get('/check/:productId', checkWishlist);

// Remove product from wishlist
router.delete('/:productId', removeFromWishlist);

export default router;
