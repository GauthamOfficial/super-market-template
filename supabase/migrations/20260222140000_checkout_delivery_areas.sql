-- Optional: customer_name on orders + delivery_areas for checkout
-- Run after 20260222120000_multi_branch_supermarket_mvp.sql

alter table public.orders
  add column if not exists customer_name text;

create table if not exists public.delivery_areas (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  fee numeric(10, 2) not null default 0 check (fee >= 0),
  branch_id uuid references public.branches (id) on delete set null,
  created_at timestamptz not null default now()
);

create index idx_delivery_areas_branch_id on public.delivery_areas (branch_id);

alter table public.delivery_areas enable row level security;
create policy "Delivery areas readable by everyone"
  on public.delivery_areas for select using (true);
