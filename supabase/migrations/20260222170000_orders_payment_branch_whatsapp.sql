-- Add payment_method to orders and whatsapp_phone to branches for WhatsApp order sharing
-- Run after 20260222160000_delivery_areas_enabled.sql (or 20260222140000)

alter table public.orders
  add column if not exists payment_method text;

alter table public.branches
  add column if not exists whatsapp_phone text;

comment on column public.orders.payment_method is 'e.g. cod, bank_transfer';
comment on column public.branches.whatsapp_phone is 'E.164 or national number for WhatsApp deep links (no +)';
