"use server";

import { createClient } from "@/lib/supabase/server";
import { upsertProduct } from "@/lib/dal";
import { isOk } from "@/lib/dal";
import { revalidatePath } from "next/cache";

/** Create a public bucket named "product-images" in Supabase Dashboard > Storage and allow uploads (e.g. authenticated users or anon policy). */
const PRODUCT_IMAGES_BUCKET = "product-images";

export type UpsertProductResult =
  | { ok: true; productId: string }
  | { ok: false; error: string };

/** Upload a product image to Supabase Storage. Returns public URL or error. */
export async function uploadProductImage(
  formData: FormData
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    return { ok: false, error: "No file provided" };
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { ok: false, error: "File must be under 5MB" };
  }

  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowed.includes(file.type)) {
    return { ok: false, error: "Allowed types: JPEG, PNG, WebP, GIF" };
  }

  try {
    const supabase = await createClient();
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;

    const { error } = await supabase.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .upload(path, file, { upsert: false, contentType: file.type });

    if (error) {
      return { ok: false, error: error.message };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(path);
    return { ok: true, url: publicUrl };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Upload failed",
    };
  }
}

/** Upsert product + variants. Input must be validated with Zod before calling. */
export async function upsertProductAction(
  product: {
    id?: string;
    name: string;
    slug: string;
    description?: string | null;
    image_url?: string | null;
    base_price: number;
    is_active: boolean;
    category_id?: string | null;
  },
  variants: {
    id?: string;
    name: string;
    sku: string;
    price: number;
  }[]
): Promise<UpsertProductResult> {
  const result = await upsertProduct({
    product: {
      id: product.id,
      name: product.name.trim(),
      slug: product.slug.trim().toLowerCase().replace(/\s+/g, "-"),
      description: product.description?.trim() || null,
      image_url: product.image_url || null,
      base_price: Number(product.base_price),
      is_active: Boolean(product.is_active),
      category_id: product.category_id || null,
    },
    variants: variants.map((v) => ({
      id: v.id,
      name: v.name.trim(),
      sku: v.sku.trim(),
      price: Number(v.price),
    })),
  });

  if (!isOk(result)) {
    return { ok: false, error: result.error };
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
  return { ok: true, productId: result.data.product.id };
}
