"use server";

import { unstable_cache } from "next/cache";
import { createClient, createClientForCache } from "@/lib/supabase/server";
import { ok, err, type Result } from "./result";
import type {
  Branch,
  Category,
  Product,
  ProductVariant,
  InventoryRow,
  DeliveryArea,
  Order,
  OrderItem,
  OrderStatus,
} from "@/types/db";

export interface GetDeliveryAreasOptions {
  /** When true, return only areas where is_enabled = true (e.g. for checkout). */
  enabledOnly?: boolean;
}

export async function getDeliveryAreas(
  options?: GetDeliveryAreasOptions
): Promise<Result<DeliveryArea[]>> {
  try {
    const supabase = await createClient();
    let query = supabase.from("delivery_areas").select("*").order("name");
    if (options?.enabledOnly) {
      query = query.eq("is_enabled", true);
    }
    const { data, error } = await query;
    if (error) return err(error.message);
    return ok((data ?? []) as DeliveryArea[]);
  } catch (e) {
    return err(
      e instanceof Error ? e.message : "Failed to fetch delivery areas"
    );
  }
}

const BRANCHES_CACHE_TAG = "branches";
const CATEGORIES_CACHE_TAG = "categories";
const CACHE_REVALIDATE_SECONDS = 300; // 5 minutes

export async function getBranches(): Promise<Result<Branch[]>> {
  return unstable_cache(
    async () => {
      try {
        const supabase = createClientForCache();
        const { data, error } = await supabase
          .from("branches")
          .select("*")
          .eq("is_active", true)
          .order("name");

        if (error) return err(error.message);
        return ok((data ?? []) as Branch[]);
      } catch (e) {
        return err(e instanceof Error ? e.message : "Failed to fetch branches");
      }
    },
    [BRANCHES_CACHE_TAG],
    { revalidate: CACHE_REVALIDATE_SECONDS, tags: [BRANCHES_CACHE_TAG] }
  )();
}

export async function getCategories(): Promise<Result<Category[]>> {
  return unstable_cache(
    async () => {
      try {
        const supabase = createClientForCache();
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .order("name");

        if (error) return err(error.message);
        return ok((data ?? []) as Category[]);
      } catch (e) {
        return err(e instanceof Error ? e.message : "Failed to fetch categories");
      }
    },
    [CATEGORIES_CACHE_TAG],
    { revalidate: CACHE_REVALIDATE_SECONDS, tags: [CATEGORIES_CACHE_TAG] }
  )();
}

export async function getProductsByCategory(
  branchId: string,
  categorySlug: string
): Promise<Result<Product[]>> {
  try {
    const supabase = await createClient();
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .single();

    if (!category?.id) return ok([]);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category_id", category.id)
      .eq("is_active", true)
      .order("name");

    if (error) return err(error.message);

    const products = (data ?? []) as Product[];
    if (products.length === 0) return ok(products);

    const variantIds = await getVariantIdsForProducts(
      supabase,
      products.map((p) => p.id)
    );
    const { data: inv } = await supabase
      .from("inventory")
      .select("product_variant_id, quantity")
      .eq("branch_id", branchId)
      .in("product_variant_id", variantIds);

    const inStockByVariant = new Map<string, number>();
    (inv ?? []).forEach((row: { product_variant_id: string; quantity: number }) => {
      inStockByVariant.set(row.product_variant_id, row.quantity);
    });

    const hasStockByProduct = new Set<string>();
    const { data: variants } = await supabase
      .from("product_variants")
      .select("id, product_id")
      .in("product_id", products.map((p) => p.id));
    (variants ?? []).forEach((v: { id: string; product_id: string }) => {
      if ((inStockByVariant.get(v.id) ?? 0) > 0) hasStockByProduct.add(v.product_id);
    });

    const available = products.filter((p) => hasStockByProduct.has(p.id));
    return ok(available);
  } catch (e) {
    return err(
      e instanceof Error ? e.message : "Failed to fetch products by category"
    );
  }
}

export async function searchProducts(
  branchId: string,
  query: string
): Promise<Result<Product[]>> {
  try {
    const supabase = await createClient();
    const term = query.trim();
    if (!term) {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) return err(error.message);
      return ok((data ?? []) as Product[]);
    }

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .or(`name.ilike.%${term}%,description.ilike.%${term}%`)
      .order("name");

    if (error) return err(error.message);
    const products = (data ?? []) as Product[];
    if (products.length === 0) return ok(products);

    const { data: variants } = await supabase
      .from("product_variants")
      .select("id, product_id")
      .in("product_id", products.map((p) => p.id));
    const variantIds = (variants ?? []).map((v: { id: string }) => v.id);
    if (variantIds.length === 0) return ok(products);

    const { data: inv } = await supabase
      .from("inventory")
      .select("product_variant_id")
      .eq("branch_id", branchId)
      .in("product_variant_id", variantIds)
      .gt("quantity", 0);

    const inStockVariantIds = new Set(
      (inv ?? []).map((r: { product_variant_id: string }) => r.product_variant_id)
    );
    const productIdsInStock = new Set(
      (variants ?? [])
        .filter((v: { id: string; product_id: string }) => inStockVariantIds.has(v.id))
        .map((v: { id: string; product_id: string }) => v.product_id)
    );
    const available = products.filter((p) => productIdsInStock.has(p.id));
    return ok(available);
  } catch (e) {
    return err(
      e instanceof Error ? e.message : "Failed to search products"
    );
  }
}

export async function getProductBySlug(
  branchId: string,
  productSlug: string
): Promise<
  Result<{
    product: Product;
    variants: ProductVariant[];
    inventory: { variantId: string; quantity: number }[];
  }>
> {
  try {
    const supabase = await createClient();
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("slug", productSlug)
      .single();

    if (productError || !product) {
      return err(productError?.message ?? "Product not found");
    }

    const { data: variants, error: variantsError } = await supabase
      .from("product_variants")
      .select("*")
      .eq("product_id", product.id)
      .order("price");

    if (variantsError) return err(variantsError.message);
    const variantList = (variants ?? []) as ProductVariant[];
    const variantIds = variantList.map((v) => v.id);

    if (variantIds.length === 0) {
      return ok({
        product: product as Product,
        variants: variantList,
        inventory: [],
      });
    }

    const { data: inv } = await supabase
      .from("inventory")
      .select("product_variant_id, quantity")
      .eq("branch_id", branchId)
      .in("product_variant_id", variantIds);

    const inventory = (inv ?? []).map(
      (r: { product_variant_id: string; quantity: number }) => ({
        variantId: r.product_variant_id,
        quantity: r.quantity,
      })
    );

    return ok({
      product: product as Product,
      variants: variantList,
      inventory,
    });
  } catch (e) {
    return err(
      e instanceof Error ? e.message : "Failed to fetch product"
    );
  }
}

export async function getInventoryForVariants(
  branchId: string,
  variantIds: string[]
): Promise<Result<InventoryRow[]>> {
  try {
    if (variantIds.length === 0) return ok([]);
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("inventory")
      .select("*")
      .eq("branch_id", branchId)
      .in("product_variant_id", variantIds);

    if (error) return err(error.message);
    return ok((data ?? []) as InventoryRow[]);
  } catch (e) {
    return err(
      e instanceof Error ? e.message : "Failed to fetch inventory"
    );
  }
}

export interface ProductWithPriceAndStock {
  product: Product;
  minPrice: number;
  inStock: boolean;
}

export interface PrimaryVariant {
  id: string;
  name: string;
  price: number;
}

export interface ProductWithPriceStockAndVariant extends ProductWithPriceAndStock {
  primaryVariant: PrimaryVariant | null;
}

/** Products in a category with min price, in-stock flag, and primary variant for add-to-cart. Returns all products in category (not filtered by stock). */
export async function getProductsByCategoryWithDetails(
  branchId: string,
  categorySlug: string
): Promise<Result<ProductWithPriceStockAndVariant[]>> {
  try {
    const supabase = await createClient();
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .single();

    if (!category?.id) return ok([]);

    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("*")
      .eq("category_id", category.id)
      .eq("is_active", true)
      .order("name");

    if (productsError) return err(productsError.message);
    const list = (products ?? []) as Product[];

    if (list.length === 0) return ok([]);

    const { data: variants } = await supabase
      .from("product_variants")
      .select("id, product_id, name, price")
      .in("product_id", list.map((p) => p.id))
      .order("price");

    const variantList = (variants ?? []) as {
      id: string;
      product_id: string;
      name: string;
      price: number;
    }[];
    const variantIds = variantList.map((v) => v.id);

    const minPriceByProduct = new Map<string, number>();
    const variantsByProduct = new Map<string, typeof variantList>();
    variantList.forEach((v) => {
      const current = minPriceByProduct.get(v.product_id);
      if (current === undefined || v.price < current) {
        minPriceByProduct.set(v.product_id, v.price);
      }
      if (!variantsByProduct.has(v.product_id)) {
        variantsByProduct.set(v.product_id, []);
      }
      variantsByProduct.get(v.product_id)!.push(v);
    });

    let inStockVariantIds = new Set<string>();
    if (variantIds.length > 0) {
      const { data: inv } = await supabase
        .from("inventory")
        .select("product_variant_id")
        .eq("branch_id", branchId)
        .in("product_variant_id", variantIds)
        .gt("quantity", 0);
      inStockVariantIds = new Set(
        (inv ?? []).map((r: { product_variant_id: string }) => r.product_variant_id)
      );
    }

    const productIdsInStock = new Set(
      variantList
        .filter((v) => inStockVariantIds.has(v.id))
        .map((v) => v.product_id)
    );

    const result: ProductWithPriceStockAndVariant[] = list.map((product) => {
      const productVariants = variantsByProduct.get(product.id) ?? [];
      const firstInStock = productVariants.find((v) => inStockVariantIds.has(v.id));
      const primary = firstInStock ?? productVariants[0] ?? null;
      return {
        product,
        minPrice: minPriceByProduct.get(product.id) ?? product.base_price,
        inStock: productIdsInStock.has(product.id),
        primaryVariant: primary
          ? { id: primary.id, name: primary.name, price: primary.price }
          : null,
      };
    });

    return ok(result);
  } catch (e) {
    return err(
      e instanceof Error ? e.message : "Failed to fetch category products"
    );
  }
}

/** Search products with min price, in-stock, and primary variant (same shape as category). Empty query returns latest products. */
export async function getSearchProductsWithDetails(
  branchId: string,
  query: string
): Promise<Result<ProductWithPriceStockAndVariant[]>> {
  try {
    const supabase = await createClient();
    const term = query.trim();

    let list: Product[];
    if (!term) {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) return err(error.message);
      list = (data ?? []) as Product[];
    } else {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .or(`name.ilike.%${term}%,description.ilike.%${term}%`)
        .order("name");
      if (error) return err(error.message);
      list = (data ?? []) as Product[];
    }

    if (list.length === 0) return ok([]);

    const { data: variants } = await supabase
      .from("product_variants")
      .select("id, product_id, name, price")
      .in("product_id", list.map((p) => p.id))
      .order("price");

    const variantList = (variants ?? []) as {
      id: string;
      product_id: string;
      name: string;
      price: number;
    }[];
    const variantIds = variantList.map((v) => v.id);

    const minPriceByProduct = new Map<string, number>();
    const variantsByProduct = new Map<string, typeof variantList>();
    variantList.forEach((v) => {
      const current = minPriceByProduct.get(v.product_id);
      if (current === undefined || v.price < current) {
        minPriceByProduct.set(v.product_id, v.price);
      }
      if (!variantsByProduct.has(v.product_id)) {
        variantsByProduct.set(v.product_id, []);
      }
      variantsByProduct.get(v.product_id)!.push(v);
    });

    let inStockVariantIds = new Set<string>();
    if (variantIds.length > 0) {
      const { data: inv } = await supabase
        .from("inventory")
        .select("product_variant_id")
        .eq("branch_id", branchId)
        .in("product_variant_id", variantIds)
        .gt("quantity", 0);
      inStockVariantIds = new Set(
        (inv ?? []).map((r: { product_variant_id: string }) => r.product_variant_id)
      );
    }

    const productIdsInStock = new Set(
      variantList
        .filter((v) => inStockVariantIds.has(v.id))
        .map((v) => v.product_id)
    );

    const result: ProductWithPriceStockAndVariant[] = list.map((product) => {
      const productVariants = variantsByProduct.get(product.id) ?? [];
      const firstInStock = productVariants.find((v) => inStockVariantIds.has(v.id));
      const primary = firstInStock ?? productVariants[0] ?? null;
      return {
        product,
        minPrice: minPriceByProduct.get(product.id) ?? product.base_price,
        inStock: productIdsInStock.has(product.id),
        primaryVariant: primary
          ? { id: primary.id, name: primary.name, price: primary.price }
          : null,
      };
    });

    return ok(result);
  } catch (e) {
    return err(
      e instanceof Error ? e.message : "Failed to search products"
    );
  }
}

/** Latest products with min variant price and in-stock status for a branch. */
export async function getPopularProducts(
  branchId: string,
  limit: number = 8
): Promise<Result<ProductWithPriceAndStock[]>> {
  try {
    const supabase = await createClient();
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (productsError) return err(productsError.message);
    const list = (products ?? []) as Product[];

    if (list.length === 0) return ok([]);

    const { data: variants } = await supabase
      .from("product_variants")
      .select("id, product_id, price")
      .in("product_id", list.map((p) => p.id));

    const variantList = (variants ?? []) as { id: string; product_id: string; price: number }[];
    const variantIds = variantList.map((v) => v.id);

    const minPriceByProduct = new Map<string, number>();
    variantList.forEach((v) => {
      const current = minPriceByProduct.get(v.product_id);
      if (current === undefined || v.price < current) {
        minPriceByProduct.set(v.product_id, v.price);
      }
    });

    let inStockVariantIds = new Set<string>();
    if (variantIds.length > 0) {
      const { data: inv } = await supabase
        .from("inventory")
        .select("product_variant_id")
        .eq("branch_id", branchId)
        .in("product_variant_id", variantIds)
        .gt("quantity", 0);
      inStockVariantIds = new Set(
        (inv ?? []).map((r: { product_variant_id: string }) => r.product_variant_id)
      );
    }

    const productIdsInStock = new Set(
      variantList
        .filter((v) => inStockVariantIds.has(v.id))
        .map((v) => v.product_id)
    );

    const result: ProductWithPriceAndStock[] = list.map((product) => ({
      product,
      minPrice: minPriceByProduct.get(product.id) ?? product.base_price,
      inStock: productIdsInStock.has(product.id),
    }));

    return ok(result);
  } catch (e) {
    return err(
      e instanceof Error ? e.message : "Failed to fetch popular products"
    );
  }
}

/** Latest products with min price, in-stock, and primary variant (for add-to-cart). */
export async function getPopularProductsWithDetails(
  branchId: string,
  limit: number = 8
): Promise<Result<ProductWithPriceStockAndVariant[]>> {
  try {
    const supabase = await createClient();
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (productsError) return err(productsError.message);
    const list = (products ?? []) as Product[];

    if (list.length === 0) return ok([]);

    const { data: variants } = await supabase
      .from("product_variants")
      .select("id, product_id, name, price")
      .in("product_id", list.map((p) => p.id))
      .order("price");

    const variantList = (variants ?? []) as {
      id: string;
      product_id: string;
      name: string;
      price: number;
    }[];
    const variantIds = variantList.map((v) => v.id);

    const minPriceByProduct = new Map<string, number>();
    const variantsByProduct = new Map<string, typeof variantList>();
    variantList.forEach((v) => {
      const current = minPriceByProduct.get(v.product_id);
      if (current === undefined || v.price < current) {
        minPriceByProduct.set(v.product_id, v.price);
      }
      if (!variantsByProduct.has(v.product_id)) {
        variantsByProduct.set(v.product_id, []);
      }
      variantsByProduct.get(v.product_id)!.push(v);
    });

    let inStockVariantIds = new Set<string>();
    if (variantIds.length > 0) {
      const { data: inv } = await supabase
        .from("inventory")
        .select("product_variant_id")
        .eq("branch_id", branchId)
        .in("product_variant_id", variantIds)
        .gt("quantity", 0);
      inStockVariantIds = new Set(
        (inv ?? []).map((r: { product_variant_id: string }) => r.product_variant_id)
      );
    }

    const productIdsInStock = new Set(
      variantList
        .filter((v) => inStockVariantIds.has(v.id))
        .map((v) => v.product_id)
    );

    const result: ProductWithPriceStockAndVariant[] = list.map((product) => {
      const productVariants = variantsByProduct.get(product.id) ?? [];
      const firstInStock = productVariants.find((v) => inStockVariantIds.has(v.id));
      const primary = firstInStock ?? productVariants[0] ?? null;
      return {
        product,
        minPrice: minPriceByProduct.get(product.id) ?? product.base_price,
        inStock: productIdsInStock.has(product.id),
        primaryVariant: primary
          ? { id: primary.id, name: primary.name, price: primary.price }
          : null,
      };
    });

    return ok(result);
  } catch (e) {
    return err(
      e instanceof Error ? e.message : "Failed to fetch popular products with details"
    );
  }
}

async function getVariantIdsForProducts(
  supabase: Awaited<ReturnType<typeof createClient>>,
  productIds: string[]
): Promise<string[]> {
  if (productIds.length === 0) return [];
  const { data } = await supabase
    .from("product_variants")
    .select("id")
    .in("product_id", productIds);
  return (data ?? []).map((r: { id: string }) => r.id);
}

/**
 * Fetch order by order_number (e.g. ORD-xxx). Use for tracking with phone verification.
 */
export async function getOrderByOrderNumber(
  orderNumber: string
): Promise<
  Result<{
    order: Order;
    items: (OrderItem & { variant?: ProductVariant })[];
  }>
> {
  try {
    const supabase = await createClient();
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("order_number", orderNumber.trim())
      .single();

    if (orderError || !order) {
      return err(orderError?.message ?? "Order not found");
    }

    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", order.id)
      .order("created_at");

    if (itemsError) return err(itemsError.message);
    const orderItems = (items ?? []) as OrderItem[];
    const variantIds = [...new Set(orderItems.map((i) => i.product_variant_id))];

    let variants: ProductVariant[] = [];
    if (variantIds.length > 0) {
      const { data: v } = await supabase
        .from("product_variants")
        .select("*")
        .in("id", variantIds);
      variants = (v ?? []) as ProductVariant[];
    }

    const variantMap = new Map(variants.map((v) => [v.id, v]));
    const itemsWithVariant = orderItems.map((item) => ({
      ...item,
      variant: variantMap.get(item.product_variant_id),
    }));

    return ok({
      order: order as Order,
      items: itemsWithVariant,
    });
  } catch (e) {
    return err(
      e instanceof Error ? e.message : "Failed to fetch order"
    );
  }
}
