import prisma from '../utils/prisma';
import { ApiError } from '../utils/ApiError';

export class NewsletterService {
  /**
   * Subscribe an email to the newsletter.
   * If already subscribed and active, returns appropriate message.
   * If previously unsubscribed, reactivates the subscription.
   */
  async subscribe(email: string) {
    const normalizedEmail = email.toLowerCase().trim();

    // Check if email already exists
    const existing = await prisma.newsletterSubscription.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      if (existing.isActive) {
        throw ApiError.conflict('This email is already subscribed to our newsletter');
      }

      // Reactivate subscription
      const subscription = await prisma.newsletterSubscription.update({
        where: { email: normalizedEmail },
        data: {
          isActive: true,
          unsubscribedAt: null,
        },
      });

      return {
        subscription,
        message: 'Welcome back! Your subscription has been reactivated.',
      };
    }

    // Create new subscription
    const subscription = await prisma.newsletterSubscription.create({
      data: { email: normalizedEmail },
    });

    return {
      subscription,
      message: 'Successfully subscribed to our newsletter!',
    };
  }

  /**
   * Unsubscribe an email from the newsletter.
   */
  async unsubscribe(email: string) {
    const normalizedEmail = email.toLowerCase().trim();

    const existing = await prisma.newsletterSubscription.findUnique({
      where: { email: normalizedEmail },
    });

    if (!existing) {
      throw ApiError.notFound('Email not found in our newsletter list');
    }

    if (!existing.isActive) {
      throw ApiError.badRequest('This email is already unsubscribed');
    }

    const subscription = await prisma.newsletterSubscription.update({
      where: { email: normalizedEmail },
      data: {
        isActive: false,
        unsubscribedAt: new Date(),
      },
    });

    return {
      subscription,
      message: 'Successfully unsubscribed from our newsletter.',
    };
  }

  /**
   * Get all active subscribers (admin only).
   */
  async getActiveSubscribers(page = 1, limit = 50) {
    const skip = (page - 1) * limit;

    const [subscribers, total] = await Promise.all([
      prisma.newsletterSubscription.findMany({
        where: { isActive: true },
        orderBy: { subscribedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.newsletterSubscription.count({ where: { isActive: true } }),
    ]);

    return {
      subscribers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export const newsletterService = new NewsletterService();
