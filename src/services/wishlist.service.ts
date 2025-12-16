import prisma from '../utils/prisma';
import { ApiError } from '../utils/ApiError';

export class WishlistService {
  /**
   * Get all wishlist items for a user.
   */
  async getWishlist(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.wishlistItem.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          product: {
            include: {
              images: { where: { isMain: true }, take: 1 },
              variants: {
                select: { id: true, size: true, color: true, stockQuantity: true },
              },
            },
          },
        },
      }),
      prisma.wishlistItem.count({ where: { userId } }),
    ]);

    return {
      items: items.map((item: { id: string; createdAt: Date; product: unknown }) => ({
        id: item.id,
        addedAt: item.createdAt,
        product: item.product,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Add a product to the user's wishlist.
   */
  async addToWishlist(userId: string, productId: string) {
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, title: true, isActive: true },
    });

    if (!product) {
      throw ApiError.notFound('Product not found');
    }

    if (!product.isActive) {
      throw ApiError.badRequest('This product is no longer available');
    }

    // Check if already in wishlist
    const existing = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    if (existing) {
      throw ApiError.conflict('Product is already in your wishlist');
    }

    const wishlistItem = await prisma.wishlistItem.create({
      data: { userId, productId },
      include: {
        product: {
          include: {
            images: { where: { isMain: true }, take: 1 },
          },
        },
      },
    });

    return {
      id: wishlistItem.id,
      addedAt: wishlistItem.createdAt,
      product: wishlistItem.product,
    };
  }

  /**
   * Remove a product from the user's wishlist.
   */
  async removeFromWishlist(userId: string, productId: string) {
    const existing = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    if (!existing) {
      throw ApiError.notFound('Product not found in your wishlist');
    }

    await prisma.wishlistItem.delete({
      where: {
        userId_productId: { userId, productId },
      },
    });

    return { message: 'Product removed from wishlist' };
  }

  /**
   * Check if a product is in the user's wishlist.
   */
  async isInWishlist(userId: string, productId: string): Promise<boolean> {
    const item = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    return !!item;
  }

  /**
   * Toggle a product in the user's wishlist.
   */
  async toggleWishlist(userId: string, productId: string) {
    const isInWishlist = await this.isInWishlist(userId, productId);

    if (isInWishlist) {
      await this.removeFromWishlist(userId, productId);
      return { inWishlist: false, message: 'Product removed from wishlist' };
    } else {
      const item = await this.addToWishlist(userId, productId);
      return { inWishlist: true, message: 'Product added to wishlist', item };
    }
  }
}

export const wishlistService = new WishlistService();
