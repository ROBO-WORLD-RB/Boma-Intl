import { WishlistService } from '../wishlist.service';
import * as prismaModule from '../../utils/prisma';
import { ApiError } from '../../utils/ApiError';

// Mock Prisma
jest.mock('../../utils/prisma', () => ({
  __esModule: true,
  default: {
    product: {
      findUnique: jest.fn(),
    },
    wishlistItem: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe('WishlistService', () => {
  let service: WishlistService;

  beforeEach(() => {
    service = new WishlistService();
    jest.clearAllMocks();
  });

  describe('getWishlist', () => {
    it('should return paginated wishlist items', async () => {
      const userId = 'user-1';
      const mockItems = [
        {
          id: 'wish-1',
          userId,
          productId: 'prod-1',
          createdAt: new Date(),
          product: {
            id: 'prod-1',
            title: 'Test Product',
            images: [{ id: 'img-1', url: 'test.jpg', isMain: true }],
            variants: [],
          },
        },
      ];

      const prisma = prismaModule.default as any;
      prisma.wishlistItem.findMany.mockResolvedValue(mockItems);
      prisma.wishlistItem.count.mockResolvedValue(1);

      const result = await service.getWishlist(userId, 1, 20);

      expect(result.items).toHaveLength(1);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.total).toBe(1);
      expect(result.pagination.totalPages).toBe(1);
    });

    it('should calculate pagination correctly', async () => {
      const userId = 'user-1';

      const prisma = prismaModule.default as any;
      prisma.wishlistItem.findMany.mockResolvedValue([]);
      prisma.wishlistItem.count.mockResolvedValue(50);

      const result = await service.getWishlist(userId, 2, 20);

      expect(result.pagination.page).toBe(2);
      expect(result.pagination.limit).toBe(20);
      expect(result.pagination.total).toBe(50);
      expect(result.pagination.totalPages).toBe(3);
      expect(prisma.wishlistItem.findMany).toHaveBeenCalledWith({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip: 20,
        take: 20,
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
      });
    });
  });

  describe('addToWishlist', () => {
    it('should add product to wishlist', async () => {
      const userId = 'user-1';
      const productId = 'prod-1';
      const mockProduct = { id: productId, title: 'Test', isActive: true };
      const mockWishlistItem = {
        id: 'wish-1',
        userId,
        productId,
        createdAt: new Date(),
        product: mockProduct,
      };

      const prisma = prismaModule.default as any;
      prisma.product.findUnique.mockResolvedValue(mockProduct);
      prisma.wishlistItem.findUnique.mockResolvedValue(null);
      prisma.wishlistItem.create.mockResolvedValue(mockWishlistItem);

      const result = await service.addToWishlist(userId, productId);

      expect(result.product.id).toBe(productId);
      expect(prisma.wishlistItem.create).toHaveBeenCalledWith({
        data: { userId, productId },
        include: {
          product: {
            include: {
              images: { where: { isMain: true }, take: 1 },
            },
          },
        },
      });
    });

    it('should throw error if product not found', async () => {
      const userId = 'user-1';
      const productId = 'nonexistent';

      const prisma = prismaModule.default as any;
      prisma.product.findUnique.mockResolvedValue(null);

      await expect(service.addToWishlist(userId, productId)).rejects.toThrow('not found');
    });

    it('should throw error if product is inactive', async () => {
      const userId = 'user-1';
      const productId = 'prod-1';
      const mockProduct = { id: productId, title: 'Test', isActive: false };

      const prisma = prismaModule.default as any;
      prisma.product.findUnique.mockResolvedValue(mockProduct);

      await expect(service.addToWishlist(userId, productId)).rejects.toThrow('no longer available');
    });

    it('should throw error if already in wishlist', async () => {
      const userId = 'user-1';
      const productId = 'prod-1';
      const mockProduct = { id: productId, title: 'Test', isActive: true };
      const mockExisting = { id: 'wish-1', userId, productId };

      const prisma = prismaModule.default as any;
      prisma.product.findUnique.mockResolvedValue(mockProduct);
      prisma.wishlistItem.findUnique.mockResolvedValue(mockExisting);

      await expect(service.addToWishlist(userId, productId)).rejects.toThrow('already in your wishlist');
    });
  });

  describe('removeFromWishlist', () => {
    it('should remove product from wishlist', async () => {
      const userId = 'user-1';
      const productId = 'prod-1';
      const mockWishlistItem = { id: 'wish-1', userId, productId };

      const prisma = prismaModule.default as any;
      prisma.wishlistItem.findUnique.mockResolvedValue(mockWishlistItem);
      prisma.wishlistItem.delete.mockResolvedValue(mockWishlistItem);

      const result = await service.removeFromWishlist(userId, productId);

      expect(result.message).toContain('removed');
      expect(prisma.wishlistItem.delete).toHaveBeenCalledWith({
        where: { userId_productId: { userId, productId } },
      });
    });

    it('should throw error if product not in wishlist', async () => {
      const userId = 'user-1';
      const productId = 'prod-1';

      const prisma = prismaModule.default as any;
      prisma.wishlistItem.findUnique.mockResolvedValue(null);

      await expect(service.removeFromWishlist(userId, productId)).rejects.toThrow('not found');
    });
  });

  describe('isInWishlist', () => {
    it('should return true if product in wishlist', async () => {
      const userId = 'user-1';
      const productId = 'prod-1';
      const mockWishlistItem = { id: 'wish-1', userId, productId };

      const prisma = prismaModule.default as any;
      prisma.wishlistItem.findUnique.mockResolvedValue(mockWishlistItem);

      const result = await service.isInWishlist(userId, productId);

      expect(result).toBe(true);
    });

    it('should return false if product not in wishlist', async () => {
      const userId = 'user-1';
      const productId = 'prod-1';

      const prisma = prismaModule.default as any;
      prisma.wishlistItem.findUnique.mockResolvedValue(null);

      const result = await service.isInWishlist(userId, productId);

      expect(result).toBe(false);
    });
  });

  describe('toggleWishlist', () => {
    it('should add product if not in wishlist', async () => {
      const userId = 'user-1';
      const productId = 'prod-1';
      const mockProduct = { id: productId, title: 'Test', isActive: true };
      const mockWishlistItem = {
        id: 'wish-1',
        userId,
        productId,
        createdAt: new Date(),
        product: mockProduct,
      };

      const prisma = prismaModule.default as any;
      prisma.wishlistItem.findUnique.mockResolvedValueOnce(null);
      prisma.product.findUnique.mockResolvedValue(mockProduct);
      prisma.wishlistItem.findUnique.mockResolvedValueOnce(null);
      prisma.wishlistItem.create.mockResolvedValue(mockWishlistItem);

      const result = await service.toggleWishlist(userId, productId);

      expect(result.inWishlist).toBe(true);
      expect(result.message).toContain('added');
    });

    it('should remove product if already in wishlist', async () => {
      const userId = 'user-1';
      const productId = 'prod-1';
      const mockWishlistItem = { id: 'wish-1', userId, productId };

      const prisma = prismaModule.default as any;
      prisma.wishlistItem.findUnique.mockResolvedValueOnce(mockWishlistItem);
      prisma.wishlistItem.findUnique.mockResolvedValueOnce(mockWishlistItem);
      prisma.wishlistItem.delete.mockResolvedValue(mockWishlistItem);

      const result = await service.toggleWishlist(userId, productId);

      expect(result.inWishlist).toBe(false);
      expect(result.message).toContain('removed');
    });
  });
});
