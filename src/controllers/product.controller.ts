import { Request, Response } from 'express';
import { productService } from '../services/product.service';
import { asyncHandler } from '../utils/asyncHandler';

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, search, minPrice, maxPrice } = req.query;

  const result = await productService.getProducts({
    page: page ? parseInt(page as string, 10) : undefined,
    limit: limit ? parseInt(limit as string, 10) : undefined,
    search: search as string,
    minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
  });

  res.json({
    success: true,
    data: result,
  });
});

export const getProductBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const product = await productService.getProductBySlug(slug);

  res.json({
    success: true,
    data: product,
  });
});

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.createProduct(req.body);

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: product,
  });
});
