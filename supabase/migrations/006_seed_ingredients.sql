-- FreshBite — Supabase migration 006: demo ingredients for a few dishes
--
-- Depends on: 004_seed_data.sql (these slugs must already exist),
-- 005_menu_item_ingredients.sql (the column must already exist).
--
-- Deliberately NOT editing 004_seed_data.sql's original INSERT — once a
-- seed migration has shipped it stays as-is; new demo data gets its own
-- follow-up file. Only a representative handful of dishes get ingredients
-- here, on purpose — "ingredients if available" means partial coverage is
-- the realistic, expected state, not a gap to fill in for every row.

update public.menu_items set ingredients = array['Chicken', 'Lemon', 'Garlic', 'Rosemary', 'Thyme', 'Olive Oil']
  where slug = 'lemon-herb-roasted-chicken';

update public.menu_items set ingredients = array['Pizza Dough', 'Tomato Sauce', 'Fresh Mozzarella', 'Basil', 'Olive Oil']
  where slug = 'margherita-pizza';

update public.menu_items set ingredients = array['Beef Patty', 'Brioche Bun', 'Cheddar Cheese', 'Lettuce', 'Tomato', 'Onion', 'Special Sauce']
  where slug = 'burger-bite-king';

update public.menu_items set ingredients = array['Spaghetti', 'Ground Beef', 'Tomato Sauce', 'Onion', 'Garlic', 'Parmesan']
  where slug = 'spaghetti-bolognese';

update public.menu_items set ingredients = array['Romaine Lettuce', 'Grilled Chicken', 'Parmesan', 'Croutons', 'Caesar Dressing']
  where slug = 'caesar-salad-grilled-chicken';

update public.menu_items set ingredients = array['Dark Chocolate', 'Butter', 'Eggs', 'Sugar', 'Flour']
  where slug = 'chocolate-lava-cake';
