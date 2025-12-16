import { Request, Response } from 'express';
import { orderService } from '../services/order.service';
import { productService } from '../services/product.service';
import { reviewService } from '../services/review.service';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { OrderStatus } from '@prisma/client';

// ============ ORDER MANAGEMENT ============

/**
 * Get all orders with optional status filter
 */
export const getAllOrders = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, status } = req.query;

  const result = await orderService.getAllOrders(
    page ? parseInt(page as string, 10) : undefined,
    limit ? parseInt(limit as string, 10) : undefined,
    status as OrderStatus | undefined
  );

  res.json({
    success: true,
    data: result,
  });
});

/**
 * Get single order by ID (admin view - no user restriction)
 */
export const getOrderByIdAdmin = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const order = await orderService.getOrderByIdAdmin(id);

  res.json({
    success: true,
    data: order,
  });
});

/**
 * Update order status
 */
export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, trackingNumber, trackingUrl } = req.body;

  if (!status || !Object.values(OrderStatus).includes(status)) {
    throw ApiError.badRequest('Invalid order status');
  }

  const order = await orderService.updateOrderStatus(
    id,
    status as OrderStatus,
    trackingNumber ? { trackingNumber, trackingUrl } : undefined
  );

  res.json({
    success: true,
    message: `Order status updated to ${status}`,
    data: order,
  });
});


// ============ PRODUCT MANAGEMENT ============

/**
 * Update product details
 */
export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await productService.updateProduct(id, req.body);

  res.json({
    success: true,
    message: 'Product updated successfully',
    data: product,
  });
});

/**
 * Delete product
 */
export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await productService.deleteProduct(id);

  res.json({
    success: true,
    message: 'Product deleted successfully',
  });
});

/**
 * Update product variant stock
 */
export const updateVariantStock = asyncHandler(async (req: Request, res: Response) => {
  const { variantId } = req.params;
  const { stockQuantity } = req.body;

  if (typeof stockQuantity !== 'number' || stockQuantity < 0) {
    throw ApiError.badRequest('Stock quantity must be a non-negative number');
  }

  const variant = await productService.updateVariantStock(variantId, stockQuantity);

  res.json({
    success: true,
    message: 'Stock updated successfully',
    data: variant,
  });
});

/**
 * Update product low stock threshold
 */
export const updateProductThreshold = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { threshold } = req.body;

  if (typeof threshold !== 'number' || threshold < 0) {
    throw ApiError.badRequest('Threshold must be a non-negative number');
  }

  const product = await productService.updateProductThreshold(id, threshold);

  res.json({
    success: true,
    message: 'Low stock threshold updated successfully',
    data: product,
  });
});

// ============ REVIEW MODERATION ============

/**
 * Get all reviews for moderation
 */
export const getAllReviews = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, flagged } = req.query;

  const result = await reviewService.getAllReviews(
    page ? parseInt(page as string, 10) : undefined,
    limit ? parseInt(limit as string, 10) : undefined,
    flagged === 'true'
  );

  res.json({
    success: true,
    data: result,
  });
});

/**
 * Flag a review as inappropriate
 */
export const flagReview = asyncHandler(async (req: Request, res: Response) => {
  const { reviewId } = req.params;
  const { flagged, flagReason } = req.body;

  const review = await reviewService.flagReview(reviewId, flagged, flagReason);

  res.json({
    success: true,
    message: flagged ? 'Review flagged successfully' : 'Review unflagged successfully',
    data: review,
  });
});

/**
 * Delete a review (admin only)
 */
export const deleteReviewAdmin = asyncHandler(async (req: Request, res: Response) => {
  const { reviewId } = req.params;

  await reviewService.deleteReview(reviewId, '', true);

  res.json({
    success: true,
    message: 'Review deleted successfully',
  });
});
