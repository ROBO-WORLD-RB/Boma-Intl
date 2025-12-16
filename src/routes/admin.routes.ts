import { Router } from 'express';
import { Request, Response } from 'express';
import { createProduct } from '../controllers/product.controller';
import {
  getAllOrders,
  getOrderByIdAdmin,
  updateOrderStatus,
  updateProduct,
  deleteProduct,
  updateVariantStock,
  updateProductThreshold,
  getAllReviews,
  flagReview,
  deleteReviewAdmin,
} from '../controllers/admin.controller';
import { verifyToken, requireAdmin } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createProductSchema, updateProductSchema, updateOrderStatusSchema } from '../utils/validators';
import { analyticsService } from '../services/analytics.service';
import { inventoryService } from '../services/inventory.service';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// All admin routes require authentication and admin role
router.use(verifyToken, requireAdmin);

// ============ PRODUCT MANAGEMENT ============
router.post('/products', validate(createProductSchema), createProduct);
router.patch('/products/:id', validate(updateProductSchema), updateProduct);
router.delete('/products/:id', deleteProduct);
router.patch('/products/:id/threshold', updateProductThreshold);
router.patch('/variants/:variantId/stock', updateVariantStock);

// ============ ORDER MANAGEMENT ============
router.get('/orders', getAllOrders);
router.get('/orders/:id', getOrderByIdAdmin);
router.patch('/orders/:id/status', validate(updateOrderStatusSchema), updateOrderStatus);

// ============ REVIEW MODERATION ============
router.get('/reviews', getAllReviews);
router.patch('/reviews/:reviewId/flag', flagReview);
router.delete('/reviews/:reviewId', deleteReviewAdmin);

// ============ ANALYTICS ============
router.get('/analytics', asyncHandler(async (req: Request, res: Response) => {
  const { days } = req.query;
  const result = await analyticsService.getSalesAnalytics(
    days ? parseInt(days as string, 10) : undefined
  );

  res.json({
    success: true,
    data: result,
  });
}));

router.get('/analytics/quick', asyncHandler(async (_req: Request, res: Response) => {
  const result = await analyticsService.getQuickMetrics();

  res.json({
    success: true,
    data: result,
  });
}));

// ============ INVENTORY ============
router.get('/inventory/alerts', asyncHandler(async (req: Request, res: Response) => {
  const { threshold } = req.query;
  const result = await inventoryService.getLowStockAlerts(
    threshold ? parseInt(threshold as string, 10) : undefined
  );

  res.json({
    success: true,
    data: result,
  });
}));

router.get('/inventory/summary', asyncHandler(async (_req: Request, res: Response) => {
  const result = await inventoryService.getInventorySummary();

  res.json({
    success: true,
    data: result,
  });
}));

export default router;
