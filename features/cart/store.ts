"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  type CartItem,
  getSubtotal as getSubtotalUtil,
  cartItemKey,
  CART_STORAGE_KEY,
  parseCartItem,
} from "./cartUtils";

/**
 * Cart state: flat list of items. Items are keyed by (branchId, variantId);
 * adding the same key merges into one line (qty summed).
 *
 * We use Zustand (not React Context) because:
 * - No provider needed; store is created once and can be used anywhere.
 * - Only components that subscribe to specific state re-render (e.g. header badge only to item count).
 * - Built-in persist middleware syncs to localStorage with minimal code.
 * - Easy to test (plain store outside React) and use from non-React code if needed.
 */

export interface CartState {
  items: CartItem[];
  /** Drawer open state so header can open the cart. */
  open: boolean;
  setOpen: (open: boolean) => void;
  addItem: (item: Omit<CartItem, "qty"> & { qty?: number }) => void;
  removeItem: (branchId: string, variantId: string) => void;
  updateQty: (branchId: string, variantId: string, qty: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      open: false,
      setOpen: (open) => set({ open }),

      addItem: (input) => {
        const qty = Math.max(1, input.qty ?? 1);
        const key = cartItemKey(input);
        set((state) => {
          const idx = state.items.findIndex(
            (i) => cartItemKey(i) === key
          );
          const next =
            idx >= 0
              ? state.items.map((item, i) =>
                  i === idx
                    ? { ...item, qty: item.qty + qty }
                    : item
                )
              : [...state.items, { ...input, qty, imageUrl: input.imageUrl ?? null }];
          return { items: next };
        });
      },

      removeItem: (branchId, variantId) => {
        const key = `${branchId}:${variantId}`;
        set((state) => ({
          items: state.items.filter((i) => cartItemKey(i) !== key),
        }));
      },

      updateQty: (branchId, variantId, qty) => {
        const key = `${branchId}:${variantId}`;
        if (qty < 1) {
          set((state) => ({
            items: state.items.filter((i) => cartItemKey(i) !== key),
          }));
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            cartItemKey(item) === key ? { ...item, qty } : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getSubtotal: () => getSubtotalUtil(get().items),

      getItemCount: () =>
        get().items.reduce((n, i) => n + i.qty, 0),
    }),
    {
      name: CART_STORAGE_KEY,
      storage: {
        getItem: (name) => {
          const raw = typeof window === "undefined" ? null : window.localStorage.getItem(name);
          if (!raw) return null;
          try {
            const parsed = JSON.parse(raw) as { state?: { items?: unknown[] } };
            const items = Array.isArray(parsed?.state?.items)
              ? parsed.state.items
                  .map((entry) => parseCartItem(entry))
                  .filter((item): item is CartItem => item !== null)
              : [];
            return { state: { items }, version: parsed?.version ?? 0 };
          } catch {
            return null;
          }
        },
        setItem: (name, value) => {
          if (typeof window === "undefined") return;
          window.localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          if (typeof window === "undefined") return;
          window.localStorage.removeItem(name);
        },
      },
      partialize: (state) => ({ items: state.items }),
    }
  )
);
