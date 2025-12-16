import prisma from '../utils/prisma';
import { ApiError } from '../utils/ApiError';

interface CreateProductInput {
  title: string;
  slug: string;
  description?: string;
  basePrice: number;
  isActive?: boolean;
  variants: {
    size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
    color: string;
    stockQuantity: number;
    priceOverride?: number;
    sku: string;
  }[];
  images?: {
    url: string;
    isMain?: boolean;
    altText?: string;
  }[];
}

interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
}

export class ProductService {
  async getProducts(filters: ProductFilters) {
    const { page = 1, limit = 12, search, minPrice, maxPrice, isActive = true } = filters;
    const skip = (page - 1) * limit;

    const where = {
      isActive,
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
      ...(minPrice !== undefined && { basePrice: { gte: minPrice } }),
      ...(maxPrice !== undefined && { basePrice: { lte: maxPrice } }),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          images: { orderBy: { isMain: 'desc' } },
          variants: { select: { id: true, size: true, color: true, stockQuantity: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }


  async getProductBySlug(slug: string) {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { isMain: 'desc' } },
        variants: {
          orderBy: [{ size: 'asc' }, { color: 'asc' }],
        },
      },
    });

    if (!product) {
      throw ApiError.notFound('Product not found');
    }

    return product;
  }

  async createProduct(data: CreateProductInput) {
    const existingProduct = await prisma.product.findUnique({
      where: { slug: data.slug },
    });

    if (existingProduct) {
      throw ApiError.conflict('Product with this slug already exists');
    }

    const product = await prisma.product.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        basePrice: data.basePrice,
        isActive: data.isActive ?? true,
        variants: {
          create: data.variants.map((v) => ({
            size: v.size,
            color: v.color,
            stockQuantity: v.stockQuantity,
            priceOverride: v.priceOverride,
            sku: v.sku,
          })),
        },
        images: data.images
          ? {
              create: data.images.map((img) => ({
                url: img.url,
                isMain: img.isMain ?? false,
                altText: img.altText,
              })),
            }
          : undefined,
      },
      include: {
        variants: true,
        images: true,
      },
    });

    return product;
  }

  async updateProduct(productId: string, data: Partial<CreateProductInput>) {
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      throw ApiError.notFound('Product not found');
    }

    if (data.slug && data.slug !== existingProduct.slug) {
      const slugExists = await prisma.product.findUnique({
        where: { slug: data.slug },
      });
      if (slugExists) {
        throw ApiError.conflict('Product with this slug already exists');
      }
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.slug && { slug: data.slug }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.basePrice !== undefined && { basePrice: data.basePrice }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
      include: {
        variants: true,
        images: true,
      },
    });

    return product;
  }


  async deleteProduct(productId: string) {
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        variants: {
          include: {
            orderItems: true,
          },
        },
      },
    });

    if (!existingProduct) {
      throw ApiError.notFound('Product not found');
    }

    const hasOrders = existingProduct.variants.some((v: { orderItems: unknown[] }) => v.orderItems.length > 0);
    if (hasOrders) {
      await prisma.product.update({
        where: { id: productId },
        data: { isActive: false },
      });
      return { softDeleted: true, message: 'Product deactivated (has existing orders)' };
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    return { softDeleted: false, message: 'Product deleted permanently' };
  }

  async updateVariantStock(variantId: string, stockQuantity: number) {
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant) {
      throw ApiError.notFound('Product variant not found');
    }

    const updatedVariant = await prisma.productVariant.update({
      where: { id: variantId },
      data: { stockQuantity },
      include: {
        product: { select: { title: true, slug: true } },
      },
    });

    return updatedVariant;
  }

  async updateProductThreshold(productId: string, threshold: number) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw ApiError.notFound('Product not found');
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { lowStockThreshold: threshold },
      select: { id: true, title: true, lowStockThreshold: true },
    });

    return updatedProduct;
  }
}

export const productService = new ProductService();
