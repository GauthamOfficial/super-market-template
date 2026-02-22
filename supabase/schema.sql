-- Optional: run in Supabase SQL Editor to create tables for this template.
-- Safe to run; tables are created only if they don't exist.

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  price numeric(10,2) not null check (price >= 0),
  image_url text,
  category_id uuid references public.categories(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS: allow public read for products and categories (adjust for auth later)
alter table public.categories enable row level security;
alter table public.products enable row level security;

create policy "Categories are viewable by everyone"
  on public.categories for select using (true);

create policy "Products are viewable by everyone"
  on public.products for select using (true);

-- Optional: trigger to keep updated_at in sync
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();
