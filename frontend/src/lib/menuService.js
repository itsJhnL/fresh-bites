import supabase from "./supabaseClient";
import { formatPeso } from "../utils/money";
import { withTimeout } from "./withTimeout";

// The one shape a raw menu_items row (with its embedded category) becomes
// for every card-rendering UI (Menu, HomePage's featured/popular sections).
// Kept here instead of duplicated per page.
export function toMenuCardItem(raw) {
  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    title: raw.name,
    description: raw.description,
    priceValue: Number(raw.price),
    price: formatPeso(Number(raw.price)),
    imageURL: raw.image_url || "",
    mealType: raw.meal_type || null,
    categoryName: raw.category?.name || null,
    categorySlug: raw.category?.slug || null,
    rating: raw.rating,
    isAvailable: raw.is_available,
    isFeatured: raw.is_featured,
    createdAt: raw.created_at,
  };
}

// Customer-facing menu reads. RLS already restricts these to
// is_active/is_available rows for anon+authenticated alike (see
// supabase/migrations/002_rls_policies.sql) — the explicit .eq() filters
// below are kept anyway as defense-in-depth and to make the intent obvious
// at the call site rather than relying purely on a policy the reader can't
// see from here.

export async function fetchCategories() {
  const { data, error } = await withTimeout(
    supabase
      .from("categories")
      .select("id, name, slug, description, image_url, sort_order")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
  );

  if (error) throw error;
  return data || [];
}

const MENU_ITEM_COLUMNS =
  "id, category_id, name, slug, description, price, image_url, meal_type, " +
  "rating, preparation_time, is_available, is_featured, created_at, " +
  "category:categories(id, name, slug)";

export async function fetchMenuItems() {
  const { data, error } = await withTimeout(
    supabase
      .from("menu_items")
      .select(MENU_ITEM_COLUMNS)
      .eq("is_available", true)
      .order("name", { ascending: true })
  );

  if (error) throw error;
  return data || [];
}

// Used by the Cart page to flag items that were added a while ago and have
// since become unavailable (or been removed). RLS only ever returns
// is_available=true rows to a non-admin caller, so any requested id that
// comes back missing here is — from the client's point of view — no longer
// purchasable, whether that's because it was marked unavailable or deleted.
export async function fetchAvailableItemIds(ids) {
  if (!ids || ids.length === 0) return [];

  const { data, error } = await withTimeout(
    supabase.from("menu_items").select("id").in("id", ids).eq("is_available", true)
  );

  if (error) throw error;
  return (data || []).map((row) => row.id);
}

// Used by reorder (src/lib/reorder.js) to re-derive CURRENT prices and
// option modifiers for previously-ordered items — order_items is a
// historical snapshot and must never be trusted for pricing on a new order.
export async function fetchMenuItemsByIds(ids) {
  if (!ids || ids.length === 0) return [];

  const { data, error } = await withTimeout(
    supabase
      .from("menu_items")
      .select(`${MENU_ITEM_COLUMNS}, options:menu_item_options(id, name, type, price_modifier, is_required)`)
      .in("id", ids)
      .eq("is_available", true)
  );

  if (error) throw error;
  return data || [];
}

export async function fetchMenuItemBySlug(slug) {
  const { data, error } = await withTimeout(
    supabase
      .from("menu_items")
      .select(
        `${MENU_ITEM_COLUMNS}, ingredients, options:menu_item_options(id, name, type, price_modifier, is_required, sort_order)`
      )
      .eq("slug", slug)
      .eq("is_available", true)
      .maybeSingle()
  );

  if (error) throw error;
  return data;
}
