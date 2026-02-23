/**
 * Data access layer. Use server Supabase client; all functions return Result<T>.
 *
 * @example Public
 * import { getBranches, getProductBySlug } from "@/lib/dal";
 * const branches = await getBranches();
 * if (branches.ok) setBranches(branches.data); else setError(branches.error);
 *
 * @example Admin
 * import { getOrders, updateOrderStatus } from "@/lib/dal";
 * const result = await getOrders({ branchId, status: "pending" });
 * await updateOrderStatus(orderId, "packed");
 */

export { ok, err, isOk, isErr, type Result } from "./result";

export {
  getBranches,
  getDeliveryAreas,
  getCategories,
  getProductsByCategory,
  searchProducts,
  getProductBySlug,
  getInventoryForVariants,
  getPopularProducts,
  getPopularProductsWithDetails,
  getProductsByCategoryWithDetails,
  getSearchProductsWithDetails,
  getOrderByOrderNumber,
  type GetDeliveryAreasOptions,
  type ProductWithPriceAndStock,
  type ProductWithPriceStockAndVariant,
  type PrimaryVariant,
} from "./public";

export {
  upsertProduct,
  setInventory,
  getStockForBranch,
  getProducts,
  getProductById,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getAllBranches,
  createBranch,
  updateBranch,
  deleteBranch,
  createDeliveryArea,
  updateDeliveryArea,
  deleteDeliveryArea,
  type OrderFilters,
  type StockRow,
  type UpsertProductInput,
} from "./admin";
