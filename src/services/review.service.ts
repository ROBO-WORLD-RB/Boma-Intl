import prisma from '../utils/prisma';
import { ApiError } from '../utils/ApiError';

interface CreateReviewInput {
  productId: string;
  userId: string;
  rating: number;
  comment?: string;
}

export class ReviewService {
  /**
   * Get reviews for a product by slug.
   */
  async getReviewsByProductSlug(slug: string, page = 1, limit = 10) {
    const product = await prisma.product.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!product) {
      throw ApiError.notFound('Product not found');
    }

    const skip = (page - 1) * limit;

    const [reviews, total, stats] = await Promise.all([
      prisma.review.findMany({
        where: { productId: product.id, flagged: false },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: {
            select: { id: true, email: true },
          },
        },
      }),
      prisma.review.count({ where: { productId: product.id, flagged: false } }),
      prisma.review.aggregate({
        where: { productId: product.id, flagged: false },
        _avg: { rating: true },
        _count: { rating: true },
      }),
    ]);

    const transformedReviews = reviews.map((review) => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      verified: review.verified,
      createdAt: review.createdAt,
      userName: this.maskEmail(review.user.email),
    }));

    return {
      reviews: transformedReviews,
      stats: {
        averageRating: stats._avg.rating ? Number(stats._avg.rating.toFixed(1)) : 0,
        totalReviews: stats._count.rating,
      },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }


  /**
   * Create a review for a product.
   */
  async createReview(slug: string, input: Omit<CreateReviewInput, 'productId'>) {
    const { userId, rating, comment } = input;

    if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      throw ApiError.badRequest('Rating must be an integer between 1 and 5');
    }

    const product = await prisma.product.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!product) {
      throw ApiError.notFound('Product not found');
    }

    const existingReview = await prisma.review.findUnique({
      where: {
        productId_userId: {
          productId: product.id,
          userId,
        },
      },
    });

    if (existingReview) {
      throw ApiError.conflict('You have already reviewed this product');
    }

    const hasPurchased = await this.userHasPurchasedProduct(userId, product.id);

    const review = await prisma.review.create({
      data: {
        productId: product.id,
        userId,
        rating,
        comment,
        verified: hasPurchased,
      },
      include: {
        user: {
          select: { email: true },
        },
      },
    });

    return {
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      verified: review.verified,
      createdAt: review.createdAt,
      userName: this.maskEmail(review.user.email),
    };
  }

  /**
   * Update a review (only by the review author).
   */
  async updateReview(reviewId: string, userId: string, data: { rating?: number; comment?: string }) {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw ApiError.notFound('Review not found');
    }

    if (review.userId !== userId) {
      throw ApiError.forbidden('You can only edit your own reviews');
    }

    if (data.rating !== undefined && (data.rating < 1 || data.rating > 5 || !Number.isInteger(data.rating))) {
      throw ApiError.badRequest('Rating must be an integer between 1 and 5');
    }

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        ...(data.rating !== undefined && { rating: data.rating }),
        ...(data.comment !== undefined && { comment: data.comment }),
      },
    });

    return updatedReview;
  }


  /**
   * Delete a review (only by the review author or admin).
   */
  async deleteReview(reviewId: string, userId: string, isAdmin: boolean) {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw ApiError.notFound('Review not found');
    }

    if (!isAdmin && review.userId !== userId) {
      throw ApiError.forbidden('You can only delete your own reviews');
    }

    await prisma.review.delete({
      where: { id: reviewId },
    });

    return { message: 'Review deleted successfully' };
  }

  /**
   * Get all reviews for admin moderation.
   */
  async getAllReviews(page = 1, limit = 20, flaggedOnly = false) {
    const skip = (page - 1) * limit;

    const where = flaggedOnly ? { flagged: true } : {};

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: { select: { id: true, email: true } },
          product: { select: { id: true, title: true, slug: true } },
        },
      }),
      prisma.review.count({ where }),
    ]);

    return {
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Flag or unflag a review for moderation.
   */
  async flagReview(reviewId: string, flagged: boolean, flagReason?: string) {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw ApiError.notFound('Review not found');
    }

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        flagged,
        flagReason: flagged ? flagReason : null,
      },
      include: {
        user: { select: { email: true } },
        product: { select: { title: true } },
      },
    });

    return updatedReview;
  }

  private async userHasPurchasedProduct(userId: string, productId: string): Promise<boolean> {
    const order = await prisma.order.findFirst({
      where: {
        userId,
        status: { in: ['PAID', 'SHIPPED', 'DELIVERED'] },
        items: {
          some: {
            variant: {
              productId,
            },
          },
        },
      },
    });

    return !!order;
  }

  private maskEmail(email: string): string {
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 2) {
      return `${localPart[0]}***@${domain}`;
    }
    return `${localPart[0]}***@${domain}`;
  }
}

export const reviewService = new ReviewService();
