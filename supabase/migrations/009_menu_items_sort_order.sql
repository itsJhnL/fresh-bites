-- FreshBite — Supabase migration 009: menu_items sort_order
--
-- menu_items had no explicit display-order column (categories and
-- menu_item_options already do). Adding it so the admin CMS can offer real
-- "Control menu ordering" instead of only created_at/name ordering, and so
-- the customer-facing menu can respect that same order.
--
-- Backfilled from created_at so existing rows get a stable, sensible order
-- immediately rather than every item tying at 0 until an admin manually
-- re-sorts the whole menu by hand.

alter table public.menu_items
  add column if not exists sort_order int not null default 0;

-- One-time backfill, guarded so re-running this file never clobbers
-- sort_order an admin has since customized (only rows still at the
-- untouched default 0 get backfilled).
with ranked as (
  select id, (row_number() over (order by created_at asc) - 1) as rn
  from public.menu_items
)
update public.menu_items m
set sort_order = ranked.rn
from ranked
where m.id = ranked.id
  and m.sort_order = 0;

create index if not exists menu_items_sort_order_idx on public.menu_items (sort_order);
