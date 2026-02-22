-- Multi-branch supermarket e-commerce MVP
-- Run in Supabase SQL Editor or via: supabase db push
--
-- If you already have public.categories / public.products from the template,
-- drop them first (or run in a new project), as this schema uses
-- products.base_price + product_variants instead of a single product price.

-- Order status enum
create type public.order_status as enum (
  'pending',
  'packed',
  'dispatched',
  'completed',
  'cancelled'
);

-- Shared trigger for updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ---------------------------------------------------------------------------
-- branches: physical store locations
-- ---------------------------------------------------------------------------
create table if not exists public.branches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  phone text,
  timezone text default 'UTC',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_branches_is_active on public.branches (is_active);

-- ---------------------------------------------------------------------------
-- categories: product taxonomy (e.g. Dairy, Produce)
-- ---------------------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  description text,
  parent_id uuid references public.categories (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint categories_slug_unique unique (slug)
);

create index idx_categories_parent_id on public.categories (parent_id);
create index idx_categories_slug on public.categories (slug);

-- ---------------------------------------------------------------------------
-- products: base product (e.g. "Milk")
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories (id) on delete set null,
  name text not null,
  slug text not null,
  description text,
  image_url text,
  base_price numeric(10, 2) not null default 0 check (base_price >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint products_slug_unique unique (slug)
);

create index idx_products_category_id on public.products (category_id);
create index idx_products_slug on public.products (slug);
create index idx_products_is_active on public.products (is_active);

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- product_variants: size/unit variants (e.g. "1L Skim", "2L Full Fat")
-- ---------------------------------------------------------------------------
create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  name text not null,
  sku text not null,
  price numeric(10, 2) not null check (price >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint product_variants_sku_unique unique (sku)
);

create index idx_product_variants_product_id on public.product_variants (product_id);
create index idx_product_variants_sku on public.product_variants (sku);

drop trigger if exists product_variants_updated_at on public.product_variants;
create trigger product_variants_updated_at
  before update on public.product_variants
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- inventory: stock per branch per variant
-- ---------------------------------------------------------------------------
create table if not exists public.inventory (
  id uuid primary key default gen_random_uuid(),
  branch_id uuid not null references public.branches (id) on delete cascade,
  product_variant_id uuid not null references public.product_variants (id) on delete cascade,
  quantity int not null default 0 check (quantity >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint inventory_branch_variant_unique unique (branch_id, product_variant_id)
);

create index idx_inventory_branch_id on public.inventory (branch_id);
create index idx_inventory_product_variant_id on public.inventory (product_variant_id);

drop trigger if exists inventory_updated_at on public.inventory;
create trigger inventory_updated_at
  before update on public.inventory
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- orders: customer order (fulfilled by a branch)
-- ---------------------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  branch_id uuid not null references public.branches (id) on delete restrict,
  order_number text not null,
  status public.order_status not null default 'pending',
  customer_email text not null,
  customer_phone text,
  delivery_address text,
  user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint orders_order_number_unique unique (order_number)
);

create index idx_orders_branch_id on public.orders (branch_id);
create index idx_orders_status on public.orders (status);
create index idx_orders_created_at on public.orders (created_at desc);
create index idx_orders_customer_email on public.orders (customer_email);
create index idx_orders_user_id on public.orders (user_id);

drop trigger if exists orders_updated_at on public.orders;
create trigger orders_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- order_items: line items (variant + qty + snapshot price)
-- ---------------------------------------------------------------------------
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_variant_id uuid not null references public.product_variants (id) on delete restrict,
  quantity int not null check (quantity >= 0),
  unit_price numeric(10, 2) not null check (unit_price >= 0),
  created_at timestamptz not null default now()
);

create index idx_order_items_order_id on public.order_items (order_id);
create index idx_order_items_product_variant_id on public.order_items (product_variant_id);

-- ---------------------------------------------------------------------------
-- admin_users: which auth users can manage which branches (optional)
-- ---------------------------------------------------------------------------
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  branch_id uuid references public.branches (id) on delete cascade,
  role text not null default 'admin' check (role in ('admin', 'manager', 'viewer')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint admin_users_user_branch_unique unique (user_id, branch_id)
);

comment on column public.admin_users.branch_id is 'Null = super admin (all branches); set = scoped to that branch';

create index idx_admin_users_user_id on public.admin_users (user_id);
create index idx_admin_users_branch_id on public.admin_users (branch_id);

drop trigger if exists admin_users_updated_at on public.admin_users;
create trigger admin_users_updated_at
  before update on public.admin_users
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS: enable and basic policies (extend per your auth rules)
-- ---------------------------------------------------------------------------
alter table public.branches enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.inventory enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.admin_users enable row level security;

-- Public read for storefront (branches, categories, products, variants, inventory)
create policy "Branches readable by everyone"
  on public.branches for select using (true);

create policy "Categories readable by everyone"
  on public.categories for select using (true);

create policy "Products readable by everyone"
  on public.products for select using (true);

create policy "Product variants readable by everyone"
  on public.product_variants for select using (true);

create policy "Inventory readable by everyone"
  on public.inventory for select using (true);

-- Orders: users see own orders; service role can do all
create policy "Users can view own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Users can insert own orders"
  on public.orders for insert
  with check (auth.uid() = user_id or user_id is null);

-- Order items: readable with order access (simplified: allow read for order in same tenant)
create policy "Order items readable when order is readable"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
      and (o.user_id = auth.uid() or o.user_id is null)
    )
  );

create policy "Order items insert with order"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
      and (o.user_id = auth.uid() or o.user_id is null)
    )
  );

-- Admin: only listed admin_users can manage (use service role or add policies per role)
create policy "Admin users readable by authenticated"
  on public.admin_users for select
  using (auth.uid() = user_id);

-- Optional: generate order_number (run from app or trigger)
-- Example: branch_code + date + sequence, e.g. BR1-20260222-0001
