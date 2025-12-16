"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useWishlistStore } from "@/store/wishlistStore";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  productId: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function WishlistButton({
  productId,
  className,
  size = "md",
}: WishlistButtonProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const { isInWishlist, toggleItem } = useWishlistStore();
  const isWishlisted = isHydrated ? isInWishlist(productId) : false;

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Minimum 44x44px for touch targets on mobile
  const sizeClasses = {
    sm: "w-11 h-11", // 44px
    md: "w-11 h-11", // 44px
    lg: "w-12 h-12", // 48px
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(productId);
  };

  return (
    <motion.button
      onClick={handleClick}
      className={cn(
        "flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm",
        "hover:bg-white transition-colors duration-200",
        "focus:outline-none focus:ring-2 focus:ring-white/50",
        sizeClasses[size],
        className
      )}
      whileTap={{ scale: 0.9 }}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={cn(iconSizes[size], "transition-colors duration-200")}
        fill={isWishlisted ? "#ef4444" : "none"}
        stroke={isWishlisted ? "#ef4444" : "#374151"}
        strokeWidth={2}
        initial={false}
        animate={{
          scale: isWishlisted ? [1, 1.2, 1] : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </motion.svg>
    </motion.button>
  );
}
