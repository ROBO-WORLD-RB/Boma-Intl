import { Product } from '@/types';

// Product names for the BOMA 2025 collection
const productNames = [
  'Culture Tee',
  'Streets Hoodie',
  'Accra Jacket',
  'Movement Pants',
  'Heritage Cap',
  'Unity Shorts',
  'Roots Sweater',
  'Vision Tank',
  'Legacy Joggers',
  'Spirit Vest',
  'Rhythm Shirt',
  'Flow Cardigan',
];

// Price range in GHS (average around 310)
const priceRanges = [250, 280, 300, 310, 320, 350, 380, 400];

// Generate mock products using lookbook images
export const mockProducts: Product[] = Array.from({ length: 24 }, (_, i) => {
  const imageNum = i + 1;
  const nameIndex = i % productNames.length;
  const basePrice = priceRanges[i % priceRanges.length];
  const hasSale = Math.random() > 0.7;
  
  return {
    id: `product-${i + 1}`,
    title: `${productNames[nameIndex]} ${Math.floor(i / productNames.length) + 1}`,
    slug: `${productNames[nameIndex].toLowerCase().replace(/\s+/g, '-')}-${i + 1}`,
    description: `Premium streetwear piece from the BOMA 2025 collection. Crafted with attention to detail and designed for those who define the culture.`,
    basePrice,
    salePrice: hasSale ? Math.floor(basePrice * 0.85) : undefined,
    isActive: true,
    category: 'streetwear',
    images: [
      {
        id: `img-${i}-1`,
        url: `/lookbook/Konu_pixels - ALL RIGHTS RESERVED-BOMA 2025_${imageNum}.jpg`,
        isMain: true,
        altText: `${productNames[nameIndex]} - Front View`,
      },
      {
        id: `img-${i}-2`,
        url: `/lookbook/Konu_pixels - ALL RIGHTS RESERVED-BOMA 2025_${imageNum + 24}.jpg`,
        isMain: false,
        altText: `${productNames[nameIndex]} - Back View`,
      },
    ],
    variants: [
      { id: `v-${i}-s-blk`, size: 'S', color: 'Black', stockQuantity: 5, sku: `BOMA-${i}-S-BLK` },
      { id: `v-${i}-m-blk`, size: 'M', color: 'Black', stockQuantity: 8, sku: `BOMA-${i}-M-BLK` },
      { id: `v-${i}-l-blk`, size: 'L', color: 'Black', stockQuantity: 3, sku: `BOMA-${i}-L-BLK` },
      { id: `v-${i}-xl-blk`, size: 'XL', color: 'Black', stockQuantity: 2, sku: `BOMA-${i}-XL-BLK` },
      { id: `v-${i}-s-wht`, size: 'S', color: 'White', stockQuantity: 4, sku: `BOMA-${i}-S-WHT` },
      { id: `v-${i}-m-wht`, size: 'M', color: 'White', stockQuantity: 6, sku: `BOMA-${i}-M-WHT` },
      { id: `v-${i}-l-wht`, size: 'L', color: 'White', stockQuantity: 0, sku: `BOMA-${i}-L-WHT` },
    ],
    averageRating: 4 + Math.random(),
    reviewCount: Math.floor(Math.random() * 50) + 5,
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  };
});

// Get paginated mock products
export function getMockProducts(options: {
  page?: number;
  limit?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  sortBy?: string;
}) {
  const { page = 1, limit = 12, search, minPrice, maxPrice, sizes, colors, sortBy } = options;
  
  let filtered = [...mockProducts];
  
  // Apply search filter
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower)
    );
  }
  
  // Apply price filter
  if (minPrice !== undefined) {
    filtered = filtered.filter(p => (p.salePrice ?? p.basePrice) >= minPrice);
  }
  if (maxPrice !== undefined) {
    filtered = filtered.filter(p => (p.salePrice ?? p.basePrice) <= maxPrice);
  }
  
  // Apply size filter
  if (sizes && sizes.length > 0) {
    filtered = filtered.filter(p => 
      p.variants.some(v => sizes.includes(v.size) && v.stockQuantity > 0)
    );
  }
  
  // Apply color filter
  if (colors && colors.length > 0) {
    filtered = filtered.filter(p => 
      p.variants.some(v => colors.includes(v.color) && v.stockQuantity > 0)
    );
  }
  
  // Apply sorting
  switch (sortBy) {
    case 'price-asc':
      filtered.sort((a, b) => (a.salePrice ?? a.basePrice) - (b.salePrice ?? b.basePrice));
      break;
    case 'price-desc':
      filtered.sort((a, b) => (b.salePrice ?? b.basePrice) - (a.salePrice ?? a.basePrice));
      break;
    case 'popular':
      filtered.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0));
      break;
    case 'newest':
    default:
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
  }
  
  // Paginate
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);
  
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
}
