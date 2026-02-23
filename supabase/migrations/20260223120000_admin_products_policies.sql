-- Allow admins (users in admin_users) to insert and update products and product_variants.
-- Without these, admin product save hits RLS and the update affects 0 rows, so
-- .select().single() returns no row and PostgREST throws "Cannot coerce the result to a single JSON object".

create policy "Admins can insert products"
  on public.products for insert
  with check (
    exists (select 1 from public.admin_users au where au.user_id = auth.uid())
  );

create policy "Admins can update products"
  on public.products for update
  using (
    exists (select 1 from public.admin_users au where au.user_id = auth.uid())
  )
  with check (
    exists (select 1 from public.admin_users au where au.user_id = auth.uid())
  );

create policy "Admins can insert product_variants"
  on public.product_variants for insert
  with check (
    exists (select 1 from public.admin_users au where au.user_id = auth.uid())
  );

create policy "Admins can update product_variants"
  on public.product_variants for update
  using (
    exists (select 1 from public.admin_users au where au.user_id = auth.uid())
  )
  with check (
    exists (select 1 from public.admin_users au where au.user_id = auth.uid())
  );
