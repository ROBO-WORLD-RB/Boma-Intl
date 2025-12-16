"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Product } from "@/types";
import { useCartStore } from "@/store/cartStore";
import { cn } from "@/lib/utils";
import WishlistButton from "./WishlistButton";
import { Button } from "./ui/Button";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

// Inner component that resets state when product changes via key prop
function QuickViewContent({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  // Get unique sizes and colors from variants
  const sizes = useMemo(
    () => [...new Set(product.variants.map((v) => v.size))],
    [product.variants]
  );
  const colors = useMemo(
    () => [...new Set(product.variants.map((v) => v.color))],
    [product.variants]
  );

  // Initialize state with defaults from product
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(sizes[0] || null);
  const [selectedColor, setSelectedColor] = useState<string | null>(colors[0] || null);
  const [quantity, setQuantity] = useState(1);
  const { addItem, setCartOpen } = useCartStore();

  // Find selected variant
  const selectedVariant = product.variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  );

  // Check stock for selected variant
  const isInStock = selectedVariant ? selectedVariant.stockQuantity > 0 : false;
  const stockQuantity = selectedVariant?.stockQuantity ?? 0;

  const handleAddToCart = () => {
    if (!selectedVariant || !selectedSize || !selectedColor) return;

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
      image: mainImage?.url || "",
    });

    setCartOpen(true);
    onClose();
  };

  const displayPrice = selectedVariant?.priceOverride ?? product.salePrice ?? product.basePrice;
  const hasDiscount = product.salePrice && product.salePrice < product.basePrice;

  return (
    <>
      {/* Close Button - 44x44px minimum touch target */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 md:top-4 md:right-4 min-w-[44px] min-h-[44px] flex items-center justify-center text-neutral-400 hover:text-white transition-colors z-20 bg-neutral-900/80 md:bg-neutral-900/50 rounded-full"
        aria-label="Close modal"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Image Gallery */}
      <div className="relative">
        {/* Main Image */}
        <div className="relative aspect-[3/4] bg-neutral-800">
          <Image
            src={product.images[selectedImageIndex]?.url || "/placeholder.svg"}
            alt={product.images[selectedImageIndex]?.altText || product.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
        </div>

        {/* Thumbnail Navigation */}
        {product.images.length > 1 && (
          <div className="flex gap-2 p-4 overflow-x-auto">
            {product.images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setSelectedImageIndex(index)}
                className={cn(
                  "relative w-16 h-20 flex-shrink-0 rounded overflow-hidden",
                  "border-2 transition-colors",
                  selectedImageIndex === index
                    ? "border-white"
                    : "border-transparent hover:border-neutral-600"
                )}
              >
                <Image
                  src={image.url}
                  alt={image.altText || `${product.title} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-6 md:p-8 flex flex-col">
        {/* Title and Wishlist */}
        <div className="flex items-start justify-between gap-4">
          <h2
            id="quick-view-title"
            className="text-2xl font-bold text-white uppercase tracking-wide"
            style={{ fontFamily: "var(--font-heading), sans-serif" }}
          >
            {product.title}
          </h2>
          <WishlistButton productId={product.id} size="md" />
        </div>

        {/* Price */}
        <div className="mt-4 flex items-center gap-3">
          <span className="text-2xl font-bold text-white">
            GH₵{displayPrice.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-lg text-neutral-500 line-through">
              GH₵{product.basePrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="mt-4 text-neutral-400 text-sm leading-relaxed">
          {product.description}
        </p>

        {/* Size Selection */}
        {sizes.length > 0 && (
          <div className="mt-6">
            <label className="block text-sm font-semibold text-white mb-3">
              Size
            </label>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => {
                const sizeVariants = product.variants.filter(
                  (v) => v.size === size
                );
                const hasStock = sizeVariants.some(
                  (v) => v.stockQuantity > 0
                );
                return (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    disabled={!hasStock}
                    className={cn(
                      "px-4 py-2 text-sm font-medium rounded border transition-colors",
                      selectedSize === size
                        ? "bg-white text-black border-white"
                        : hasStock
                        ? "bg-transparent text-white border-neutral-600 hover:border-white"
                        : "bg-transparent text-neutral-600 border-neutral-800 cursor-not-allowed line-through"
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
          <div className="mt-6">
            <label className="block text-sm font-semibold text-white mb-3">
              Color
            </label>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => {
                const colorVariants = product.variants.filter(
                  (v) => v.color === color && v.size === selectedSize
                );
                const hasStock = colorVariants.some(
                  (v) => v.stockQuantity > 0
                );
                return (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    disabled={!hasStock}
                    className={cn(
                      "px-4 py-2 text-sm font-medium rounded border transition-colors",
                      selectedColor === color
                        ? "bg-white text-black border-white"
                        : hasStock
                        ? "bg-transparent text-white border-neutral-600 hover:border-white"
                        : "bg-transparent text-neutral-600 border-neutral-800 cursor-not-allowed"
                    )}
                  >
                    {color}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Quantity - 44x44px minimum touch targets */}
        <div className="mt-6">
          <label className="block text-sm font-semibold text-white mb-3">
            Quantity
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded border border-neutral-600 text-white hover:border-white transition-colors"
              aria-label="Decrease quantity"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="w-12 text-center text-white font-medium">
              {quantity}
            </span>
            <button
              onClick={() =>
                setQuantity(Math.min(stockQuantity || 10, quantity + 1))
              }
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded border border-neutral-600 text-white hover:border-white transition-colors"
              aria-label="Increase quantity"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>

        {/* Stock Status */}
        {selectedVariant && (
          <div className="mt-4">
            {isInStock ? (
              stockQuantity <= 5 ? (
                <span className="text-yellow-500 text-sm">
                  Only {stockQuantity} left in stock
                </span>
              ) : (
                <span className="text-green-500 text-sm">In Stock</span>
              )
            ) : (
              <span className="text-red-500 text-sm">Out of Stock</span>
            )}
          </div>
        )}

        {/* Add to Cart Button */}
        <div className="mt-auto pt-6">
          <Button
            onClick={handleAddToCart}
            disabled={!selectedVariant || !isInStock}
            className="w-full"
            size="lg"
          >
            {!selectedSize || !selectedColor
              ? "Select Options"
              : !isInStock
              ? "Out of Stock"
              : "Add to Cart"}
          </Button>
        </div>
      </div>
    </>
  );
}

export default function QuickViewModal({
  product,
  isOpen,
  onClose,
}: QuickViewModalProps) {

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4">
          {/* Backdrop - hidden on mobile since modal is full-screen */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm hidden md:block"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal Content - Full screen on mobile, centered modal on desktop */}
          <motion.div
            className={cn(
              "relative z-10 w-full bg-neutral-900 shadow-xl",
              // Mobile: full screen with no rounded corners
              "h-full overflow-y-auto",
              // Desktop: centered modal with max width and rounded corners
              "md:h-auto md:max-h-[90vh] md:max-w-4xl md:rounded-lg",
              "md:grid md:grid-cols-2 md:gap-0"
            )}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="quick-view-title"
          >
            {/* Use key to reset state when product changes */}
            <QuickViewContent key={product.id} product={product} onClose={onClose} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
