"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Product } from "@/types";
import { cn } from "@/lib/utils";
import WishlistButton from "./WishlistButton";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  showWishlist?: boolean;
  className?: string;
}

export default function ProductCard({
  product,
  onQuickView,
  showWishlist = true,
  className,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const mainImage = product.images.find((img) => img.isMain) || product.images[0];
  const hoverImage = product.images.find((img) => !img.isMain) || mainImage;

  const displayPrice = product.salePrice ?? product.basePrice;
  const hasDiscount = product.salePrice && product.salePrice < product.basePrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.basePrice - product.salePrice!) / product.basePrice) * 100)
    : 0;

  // Get available sizes from variants
  const availableSizes = [...new Set(product.variants.map((v) => v.size))];
  const inStockSizes = product.variants
    .filter((v) => v.stockQuantity > 0)
    .map((v) => v.size);

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  };

  return (
    <motion.div
      className={cn(
        "group relative bg-neutral-900 rounded-lg overflow-hidden",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden">
        {/* Main Image */}
        <Image
          src={mainImage?.url || "/placeholder.svg"}
          alt={mainImage?.altText || product.title}
          fill
          className={cn(
            "object-cover transition-opacity duration-500",
            isHovered && hoverImage !== mainImage ? "opacity-0" : "opacity-100"
          )}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          loading="lazy"
          quality={75}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }}
        />

        {/* Hover Image - only load on hover */}
        {hoverImage && hoverImage !== mainImage && isHovered && (
          <Image
            src={hoverImage.url}
            alt={hoverImage.altText || product.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            loading="lazy"
            quality={75}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {hasDiscount && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              -{discountPercent}%
            </span>
          )}
          {product.variants.every((v) => v.stockQuantity === 0) && (
            <span className="bg-neutral-800 text-white text-xs font-bold px-2 py-1 rounded">
              SOLD OUT
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        {showWishlist && (
          <div className="absolute top-3 right-3">
            <WishlistButton productId={product.id} size="sm" />
          </div>
        )}

        {/* Quick View Button - Always visible on mobile, hover on desktop */}
        {onQuickView && (
          <motion.button
            onClick={handleQuickView}
            className={cn(
              "absolute bottom-4 left-1/2 -translate-x-1/2",
              "bg-white text-black px-6 min-h-[44px] text-sm font-semibold uppercase tracking-wider",
              "md:opacity-0 md:translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0",
              "transition-all duration-300 hover:bg-neutral-200",
              "focus:outline-none focus:ring-2 focus:ring-white/50",
              "flex items-center justify-center"
            )}
            whileTap={{ scale: 0.95 }}
          >
            Quick View
          </motion.button>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3
          className="text-white font-semibold text-sm uppercase tracking-wide truncate"
          style={{ fontFamily: "var(--font-heading), sans-serif" }}
        >
          {product.title}
        </h3>

        {/* Price */}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-white font-bold">
            GH₵{displayPrice.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-neutral-500 line-through text-sm">
              GH₵{product.basePrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Size Availability */}
        {availableSizes.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {availableSizes.map((size) => (
              <span
                key={size}
                className={cn(
                  "text-xs px-2 py-0.5 rounded border",
                  inStockSizes.includes(size)
                    ? "border-neutral-600 text-neutral-300"
                    : "border-neutral-800 text-neutral-600 line-through"
                )}
              >
                {size}
              </span>
            ))}
          </div>
        )}

        {/* Rating */}
        {product.averageRating !== undefined && product.reviewCount !== undefined && product.reviewCount > 0 && (
          <div className="mt-2 flex items-center gap-1 text-sm text-neutral-400">
            <svg
              className="w-4 h-4 text-yellow-500 fill-current"
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
            <span>{product.averageRating.toFixed(1)}</span>
            <span className="text-neutral-600">({product.reviewCount})</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
