import { ReviewService } from '../review.service';
import * as prismaModule from '../../utils/prisma';
import { ApiError } from '../../utils/ApiError';

// Mock Prisma
jest.mock('../../utils/prisma', () => ({
  __esModule: true,
  default: {
    product: {
      findUnique: jest.fn(),
    },
    review: {
      findMany: jest.fn(),
      count: jest.fn(),
      aggregate: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    order: {
      findFirst: jest.fn(),
    },
  },
}));

describe('ReviewService', () => {
  let service: ReviewService;

  beforeEach(() => {
    service = new ReviewService();
    jest.clearAllMocks();
  });

  describe('getReviewsByProductSlug', () => {
    it('should return reviews for a product with pagination', async () => {
      const slug = 'test-product';
      const productId = 'prod-1';
      const mockReviews = [
        {
          id: 'rev-1',
          rating: 5,
          comment: 'Great product!',
          verified: true,
          createdAt: new Date(),
          user: { id: 'user-1', email: 'john@example.com' },
        },
      ];

      const prisma = prismaModule.default as any;
      prisma.product.findUnique.mockResolvedValue({ id: productId });
      prisma.review.findMany.mockResolvedValue(mockReviews);
      prisma.review.count.mockResolvedValue(1);
      prisma.review.aggregate.mockResolvedValue({
        _avg: { rating: 5 },
        _count: { rating: 1 },
      });

      const result = await service.getReviewsByProductSlug(slug, 1, 10);

      expect(result.reviews).toHaveLength(1);
      expect(result.stats.averageRating).toBe(5);
      expect(result.stats.totalReviews).toBe(1);
      expect(result.pagination.page).toBe(1);
    });

    it('should throw error if product not found', async () => {
      const slug = 'nonexistent';

      const prisma = prismaModule.default as any;
      prisma.product.findUnique.mockResolvedValue(null);

      await expect(service.getReviewsByProductSlug(slug)).rejects.toThrow('not found');
    });

    it('should mask email addresses in reviews', async () => {
      const slug = 'test-product';
      const productId = 'prod-1';
      const mockReviews = [
        {
          id: 'rev-1',
          rating: 4,
          comment: 'Good',
          verified: true,
          createdAt: new Date(),
          user: { id: 'user-1', email: 'john@example.com' },
        },
      ];

      const prisma = prismaModule.default as any;
      prisma.product.findUnique.mockResolvedValue({ id: productId });
      prisma.review.findMany.mockResolvedValue(mockReviews);
      prisma.review.count.mockResolvedValue(1);
      prisma.review.aggregate.mockResolvedValue({
        _avg: { rating: 4 },
        _count: { rating: 1 },
      });

      const result = await service.getReviewsByProductSlug(slug);

      expect(result.reviews[0].userName).toBe('j***@example.com');
    });
  });

  describe('createReview', () => {
    it('should create a review with valid rating', async () => {
      const slug = 'test-product';
      const productId = 'prod-1';
      const userId = 'user-1';
      const mockReview = {
        id: 'rev-1',
        rating: 5,
        comment: 'Excellent!',
        verified: true,
        createdAt: new Date(),
        user: { email: 'john@example.com' },
      };

      const prisma = prismaModule.default as any;
      prisma.product.findUnique.mockResolvedValue({ id: productId });
      prisma.review.findUnique.mockResolvedValue(null);
      prisma.order.findFirst.mockResolvedValue({ id: 'order-1' });
      prisma.review.create.mockResolvedValue(mockReview);

      const result = await service.createReview(slug, {
        userId,
        rating: 5,
        comment: 'Excellent!',
      });

      expect(result.rating).toBe(5);
      expect(result.verified).toBe(true);
    });

    it('should reject rating outside 1-5 range', async () => {
      const slug = 'test-product';
      const productId = 'prod-1';

      const prisma = prismaModule.default as any;
      prisma.product.findUnique.mockResolvedValue({ id: productId });

      await expect(
        service.createReview(slug, {
          userId: 'user-1',
          rating: 6,
          comment: 'Too high',
        })
      ).rejects.toThrow('between 1 and 5');

      await expect(
        service.createReview(slug, {
          userId: 'user-1',
          rating: 0,
          comment: 'Too low',
        })
      ).rejects.toThrow('between 1 and 5');
    });

    it('should reject non-integer ratings', async () => {
      const slug = 'test-product';
      const productId = 'prod-1';

      const prisma = prismaModule.default as any;
      prisma.product.findUnique.mockResolvedValue({ id: productId });

      await expect(
        service.createReview(slug, {
          userId: 'user-1',
          rating: 3.5,
          comment: 'Decimal rating',
        })
      ).rejects.toThrow('integer');
    });

    it('should throw error if user already reviewed product', async () => {
      const slug = 'test-product';
      const productId = 'prod-1';
      const userId = 'user-1';
      const mockExistingReview = { id: 'rev-1', rating: 4 };

      const prisma = prismaModule.default as any;
      prisma.product.findUnique.mockResolvedValue({ id: productId });
      prisma.review.findUnique.mockResolvedValue(mockExistingReview);

      await expect(
        service.createReview(slug, {
          userId,
          rating: 5,
          comment: 'Another review',
        })
      ).rejects.toThrow('already reviewed');
    });

    it('should throw error if product not found', async () => {
      const slug = 'nonexistent';

      const prisma = prismaModule.default as any;
      prisma.product.findUnique.mockResolvedValue(null);

      await expect(
        service.createReview(slug, {
          userId: 'user-1',
          rating: 5,
          comment: 'Test',
        })
      ).rejects.toThrow('not found');
    });
  });

  describe('updateReview', () => {
    it('should update review by author', async () => {
      const reviewId = 'rev-1';
      const userId = 'user-1';
      const mockReview = { id: reviewId, userId, rating: 4, comment: 'Good' };
      const mockUpdated = { ...mockReview, rating: 5, comment: 'Excellent!' };

      const prisma = prismaModule.default as any;
      prisma.review.findUnique.mockResolvedValue(mockReview);
      prisma.review.update.mockResolvedValue(mockUpdated);

      const result = await service.updateReview(reviewId, userId, {
        rating: 5,
        comment: 'Excellent!',
      });

      expect(result.rating).toBe(5);
      expect(result.comment).toBe('Excellent!');
    });

    it('should throw error if not review author', async () => {
      const reviewId = 'rev-1';
      const userId = 'user-1';
      const authorId = 'user-2';
      const mockReview = { id: reviewId, userId: authorId, rating: 4 };

      const prisma = prismaModule.default as any;
      prisma.review.findUnique.mockResolvedValue(mockReview);

      await expect(
        service.updateReview(reviewId, userId, { rating: 5 })
      ).rejects.toThrow('only edit your own');
    });

    it('should throw error if review not found', async () => {
      const prisma = prismaModule.default as any;
      prisma.review.findUnique.mockResolvedValue(null);

      await expect(
        service.updateReview('nonexistent', 'user-1', { rating: 5 })
      ).rejects.toThrow('not found');
    });
  });

  describe('deleteReview', () => {
    it('should delete review by author', async () => {
      const reviewId = 'rev-1';
      const userId = 'user-1';
      const mockReview = { id: reviewId, userId };

      const prisma = prismaModule.default as any;
      prisma.review.findUnique.mockResolvedValue(mockReview);
      prisma.review.delete.mockResolvedValue(mockReview);

      const result = await service.deleteReview(reviewId, userId, false);

      expect(result.message).toContain('deleted');
      expect(prisma.review.delete).toHaveBeenCalledWith({
        where: { id: reviewId },
      });
    });

    it('should allow admin to delete any review', async () => {
      const reviewId = 'rev-1';
      const userId = 'user-1';
      const adminId = 'admin-1';
      const mockReview = { id: reviewId, userId };

      const prisma = prismaModule.default as any;
      prisma.review.findUnique.mockResolvedValue(mockReview);
      prisma.review.delete.mockResolvedValue(mockReview);

      const result = await service.deleteReview(reviewId, adminId, true);

      expect(result.message).toContain('deleted');
    });

    it('should throw error if not author and not admin', async () => {
      const reviewId = 'rev-1';
      const userId = 'user-1';
      const authorId = 'user-2';
      const mockReview = { id: reviewId, userId: authorId };

      const prisma = prismaModule.default as any;
      prisma.review.findUnique.mockResolvedValue(mockReview);

      await expect(
        service.deleteReview(reviewId, userId, false)
      ).rejects.toThrow('only delete your own');
    });
  });
});
