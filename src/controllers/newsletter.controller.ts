import { Request, Response } from 'express';
import { newsletterService } from '../services/newsletter.service';
import { asyncHandler } from '../utils/asyncHandler';

export const subscribe = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  const result = await newsletterService.subscribe(email);

  res.status(201).json({
    success: true,
    message: result.message,
    data: {
      email: result.subscription.email,
      subscribedAt: result.subscription.subscribedAt,
    },
  });
});

export const unsubscribe = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  const result = await newsletterService.unsubscribe(email);

  res.json({
    success: true,
    message: result.message,
  });
});

export const getSubscribers = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = req.query;

  const result = await newsletterService.getActiveSubscribers(
    page ? parseInt(page as string, 10) : undefined,
    limit ? parseInt(limit as string, 10) : undefined
  );

  res.json({
    success: true,
    data: result,
  });
});
