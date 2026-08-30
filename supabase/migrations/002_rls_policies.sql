-- FreshBite — Supabase migration 002: Row Level Security
--
-- Depends on: 001_initial_schema.sql (all tables must already exist).
-- Provides: is_admin() helper (defined here, not in 003_functions.sql,
-- specifically because these policies need it to exist first) + RLS enabled
-- and policies for every table + explicit table-level GRANTs.
--
-- Design notes:
--   * Postgres RLS is default-deny: a table with RLS enabled and NO policy
--     for a given command blocks that command entirely for non-owner roles.
--     orders, order_items and user_roles deliberately have NO client-facing
--     INSERT/UPDATE/DELETE policy (and, below, no such GRANT either) — every
--     write to those tables happens through a SECURITY DEFINER function in
--     003_functions.sql, which is owned by the table owner and therefore
--     bypasses RLS for its own internal writes. This is what makes
--     "the client can never control the final price/total/role" enforceable
--     at the database layer, not just in application code.
--   * None of these tables use `FORCE ROW LEVEL SECURITY` — that's
--     intentional. Forcing RLS would also block the table owner (and thus
--     our SECURITY DEFINER functions) from writing, which would break
--     create_order()/admin_update_order_status()/admin_set_user_role().
--   * Multiple permissive policies on the same command are OR'd together by
--     Postgres, which is how e.g. categories ends up "public sees active
--     rows OR admin sees everything" as two separate, readable policies
--     instead of one compound expression.

-- ============================================================================
-- is_admin() — the single source of truth for "is the current request from
-- an admin". SECURITY DEFINER + fixed search_path so it can't be tricked by
-- a hostile search_path, and so it works consistently even from inside other
-- tables' RLS policies. Only ever reads user_roles for auth.uid() — i.e. it
-- can only tell you about the CALLER's own role, never anyone else's.
-- ============================================================================
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ============================================================================
-- profiles
-- ============================================================================
alter table public.profiles enable row level security;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists profiles_select_admin on public.profiles;
create policy profiles_select_admin
  on public.profiles for select
  using (public.is_admin());

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

grant select, update on public.profiles to authenticated;

-- ============================================================================
-- user_roles — SELECT only. No INSERT/UPDATE/DELETE policy AND no such
-- GRANT below, for anyone, including admins acting directly on the table.
-- Role changes only happen via admin_set_user_role() (003_functions.sql).
-- ============================================================================
alter table public.user_roles enable row level security;

drop policy if exists user_roles_select_own on public.user_roles;
create policy user_roles_select_own
  on public.user_roles for select
  using (auth.uid() = user_id);

drop policy if exists user_roles_select_admin on public.user_roles;
create policy user_roles_select_admin
  on public.user_roles for select
  using (public.is_admin());

grant select on public.user_roles to authenticated;

-- ============================================================================
-- categories — public reads active rows; admin reads/writes everything.
-- ============================================================================
alter table public.categories enable row level security;

drop policy if exists categories_select_active on public.categories;
create policy categories_select_active
  on public.categories for select
  using (is_active = true);

drop policy if exists categories_select_admin on public.categories;
create policy categories_select_admin
  on public.categories for select
  using (public.is_admin());

drop policy if exists categories_admin_insert on public.categories;
create policy categories_admin_insert
  on public.categories for insert
  with check (public.is_admin());

drop policy if exists categories_admin_update on public.categories;
create policy categories_admin_update
  on public.categories for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists categories_admin_delete on public.categories;
create policy categories_admin_delete
  on public.categories for delete
  using (public.is_admin());

grant select on public.categories to anon, authenticated;
grant insert, update, delete on public.categories to authenticated;

-- ============================================================================
-- menu_items — same pattern as categories, keyed on is_available.
-- ============================================================================
alter table public.menu_items enable row level security;

drop policy if exists menu_items_select_available on public.menu_items;
create policy menu_items_select_available
  on public.menu_items for select
  using (is_available = true);

drop policy if exists menu_items_select_admin on public.menu_items;
create policy menu_items_select_admin
  on public.menu_items for select
  using (public.is_admin());

drop policy if exists menu_items_admin_insert on public.menu_items;
create policy menu_items_admin_insert
  on public.menu_items for insert
  with check (public.is_admin());

drop policy if exists menu_items_admin_update on public.menu_items;
create policy menu_items_admin_update
  on public.menu_items for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists menu_items_admin_delete on public.menu_items;
create policy menu_items_admin_delete
  on public.menu_items for delete
  using (public.is_admin());

grant select on public.menu_items to anon, authenticated;
grant insert, update, delete on public.menu_items to authenticated;

-- ============================================================================
-- menu_item_options — visible when the parent item is visible.
-- ============================================================================
alter table public.menu_item_options enable row level security;

drop policy if exists menu_item_options_select_public on public.menu_item_options;
create policy menu_item_options_select_public
  on public.menu_item_options for select
  using (
    exists (
      select 1 from public.menu_items mi
      where mi.id = menu_item_options.menu_item_id
        and mi.is_available = true
    )
  );

drop policy if exists menu_item_options_select_admin on public.menu_item_options;
create policy menu_item_options_select_admin
  on public.menu_item_options for select
  using (public.is_admin());

drop policy if exists menu_item_options_admin_insert on public.menu_item_options;
create policy menu_item_options_admin_insert
  on public.menu_item_options for insert
  with check (public.is_admin());

drop policy if exists menu_item_options_admin_update on public.menu_item_options;
create policy menu_item_options_admin_update
  on public.menu_item_options for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists menu_item_options_admin_delete on public.menu_item_options;
create policy menu_item_options_admin_delete
  on public.menu_item_options for delete
  using (public.is_admin());

grant select on public.menu_item_options to anon, authenticated;
grant insert, update, delete on public.menu_item_options to authenticated;

-- ============================================================================
-- addresses — fully owner-scoped, no admin access needed (delivery address
-- is snapshotted onto the order itself when one is placed).
-- ============================================================================
alter table public.addresses enable row level security;

drop policy if exists addresses_select_own on public.addresses;
create policy addresses_select_own
  on public.addresses for select
  using (auth.uid() = user_id);

drop policy if exists addresses_insert_own on public.addresses;
create policy addresses_insert_own
  on public.addresses for insert
  with check (auth.uid() = user_id);

drop policy if exists addresses_update_own on public.addresses;
create policy addresses_update_own
  on public.addresses for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists addresses_delete_own on public.addresses;
create policy addresses_delete_own
  on public.addresses for delete
  using (auth.uid() = user_id);

grant select, insert, update, delete on public.addresses to authenticated;

-- ============================================================================
-- orders — SELECT only for owner/admin. Deliberately NO insert/update/delete
-- policy AND no such GRANT below. See 003_functions.sql for create_order()
-- and admin_update_order_status().
-- ============================================================================
alter table public.orders enable row level security;

drop policy if exists orders_select_own on public.orders;
create policy orders_select_own
  on public.orders for select
  using (auth.uid() = user_id);

drop policy if exists orders_select_admin on public.orders;
create policy orders_select_admin
  on public.orders for select
  using (public.is_admin());

grant select on public.orders to authenticated;

-- ============================================================================
-- order_items — same pattern, scoped through the parent order's ownership.
-- ============================================================================
alter table public.order_items enable row level security;

drop policy if exists order_items_select_own on public.order_items;
create policy order_items_select_own
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and o.user_id = auth.uid()
    )
  );

drop policy if exists order_items_select_admin on public.order_items;
create policy order_items_select_admin
  on public.order_items for select
  using (public.is_admin());

grant select on public.order_items to authenticated;
