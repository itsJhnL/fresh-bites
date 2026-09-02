-- FreshBite — Supabase migration 010: menu-images storage bucket
--
-- Public bucket (menu photos are already public product images shown on
-- the storefront to anonymous visitors) with admin-only writes, enforced
-- the exact same way as every other admin-only write in this project:
-- is_admin(), not a client-side flag or a second parallel access-control
-- system. RLS is already enabled on storage.objects by default in a
-- Supabase project — this file only adds bucket-scoped policies to it,
-- the same pattern as 002_rls_policies.sql uses for ordinary tables.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'menu-images',
  'menu-images',
  true,
  5242880, -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

drop policy if exists menu_images_public_read on storage.objects;
create policy menu_images_public_read
  on storage.objects for select
  using (bucket_id = 'menu-images');

drop policy if exists menu_images_admin_insert on storage.objects;
create policy menu_images_admin_insert
  on storage.objects for insert
  with check (bucket_id = 'menu-images' and public.is_admin());

drop policy if exists menu_images_admin_update on storage.objects;
create policy menu_images_admin_update
  on storage.objects for update
  using (bucket_id = 'menu-images' and public.is_admin())
  with check (bucket_id = 'menu-images' and public.is_admin());

drop policy if exists menu_images_admin_delete on storage.objects;
create policy menu_images_admin_delete
  on storage.objects for delete
  using (bucket_id = 'menu-images' and public.is_admin());
