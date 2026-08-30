-- FreshBite — Supabase migration 004: seed data
--
-- Depends on: 001_initial_schema.sql (tables), 002_rls_policies.sql (this
-- runs as the table owner via the migration role, so RLS doesn't block it).
--
-- Per the agreed decision: this is a clean demo seed, NOT a migration of
-- historical rows from the existing Postgres/Express database. The 12
-- existing demo dishes (backend/src/db/seed.js) are recreated here with
-- real categories assigned; meal_type is kept as-is as a secondary filter.
-- A handful of new items are added so every category has at least one dish
-- (the old data had nothing in Salads/Desserts/Drinks).
--
-- NOTE on images: image_url is left NULL for every seeded row on purpose.
-- The old /menu/<name>.png paths referenced files that were already deleted
-- from frontend/public (see the earlier audit) — carrying those same
-- broken paths into the new database would just relocate the same bug.
-- Sourcing real images and wiring up a frontend placeholder/empty-image
-- state is later, frontend-side work; NULL here is the honest "no image
-- yet" state rather than a second copy of a 404.
--
-- Idempotent: ON CONFLICT (slug) DO NOTHING everywhere, safe to re-run.

-- ============================================================================
-- Categories
-- ============================================================================
insert into public.categories (name, slug, description, sort_order, is_active) values
  ('Burgers',  'burgers',  'Stacked, juicy, and always fresh off the grill.', 1, true),
  ('Pizza',    'pizza',    'Hand-tossed pies with generous toppings.',        2, true),
  ('Chicken',  'chicken',  'Roasted, grilled, and herb-marinated favorites.', 3, true),
  ('Pasta',    'pasta',    'Comfort-food classics, made fresh to order.',     4, true),
  ('Salads',   'salads',   'Crisp, light, and packed with flavor.',           5, true),
  ('Desserts', 'desserts', 'Something sweet to finish the meal.',             6, true),
  ('Drinks',   'drinks',   'Refreshing pairings for every dish.',             7, true)
on conflict (slug) do nothing;

-- ============================================================================
-- Menu items — existing demo dishes, remapped to a category + kept meal_type
-- ============================================================================
insert into public.menu_items (
  category_id, name, slug, description, price, meal_type,
  rating, preparation_time, is_available, is_featured
)
select
  c.id, v.name, v.slug, v.description, v.price, v.meal_type,
  v.rating, v.preparation_time, true, v.is_featured
from (values
  -- Chicken
  ('chicken', 'Lemon Herb Roasted Chicken', 'lemon-herb-roasted-chicken',
    'Whole roasted chicken marinated in lemon, garlic, and fresh herbs.',
    499.00, 'dinner', 4.7, 35, true),
  ('chicken', 'Roasted Chicken with Carrots', 'roasted-chicken-with-carrots',
    'Oven-roasted chicken served with honey-glazed carrots.',
    499.00, 'lunch', 4.5, 30, false),
  ('chicken', 'Roast Bites', 'roast-bites',
    'Bite-sized roasted chicken pieces, perfect for sharing.',
    399.00, 'lunch', 4.3, 20, false),
  ('chicken', 'Lemon Herb Chicken', 'lemon-herb-chicken',
    'Grilled chicken breast with a bright lemon-herb finish.',
    569.00, 'dinner', 4.6, 25, false),
  ('chicken', 'Roasted Chicken Legs', 'roasted-chicken-legs',
    'Crispy-skinned roasted chicken legs, seasoned and juicy.',
    199.00, 'dinner', 4.2, 25, false),
  -- Pizza
  ('pizza', 'Pizza Bites', 'pizza-bites',
    'Mini pizza bites loaded with cheese and toppings.',
    699.00, 'lunch', 4.4, 18, false),
  ('pizza', 'Strawchoco Pizza', 'strawchoco-pizza',
    'A sweet dessert pizza with strawberry and chocolate drizzle.',
    900.00, 'dinner', 4.1, 20, false),
  ('pizza', 'Margherita Pizza', 'margherita-pizza',
    'Classic Margherita with fresh basil and mozzarella.',
    499.00, 'lunch', 4.8, 18, true),
  -- Burgers
  ('burgers', 'Burger Bite King', 'burger-bite-king',
    'A hearty double-patty burger with all the fixings.',
    259.00, 'breakfast', 4.3, 15, false),
  ('burgers', 'Burger Overload', 'burger-overload',
    'Loaded burger stacked with bacon, cheese, and special sauce.',
    399.00, 'breakfast', 4.5, 18, false),
  -- Pasta
  ('pasta', 'Spaghetti Bolognese', 'spaghetti-bolognese',
    'Classic spaghetti in a slow-simmered meat sauce.',
    199.00, 'lunch', 4.4, 20, false),
  ('pasta', 'Meatballs Pasta', 'meatballs-pasta',
    'Pasta tossed in marinara with house-made meatballs.',
    199.00, 'dinner', 4.3, 22, false),
  -- Salads (new)
  ('salads', 'Garden Fresh Salad', 'garden-fresh-salad',
    'Mixed greens, cherry tomatoes, and a light vinaigrette.',
    249.00, 'lunch', 4.2, 10, false),
  ('salads', 'Caesar Salad with Grilled Chicken', 'caesar-salad-grilled-chicken',
    'Crisp romaine, parmesan, croutons, and grilled chicken breast.',
    329.00, 'lunch', 4.5, 12, false),
  -- Desserts (new)
  ('desserts', 'Chocolate Lava Cake', 'chocolate-lava-cake',
    'Warm chocolate cake with a molten center.',
    189.00, 'dinner', 4.8, 15, true),
  ('desserts', 'Mango Cheesecake', 'mango-cheesecake',
    'Creamy cheesecake topped with fresh mango.',
    199.00, 'dinner', 4.6, 10, false),
  -- Drinks (new)
  ('drinks', 'Iced Lemon Tea', 'iced-lemon-tea',
    'Refreshing house-brewed iced tea with lemon.',
    89.00, null, 4.4, 5, false),
  ('drinks', 'Fresh Calamansi Juice', 'fresh-calamansi-juice',
    'Freshly squeezed calamansi juice, lightly sweetened.',
    99.00, null, 4.3, 5, false)
) as v(category_slug, name, slug, description, price, meal_type, rating, preparation_time, is_featured)
join public.categories c on c.slug = v.category_slug
on conflict (slug) do nothing;

-- ============================================================================
-- menu_item_options — a small, useful example set on a couple of items so
-- the customization UI has something real to render later. Not exhaustive;
-- more can be added per-item through the admin panel once it's migrated.
-- ============================================================================
insert into public.menu_item_options (menu_item_id, name, type, price_modifier, is_required, sort_order)
select mi.id, o.name, o.type, o.price_modifier, o.is_required, o.sort_order
from (values
  ('margherita-pizza', 'Regular', 'size', 0.00, true, 1),
  ('margherita-pizza', 'Large', 'size', 150.00, true, 2),
  ('margherita-pizza', 'Extra Cheese', 'addon', 60.00, false, 3),
  ('margherita-pizza', 'Extra Sauce', 'addon', 30.00, false, 4),
  ('burger-bite-king', 'Add Bacon', 'addon', 40.00, false, 1),
  ('burger-bite-king', 'Extra Cheese', 'addon', 30.00, false, 2),
  ('burger-bite-king', 'No Onions', 'removal', 0.00, false, 3),
  ('caesar-salad-grilled-chicken', 'No Croutons', 'removal', 0.00, false, 1),
  ('caesar-salad-grilled-chicken', 'Extra Chicken', 'addon', 80.00, false, 2)
) as o(item_slug, name, type, price_modifier, is_required, sort_order)
join public.menu_items mi on mi.slug = o.item_slug
on conflict (menu_item_id, name) do nothing;

-- ============================================================================
-- Demo admin role
--
-- Deliberately NOT inserting a row into auth.users directly from SQL — doing
-- that bypasses GoTrue's own invariants (the linked identities row, tokens,
-- password handling) and is an unsupported anti-pattern that risks a broken
-- auth account. Real account creation has to go through Supabase Auth's own
-- signup flow (frontend work for a later phase).
--
-- What this does instead: if an account with this email already exists
-- (because someone has signed up through the app), promote it to admin.
-- If it doesn't exist yet, this is a safe no-op. Re-run this file any time
-- after the real signup happens and it will pick it up.
-- ============================================================================
do $$
declare
  v_admin_email constant text := 'admin@freshbites.com';
  v_admin_id uuid;
begin
  select id into v_admin_id from auth.users where email = v_admin_email;

  if v_admin_id is not null then
    insert into public.user_roles (user_id, role)
    values (v_admin_id, 'admin')
    on conflict (user_id) do update set role = 'admin';
  end if;
end;
$$;
