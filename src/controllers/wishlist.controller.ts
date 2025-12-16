import { Request, Response } from 'express';
import { wishlistService } from '../services/wishlist.service';
import { asyncHandler } from '../utils/asyncHandler';

export const getWishlist = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { page, limit } = req.query;

  const result = await wishlistService.getWishlist(
    userId,
    page ? parseInt(page as string, 10) : undefined,
    limit ? parseInt(limit as string, 10) : undefined
  );

  res.json({
    success: true,
    data: result,
  });
});

export const addToWishlist = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { productId } = req.body;

  const item = await wishlistService.addToWishlist(userId, productId);

  res.status(201).json({
    success: true,
    message: 'Product added to wishlist',
    data: item,
  });
});

export const removeFromWishlist = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { productId } = req.params;

  const result = await wishlistService.removeFromWishlist(userId, productId);

  res.json({
    success: true,
    message: result.message,
  });
});

export const toggleWishlist = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { productId } = req.body;

  const result = await wishlistService.toggleWishlist(userId, productId);

  res.json({
    success: true,
    message: result.message,
    data: {
      inWishlist: result.inWishlist,
      item: result.item,
    },
  });
});

export const checkWishlist = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { productId } = req.params;

  const inWishlist = await wishlistService.isInWishlist(userId, productId);

  res.json({
    success: true,
    data: { inWishlist },
  });
});
