'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Product, Review } from '@/types';
import { api } from '@/lib/api';
import { useCartStore } from '@/store/cartStore';
import { cn } from '@/lib/utils';
import Breadcrumbs, { generateBreadcrumbPath } from '@/components/Breadcrumbs';
import ReviewSection from '@/components/ReviewSection';
import { ReviewFormData } from '@/components/ReviewForm';
import WishlistButton from '@/components/WishlistButton';
import { Button } from '@/components/ui/Button';
import { RatingDisplay } from '@/components/StarRating';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Variant selection state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const { addItem, setCartOpen } = useCartStore();

  // Fetch product and reviews
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [productRes, reviewsRes] = await Promise.all([
          api.products.get(slug),
          api.reviews.list(slug).catch(() => ({ data: [] })),
        ]);
        setProduct(productRes.data);
        setReviews(reviewsRes.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug]);


  // Initialize variant selection when product loads
  useEffect(() => {
    if (product) {
      const sizes = [...new Set(product.variants.map((v) => v.size))];
      const colors = [...new Set(product.variants.map((v) => v.color))];
      setSelectedSize(sizes[0] || null);
      setSelectedColor(colors[0] || null);
    }
  }, [product]);

  // Computed values
  const sizes = useMemo(
    () => (product ? [...new Set(product.variants.map((v) => v.size))] : []),
    [product]
  );
  const colors = useMemo(
    () => (product ? [...new Set(product.variants.map((v) => v.color))] : []),
    [product]
  );

  const selectedVariant = useMemo(
    () =>
      product?.variants.find(
        (v) => v.size === selectedSize && v.color === selectedColor
      ),
    [product, selectedSize, selectedColor]
  );

  const isInStock = selectedVariant ? selectedVariant.stockQuantity > 0 : false;
  const stockQuantity = selectedVariant?.stockQuantity ?? 0;

  const displayPrice = selectedVariant?.priceOverride ?? product?.salePrice ?? product?.basePrice ?? 0;
  const hasDiscount = product?.salePrice && product.salePrice < product.basePrice;

  const breadcrumbItems = useMemo(() => {
    if (!product) return [];
    return generateBreadcrumbPath(
      [
        { label: 'Shop', slug: 'shop' },
        { label: product.title },
      ],
      ''
    );
  }, [product]);

  const handleAddToCart = () => {
    if (!product || !selectedVariant || !selectedSize || !selectedColor) return;

    const mainImage = product.images.find((img) => img.isMain) || product.images[0];
    const price = selectedVariant.priceOverride ?? product.salePrice ?? product.basePrice;

    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      title: product.title,
      size: selectedSize,
      color: selectedColor,
      price,
      quantity,
      image: mainImage?.url || '',
    });

    setCartOpen(true);
  };


  const handleSubmitReview = async (data: ReviewFormData) => {
    if (!product) return;
    await api.reviews.create({
      productId: product.id,
      rating: data.rating,
      comment: data.content,
    });
    // Refresh reviews
    const reviewsRes = await api.reviews.list(slug);
    setReviews(reviewsRes.data || []);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-[3/4] bg-neutral-900 rounded-lg animate-pulse" />
            <div className="space-y-4">
              <div className="h-8 bg-neutral-900 rounded w-3/4 animate-pulse" />
              <div className="h-6 bg-neutral-900 rounded w-1/4 animate-pulse" />
              <div className="h-24 bg-neutral-900 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-black pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Product Not Found</h1>
          <p className="text-neutral-400">{error || 'The product you are looking for does not exist.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} className="mb-8" />

        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div>
            {/* Main Image */}
            <div className="relative aspect-[3/4] bg-neutral-900 rounded-lg overflow-hidden mb-4">
              <Image
                src={product.images[selectedImageIndex]?.url || '/placeholder.svg'}
                alt={product.images[selectedImageIndex]?.altText || product.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>


            {/* Thumbnail Navigation */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImageIndex(index)}
                    className={cn(
                      'relative w-20 h-24 flex-shrink-0 rounded-lg overflow-hidden',
                      'border-2 transition-colors',
                      selectedImageIndex === index
                        ? 'border-white'
                        : 'border-transparent hover:border-neutral-600'
                    )}
                  >
                    <Image
                      src={image.url}
                      alt={image.altText || `${product.title} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            {/* Title and Wishlist */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1
                className="text-3xl lg:text-4xl font-bold text-white uppercase tracking-wide"
                style={{ fontFamily: 'var(--font-heading), sans-serif' }}
              >
                {product.title}
              </h1>
              <WishlistButton productId={product.id} size="lg" />
            </div>

            {/* Rating */}
            {product.averageRating !== undefined && product.reviewCount !== undefined && (
              <RatingDisplay
                rating={product.averageRating}
                reviewCount={product.reviewCount}
                size="md"
                className="mb-4"
              />
            )}

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-white">
                GH₵{displayPrice.toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-xl text-neutral-500 line-through">
                  GH₵{product.basePrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-neutral-400 leading-relaxed mb-8">
              {product.description}
            </p>


            {/* Size Selection */}
            {sizes.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-white mb-3">
                  Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => {
                    const sizeVariants = product.variants.filter((v) => v.size === size);
                    const hasStock = sizeVariants.some((v) => v.stockQuantity > 0);
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        disabled={!hasStock}
                        className={cn(
                          'px-5 py-2.5 text-sm font-medium rounded-lg border transition-colors',
                          selectedSize === size
                            ? 'bg-white text-black border-white'
                            : hasStock
                            ? 'bg-transparent text-white border-neutral-600 hover:border-white'
                            : 'bg-transparent text-neutral-600 border-neutral-800 cursor-not-allowed line-through'
                        )}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {colors.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-white mb-3">
                  Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => {
                    const colorVariants = product.variants.filter(
                      (v) => v.color === color && v.size === selectedSize
                    );
                    const hasStock = colorVariants.some((v) => v.stockQuantity > 0);
                    return (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        disabled={!hasStock}
                        className={cn(
                          'px-5 py-2.5 text-sm font-medium rounded-lg border transition-colors',
                          selectedColor === color
                            ? 'bg-white text-black border-white'
                            : hasStock
                            ? 'bg-transparent text-white border-neutral-600 hover:border-white'
                            : 'bg-transparent text-neutral-600 border-neutral-800 cursor-not-allowed'
                        )}
                      >
                        {color}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}


            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-white mb-3">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center rounded-lg border border-neutral-600 text-white hover:border-white transition-colors"
                  aria-label="Decrease quantity"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="w-16 text-center text-white font-medium text-lg">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(stockQuantity || 10, quantity + 1))}
                  className="w-12 h-12 flex items-center justify-center rounded-lg border border-neutral-600 text-white hover:border-white transition-colors"
                  aria-label="Increase quantity"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Stock Status */}
            {selectedVariant && (
              <div className="mb-6">
                {isInStock ? (
                  stockQuantity <= 5 ? (
                    <span className="text-yellow-500">Only {stockQuantity} left in stock</span>
                  ) : (
                    <span className="text-green-500">In Stock</span>
                  )
                ) : (
                  <span className="text-red-500">Out of Stock</span>
                )}
              </div>
            )}

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              disabled={!selectedVariant || !isInStock}
              className="w-full"
              size="lg"
            >
              {!selectedSize || !selectedColor
                ? 'Select Options'
                : !isInStock
                ? 'Out of Stock'
                : 'Add to Cart'}
            </Button>
          </div>
        </div>

        {/* Reviews Section */}
        <ReviewSection
          productId={product.id}
          reviews={reviews}
          averageRating={product.averageRating ?? 0}
          reviewCount={product.reviewCount ?? 0}
          canReview={true}
          onSubmitReview={handleSubmitReview}
        />
      </div>
    </div>
  );
}
