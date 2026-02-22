"use server";

import { createClient } from "@/lib/supabase/server";
import { ok, err, type Result } from "./result";
import type {
  Branch,
  BranchInsert,
  DeliveryArea,
  DeliveryAreaInsert,
  Product,
  ProductVariant,
  ProductInsert,
  ProductVariantInsert,
  Order,
  OrderItem,
  OrderStatus,
} from "@/types/db";

export interface OrderFilters {
  branchId?: string;
  status?: OrderStatus;
  from?: string; // ISO date
  to?: string;   // ISO date
  limit?: number;
  offset?: number;
}

/** Variant payload for upsert; product_id is set by the server. */
export type UpsertProductVariantPayload = Pick<ProductVariantInsert, "name" | "sku" | "price"> & {
  id?: string;
};

export interface UpsertProductInput {
  product: ProductInsert & { id?: string };
  variants: UpsertProductVariantPayload[];
}

/** Fetch all products for admin list (no inventory). */
export async function getProducts(): Promise<
  Result<{ products: Product[]; categories: Map<string, string> }>
> {
  try {
    const supabase = await createClient();
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("*")
      .order("name");

    if (productsError) return err(productsError.message);
    const list = (products ?? []) as Product[];

    const categoryIds = [
      ...new Set(list.map((p) => p.category_id).filter(Boolean)),
    ] as string[];
    let categories = new Map<string, string>();
    if (categoryIds.length > 0) {
      const { data: cats } = await supabase
        .from("categories")
        .select("id, name")
        .in("id", categoryIds);
      categories = new Map(
        (cats ?? []).map((c: { id: string; name: string }) => [c.id, c.name])
      );
    }

    return ok({ products: list, categories });
  } catch (e) {
    return err(
      e instanceof Error ? e.message : "Failed to fetch products"
    );
  }
}

/** Fetch a single product with variants for admin edit. */
export async function getProductById(
  productId: string
): Promise<
  Result<{ product: Product; variants: ProductVariant[] }>
> {
  try {
    const supabase = await createClient();
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();

    if (productError || !product) {
      return err(productError?.message ?? "Product not found");
    }

    const { data: variants, error: variantsError } = await supabase
      .from("product_variants")
      .select("*")
      .eq("product_id", productId)
      .order("price");

    if (variantsError) return err(variantsError.message);

    return ok({
      product: product as Product,
      variants: (variants ?? []) as ProductVariant[],
    });
  } catch (e) {
    return err(
      e instanceof Error ? e.message : "Failed to fetch product"
    );
  }
}

export async function upsertProduct(
  input: UpsertProductInput
): Promise<Result<{ product: Product; variants: ProductVariant[] }>> {
  try {
    const supabase = await createClient();
    const { product: productPayload, variants: variantsPayload } = input;

    let productId: string;
    let productRow: Product;

    if (productPayload.id) {
      const { data, error } = await supabase
        .from("products")
        .update({
          name: productPayload.name,
          slug: productPayload.slug,
          description: productPayload.description ?? null,
          image_url: productPayload.image_url ?? null,
          base_price: productPayload.base_price,
          is_active: productPayload.is_active ?? true,
          category_id: productPayload.category_id ?? null,
        })
        .eq("id", productPayload.id)
        .select()
        .single();
      if (error) return err(error.message);
      if (!data) return err("Product update returned no row");
      productRow = data as Product;
      productId = productRow.id;
    } else {
      const { data, error } = await supabase
        .from("products")
        .insert({
          name: productPayload.name,
          slug: productPayload.slug,
          description: productPayload.description ?? null,
          image_url: productPayload.image_url ?? null,
          base_price: productPayload.base_price,
          is_active: productPayload.is_active ?? true,
          category_id: productPayload.category_id ?? null,
        })
        .select()
        .single();
      if (error) return err(error.message);
      if (!data) return err("Product insert returned no row");
      productRow = data as Product;
      productId = productRow.id;
    }

    const variantRows: ProductVariant[] = [];
    for (const v of variantsPayload) {
      const payload = {
        product_id: productId,
        name: v.name,
        sku: v.sku,
        price: v.price,
      };
      if (v.id) {
        const { data, error } = await supabase
          .from("product_variants")
          .update(payload)
          .eq("id", v.id)
          .select()
          .single();
        if (error) return err(error.message);
        if (data) variantRows.push(data as ProductVariant);
      } else {
        const { data, error } = await supabase
          .from("product_variants")
          .insert(payload)
          .select()
          .single();
        if (error) return err(error.message);
        if (data) variantRows.push(data as ProductVariant);
      }
    }

    return ok({ product: productRow, variants: variantRows });
  } catch (e) {
    return err(
      e instanceof Error ? e.message : "Failed to upsert product"
    );
  }
}

/** Row for stock management: variant + product name + quantity at a branch. */
export interface StockRow {
  variantId: string;
  variantName: string;
  sku: string;
  price: number;
  productName: string;
  quantity: number;
}

/** Fetch all variants with product name and inventory quantity for a branch. */
export async function getStockForBranch(
  branchId: string
): Promise<Result<StockRow[]>> {
  try {
    const supabase = await createClient();

    const { data: variants, error: variantsError } = await supabase
      .from("product_variants")
      .select("id, name, sku, price, product_id")
      .order("name");

    if (variantsError) return err(variantsError.message);
    const variantList = (variants ?? []) as {
      id: string;
      name: string;
      sku: string;
      price: number;
      product_id: string;
    }[];

    if (variantList.length === 0) return ok([]);

    const productIds = [...new Set(variantList.map((v) => v.product_id))];
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, name")
      .in("id", productIds);

    if (productsError) return err(productsError.message);
    const productMap = new Map(
      (products ?? []).map((p: { id: string; name: string }) => [p.id, p.name])
    );

    const variantIds = variantList.map((v) => v.id);
    const { data: inv, error: invError } = await supabase
      .from("inventory")
      .select("product_variant_id, quantity")
      .eq("branch_id", branchId)
      .in("product_variant_id", variantIds);

    if (invError) return err(invError.message);
    const qtyByVariant = new Map(
      (inv ?? []).map((r: { product_variant_id: string; quantity: number }) => [
        r.product_variant_id,
        r.quantity,
      ])
    );

    const rows: StockRow[] = variantList.map((v) => ({
      variantId: v.id,
      variantName: v.name,
      sku: v.sku,
      price: v.price,
      productName: productMap.get(v.product_id) ?? "",
      quantity: qtyByVariant.get(v.id) ?? 0,
    }));

    return ok(rows);
  } catch (e) {
    return err(
      e instanceof Error ? e.message : "Failed to fetch stock"
    );
  }
}

export async function setInventory(
  branchId: string,
  variantId: string,
  quantity: number
): Promise<Result<{ branchId: string; variantId: string; quantity: number }>> {
  try {
    if (quantity < 0) return err("Quantity must be >= 0");
    const supabase = await createClient();

    const { data: existing } = await supabase
      .from("inventory")
      .select("id")
      .eq("branch_id", branchId)
      .eq("product_variant_id", variantId)
      .single();

    if (existing?.id) {
      const { error } = await supabase
        .from("inventory")
        .update({ quantity })
        .eq("id", existing.id);
      if (error) return err(error.message);
    } else {
      const { error } = await supabase.from("inventory").insert({
        branch_id: branchId,
        product_variant_id: variantId,
        quantity,
      });
      if (error) return err(error.message);
    }

    return ok({ branchId, variantId, quantity });
  } catch (e) {
    return err(
      e instanceof Error ? e.message : "Failed to set inventory"
    );
  }
}

export async function getOrders(
  filters: OrderFilters = {}
): Promise<Result<{ orders: Order[]; total?: number }>> {
  try {
    const supabase = await createClient();
    let query = supabase.from("orders").select("*", { count: "exact" });

    if (filters.branchId) query = query.eq("branch_id", filters.branchId);
    if (filters.status) query = query.eq("status", filters.status);
    if (filters.from) query = query.gte("created_at", filters.from);
    if (filters.to) query = query.lte("created_at", filters.to);

    query = query.order("created_at", { ascending: false });
    const limit = Math.min(100, Math.max(1, filters.limit ?? 20));
    const offset = Math.max(0, filters.offset ?? 0);
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) return err(error.message);
    return ok({
      orders: (data ?? []) as Order[],
      total: count ?? undefined,
    });
  } catch (e) {
    return err(
      e instanceof Error ? e.message : "Failed to fetch orders"
    );
  }
}

export async function getOrderById(
  orderId: string
): Promise<
  Result<{
    order: Order;
    items: (OrderItem & { variant?: ProductVariant })[];
    branch: Branch | null;
  }>
> {
  try {
    const supabase = await createClient();
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return err(orderError?.message ?? "Order not found");
    }

    const [itemsResult, branchResult] = await Promise.all([
      (async () => {
        const { data: items, error: itemsError } = await supabase
          .from("order_items")
          .select("*")
          .eq("order_id", orderId)
          .order("created_at");
        if (itemsError) return { items: null, error: itemsError.message };
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
        return {
          items: orderItems.map((item) => ({
            ...item,
            variant: variantMap.get(item.product_variant_id),
          })),
          error: null,
        };
      })(),
      (async () => {
        const { data: branch, error } = await supabase
          .from("branches")
          .select("*")
          .eq("id", order.branch_id)
          .single();
        return { branch: error ? null : (branch as Branch), error };
      })(),
    ]);

    if (itemsResult.error || !itemsResult.items) {
      return err(itemsResult.error ?? "Failed to fetch order items");
    }

    return ok({
      order: order as Order,
      items: itemsResult.items,
      branch: branchResult.branch,
    });
  } catch (e) {
    return err(
      e instanceof Error ? e.message : "Failed to fetch order"
    );
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<Result<Order>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId)
      .select()
      .single();

    if (error) return err(error.message);
    if (!data) return err("Order not found");
    return ok(data as Order);
  } catch (e) {
    return err(
      e instanceof Error ? e.message : "Failed to update order status"
    );
  }
}

// ---------------------------------------------------------------------------
// Branches (admin CRUD)
// ---------------------------------------------------------------------------

/** Fetch all branches (no is_active filter) for admin. */
export async function getAllBranches(): Promise<Result<Branch[]>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("branches")
      .select("*")
      .order("name");
    if (error) return err(error.message);
    return ok((data ?? []) as Branch[]);
  } catch (e) {
    return err(
      e instanceof Error ? e.message : "Failed to fetch branches"
    );
  }
}

export async function createBranch(
  input: BranchInsert
): Promise<Result<Branch>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("branches")
      .insert({
        name: input.name.trim(),
        address: input.address?.trim() ?? null,
        phone: input.phone?.trim() ?? null,
        whatsapp_phone: input.whatsapp_phone?.trim() ?? null,
        timezone: input.timezone?.trim() ?? "UTC",
        is_active: input.is_active ?? true,
      })
      .select()
      .single();
    if (error) return err(error.message);
    if (!data) return err("Branch create returned no row");
    return ok(data as Branch);
  } catch (e) {
    return err(
      e instanceof Error ? e.message : "Failed to create branch"
    );
  }
}

export async function updateBranch(
  id: string,
  input: Partial<BranchInsert>
): Promise<Result<Branch>> {
  try {
    const supabase = await createClient();
    const payload: Record<string, unknown> = {};
    if (input.name !== undefined) payload.name = input.name.trim();
    if (input.address !== undefined) payload.address = input.address?.trim() ?? null;
    if (input.phone !== undefined) payload.phone = input.phone?.trim() ?? null;
    if (input.whatsapp_phone !== undefined) payload.whatsapp_phone = input.whatsapp_phone?.trim() ?? null;
    if (input.timezone !== undefined) payload.timezone = input.timezone?.trim() ?? "UTC";
    if (input.is_active !== undefined) payload.is_active = input.is_active;

    const { data, error } = await supabase
      .from("branches")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) return err(error.message);
    if (!data) return err("Branch not found");
    return ok(data as Branch);
  } catch (e) {
    return err(
      e instanceof Error ? e.message : "Failed to update branch"
    );
  }
}

export async function deleteBranch(id: string): Promise<Result<void>> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("branches").delete().eq("id", id);
    if (error) return err(error.message);
    return ok(undefined);
  } catch (e) {
    return err(
      e instanceof Error ? e.message : "Failed to delete branch"
    );
  }
}

// ---------------------------------------------------------------------------
// Delivery areas (admin CRUD)
// ---------------------------------------------------------------------------

export async function createDeliveryArea(
  input: DeliveryAreaInsert
): Promise<Result<DeliveryArea>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("delivery_areas")
      .insert({
        name: input.name.trim(),
        fee: Number(input.fee) >= 0 ? Number(input.fee) : 0,
        branch_id: input.branch_id ?? null,
        is_enabled: input.is_enabled ?? true,
      })
      .select()
      .single();
    if (error) return err(error.message);
    if (!data) return err("Delivery area create returned no row");
    return ok(data as DeliveryArea);
  } catch (e) {
    return err(
      e instanceof Error ? e.message : "Failed to create delivery area"
    );
  }
}

export async function updateDeliveryArea(
  id: string,
  input: Partial<DeliveryAreaInsert>
): Promise<Result<DeliveryArea>> {
  try {
    const supabase = await createClient();
    const payload: Record<string, unknown> = {};
    if (input.name !== undefined) payload.name = input.name.trim();
    if (input.fee !== undefined) payload.fee = Number(input.fee) >= 0 ? Number(input.fee) : 0;
    if (input.branch_id !== undefined) payload.branch_id = input.branch_id ?? null;
    if (input.is_enabled !== undefined) payload.is_enabled = input.is_enabled;

    const { data, error } = await supabase
      .from("delivery_areas")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) return err(error.message);
    if (!data) return err("Delivery area not found");
    return ok(data as DeliveryArea);
  } catch (e) {
    return err(
      e instanceof Error ? e.message : "Failed to update delivery area"
    );
  }
}

export async function deleteDeliveryArea(id: string): Promise<Result<void>> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("delivery_areas").delete().eq("id", id);
    if (error) return err(error.message);
    return ok(undefined);
  } catch (e) {
    return err(
      e instanceof Error ? e.message : "Failed to delete delivery area"
    );
  }
}
