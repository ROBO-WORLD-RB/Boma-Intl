import { NewsletterService } from '../newsletter.service';
import * as prismaModule from '../../utils/prisma';
import { ApiError } from '../../utils/ApiError';

// Mock Prisma
jest.mock('../../utils/prisma', () => ({
  __esModule: true,
  default: {
    newsletterSubscription: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
  },
}));

describe('NewsletterService', () => {
  let service: NewsletterService;

  beforeEach(() => {
    service = new NewsletterService();
    jest.clearAllMocks();
  });

  describe('subscribe', () => {
    it('should create a new subscription for a valid email', async () => {
      const email = 'test@example.com';
      const mockSubscription = {
        id: '1',
        email: email.toLowerCase(),
        isActive: true,
        subscribedAt: new Date(),
        unsubscribedAt: null,
      };

      const prisma = prismaModule.default as any;
      prisma.newsletterSubscription.findUnique.mockResolvedValue(null);
      prisma.newsletterSubscription.create.mockResolvedValue(mockSubscription);

      const result = await service.subscribe(email);

      expect(result.subscription.email).toBe(email.toLowerCase());
      expect(result.message).toContain('Successfully subscribed');
      expect(prisma.newsletterSubscription.create).toHaveBeenCalledWith({
        data: { email: email.toLowerCase() },
      });
    });

    it('should normalize email to lowercase and trim whitespace', async () => {
      const email = '  TEST@EXAMPLE.COM  ';
      const normalized = 'test@example.com';
      const mockSubscription = {
        id: '1',
        email: normalized,
        isActive: true,
        subscribedAt: new Date(),
        unsubscribedAt: null,
      };

      const prisma = prismaModule.default as any;
      prisma.newsletterSubscription.findUnique.mockResolvedValue(null);
      prisma.newsletterSubscription.create.mockResolvedValue(mockSubscription);

      await service.subscribe(email);

      expect(prisma.newsletterSubscription.findUnique).toHaveBeenCalledWith({
        where: { email: normalized },
      });
    });

    it('should throw conflict error if email already subscribed', async () => {
      const email = 'test@example.com';
      const mockSubscription = {
        id: '1',
        email,
        isActive: true,
        subscribedAt: new Date(),
        unsubscribedAt: null,
      };

      const prisma = prismaModule.default as any;
      prisma.newsletterSubscription.findUnique.mockResolvedValue(mockSubscription);

      await expect(service.subscribe(email)).rejects.toThrow('already subscribed');
    });

    it('should reactivate a previously unsubscribed email', async () => {
      const email = 'test@example.com';
      const mockExisting = {
        id: '1',
        email,
        isActive: false,
        subscribedAt: new Date(),
        unsubscribedAt: new Date(),
      };
      const mockReactivated = {
        ...mockExisting,
        isActive: true,
        unsubscribedAt: null,
      };

      const prisma = prismaModule.default as any;
      prisma.newsletterSubscription.findUnique.mockResolvedValue(mockExisting);
      prisma.newsletterSubscription.update.mockResolvedValue(mockReactivated);

      const result = await service.subscribe(email);

      expect(result.message).toContain('reactivated');
      expect(prisma.newsletterSubscription.update).toHaveBeenCalledWith({
        where: { email },
        data: { isActive: true, unsubscribedAt: null },
      });
    });
  });

  describe('unsubscribe', () => {
    it('should unsubscribe an active subscription', async () => {
      const email = 'test@example.com';
      const mockSubscription = {
        id: '1',
        email,
        isActive: true,
        subscribedAt: new Date(),
        unsubscribedAt: null,
      };
      const mockUnsubscribed = {
        ...mockSubscription,
        isActive: false,
        unsubscribedAt: new Date(),
      };

      const prisma = prismaModule.default as any;
      prisma.newsletterSubscription.findUnique.mockResolvedValue(mockSubscription);
      prisma.newsletterSubscription.update.mockResolvedValue(mockUnsubscribed);

      const result = await service.unsubscribe(email);

      expect(result.message).toContain('unsubscribed');
      expect(prisma.newsletterSubscription.update).toHaveBeenCalledWith({
        where: { email },
        data: { isActive: false, unsubscribedAt: expect.any(Date) },
      });
    });

    it('should throw error if email not found', async () => {
      const email = 'nonexistent@example.com';

      const prisma = prismaModule.default as any;
      prisma.newsletterSubscription.findUnique.mockResolvedValue(null);

      await expect(service.unsubscribe(email)).rejects.toThrow('not found');
    });

    it('should throw error if already unsubscribed', async () => {
      const email = 'test@example.com';
      const mockSubscription = {
        id: '1',
        email,
        isActive: false,
        subscribedAt: new Date(),
        unsubscribedAt: new Date(),
      };

      const prisma = prismaModule.default as any;
      prisma.newsletterSubscription.findUnique.mockResolvedValue(mockSubscription);

      await expect(service.unsubscribe(email)).rejects.toThrow('already unsubscribed');
    });
  });

  describe('getActiveSubscribers', () => {
    it('should return paginated active subscribers', async () => {
      const mockSubscribers = [
        { id: '1', email: 'test1@example.com', isActive: true, subscribedAt: new Date(), unsubscribedAt: null },
        { id: '2', email: 'test2@example.com', isActive: true, subscribedAt: new Date(), unsubscribedAt: null },
      ];

      const prisma = prismaModule.default as any;
      prisma.newsletterSubscription.findMany.mockResolvedValue(mockSubscribers);
      prisma.newsletterSubscription.count.mockResolvedValue(2);

      const result = await service.getActiveSubscribers(1, 50);

      expect(result.subscribers).toHaveLength(2);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.total).toBe(2);
      expect(result.pagination.totalPages).toBe(1);
    });

    it('should calculate pagination correctly', async () => {
      const prisma = prismaModule.default as any;
      prisma.newsletterSubscription.findMany.mockResolvedValue([]);
      prisma.newsletterSubscription.count.mockResolvedValue(150);

      const result = await service.getActiveSubscribers(2, 50);

      expect(result.pagination.page).toBe(2);
      expect(result.pagination.limit).toBe(50);
      expect(result.pagination.total).toBe(150);
      expect(result.pagination.totalPages).toBe(3);
      expect(prisma.newsletterSubscription.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        orderBy: { subscribedAt: 'desc' },
        skip: 50,
        take: 50,
      });
    });
  });
});
