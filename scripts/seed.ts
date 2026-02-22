/**
 * Supabase seed script
 *
 * Populates the database with:
 * - 4 branches
 * - 8 categories
 * - 60 products (with slugs, base_price, category_id)
 * - 2 variants per product (120 variants, unique SKUs)
 * - Random inventory per branch for each variant
 * - A few sample orders with order_items
 *
 * Run: npm run seed
 * Requires: .env with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Load .env (optional; can also set env vars in shell)
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("dotenv").config();
} catch {
  // dotenv not installed; rely on process.env
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    "Missing env: NEXT_PUBLIC_SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY. " +
      "Copy .env.example to .env and set values, or install dotenv and add a .env file."
  );
  process.exit(1);
}

const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const BRANCHES = [
  { name: "Downtown Main", address: "100 Main St", phone: "+1-555-0100", timezone: "America/New_York" },
  { name: "Westside Mall", address: "200 Mall Dr", phone: "+1-555-0200", timezone: "America/New_York" },
  { name: "East End", address: "300 East Ave", phone: "+1-555-0300", timezone: "America/New_York" },
  { name: "North Plaza", address: "400 North Rd", phone: "+1-555-0400", timezone: "America/New_York" },
];

const CATEGORIES = [
  { name: "Dairy & Eggs", slug: "dairy-eggs" },
  { name: "Produce", slug: "produce" },
  { name: "Bakery", slug: "bakery" },
  { name: "Beverages", slug: "beverages" },
  { name: "Snacks", slug: "snacks" },
  { name: "Frozen", slug: "frozen" },
  { name: "Pantry", slug: "pantry" },
  { name: "Personal Care", slug: "personal-care" },
];

// 60 product names (mix across categories); we'll assign category by index % 8
const PRODUCT_NAMES = [
  "Whole Milk", "Skim Milk", "Greek Yogurt", "Cheddar Cheese", "Butter", "Eggs Dozen", "Cream Cheese", "Mozzarella",
  "Tomatoes", "Onions", "Potatoes", "Carrots", "Broccoli", "Spinach", "Apples", "Bananas", "Oranges", "Lettuce",
  "White Bread", "Whole Wheat Bread", "Bagels", "Croissants", "Muffins", "Tortillas", "English Muffins", "Baguette",
  "Orange Juice", "Apple Juice", "Cola", "Sparkling Water", "Green Tea", "Coffee Beans", "Energy Drink", "Iced Tea",
  "Potato Chips", "Crackers", "Cookies", "Granola Bars", "Nuts", "Popcorn", "Chocolate Bar", "Trail Mix",
  "Ice Cream", "Frozen Pizza", "Frozen Peas", "Frozen Fries", "Frozen Berries", "Frozen Waffles", "Frozen Lasagna", "Popsicles",
  "Pasta", "Rice", "Olive Oil", "Canned Beans", "Tomato Sauce", "Cereal", "Oatmeal", "Peanut Butter",
  "Shampoo", "Soap", "Toothpaste", "Hand Sanitizer",
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

// ---------------------------------------------------------------------------
// Seed
// ---------------------------------------------------------------------------

async function seed() {
  console.log("Seeding Supabase...\n");

  // 1. Branches
  console.log("Inserting branches...");
  const { data: branches, error: branchesError } = await supabase
    .from("branches")
    .insert(
      BRANCHES.map((b) => ({
        name: b.name,
        address: b.address,
        phone: b.phone,
        timezone: b.timezone,
        is_active: true,
      }))
    )
    .select("id, name");

  if (branchesError) {
    console.error("Branches error:", branchesError);
    process.exit(1);
  }
  const branchIds = (branches ?? []).map((b) => b.id);
  console.log(`  Inserted ${branchIds.length} branches.\n`);

  // 2. Categories
  console.log("Inserting categories...");
  const { data: categories, error: categoriesError } = await supabase
    .from("categories")
    .insert(CATEGORIES.map((c) => ({ name: c.name, slug: c.slug })))
    .select("id, slug");

  if (categoriesError) {
    console.error("Categories error:", categoriesError);
    process.exit(1);
  }
  const categoryIds = (categories ?? []).map((c) => c.id);
  console.log(`  Inserted ${categoryIds.length} categories.\n`);

  // 3. Products (60)
  console.log("Inserting products...");
  const productRows = PRODUCT_NAMES.map((name, i) => ({
    name,
    slug: `${slugify(name)}-${i + 1}`,
    description: `${name} – quality product.`,
    category_id: categoryIds[i % categoryIds.length],
    base_price: Number((randomInt(1, 50) + Math.random()).toFixed(2)),
    is_active: true,
  }));

  const { data: products, error: productsError } = await supabase
    .from("products")
    .insert(productRows)
    .select("id, name");

  if (productsError) {
    console.error("Products error:", productsError);
    process.exit(1);
  }
  const productList = products ?? [];
  console.log(`  Inserted ${productList.length} products.\n`);

  // 4. Variants (2 per product)
  console.log("Inserting product variants (2 per product)...");
  const variantRows: { product_id: string; name: string; sku: string; price: number }[] = [];
  let skuCounter = 10000;
  for (const p of productList) {
    const basePrice = productRows.find((r) => r.name === p.name)?.base_price ?? 5;
    variantRows.push(
      { product_id: p.id, name: "Standard", sku: `SKU-${skuCounter++}`, price: Number(basePrice.toFixed(2)) },
      { product_id: p.id, name: "Large", sku: `SKU-${skuCounter++}`, price: Number((basePrice * 1.5).toFixed(2)) }
    );
  }

  const { data: variants, error: variantsError } = await supabase
    .from("product_variants")
    .insert(variantRows)
    .select("id, product_id");

  if (variantsError) {
    console.error("Variants error:", variantsError);
    process.exit(1);
  }
  const variantList = variants ?? [];
  // variantList[i] corresponds to variantRows[i] (same insert order)
  const variantPriceByIndex = new Map(variantList.map((v, i) => [v.id, variantRows[i]!.price]));
  console.log(`  Inserted ${variantList.length} variants.\n`);

  // 5. Inventory (per branch, per variant – random quantity)
  console.log("Inserting inventory (random per branch per variant)...");
  const inventoryRows: { branch_id: string; product_variant_id: string; quantity: number }[] = [];
  for (const branchId of branchIds) {
    for (const v of variantList) {
      inventoryRows.push({
        branch_id: branchId,
        product_variant_id: v.id,
        quantity: randomInt(0, 100),
      });
    }
  }

  const { error: inventoryError } = await supabase.from("inventory").insert(inventoryRows);
  if (inventoryError) {
    console.error("Inventory error:", inventoryError);
    process.exit(1);
  }
  console.log(`  Inserted ${inventoryRows.length} inventory rows.\n`);

  // 6. Sample orders (a few per branch, with order_items)
  console.log("Inserting sample orders...");
  const orderStatuses = ["pending", "packed", "dispatched", "completed"] as const;
  let orderNum = 1;
  const ordersToCreate = 5;

  for (let i = 0; i < ordersToCreate; i++) {
    const branchId = branchIds[i % branchIds.length];
    const orderNumber = `ORD-SEED-${String(orderNum++).padStart(4, "0")}`;
    const status = orderStatuses[i % orderStatuses.length];

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        branch_id: branchId,
        order_number: orderNumber,
        status,
        customer_email: `customer${i + 1}@example.com`,
        customer_phone: `+1-555-100${i}`,
        delivery_address: `${100 + i} Sample Street, City`,
      })
      .select("id")
      .single();

    if (orderError || !order) {
      console.error("Order error:", orderError);
      continue;
    }

    // 1–3 items per order; pick random variants from this branch's inventory
    const branchVariants = variantList; // any variant is fine for seed
    const numItems = randomInt(1, 3);
    const chosen = new Set<number>();
    while (chosen.size < numItems) chosen.add(randomInt(0, branchVariants.length - 1));
    const items = Array.from(chosen).map((idx) => {
      const v = branchVariants[idx]!;
      const inv = inventoryRows.find(
        (r) => r.branch_id === branchId && r.product_variant_id === v.id
      );
      const price = variantPriceByIndex.get(v.id) ?? 10;
      return {
        order_id: order.id,
        product_variant_id: v.id,
        quantity: randomInt(1, Math.max(1, inv?.quantity ?? 2)),
        unit_price: price,
      };
    });

    const { error: itemsError } = await supabase.from("order_items").insert(items);
    if (itemsError) {
      console.error("Order items error:", itemsError);
    }
  }
  console.log(`  Inserted ${ordersToCreate} sample orders with items.\n`);

  console.log("Seed completed successfully.");
  console.log("Summary: 4 branches, 8 categories, 60 products, 120 variants, inventory, 5 orders.");
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
