/**
 * Cart types and pure helpers. No React/Zustand — safe for SSR and tests.
 */

export interface CartItem {
  branchId: string;
  variantId: string;
  productName: string;
  variantLabel: string;
  unitPrice: number;
  qty: number;
  imageUrl: string | null;
}

/** Unique key for an item (same branch + variant = same line). */
export function cartItemKey(item: Pick<CartItem, "branchId" | "variantId">): string {
  return `${item.branchId}:${item.variantId}`;
}

/** Line total for one item. */
export function cartItemSubtotal(item: CartItem): number {
  return item.unitPrice * item.qty;
}

/** Sum of (unitPrice * qty) for all items. */
export function getSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + cartItemSubtotal(item), 0);
}

/** Total number of units in the cart. */
export function getTotalQuantity(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.qty, 0);
}

export const CART_STORAGE_KEY = "super-market-cart";

/** Validate and parse a single cart item from storage. */
export function parseCartItem(raw: unknown): CartItem | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (
    typeof o.branchId !== "string" ||
    typeof o.variantId !== "string" ||
    typeof o.productName !== "string" ||
    typeof o.variantLabel !== "string" ||
    typeof o.unitPrice !== "number" ||
    typeof o.qty !== "number" ||
    o.qty < 1
  ) {
    return null;
  }
  return {
    branchId: o.branchId,
    variantId: o.variantId,
    productName: o.productName,
    variantLabel: o.variantLabel,
    unitPrice: o.unitPrice,
    qty: o.qty,
    imageUrl: typeof o.imageUrl === "string" ? o.imageUrl : null,
  };
}

/** Parse persisted cart from JSON; drops invalid entries. */
export function parseCartFromStorage(json: string): CartItem[] {
  try {
    const raw = JSON.parse(json) as unknown;
    if (!Array.isArray(raw)) return [];
    const items: CartItem[] = [];
    for (const entry of raw) {
      const item = parseCartItem(entry);
      if (item) items.push(item);
    }
    return items;
  } catch {
    return [];
  }
}
