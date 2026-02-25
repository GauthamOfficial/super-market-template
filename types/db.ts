/**
 * Database entity types for the multi-branch supermarket schema.
 * Matches Supabase tables: branches, categories, products, product_variants,
 * inventory, orders, order_items, admin_users.
 */

/** Order lifecycle status (public.order_status enum). */
export type OrderStatus =
  | "pending"
  | "packed"
  | "dispatched"
  | "completed"
  | "cancelled";

/** UUID type used for primary and foreign keys. */
export type UUID = string;

/** ISO timestamp from Postgres timestamptz. */
export type Timestamp = string;

/** Numeric price/amount from Postgres (10,2). */
export type Price = number;

// -----------------------------------------------------------------------------
// Table row types (entities)
// -----------------------------------------------------------------------------

export interface Branch {
  id: UUID;
  name: string;
  address: string | null;
  phone: string | null;
  /** WhatsApp number for deep links (country code, no +). Falls back to phone if unset. */
  whatsapp_phone?: string | null;
  timezone: string;
  is_active: boolean;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface Category {
  id: UUID;
  name: string;
  slug: string;
  description: string | null;
  parent_id: UUID | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface Product {
  id: UUID;
  category_id: UUID | null;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  base_price: Price;
  is_active: boolean;
  created_at: Timestamp;
  updated_at: Timestamp;
}

/** Product variant (product_variants table). Exported as Variant in models. */
export interface ProductVariant {
  id: UUID;
  product_id: UUID;
  name: string;
  sku: string;
  price: Price;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface InventoryRow {
  id: UUID;
  branch_id: UUID;
  product_variant_id: UUID;
  quantity: number;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface Order {
  id: UUID;
  branch_id: UUID;
  order_number: string;
  status: OrderStatus;
  customer_name?: string | null;
  customer_email: string;
  customer_phone: string | null;
  delivery_address: string | null;
  /** Delivery charge when order is delivery; 0 for pickup. */
  delivery_fee?: number | null;
  /** e.g. cod, bank_transfer */
  payment_method?: string | null;
  user_id: UUID | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface DeliveryArea {
  id: UUID;
  name: string;
  fee: number;
  branch_id: UUID | null;
  is_enabled: boolean;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface OrderItem {
  id: UUID;
  order_id: UUID;
  product_variant_id: UUID;
  quantity: number;
  unit_price: Price;
  created_at: Timestamp;
}

export interface AdminUser {
  id: UUID;
  user_id: UUID;
  branch_id: UUID | null;
  role: "admin" | "manager" | "viewer";
  created_at: Timestamp;
  updated_at: Timestamp;
}

// -----------------------------------------------------------------------------
// Insert types (for create; optional id/created_at/updated_at)
// -----------------------------------------------------------------------------

export type BranchInsert = Omit<Branch, "id" | "created_at" | "updated_at"> & {
  id?: UUID;
  created_at?: Timestamp;
  updated_at?: Timestamp;
};

export type CategoryInsert = Omit<Category, "id" | "created_at" | "updated_at"> & {
  id?: UUID;
  created_at?: Timestamp;
  updated_at?: Timestamp;
};

export type ProductInsert = Omit<Product, "id" | "created_at" | "updated_at"> & {
  id?: UUID;
  created_at?: Timestamp;
  updated_at?: Timestamp;
};

export type ProductVariantInsert = Omit<ProductVariant, "id" | "created_at" | "updated_at"> & {
  id?: UUID;
  created_at?: Timestamp;
  updated_at?: Timestamp;
};

export type InventoryRowInsert = Omit<InventoryRow, "id" | "created_at" | "updated_at"> & {
  id?: UUID;
  created_at?: Timestamp;
  updated_at?: Timestamp;
};

export type OrderInsert = Omit<Order, "id" | "created_at" | "updated_at"> & {
  id?: UUID;
  created_at?: Timestamp;
  updated_at?: Timestamp;
};

export type OrderItemInsert = Omit<OrderItem, "id" | "created_at"> & {
  id?: UUID;
  created_at?: Timestamp;
};

export type DeliveryAreaInsert = Omit<
  DeliveryArea,
  "id" | "created_at" | "updated_at"
> & {
  id?: UUID;
  created_at?: Timestamp;
  updated_at?: Timestamp;
};

export type AdminUserInsert = Omit<AdminUser, "id" | "created_at" | "updated_at"> & {
  id?: UUID;
  created_at?: Timestamp;
  updated_at?: Timestamp;
};

// -----------------------------------------------------------------------------
// Update types (partial insert for updates)
// -----------------------------------------------------------------------------

export type BranchUpdate = Partial<BranchInsert>;
export type CategoryUpdate = Partial<CategoryInsert>;
export type ProductUpdate = Partial<ProductInsert>;
export type ProductVariantUpdate = Partial<ProductVariantInsert>;
export type InventoryRowUpdate = Partial<InventoryRowInsert>;
export type OrderUpdate = Partial<OrderInsert>;
export type OrderItemUpdate = Partial<OrderItemInsert>;
export type DeliveryAreaUpdate = Partial<DeliveryAreaInsert>;
export type AdminUserUpdate = Partial<AdminUserInsert>;

// -----------------------------------------------------------------------------
// API response helpers
// -----------------------------------------------------------------------------

/** Successful API response with data. */
export interface ApiResponse<T> {
  data: T;
  error?: never;
}

/** Failed API response with error message. */
export interface ApiError {
  data?: never;
  error: string;
}

/** Discriminated union for API results. */
export type ApiResult<T> = ApiResponse<T> | ApiError;

/** Type guard: response is success. */
export function isApiSuccess<T>(res: ApiResult<T>): res is ApiResponse<T> {
  return "data" in res && res.data !== undefined;
}

/** Type guard: response is error. */
export function isApiError<T>(res: ApiResult<T>): res is ApiError {
  return "error" in res && typeof res.error === "string";
}

// -----------------------------------------------------------------------------
// Pagination helpers
// -----------------------------------------------------------------------------

/** Request params for paginated list endpoints. */
export interface PaginationParams {
  page?: number;   // 1-based
  pageSize?: number;
  /** Cursor-based: use after this id (e.g. last item id from previous page). */
  after?: UUID;
  /** Cursor-based: max items to return. */
  limit?: number;
}

/** Metadata returned with a paginated list. */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/** Paginated API response. */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

/** Build PaginationMeta from known total and params. */
export function buildPaginationMeta(
  totalCount: number,
  params: { page?: number; pageSize?: number }
): PaginationMeta {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.max(1, Math.min(100, params.pageSize ?? 20));
  const totalPages = Math.ceil(totalCount / pageSize);
  return {
    page,
    pageSize,
    totalCount,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}
