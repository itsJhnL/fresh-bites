-- FreshBite — Supabase migration 001: initial schema
--
-- Depends on: nothing (first migration).
-- Provides: extensions, all core tables, enums-as-check-constraints, indexes,
-- unique constraints, and the generic `updated_at` trigger + the
-- `handle_new_user()` trigger that provisions a profile/role row for every
-- new auth.users signup.
--
-- Does NOT contain RLS policies (see 002_rls_policies.sql) or the
-- order-creation / admin RPCs (see 003_functions.sql) — those are kept in
-- separate files because they depend on things defined here.
--
-- Idempotent: safe to re-run (IF NOT EXISTS / OR REPLACE / DROP...CREATE
-- TRIGGER everywhere).

create extension if not exists pgcrypto;

-- ============================================================================
-- profiles — 1:1 with auth.users. Public-facing account info only.
-- Role is intentionally NOT stored here — see user_roles below.
-- ============================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- user_roles — kept separate from profiles on purpose. No client (not even
-- the owning user) ever gets an INSERT/UPDATE/DELETE grant on this table —
-- see 002_rls_policies.sql and 003_functions.sql's admin_set_user_role().
-- ============================================================================
create table if not exists public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- categories — primary menu organization (Burgers, Pizza, Chicken, ...).
-- ============================================================================
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists categories_is_active_idx on public.categories (is_active);

-- ============================================================================
-- menu_items — category_id is the primary organization axis; meal_type is a
-- secondary, independent filter (breakfast/lunch/dinner) and is NOT replaced
-- by categories per the agreed design.
-- ============================================================================
create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text,
  price numeric(10, 2) not null check (price >= 0),
  image_url text,
  meal_type text check (meal_type is null or meal_type in ('breakfast', 'lunch', 'dinner')),
  rating numeric(2, 1) check (rating is null or (rating >= 0 and rating <= 5)),
  preparation_time int check (preparation_time is null or preparation_time >= 0),
  is_available boolean not null default true,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists menu_items_category_id_idx on public.menu_items (category_id);
create index if not exists menu_items_is_available_idx on public.menu_items (is_available);
create index if not exists menu_items_meal_type_idx on public.menu_items (meal_type);
create index if not exists menu_items_is_featured_idx on public.menu_items (is_featured) where is_featured;

-- ============================================================================
-- menu_item_options — per-item customization (size / addon / removal).
-- Empty for now; seeded/used starting when the frontend gets customization UI.
-- ============================================================================
create table if not exists public.menu_item_options (
  id uuid primary key default gen_random_uuid(),
  menu_item_id uuid not null references public.menu_items(id) on delete cascade,
  name text not null,
  type text not null check (type in ('size', 'addon', 'removal')),
  price_modifier numeric(10, 2) not null default 0,
  is_required boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  unique (menu_item_id, name)
);

create index if not exists menu_item_options_menu_item_id_idx on public.menu_item_options (menu_item_id);

-- ============================================================================
-- addresses — user-owned delivery addresses.
-- ============================================================================
create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text,
  full_name text not null,
  phone text not null,
  address_line text not null,
  city text not null,
  postal_code text,
  delivery_notes text,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists addresses_user_id_idx on public.addresses (user_id);

-- Only one default address per user.
create unique index if not exists addresses_one_default_per_user
  on public.addresses (user_id)
  where is_default;

-- ============================================================================
-- orders — no direct client INSERT/UPDATE is ever granted (see 002/003).
-- All writes happen through create_order() / admin_update_order_status().
-- ============================================================================
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  order_number text not null unique,
  status text not null default 'pending' check (
    status in ('pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled')
  ),
  payment_method text not null check (payment_method in ('cod', 'demo_card', 'demo_ewallet')),
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid', 'paid', 'failed')),
  payment_reference text,
  subtotal numeric(10, 2) not null check (subtotal >= 0),
  delivery_fee numeric(10, 2) not null default 0 check (delivery_fee >= 0),
  discount numeric(10, 2) not null default 0 check (discount >= 0),
  total numeric(10, 2) not null check (total >= 0),
  delivery_address jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_user_id_idx on public.orders (user_id);
create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

-- ============================================================================
-- order_items — immutable snapshot of what was actually purchased.
-- item_name/unit_price are copied at order time and never updated afterward,
-- so later menu price/name changes never alter historical orders.
-- ============================================================================
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  menu_item_id uuid references public.menu_items(id) on delete set null,
  item_name text not null,
  unit_price numeric(10, 2) not null check (unit_price >= 0),
  quantity int not null check (quantity > 0),
  customizations jsonb not null default '[]'::jsonb,
  total_price numeric(10, 2) not null check (total_price >= 0)
);

create index if not exists order_items_order_id_idx on public.order_items (order_id);
create index if not exists order_items_menu_item_id_idx on public.order_items (menu_item_id);

-- ============================================================================
-- Generic updated_at trigger, applied to every table that has the column.
-- ============================================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists set_user_roles_updated_at on public.user_roles;
create trigger set_user_roles_updated_at
  before update on public.user_roles
  for each row execute function public.set_updated_at();

drop trigger if exists set_menu_items_updated_at on public.menu_items;
create trigger set_menu_items_updated_at
  before update on public.menu_items
  for each row execute function public.set_updated_at();

drop trigger if exists set_addresses_updated_at on public.addresses;
create trigger set_addresses_updated_at
  before update on public.addresses
  for each row execute function public.set_updated_at();

drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- ============================================================================
-- handle_new_user — provisions profiles + user_roles rows automatically for
-- every new Supabase Auth signup. SECURITY DEFINER because it must write to
-- tables the new user has no grants on yet at the moment they're created.
-- New accounts always start as 'customer' — promotion to 'admin' can only
-- happen later via admin_set_user_role() (see 003_functions.sql).
-- ============================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;

  insert into public.user_roles (user_id, role)
  values (new.id, 'customer')
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
