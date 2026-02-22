/**
 * UI / view models for the app.
 * Use these in components and API responses where you need
 * denormalized data, display-only fields, or relations.
 */

import type {
  Branch,
  Category,
  Product,
  ProductVariant,
  Order,
  OrderItem,
  OrderStatus,
  InventoryRow,
} from "./db";

// Re-export DB types as base for UI models where no transformation is needed.
export type { Branch, Category, Order, OrderStatus };

/** Product variant; alias for consistent naming in UI. */
export type Variant = ProductVariant;

/** Inventory row; alias for UI usage. */
export type InventoryRowModel = InventoryRow;

/** Order line item. */
export type OrderItemModel = OrderItem;

// -----------------------------------------------------------------------------
// Product & catalog models
// -----------------------------------------------------------------------------

/** Product with optional category (for listing/detail). */
export interface ProductWithCategory extends Product {
  category?: Category | null;
}

/** Product with variants (for detail page). */
export interface ProductWithVariants extends Product {
  variants: Variant[];
}

/** Product with category and variants (full detail). */
export interface ProductDetailModel extends Product {
  category?: Category | null;
  variants: Variant[];
}

/** Variant with optional stock for a branch (for PDP / cart). */
export interface VariantWithStock extends ProductVariant {
  quantity?: number;
}

/** Category with optional children (for nav tree). */
export interface CategoryWithChildren extends Category {
  children?: CategoryWithChildren[];
}

// -----------------------------------------------------------------------------
// Branch & inventory models
// -----------------------------------------------------------------------------

/** Branch with optional display label. */
export interface BranchModel extends Branch {
  /** Optional: "Name — Address" or similar for selects. */
  displayLabel?: string;
}

/** Inventory row with variant and optional product (for admin stock view). */
export interface InventoryRowWithVariant extends InventoryRow {
  variant?: ProductVariant;
  product?: Product;
}

// -----------------------------------------------------------------------------
// Order models
// -----------------------------------------------------------------------------

/** Order item with variant (and optional product) for display. */
export interface OrderItemWithVariant extends OrderItem {
  variant?: ProductVariant;
  product?: Product;
}

/** Order with items (for confirmation / order detail). */
export interface OrderWithItems extends Order {
  items: OrderItemWithVariant[];
}

/** Order with branch and items (full order view). */
export interface OrderDetailModel extends Order {
  branch?: Branch;
  items: OrderItemWithVariant[];
}

// -----------------------------------------------------------------------------
// Cart & checkout (UI-only, not stored as DB entity)
// -----------------------------------------------------------------------------

/** Cart line: variant + quantity (before order is created). */
export interface CartItem {
  variantId: string;
  productId: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  imageUrl?: string | null;
}
