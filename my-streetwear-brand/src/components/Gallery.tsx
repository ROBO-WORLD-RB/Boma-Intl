"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import { galleryData, type GalleryItem } from "@/lib/gallery-data";
import { cn } from "@/lib/utils";
import { Product } from "@/types";
import QuickViewModal from "./QuickViewModal";

// Animation variants for viewport-triggered animations
const itemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 50, 
    scale: 0.95 
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

// Map gallery items to product data for quick view
const galleryToProduct = (item: GalleryItem): Product => ({
  id: item.id,
  title: item.title,
  slug: item.title.toLowerCase().replace(/\s+/g, "-"),
  description: `Premium streetwear piece from the BOMA 2025 collection. ${item.alt}`,
  basePrice: 45000 + Math.floor(Math.random() * 30000),
  salePrice: Math.random() > 0.7 ? 35000 + Math.floor(Math.random() * 20000) : undefined,
  isActive: true,
  category: "streetwear",
  images: [
    {
      id: `${item.id}-main`,
      url: item.src,
      isMain: true,
      altText: item.alt,
    },
  ],
  variants: [
    { id: `${item.id}-s-black`, size: "S", color: "Black", stockQuantity: 5, sku: `BOMA-${item.id}-S-BLK` },
    { id: `${item.id}-m-black`, size: "M", color: "Black", stockQuantity: 8, sku: `BOMA-${item.id}-M-BLK` },
    { id: `${item.id}-l-black`, size: "L", color: "Black", stockQuantity: 3, sku: `BOMA-${item.id}-L-BLK` },
    { id: `${item.id}-xl-black`, size: "XL", color: "Black", stockQuantity: 2, sku: `BOMA-${item.id}-XL-BLK` },
    { id: `${item.id}-s-white`, size: "S", color: "White", stockQuantity: 4, sku: `BOMA-${item.id}-S-WHT` },
    { id: `${item.id}-m-white`, size: "M", color: "White", stockQuantity: 6, sku: `BOMA-${item.id}-M-WHT` },
    { id: `${item.id}-l-white`, size: "L", color: "White", stockQuantity: 0, sku: `BOMA-${item.id}-L-WHT` },
  ],
  averageRating: 4.5,
  reviewCount: 12,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export default function Gallery() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleItemClick = (item: GalleryItem) => {
    const product = galleryToProduct(item);
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <>
      <section className="w-full bg-black py-16 sm:py-24 px-4 md:px-8">
        {/* Bento grid layout with responsive columns - single column on xs, two on sm, three on md, four on lg */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 max-w-7xl mx-auto auto-rows-[200px] sm:auto-rows-[250px] md:auto-rows-[300px] grid-flow-dense">
          {galleryData.map((item: GalleryItem, index: number) => (
            <motion.div
              key={item.id}
              className={cn(
                "relative overflow-hidden group cursor-pointer",
                item.span
              )}
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleItemClick(item)}
            >
              {/* Image with hover zoom effect */}
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
              
              {/* Overlay with title text on hover/tap */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 active:bg-black/60 transition-all duration-300 flex items-end justify-start p-4 sm:p-6">
                <span 
                  className="text-white uppercase text-xs sm:text-sm md:text-base font-bold tracking-widest opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0"
                  style={{ fontFamily: "var(--font-heading), sans-serif" }}
                >
                  {item.title}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
