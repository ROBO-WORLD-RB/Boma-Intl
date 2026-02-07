import { Metadata } from 'next';
import { api } from '@/lib/api';
import ProductDetailClient from './ProductDetailClient';
import ProductStructuredData from '@/components/ProductStructuredData';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  // read route params
  const slug = (await params).slug;

  // fetch data
  try {
    const response = await api.products.get(slug);
    const product = response.data;

    if (!product) {
        return {
            title: 'Product Not Found | BOMA',
            description: 'The requested product could not be found.'
        };
    }

    const mainImage = product.images.find(img => img.isMain) || product.images[0];

    return {
      title: `${product.title} | BOMA Streetwear`,
      description: product.description.substring(0, 160),
      openGraph: {
        title: `${product.title} | BOMA Streetwear`,
        description: product.description.substring(0, 160),
        images: mainImage ? [mainImage.url] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${product.title} | BOMA Streetwear`,
        description: product.description.substring(0, 160),
        images: mainImage ? [mainImage.url] : [],
      }
    };
  } catch (error) {
    return {
      title: 'BOMA Streetwear',
      description: 'Premium Streetwear from Accra'
    };
  }
}

export default async function ProductPage({ params }: Props) {
    const slug = (await params).slug;
    
    // Fetch product data on the server to pass to client component for hydration
    // and to ensure search engines see the content in the initial HTML
    let initialProduct = null;
    try {
        const response = await api.products.get(slug);
        initialProduct = response.data;
    } catch (error) {
        // Allow client component to handle 404/error state
        console.error('Failed to fetch product on server:', error);
    }

    return (
      <>
        {initialProduct && <ProductStructuredData product={initialProduct} />}
        <ProductDetailClient initialProduct={initialProduct} />
      </>
    );
}
