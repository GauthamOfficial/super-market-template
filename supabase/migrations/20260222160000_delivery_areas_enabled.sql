-- Add is_enabled to delivery_areas for checkout filtering
-- Run after 20260222140000_checkout_delivery_areas.sql

alter table public.delivery_areas
  add column if not exists is_enabled boolean not null default true;

alter table public.delivery_areas
  add column if not exists updated_at timestamptz not null default now();

create index if not exists idx_delivery_areas_is_enabled on public.delivery_areas (is_enabled);

-- Trigger to keep updated_at in sync
drop trigger if exists delivery_areas_updated_at on public.delivery_areas;
create trigger delivery_areas_updated_at
  before update on public.delivery_areas
  for each row execute function public.set_updated_at();
