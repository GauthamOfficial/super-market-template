/**
 * Remove all products and seed exactly 20 products with Sri Lankan (LKR) prices
 * spread across all existing categories. Keeps branches, categories, and orders
 * (order line items are removed because they reference product variants).
 *
 * Run: npx tsx scripts/reseed-products.ts
 * Requires: .env.local or .env with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

function loadEnv() {
  const root = resolve(process.cwd());
  for (const p of [resolve(root, ".env.local"), resolve(root, ".env")]) {
    if (!existsSync(p)) continue;
    try {
      const content = readFileSync(p, "utf8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eq = trimmed.indexOf("=");
        if (eq <= 0) continue;
        const key = trimmed.slice(0, eq).trim();
        const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
        if (!process.env[key]) process.env[key] = value;
      }
      break;
    } catch {
      /* ignore */
    }
  }
}
loadEnv();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local or .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// 20 products: name and base price in LKR (Sri Lankan Rupees), one per category then cycle
const PRODUCTS_LKR: { name: string; basePriceLkr: number }[] = [
  { name: "Fresh Milk 1L", basePriceLkr: 380 },
  { name: "Curd 450g", basePriceLkr: 220 },
  { name: "Eggs (6)", basePriceLkr: 450 },
  { name: "Tomatoes 1kg", basePriceLkr: 120 },
  { name: "Onions 1kg", basePriceLkr: 100 },
  { name: "Potatoes 1kg", basePriceLkr: 90 },
  { name: "White Bread", basePriceLkr: 220 },
  { name: "Buns (4)", basePriceLkr: 180 },
  { name: "Ceylon Tea 400g", basePriceLkr: 350 },
  { name: "Milk Powder 400g", basePriceLkr: 580 },
  { name: "Cream Crackers 200g", basePriceLkr: 120 },
  { name: "Cashew Nuts 100g", basePriceLkr: 450 },
  { name: "Ice Cream 1L", basePriceLkr: 420 },
  { name: "Frozen Peas 500g", basePriceLkr: 280 },
  { name: "Keeri Samba Rice 1kg", basePriceLkr: 220 },
  { name: "Dhal 500g", basePriceLkr: 180 },
  { name: "Cooking Oil 1L", basePriceLkr: 650 },
  { name: "Bath Soap", basePriceLkr: 95 },
  { name: "Toothpaste", basePriceLkr: 420 },
  { name: "Shampoo 400ml", basePriceLkr: 380 },
];

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function reseed() {
  console.log("Reseeding products: remove all, then add 20 with LKR prices.\n");

  // 1. Delete in order (order_items reference product_variant_id with restrict)
  console.log("Deleting existing order items...");
  const { error: oiErr } = await supabase.from("order_items").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (oiErr) {
    console.error("order_items delete error:", oiErr);
    process.exit(1);
  }
  console.log("  Done.\n");

  console.log("Deleting inventory...");
  const { error: invErr } = await supabase.from("inventory").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (invErr) {
    console.error("inventory delete error:", invErr);
    process.exit(1);
  }
  console.log("  Done.\n");

  console.log("Deleting product variants...");
  const { error: pvErr } = await supabase.from("product_variants").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (pvErr) {
    console.error("product_variants delete error:", pvErr);
    process.exit(1);
  }
  console.log("  Done.\n");

  console.log("Deleting products...");
  const { error: prodErr } = await supabase.from("products").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (prodErr) {
    console.error("products delete error:", prodErr);
    process.exit(1);
  }
  console.log("  Done.\n");

  // 2. Get categories (keep existing order)
  const { data: categories, error: catErr } = await supabase
    .from("categories")
    .select("id")
    .order("slug");
  if (catErr || !categories?.length) {
    console.error("Need existing categories. Run full seed first or add categories in admin.", catErr);
    process.exit(1);
  }
  const categoryIds = categories.map((c) => c.id);

  // 3. Insert 20 products (LKR prices), spread across categories
  console.log("Inserting 20 products (LKR prices)...");
  const productRows = PRODUCTS_LKR.map((p, i) => ({
    name: p.name,
    slug: `${slugify(p.name)}-${i + 1}`,
    description: `${p.name} – quality product.`,
    category_id: categoryIds[i % categoryIds.length],
    base_price: p.basePriceLkr,
    is_active: true,
  }));

  const { data: products, error: productsError } = await supabase
    .from("products")
    .insert(productRows)
    .select("id, name");

  if (productsError) {
    console.error("Products insert error:", productsError);
    process.exit(1);
  }
  const productList = products ?? [];
  console.log(`  Inserted ${productList.length} products.\n`);

  // 4. Variants (2 per product: Standard, Large — Large ~1.4x LKR)
  console.log("Inserting product variants (Standard + Large)...");
  const variantRows: { product_id: string; name: string; sku: string; price: number }[] = [];
  let skuCounter = 20000;
  for (const p of productList) {
    const base = PRODUCTS_LKR.find((x) => x.name === p.name)?.basePriceLkr ?? 200;
    variantRows.push(
      { product_id: p.id, name: "Standard", sku: `SKU-${skuCounter++}`, price: base },
      { product_id: p.id, name: "Large", sku: `SKU-${skuCounter++}`, price: Math.round(base * 1.4) }
    );
  }

  const { data: variants, error: variantsError } = await supabase
    .from("product_variants")
    .insert(variantRows)
    .select("id");

  if (variantsError) {
    console.error("Variants insert error:", variantsError);
    process.exit(1);
  }
  const variantList = variants ?? [];
  console.log(`  Inserted ${variantList.length} variants.\n`);

  // 5. Inventory (all branches × all variants)
  const { data: branches } = await supabase.from("branches").select("id");
  const branchIds = (branches ?? []).map((b) => b.id);
  if (branchIds.length === 0) {
    console.error("No branches found. Run full seed first.");
    process.exit(1);
  }

  console.log("Inserting inventory (per branch, per variant)...");
  const inventoryRows: { branch_id: string; product_variant_id: string; quantity: number }[] = [];
  for (const branchId of branchIds) {
    for (const v of variantList) {
      inventoryRows.push({
        branch_id: branchId,
        product_variant_id: v.id,
        quantity: randomInt(5, 80),
      });
    }
  }
  const { error: invInsertErr } = await supabase.from("inventory").insert(inventoryRows);
  if (invInsertErr) {
    console.error("Inventory insert error:", invInsertErr);
    process.exit(1);
  }
  console.log(`  Inserted ${inventoryRows.length} inventory rows.\n`);

  console.log("Reseed completed: 20 products with LKR prices across all categories.");
}

reseed().catch((e) => {
  console.error(e);
  process.exit(1);
});
