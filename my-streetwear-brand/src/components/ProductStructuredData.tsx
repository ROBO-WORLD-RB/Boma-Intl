import { Product } from '@/types';

interface ProductStructuredDataProps {
  product: Product;
}

export default function ProductStructuredData({ product }: ProductStructuredDataProps) {
  const mainImage = product.images.find((img) => img.isMain) || product.images[0];
  const price = product.salePrice && product.salePrice < product.basePrice 
    ? product.salePrice 
    : product.basePrice;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: mainImage ? [mainImage.url] : [],
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'BOMA',
    },
    offers: {
      '@type': 'Offer',
      url: `https://bomaintl.shop/product/${product.slug}`,
      priceCurrency: 'GHS',
      price: price,
      availability: product.variants.some(v => v.stockQuantity > 0)
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
    ...(product.averageRating && product.reviewCount ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.averageRating,
        reviewCount: product.reviewCount,
      }
    } : {})
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
