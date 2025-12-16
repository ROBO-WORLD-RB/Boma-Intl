import prisma from '../utils/prisma';

interface LowStockItem {
  productId: string;
  productTitle: string;
  productSlug: string;
  variantId: string;
  sku: string;
  size: string;
  color: string;
  stockQuantity: number;
  lowStockThreshold: number;
  isCritical: boolean; // true if stock is 0 or below critical threshold (threshold / 2)
}

interface InventoryAlertResult {
  lowStockItems: LowStockItem[];
  outOfStockCount: number;
  lowStockCount: number;
  criticalCount: number;
}

export class InventoryService {
  /**
   * Get all products/variants with low stock.
   * Uses product-level lowStockThreshold or falls back to global default.
   */
  async getLowStockAlerts(globalThreshold = 5): Promise<InventoryAlertResult> {
    // Get all variants with their product's threshold
    const variants = await prisma.productVariant.findMany({
      include: {
        product: {
          select: {
            id: true,
            title: true,
            slug: true,
            lowStockThreshold: true,
            isActive: true,
          },
        },
      },
      orderBy: { stockQuantity: 'asc' },
    });

    const lowStockItems: LowStockItem[] = [];
    let outOfStockCount = 0;
    let criticalCount = 0;

    for (const variant of variants) {
      // Skip inactive products
      if (!variant.product.isActive) continue;

      const threshold = variant.product.lowStockThreshold || globalThreshold;
      const criticalThreshold = Math.floor(threshold / 2);

      // Check if stock is below threshold
      if (variant.stockQuantity <= threshold) {
        const isCritical = variant.stockQuantity <= criticalThreshold;
        const isOutOfStock = variant.stockQuantity === 0;

        if (isOutOfStock) outOfStockCount++;
        if (isCritical) criticalCount++;

        lowStockItems.push({
          productId: variant.product.id,
          productTitle: variant.product.title,
          productSlug: variant.product.slug,
          variantId: variant.id,
          sku: variant.sku,
          size: variant.size,
          color: variant.color,
          stockQuantity: variant.stockQuantity,
          lowStockThreshold: threshold,
          isCritical,
        });
      }
    }

    return {
      lowStockItems,
      outOfStockCount,
      lowStockCount: lowStockItems.length,
      criticalCount,
    };
  }

  /**
   * Update the low stock threshold for a specific product.
   */
  async updateProductThreshold(productId: string, threshold: number) {
    if (threshold < 0) {
      throw new Error('Threshold must be a non-negative number');
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data: { lowStockThreshold: threshold },
      select: { id: true, title: true, lowStockThreshold: true },
    });

    return product;
  }

  /**
   * Get inventory summary for all products.
   */
  async getInventorySummary() {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        variants: {
          select: { stockQuantity: true },
        },
      },
    });

    const summary = products.map((product) => {
      const totalStock = product.variants.reduce((sum, v) => sum + v.stockQuantity, 0);
      const variantCount = product.variants.length;
      const outOfStockVariants = product.variants.filter((v) => v.stockQuantity === 0).length;

      return {
        productId: product.id,
        title: product.title,
        slug: product.slug,
        totalStock,
        variantCount,
        outOfStockVariants,
        lowStockThreshold: product.lowStockThreshold,
      };
    });

    return summary.sort((a, b) => a.totalStock - b.totalStock);
  }
}

export const inventoryService = new InventoryService();
