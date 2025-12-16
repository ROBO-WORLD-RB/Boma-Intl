import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistItem {
  productId: string;
  addedAt: string;
}

interface WishlistStore {
  items: WishlistItem[];

  // Actions
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  toggleItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (productId) => {
        const { items } = get();
        if (!items.some((item) => item.productId === productId)) {
          set({
            items: [...items, { productId, addedAt: new Date().toISOString() }],
          });
        }
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.productId !== productId),
        });
      },

      toggleItem: (productId) => {
        const { items, addItem, removeItem } = get();
        if (items.some((item) => item.productId === productId)) {
          removeItem(productId);
        } else {
          addItem(productId);
        }
      },

      isInWishlist: (productId) => {
        return get().items.some((item) => item.productId === productId);
      },

      clearWishlist: () => {
        set({ items: [] });
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
);
