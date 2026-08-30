-- FreshBite — Supabase migration 003: business-logic RPCs
--
-- Depends on: 001_initial_schema.sql (tables) and 002_rls_policies.sql
-- (is_admin(), and the fact that orders/order_items/user_roles have no
-- direct client write policy — these functions are the ONLY way those
-- tables get written to by app code).
--
-- All functions here are SECURITY DEFINER, owned by the migration role
-- (the table owner in a standard Supabase project), so their internal
-- writes bypass RLS by design — see the note at the top of
-- 002_rls_policies.sql about why FORCE ROW LEVEL SECURITY is deliberately
-- NOT used anywhere. Each function independently re-checks auth.uid()
-- and/or is_admin() itself; RLS bypass only ever applies to what the
-- function's own code decides to write, never to what the calling client
-- can ask it to do.

-- ============================================================================
-- create_order — the secure replacement for POST /api/orders in the
-- existing Express backend (backend/src/routes/orders.js). Same guarantees:
--   * price/name always comes from menu_items, never from the client
--   * atomic (a single function invocation is a single transaction; any
--     raised exception rolls back everything the function has done so far)
--   * cart must be non-empty, items must exist + be available, quantities
--     must be sane
--
-- p_items shape (jsonb array), e.g.:
--   [{"menu_item_id": "…uuid…", "quantity": 2}, {"menu_item_id": "…", "quantity": 1}]
-- "customizations" per line is optional and currently just stored as-is —
-- there's no server-side price impact yet since menu_item_options isn't
-- wired into pricing in this phase.
--
-- Duplicate menu_item_id entries in p_items are merged (quantities summed)
-- rather than rejected — a client accidentally sending the same item twice
-- shouldn't be a hard error, and the per-line quantity cap below is applied
-- AFTER merging so it can't be bypassed by splitting one large quantity
-- across several duplicate lines.
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
  v_delivery_fee constant numeric(10, 2) := 49.00;
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

  -- Parse, merge duplicate line items, and stage them in a temp table.
  -- Any malformed entry (bad uuid, non-numeric quantity, etc.) is caught
  -- here and turned into one friendly error instead of a raw Postgres
  -- cast-error message reaching the client.
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

  -- Every requested id must resolve to a currently-available menu item.
  select count(*)
    into v_missing_count
    from tmp_order_items toi
    left join public.menu_items mi
      on mi.id = toi.menu_item_id and mi.is_available = true
    where mi.id is null;

  if v_missing_count > 0 then
    raise exception 'One or more items are no longer available.' using errcode = '22023';
  end if;

  -- Authoritative pricing — always from menu_items, never from the client.
  select coalesce(sum(mi.price * toi.quantity), 0)
    into v_subtotal
    from tmp_order_items toi
    join public.menu_items mi on mi.id = toi.menu_item_id;

  v_discount := 0; -- no promo/discount engine yet; column reserved for future use
  v_total := v_subtotal + v_delivery_fee - v_discount;
  v_payment_status := case when p_payment_method = 'cod' then 'unpaid' else 'paid' end;

  -- order_number collisions are astronomically unlikely but handled anyway.
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
      null; -- retry with a new random suffix
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

-- ============================================================================
-- admin_update_order_status — the secure replacement for
-- PATCH /api/admin/orders/:id. Re-checks is_admin() itself; the caller's
-- own client-side "isAdmin" belief is never trusted (mirrors requireAdmin
-- in backend/src/middleware/auth.js, which re-fetches role from the DB on
-- every request instead of trusting the JWT payload).
-- ============================================================================
create or replace function public.admin_update_order_status(
  p_order_id uuid,
  p_status text
)
returns public.orders
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders;
begin
  if not public.is_admin() then
    raise exception 'Admin access required.' using errcode = '42501';
  end if;

  if p_status not in ('pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled') then
    raise exception 'Invalid order status.' using errcode = '22023';
  end if;

  update public.orders
    set status = p_status
    where id = p_order_id
    returning * into v_order;

  if v_order.id is null then
    raise exception 'Order not found.' using errcode = 'P0002';
  end if;

  return v_order;
end;
$$;

revoke all on function public.admin_update_order_status(uuid, text) from public;
grant execute on function public.admin_update_order_status(uuid, text) to authenticated;

-- ============================================================================
-- admin_set_user_role — the ONLY way any role in user_roles ever changes.
-- Refuses to let an admin change their own role (avoids an accidental
-- self-demotion/lockout); every other write path to user_roles is closed
-- off entirely at the RLS/grant level (see 002_rls_policies.sql).
-- ============================================================================
create or replace function public.admin_set_user_role(
  p_user_id uuid,
  p_role text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Admin access required.' using errcode = '42501';
  end if;

  if p_role not in ('customer', 'admin') then
    raise exception 'Invalid role.' using errcode = '22023';
  end if;

  if p_user_id = auth.uid() then
    raise exception 'Admins cannot change their own role.' using errcode = '42501';
  end if;

  insert into public.user_roles (user_id, role)
  values (p_user_id, p_role)
  on conflict (user_id) do update set role = excluded.role;
end;
$$;

revoke all on function public.admin_set_user_role(uuid, text) from public;
grant execute on function public.admin_set_user_role(uuid, text) to authenticated;
