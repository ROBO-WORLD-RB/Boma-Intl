import prisma from '../utils/prisma';
import { ApiError } from '../utils/ApiError';
import { paystackService } from './paystack.service';
import { emailService } from './email.service';
import { Decimal } from '@prisma/client/runtime/library';
import { OrderStatus } from '@prisma/client';
import { calculateDeliveryFee } from '../utils/delivery-calculator';

interface OrderItemInput {
  variantId: string;
  quantity: number;
}

interface ShippingAddress {
  fullName?: string;
  street: string;
  city: string;
  state?: string;
  region?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  directions?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

type TimeWindow = 'morning' | 'afternoon' | 'evening' | 'any';
type PaymentMethod = 'cod' | 'paystack';

interface CreateOrderInput {
  userId?: string;  // Optional for guest orders
  userEmail?: string;
  items: OrderItemInput[];
  shippingAddress: ShippingAddress;
  // New fields for checkout flow
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  scheduledDate?: Date;
  timeWindow?: TimeWindow;
  paymentMethod?: PaymentMethod;
}

export interface InventoryError {
  variantId: string;
  productTitle: string;
  size: string;
  color: string;
  requested: number;
  available: number;
}

export interface CreateOrderResult {
  order: Awaited<ReturnType<typeof prisma.order.create>>;
  payment?: {
    authorizationUrl: string;
    reference: string;
  };
  inventoryErrors?: InventoryError[];
}

export class OrderService {
  /**
   * Validates inventory for all items and returns errors if any items have insufficient stock.
   * Does not modify stock - just checks availability.
   */
  async validateInventory(items: OrderItemInput[]): Promise<InventoryError[]> {
    const variantIds = items.map((item) => item.variantId);
    const variants = await prisma.productVariant.findMany({
      where: { id: { in: variantIds } },
      include: { product: { select: { title: true, isActive: true } } },
    });

    const errors: InventoryError[] = [];

    type VariantWithProduct = { id: string; stockQuantity: number; size: string; color: string; product: { title: string; isActive: boolean } };
    
    for (const item of items) {
      const variant = variants.find((v: VariantWithProduct) => v.id === item.variantId) as VariantWithProduct | undefined;
      
      if (!variant) {
        errors.push({
          variantId: item.variantId,
          productTitle: 'Unknown Product',
          size: 'N/A',
          color: 'N/A',
          requested: item.quantity,
          available: 0,
        });
        continue;
      }

      if (!variant.product.isActive) {
        errors.push({
          variantId: variant.id,
          productTitle: variant.product.title,
          size: variant.size,
          color: variant.color,
          requested: item.quantity,
          available: 0,
        });
        continue;
      }

      if (variant.stockQuantity < item.quantity) {
        errors.push({
          variantId: variant.id,
          productTitle: variant.product.title,
          size: variant.size,
          color: variant.color,
          requested: item.quantity,
          available: variant.stockQuantity,
        });
      }
    }

    return errors;
  }

  /**
   * Creates an order with atomic stock deduction to prevent overselling.
   * Uses Prisma interactive transactions for data consistency.
   * Supports both authenticated and guest checkout.
   * 
   * Requirements: 8.2, 12.5, 12.6, 12.7
   */
  async createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
    const { 
      userId, 
      userEmail, 
      items, 
      shippingAddress,
      customerName,
      customerPhone,
      customerEmail,
      scheduledDate,
      timeWindow = 'any',
      paymentMethod = 'cod',
    } = input;

    // Calculate delivery fee based on region
    const deliveryFee = new Decimal(
      calculateDeliveryFee(shippingAddress.region || shippingAddress.state || '')
    );

    type TxVariant = { id: string; stockQuantity: number; size: string; color: string; priceOverride: Decimal | null; product: { basePrice: Decimal; isActive: boolean; title: string } };
    
    // Execute everything in a transaction
    const result = await prisma.$transaction(async (tx: typeof prisma) => {
      // 1. Fetch all variants with their products (for pricing)
      const variantIds = items.map((item) => item.variantId);
      const variants = await tx.productVariant.findMany({
        where: { id: { in: variantIds } },
        include: { product: { select: { basePrice: true, isActive: true, title: true } } },
      });

      // 2. Validate all variants exist
      if (variants.length !== variantIds.length) {
        throw ApiError.badRequest('One or more product variants not found');
      }

      // 3. Check stock availability and calculate totals
      const orderItems: {
        variantId: string;
        quantity: number;
        priceAtPurchase: Decimal;
      }[] = [];
      let subtotal = new Decimal(0);
      const inventoryErrors: InventoryError[] = [];

      for (const item of items) {
        const variant = variants.find((v: TxVariant) => v.id === item.variantId) as TxVariant | undefined;
        
        if (!variant) {
          throw ApiError.badRequest(`Variant ${item.variantId} not found`);
        }

        if (!variant.product.isActive) {
          throw ApiError.badRequest(`Product is no longer available`);
        }

        // CRITICAL: Check stock availability
        if (variant.stockQuantity < item.quantity) {
          inventoryErrors.push({
            variantId: variant.id,
            productTitle: variant.product.title,
            size: variant.size,
            color: variant.color,
            requested: item.quantity,
            available: variant.stockQuantity,
          });
          continue;
        }

        // Use price override if set, otherwise use base price
        const price = variant.priceOverride ?? variant.product.basePrice;
        const itemTotal = price.mul(item.quantity);
        subtotal = subtotal.add(itemTotal);

        orderItems.push({
          variantId: variant.id,
          quantity: item.quantity,
          priceAtPurchase: price,
        });

        // 4. ATOMIC: Deduct stock immediately within transaction
        await tx.productVariant.update({
          where: { id: variant.id },
          data: { stockQuantity: { decrement: item.quantity } },
        });
      }

      // If there are inventory errors, throw them
      if (inventoryErrors.length > 0) {
        throw { type: 'INVENTORY_ERROR', errors: inventoryErrors };
      }

      // Calculate total amount (subtotal + delivery fee)
      const totalAmount = subtotal.add(deliveryFee);

      // 5. Generate unique payment reference
      const paymentRef = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

      // 6. Create the order with new fields
      const order = await tx.order.create({
        data: {
          userId: userId || null,  // Nullable for guest orders
          totalAmount,
          deliveryFee,
          paymentRef,
          paymentMethod,
          shippingAddress: shippingAddress as object,
          scheduledDate: scheduledDate || null,
          timeWindow: timeWindow || null,
          customerName: customerName || null,
          customerPhone: customerPhone || null,
          customerEmail: customerEmail || userEmail || null,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: {
            include: {
              variant: {
                include: { product: { select: { title: true, slug: true } } },
              },
            },
          },
        },
      });

      return { order, paymentRef, totalAmount, subtotal };
    });

    // 7. Handle payment based on method
    if (paymentMethod === 'paystack') {
      const email = customerEmail || userEmail;
      if (!email) {
        throw ApiError.badRequest('Email is required for online payment');
      }

      const payment = await paystackService.initializePayment({
        email,
        amount: result.totalAmount.mul(100).toNumber(), // Convert to kobo/pesewas
        reference: result.paymentRef,
        metadata: {
          orderId: result.order.id,
          userId: userId || 'guest',
        },
      });

      return {
        order: result.order,
        payment: {
          authorizationUrl: payment.authorization_url,
          reference: payment.reference,
        },
      };
    }

    // For COD, just return the order without payment redirect
    return {
      order: result.order,
    };
  }


  /**
   * Verify payment and update order status.
   * Called by Paystack webhook.
   */
  async verifyPayment(reference: string, signature: string, payload: string) {
    // Verify webhook signature
    if (!paystackService.verifyWebhookSignature(payload, signature)) {
      throw ApiError.unauthorized('Invalid webhook signature');
    }

    // Verify payment with Paystack
    const paymentData = await paystackService.verifyPayment(reference);

    if (paymentData.status !== 'success') {
      // Payment failed - restore stock
      await this.restoreStockForOrder(reference);
      
      await prisma.order.update({
        where: { paymentRef: reference },
        data: { status: 'CANCELLED' },
      });

      return { success: false, message: 'Payment failed' };
    }

    // Update order status to PAID
    const order = await prisma.order.update({
      where: { paymentRef: reference },
      data: { status: 'PAID' },
      include: {
        items: {
          include: {
            variant: {
              include: { product: { select: { title: true } } },
            },
          },
        },
        user: { select: { email: true } },
      },
    });

    // Send order confirmation email
    const shippingAddress = order.shippingAddress as {
      fullName: string;
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };

    type OrderItemWithVariant = { variant: { product: { title: string }; size: string; color: string }; quantity: number; priceAtPurchase: Decimal };
    
    await emailService.sendOrderConfirmation({
      orderId: order.id,
      customerName: shippingAddress.fullName || order.customerName || 'Customer',
      customerEmail: order.customerEmail || order.user?.email || '',
      items: order.items.map((item: OrderItemWithVariant) => ({
        title: item.variant.product.title,
        size: item.variant.size,
        color: item.variant.color,
        quantity: item.quantity,
        price: item.priceAtPurchase.toNumber(),
      })),
      totalAmount: order.totalAmount.toNumber(),
      shippingAddress,
    });

    return { success: true, order };
  }

  /**
   * Restore stock when payment fails or order is cancelled.
   */
  private async restoreStockForOrder(paymentRef: string) {
    const order = await prisma.order.findUnique({
      where: { paymentRef },
      include: { items: true },
    });

    if (!order) return;

    await prisma.$transaction(
      order.items.map((item: { variantId: string; quantity: number }) =>
        prisma.productVariant.update({
          where: { id: item.variantId },
          data: { stockQuantity: { increment: item.quantity } },
        })
      )
    );
  }

  async getOrdersByUser(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            variant: {
              include: { product: { select: { title: true, slug: true } } },
            },
          },
        },
      },
    });
  }

  async getOrderById(orderId: string, userId: string) {
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        items: {
          include: {
            variant: {
              include: { product: true },
            },
          },
        },
      },
    });

    if (!order) {
      throw ApiError.notFound('Order not found');
    }

    return order;
  }

  /**
   * Get order by ID for admin (no user restriction)
   */
  async getOrderByIdAdmin(orderId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: { select: { id: true, email: true } },
        items: {
          include: {
            variant: {
              include: { product: { select: { title: true, slug: true } } },
            },
          },
        },
      },
    });

    if (!order) {
      throw ApiError.notFound('Order not found');
    }

    return order;
  }

  /**
   * Update order status (admin only).
   * Sends email notifications for status changes.
   */
  async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    trackingInfo?: { trackingNumber: string; trackingUrl?: string }
  ) {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        items: {
          include: {
            variant: {
              include: { product: { select: { title: true } } },
            },
          },
        },
        user: { select: { email: true } },
      },
    });

    const shippingAddress = order.shippingAddress as {
      fullName: string;
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };

    // Send shipping notification when status changes to SHIPPED
    if (status === 'SHIPPED') {
      type ShippingItem = { variant: { product: { title: string }; size: string; color: string }; quantity: number; priceAtPurchase: Decimal };
      await emailService.sendShippingNotification({
        orderId: order.id,
        customerName: shippingAddress.fullName || order.customerName || 'Customer',
        customerEmail: order.customerEmail || order.user?.email || '',
        items: order.items.map((item: ShippingItem) => ({
          title: item.variant.product.title,
          size: item.variant.size,
          color: item.variant.color,
          quantity: item.quantity,
          price: item.priceAtPurchase.toNumber(),
        })),
        totalAmount: order.totalAmount.toNumber(),
        shippingAddress,
        trackingNumber: trackingInfo?.trackingNumber,
        trackingUrl: trackingInfo?.trackingUrl,
      });
    }

    return order;
  }

  /**
   * Get all orders (admin only).
   */
  async getAllOrders(page = 1, limit = 20, status?: OrderStatus) {
    const skip = (page - 1) * limit;

    const where = status ? { status } : {};

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: { select: { id: true, email: true } },
          items: {
            include: {
              variant: {
                include: { product: { select: { title: true, slug: true } } },
              },
            },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Lookup order by ID and phone number for guest orders.
   * Requirements: 8.6
   */
  async lookupGuestOrder(orderId: string, phone: string) {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        customerPhone: phone,
      },
      include: {
        items: {
          include: {
            variant: {
              include: { product: { select: { title: true, slug: true } } },
            },
          },
        },
      },
    });

    if (!order) {
      throw ApiError.notFound('Order not found or phone number does not match');
    }

    return order;
  }

  /**
   * Validates delivery date is within allowed range.
   * Requirements: 12.6
   */
  validateDeliveryDate(date: Date): boolean {
    // Normalize dates to midnight in local timezone for comparison
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    
    // Normalize the input date to midnight
    const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
    
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 14);

    // Check if date is in the past
    if (normalizedDate < today) {
      return false;
    }

    // Check if date is more than 14 days in the future
    if (normalizedDate > maxDate) {
      return false;
    }

    // Check if date is a Sunday (blackout day)
    if (normalizedDate.getDay() === 0) {
      return false;
    }

    return true;
  }
}

export const orderService = new OrderService();
