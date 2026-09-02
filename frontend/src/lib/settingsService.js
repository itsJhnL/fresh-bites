import supabase from "./supabaseClient";
import { withTimeout } from "./withTimeout";

// restaurant_settings is a singleton row (id is a boolean PK that must be
// TRUE — see supabase/migrations/012_restaurant_settings.sql) so every read
// here just takes the first row rather than filtering by id.
const SETTINGS_COLUMNS =
  "restaurant_name, description, contact_email, contact_phone, address, " +
  "opening_hours, delivery_fee, logo_url, hero_image_url, updated_at";

// Publicly readable (restaurant_settings_select_public policy) — used by
// the customer-facing cart/checkout to price delivery, not just the admin
// Settings page.
export async function fetchRestaurantSettings() {
  const { data, error } = await withTimeout(
    supabase.from("restaurant_settings").select(SETTINGS_COLUMNS).eq("id", true).maybeSingle()
  );
  if (error) throw error;
  return data;
}

// Admin-only write (restaurant_settings_admin_update policy). The row
// already exists (seeded by the migration) so this is always an update,
// never an insert — the table has no insert policy for anyone.
export async function updateRestaurantSettings(patch) {
  const row = {};
  if (patch.restaurantName !== undefined) row.restaurant_name = patch.restaurantName.trim();
  if (patch.description !== undefined) row.description = patch.description?.trim() || null;
  if (patch.contactEmail !== undefined) row.contact_email = patch.contactEmail?.trim() || null;
  if (patch.contactPhone !== undefined) row.contact_phone = patch.contactPhone?.trim() || null;
  if (patch.address !== undefined) row.address = patch.address?.trim() || null;
  if (patch.openingHours !== undefined) row.opening_hours = patch.openingHours?.trim() || null;
  if (patch.deliveryFee !== undefined) row.delivery_fee = Number(patch.deliveryFee) || 0;
  if (patch.logoUrl !== undefined) row.logo_url = patch.logoUrl?.trim() || null;
  if (patch.heroImageUrl !== undefined) row.hero_image_url = patch.heroImageUrl?.trim() || null;

  const { data, error } = await withTimeout(
    supabase.from("restaurant_settings").update(row).eq("id", true).select(SETTINGS_COLUMNS).single()
  );
  if (error) throw error;
  return data;
}
