# Multi-branch supermarket schema & screen mapping

## 1) Schema overview

| Table | Purpose |
|-------|--------|
| **branches** | Store locations (name, address, phone, timezone, is_active). |
| **categories** | Product taxonomy; optional `parent_id` for subcategories. |
| **products** | Base product (name, slug, description, image, base_price, category). |
| **product_variants** | Variants per product (e.g. "1L Skim", "2L Full Fat") with `sku` and `price`. |
| **inventory** | Stock per branch per variant: `(branch_id, product_variant_id, quantity)`. |
| **orders** | Order header: branch, order_number, status, customer contact, optional user_id. |
| **order_items** | Line items: order_id, product_variant_id, quantity, unit_price (snapshot). |
| **admin_users** | Links auth.users to branch access; `branch_id` null = super admin. |

**Enum:** `order_status` = `pending` → `packed` → `dispatched` → `completed` | `cancelled`.

---

## 2) How each table maps to screens

### **branches**

- **Branch picker / selector**  
  List active branches (`is_active = true`) so the customer (or admin) chooses delivery/pickup branch.
- **Branch detail / info**  
  Single branch: name, address, phone, opening info (if you add it later).
- **Admin: Branch list & edit**  
  CRUD for branches; toggle `is_active` to hide a branch from the storefront.

---

### **categories**

- **Navigation / mega menu**  
  List categories (and optionally subcategories via `parent_id`) for filters and nav.
- **Category landing page**  
  e.g. `/categories/dairy`: products where `product.category_id` = that category.
- **Admin: Category management**  
  Tree or flat list; create/edit categories and set `parent_id` for hierarchy.

---

### **products**

- **Product listing / search**  
  List products (filter by category, branch availability). Join to **product_variants** and **inventory** to show “available at branch X” or “from $Y”.
- **Product detail page**  
  One product: name, description, image, category. Variants and prices come from **product_variants**; availability from **inventory** for the selected branch.
- **Admin: Product catalog**  
  CRUD products; set category, base_price, image_url, is_active.

---

### **product_variants**

- **Product detail: variant selector**  
  Dropdown or buttons (e.g. “1L Skim”, “2L Full Fat”) built from variants; price and stock come from variant + **inventory** for current branch.
- **Cart & checkout**  
  Cart stores `product_variant_id` (and optionally product_id for display). Checkout shows variant name, price, qty.
- **Admin: Variant management**  
  Per product: add/edit variants (name, sku, price); bulk or inline.

---

### **inventory**

- **Product detail: “In stock” / “Out of stock”**  
  For selected branch, sum or read `inventory.quantity` for that variant; show “In stock” / “Only X left” / “Out of stock”.
- **Cart: quantity limits**  
  Before add-to-cart or on change, check `inventory.quantity` for (branch, variant) and cap quantity.
- **Admin: Stock per branch**  
  Table/grid: rows = variants (or products), columns = branches, cells = quantity; edit and save to **inventory**.
- **Order fulfilment**  
  When marking an order packed/dispatched, optionally decrement **inventory** for that branch and variants (in app logic or trigger).

---

### **orders**

- **Checkout: create order**  
  Insert **orders** (branch_id, order_number, status = `pending`, customer_email, customer_phone, delivery_address, user_id if logged in).
- **Order confirmation / thank-you**  
  Show the created order (order_number, status, items summary).
- **My orders / order history**  
  List orders for `user_id = auth.uid()` (and optionally guest orders by email + token).
- **Admin: Order list**  
  Filter by branch, status, date; show order_number, customer, status, totals.
- **Admin: Order detail**  
  Single order: header (status, customer, branch, payment method) and line items; change **orders.status** (pending → packed → dispatched → completed / cancelled).
- **Order retention**  
  Completed orders stay in the database. Good practice: keep all orders for accounting, analytics, and support; do not delete. Use status (e.g. `completed`, `cancelled`) to filter. Soft-delete or archival is optional for very old data.

---

### **order_items**

- **Order confirmation & order history**  
  For each order, list **order_items** with product/variant name (from **product_variants** / **products**), quantity, unit_price, line total.
- **Admin: Order detail**  
  Same: show and edit line items if you support changes before fulfilment; **order_items** is the source of truth for what was ordered and at what price.

---

### **admin_users**

- **Admin: access control**  
  Who can log in to admin: only rows in **admin_users** for current `auth.uid()`. If `branch_id` is null, user sees all branches; else only that branch.
- **Super admin: manage staff**  
  Screen to add/remove **admin_users** (user_id, branch_id, role); used to gate admin UI and API by branch and role.

---

## 3) Screen → tables quick reference

| Screen | Main tables | Notes |
|--------|-------------|--------|
| Branch picker | branches | Filter `is_active`. |
| Category nav / landing | categories, products | Join product.category_id. |
| Product listing | products, product_variants, inventory, categories | Filter by category; availability by branch. |
| Product detail | products, product_variants, inventory | One product; variants and stock for selected branch. |
| Cart | product_variants, inventory | Store variant_id; check stock before checkout. |
| Checkout | orders, order_items, branches | Create order + items; optional user_id. |
| Order confirmation / history | orders, order_items, product_variants, products | Read-only for customer. |
| Admin – catalog | categories, products, product_variants | CRUD. |
| Admin – stock | inventory, branches, product_variants | Edit quantity per branch/variant. |
| Admin – orders | orders, order_items, branches | List and update status. |
| Admin – branches / staff | branches, admin_users | CRUD branches; assign admins. |

---

## 4) Running the migration

- **Supabase Dashboard:** SQL Editor → paste contents of `supabase/migrations/20260222120000_multi_branch_supermarket_mvp.sql` → Run.
- **CLI:** From project root, `supabase db push` (or `supabase migration up` if using local migrations).

If you already have the older `public.products` / `public.categories` from the template, you can either:

- Run this migration in a new project, or  
- Rename/backup the old tables, run this migration, then copy data into the new **products** / **categories** (and add **product_variants** and **inventory** as needed).
