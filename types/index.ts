/**
 * Central type exports. Database entities live in ./db, UI models in ./models.
 */

export type { Database, Json } from "./database";

// Database entities (multi-branch schema)
export type {
  OrderStatus,
  UUID,
  Timestamp,
  Price,
  Branch,
  Category,
  Product,
  ProductVariant,
  InventoryRow,
  Order,
  OrderItem,
  AdminUser,
  BranchInsert,
  CategoryInsert,
  ProductInsert,
  ProductVariantInsert,
  InventoryRowInsert,
  OrderInsert,
  OrderItemInsert,
  AdminUserInsert,
  BranchUpdate,
  CategoryUpdate,
  ProductUpdate,
  ProductVariantUpdate,
  InventoryRowUpdate,
  OrderUpdate,
  OrderItemUpdate,
  AdminUserUpdate,
  ApiResponse,
  ApiError,
  ApiResult,
  PaginationParams,
  PaginationMeta,
  PaginatedResponse,
} from "./db";

export { isApiSuccess, isApiError, buildPaginationMeta } from "./db";

// UI / view models
export type {
  Variant,
  InventoryRowModel,
  OrderItemModel,
  ProductWithCategory,
  ProductWithVariants,
  ProductDetailModel,
  VariantWithStock,
  CategoryWithChildren,
  BranchModel,
  InventoryRowWithVariant,
  OrderItemWithVariant,
  OrderWithItems,
  OrderDetailModel,
  CartItem,
} from "./models";

