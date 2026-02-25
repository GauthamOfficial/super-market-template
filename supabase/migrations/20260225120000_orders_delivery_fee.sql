-- Store delivery fee on the order so it appears on confirmation and admin.
alter table public.orders
  add column if not exists delivery_fee numeric(10, 2) not null default 0 check (delivery_fee >= 0);

comment on column public.orders.delivery_fee is 'Delivery charge in LKR (or store currency) when delivery_method is delivery; 0 for pickup.';
