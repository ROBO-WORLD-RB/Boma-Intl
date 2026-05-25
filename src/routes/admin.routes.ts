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
import { verifyToken, requireOwner, requireDeveloper, requireOwnerOrDeveloper } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createProductSchema, updateProductSchema, updateOrderStatusSchema } from '../utils/validators';
import { analyticsService } from '../services/analytics.service';
import { inventoryService } from '../services/inventory.service';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// All admin routes require authentication
router.use(verifyToken);

// ============ PRODUCT MANAGEMENT ============
router.post('/products', requireOwner, validate(createProductSchema), createProduct);
router.patch('/products/:id', requireOwner, validate(updateProductSchema), updateProduct);
router.delete('/products/:id', requireOwner, deleteProduct);
router.patch('/products/:id/threshold', requireOwner, updateProductThreshold);
router.patch('/variants/:variantId/stock', requireOwner, updateVariantStock);

// ============ ORDER MANAGEMENT ============
router.get('/orders', requireOwner, getAllOrders);
router.get('/orders/:id', requireOwner, getOrderByIdAdmin);
router.patch('/orders/:id/status', requireOwner, validate(updateOrderStatusSchema), updateOrderStatus);

// ============ REVIEW MODERATION ============
router.get('/reviews', requireOwnerOrDeveloper, getAllReviews);
router.patch('/reviews/:reviewId/flag', requireOwnerOrDeveloper, flagReview);
router.delete('/reviews/:reviewId', requireOwnerOrDeveloper, deleteReviewAdmin);

// ============ ANALYTICS ============
router.get('/analytics', requireOwnerOrDeveloper, asyncHandler(async (req: Request, res: Response) => {
  const { days } = req.query;
  const result = await analyticsService.getSalesAnalytics(
    days ? parseInt(days as string, 10) : undefined
  );

  res.json({
    success: true,
    data: result,
  });
}));

router.get('/analytics/quick', requireOwnerOrDeveloper, asyncHandler(async (_req: Request, res: Response) => {
  const result = await analyticsService.getQuickMetrics();

  res.json({
    success: true,
    data: result,
  });
}));

// ============ INVENTORY ============
router.get('/inventory/alerts', requireOwnerOrDeveloper, asyncHandler(async (req: Request, res: Response) => {
  const { threshold } = req.query;
  const result = await inventoryService.getLowStockAlerts(
    threshold ? parseInt(threshold as string, 10) : undefined
  );

  res.json({
    success: true,
    data: result,
  });
}));

router.get('/inventory/summary', requireOwnerOrDeveloper, asyncHandler(async (_req: Request, res: Response) => {
  const result = await inventoryService.getInventorySummary();

  res.json({
    success: true,
    data: result,
  });
}));

export default router;
