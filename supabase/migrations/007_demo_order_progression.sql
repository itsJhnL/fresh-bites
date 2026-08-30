-- FreshBite — Supabase migration 007: demo order status self-advance
--
-- Depends on: 001_initial_schema.sql (orders table), 002_rls_policies.sql
-- (orders has no direct client UPDATE policy/grant — this function and
-- admin_update_order_status() in 003_functions.sql are the only two ways
-- an order's status ever changes).
--
-- This is deliberately NOT admin_update_order_status(). That one lets an
-- admin set ANY status on ANY order. This one exists purely so the demo
-- tracking page has something to show progressing, and is scoped tightly
-- on purpose: the order's OWNER can advance their OWN order exactly one
-- step forward through the fixed pipeline — never skip ahead, never set an
-- arbitrary status, never touch someone else's order, and refuses once the
-- order is delivered or cancelled. It does not simulate real logistics —
-- it's a demo button, and the tracking UI says so.

create or replace function public.demo_advance_order_status(p_order_id uuid)
returns public.orders
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders;
  v_next_status text;
begin
  select * into v_order from public.orders where id = p_order_id;

  if v_order.id is null then
    raise exception 'Order not found.' using errcode = 'P0002';
  end if;

  if v_order.user_id <> auth.uid() then
    raise exception 'You can only update your own orders.' using errcode = '42501';
  end if;

  v_next_status := case v_order.status
    when 'pending' then 'confirmed'
    when 'confirmed' then 'preparing'
    when 'preparing' then 'ready'
    when 'ready' then 'out_for_delivery'
    when 'out_for_delivery' then 'delivered'
    else null
  end;

  if v_next_status is null then
    raise exception 'This order cannot be advanced any further.' using errcode = '22023';
  end if;

  update public.orders
    set status = v_next_status
    where id = p_order_id
    returning * into v_order;

  return v_order;
end;
$$;

revoke all on function public.demo_advance_order_status(uuid) from public;
grant execute on function public.demo_advance_order_status(uuid) to authenticated;
