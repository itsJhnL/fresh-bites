-- FreshBite — Supabase migration 005: menu_items.ingredients
--
-- Depends on: 001_initial_schema.sql (menu_items must already exist).
--
-- Additive only. The original schema (001) didn't include an ingredients
-- field even though the PRD's Food Details section calls for one — adding
-- it now that the Food Details page actually needs to render it.
-- Nullable: "ingredients if available" means many rows can legitimately
-- have none, which is a perfectly normal state, not missing data.

alter table public.menu_items
  add column if not exists ingredients text[];
