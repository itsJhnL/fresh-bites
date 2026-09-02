-- FreshBite — Supabase migration 012: restaurant_settings
--
-- Depends on: 001_initial_schema.sql (set_updated_at()), 002_rls_policies.sql
-- (is_admin()), 003_functions.sql (create_order(), redefined below to read
-- delivery_fee from here instead of a hardcoded constant).
--
-- Singleton table (id is a boolean primary key that must be TRUE — Postgres
-- guarantees at most one row can ever satisfy that) backing /admin/settings.
-- Only fields the app actually reads or displays somewhere are included:
--   * delivery_fee is real and load-bearing — create_order() now reads it,
--     replacing the constant that used to live only in that function (and
--     was duplicated, with a "keep in sync" comment, in cartMath.js).
--   * Everything else (restaurant identity/contact/hours/branding) is
--     informational, admin-editable, publicly readable — no currency field,
--     since the app hardcodes peso formatting everywhere (utils/money.js)
--     and a settings value wouldn't actually change that.

create table if not exists public.restaurant_settings (
  id boolean primary key default true check (id),
  restaurant_name text not null default 'FreshBite',
  description text,
  contact_email text,
  contact_phone text,
  address text,
  opening_hours text,
  delivery_fee numeric(10, 2) not null default 49.00 check (delivery_fee >= 0),
  logo_url text,
  hero_image_url text,
  updated_at timestamptz not null default now()
);

insert into public.restaurant_settings (id) values (true) on conflict (id) do nothing;

drop trigger if exists set_restaurant_settings_updated_at on public.restaurant_settings;
create trigger set_restaurant_settings_updated_at
  before update on public.restaurant_settings
  for each row execute function public.set_updated_at();

alter table public.restaurant_settings enable row level security;

-- Publicly readable: delivery_fee needs to be visible to anon/authenticated
-- carts before checkout, and contact/hours are ordinary public site content.
drop policy if exists restaurant_settings_select_public on public.restaurant_settings;
create policy restaurant_settings_select_public
  on public.restaurant_settings for select
  using (true);

drop policy if exists restaurant_settings_admin_update on public.restaurant_settings;
create policy restaurant_settings_admin_update
  on public.restaurant_settings for update
  using (public.is_admin())
  with check (public.is_admin());

-- No insert/delete policy or grant for anyone — the single row is seeded by
-- this migration and never needs to be created or removed by the app.
grant select on public.restaurant_settings to anon, authenticated;
grant update on public.restaurant_settings to authenticated;

-- ============================================================================
-- create_order — identical to 003_functions.sql's version except
-- v_delivery_fee is now read from restaurant_settings (falling back to 49.00
-- if the row is somehow missing) instead of being a hardcoded constant.
-- ============================================================================
create or replace function public.create_order(
  p_items jsonb,
  p_payment_method text,
  p_delivery_address jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_max_qty_per_item constant int := 50;
  v_delivery_fee numeric(10, 2);
  v_subtotal numeric(10, 2) := 0;
  v_discount numeric(10, 2) := 0;
  v_total numeric(10, 2) := 0;
  v_order_id uuid;
  v_order_number text;
  v_payment_status text;
  v_attempt int := 0;
  v_inserted boolean := false;
  v_missing_count int;
begin
  if v_user_id is null then
    raise exception 'Authentication required.' using errcode = '28000';
  end if;

  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'Your cart is empty.' using errcode = '22023';
  end if;

  if p_payment_method not in ('cod', 'demo_card', 'demo_ewallet') then
    raise exception 'Invalid payment method.' using errcode = '22023';
  end if;

  if p_delivery_address is null
    or coalesce(trim(p_delivery_address ->> 'full_name'), '') = ''
    or coalesce(trim(p_delivery_address ->> 'phone'), '') = ''
    or coalesce(trim(p_delivery_address ->> 'address_line'), '') = ''
    or coalesce(trim(p_delivery_address ->> 'city'), '') = ''
  then
    raise exception 'Delivery information is incomplete.' using errcode = '22023';
  end if;

  select coalesce((select delivery_fee from public.restaurant_settings limit 1), 49.00)
    into v_delivery_fee;

  begin
    create temporary table tmp_order_items on commit drop as
    select
      (elem ->> 'menu_item_id')::uuid as menu_item_id,
      sum((elem ->> 'quantity')::int) as quantity,
      (array_agg(coalesce(elem -> 'customizations', '[]'::jsonb) order by ord))[1] as customizations
    from jsonb_array_elements(p_items) with ordinality as t(elem, ord)
    group by (elem ->> 'menu_item_id')::uuid;
  exception when others then
    raise exception 'One or more cart items are invalid.' using errcode = '22023';
  end;

  if exists (select 1 from tmp_order_items where menu_item_id is null) then
    raise exception 'One or more cart items are invalid.' using errcode = '22023';
  end if;

  if exists (select 1 from tmp_order_items where quantity is null or quantity <= 0) then
    raise exception 'Item quantities must be greater than zero.' using errcode = '22023';
  end if;

  if exists (select 1 from tmp_order_items where quantity > v_max_qty_per_item) then
    raise exception 'Item quantity exceeds the maximum allowed per order (%).', v_max_qty_per_item
      using errcode = '22023';
  end if;

  select count(*)
    into v_missing_count
    from tmp_order_items toi
    left join public.menu_items mi
      on mi.id = toi.menu_item_id and mi.is_available = true
    where mi.id is null;

  if v_missing_count > 0 then
    raise exception 'One or more items are no longer available.' using errcode = '22023';
  end if;

  select coalesce(sum(mi.price * toi.quantity), 0)
    into v_subtotal
    from tmp_order_items toi
    join public.menu_items mi on mi.id = toi.menu_item_id;

  v_discount := 0;
  v_total := v_subtotal + v_delivery_fee - v_discount;
  v_payment_status := case when p_payment_method = 'cod' then 'unpaid' else 'paid' end;

  while v_attempt < 5 and not v_inserted loop
    v_attempt := v_attempt + 1;
    v_order_number := 'FB-' || to_char(now(), 'YYYYMMDD') || '-' || lpad(floor(random() * 1000000)::text, 6, '0');
    begin
      insert into public.orders (
        user_id, order_number, status, payment_method, payment_status,
        subtotal, delivery_fee, discount, total, delivery_address
      ) values (
        v_user_id, v_order_number, 'pending', p_payment_method, v_payment_status,
        v_subtotal, v_delivery_fee, v_discount, v_total, p_delivery_address
      )
      returning id into v_order_id;
      v_inserted := true;
    exception when unique_violation then
      null;
    end;
  end loop;

  if not v_inserted then
    raise exception 'Could not place your order. Please try again.' using errcode = '40001';
  end if;

  insert into public.order_items (order_id, menu_item_id, item_name, unit_price, quantity, customizations, total_price)
  select
    v_order_id,
    mi.id,
    mi.name,
    mi.price,
    toi.quantity,
    toi.customizations,
    mi.price * toi.quantity
  from tmp_order_items toi
  join public.menu_items mi on mi.id = toi.menu_item_id;

  return jsonb_build_object(
    'id', v_order_id,
    'order_number', v_order_number,
    'status', 'pending',
    'payment_status', v_payment_status,
    'subtotal', v_subtotal,
    'delivery_fee', v_delivery_fee,
    'discount', v_discount,
    'total', v_total
  );
end;
$$;

revoke all on function public.create_order(jsonb, text, jsonb) from public;
grant execute on function public.create_order(jsonb, text, jsonb) to authenticated;
