import { Request, Response } from 'express';
import { orderService } from '../services/order.service';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw ApiError.unauthorized();
  }

  const { items, shippingAddress, scheduledDate, timeWindow, paymentMethod } = req.body;

  const result = await orderService.createOrder({
    userId: req.user.userId,
    userEmail: req.user.email,
    items,
    shippingAddress,
    scheduledDate: scheduledDate ? new Date(scheduledDate) : undefined,
    timeWindow,
    paymentMethod,
  });

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: result,
  });
});

/**
 * Create a guest order without authentication
 * Requirements: 8.1, 6.1, 6.2, 6.3
 */
export const createGuestOrder = asyncHandler(async (req: Request, res: Response) => {
  const { 
    items, 
    shippingAddress, 
    customerName, 
    customerPhone, 
    customerEmail,
    deliveryDate,
    timeWindow,
    paymentMethod,
  } = req.body;

  // Validate delivery date
  const scheduledDate = new Date(deliveryDate);
  if (!orderService.validateDeliveryDate(scheduledDate)) {
    throw ApiError.badRequest('Invalid delivery date. Please select a valid date within the next 14 days (excluding Sundays).');
  }

  try {
    const result = await orderService.createOrder({
      // No userId for guest orders
      items,
      shippingAddress,
      customerName,
      customerPhone,
      customerEmail: customerEmail || undefined,
      scheduledDate,
      timeWindow: timeWindow || 'any',
      paymentMethod: paymentMethod || 'cod',
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        orderId: result.order.id,
        status: result.order.status,
        scheduledDate: result.order.scheduledDate,
        timeWindow: result.order.timeWindow,
        totalAmount: result.order.totalAmount,
        deliveryFee: result.order.deliveryFee,
        paymentMethod: result.order.paymentMethod,
        paymentUrl: result.payment?.authorizationUrl,
      },
    });
  } catch (error: unknown) {
    // Handle inventory errors specially
    if (error && typeof error === 'object' && 'type' in error && error.type === 'INVENTORY_ERROR') {
      const inventoryError = error as { type: string; errors: Array<{ variantId: string; productTitle: string; size: string; color: string; requested: number; available: number }> };
      res.status(400).json({
        success: false,
        error: 'INVENTORY_ERROR',
        message: 'Some items have insufficient stock',
        items: inventoryError.errors,
      });
      return;
    }
    throw error;
  }
});

/**
 * Lookup order by ID and phone number for guests
 * Requirements: 8.6
 */
export const lookupGuestOrder = asyncHandler(async (req: Request, res: Response) => {
  const { orderId, phone } = req.query;

  if (!orderId || !phone) {
    throw ApiError.badRequest('Order ID and phone number are required');
  }

  const order = await orderService.lookupGuestOrder(
    orderId as string, 
    phone as string
  );

  res.json({
    success: true,
    data: order,
  });
});

export const verifyPayment = asyncHandler(async (req: Request, res: Response) => {
  const signature = req.headers['x-paystack-signature'] as string;
  const payload = JSON.stringify(req.body);
  const { reference } = req.body.data || {};

  if (!reference) {
    throw ApiError.badRequest('Payment reference is required');
  }

  const result = await orderService.verifyPayment(reference, signature, payload);

  res.json({
    success: true,
    data: result,
  });
});

export const getMyOrders = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw ApiError.unauthorized();
  }

  const orders = await orderService.getOrdersByUser(req.user.userId);

  res.json({
    success: true,
    data: orders,
  });
});

export const getOrderById = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw ApiError.unauthorized();
  }

  const { id } = req.params;
  const order = await orderService.getOrderById(id, req.user.userId);

  res.json({
    success: true,
    data: order,
  });
});
