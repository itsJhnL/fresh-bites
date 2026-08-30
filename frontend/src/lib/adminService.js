import supabase from "./supabaseClient";
import { withTimeout } from "./withTimeout";

// Every write in this file targets tables/RPCs whose actual admin-only
// enforcement is Postgres RLS or a SECURITY DEFINER function that checks
// is_admin() itself (see supabase/migrations/002_rls_policies.sql,
// 003_functions.sql, 008_admin_list_users.sql) — never the fact that
// AdminRoute let the current user reach this page. A non-admin calling any
// of these directly gets rejected by the database, not just hidden by the UI.

const ADMIN_MENU_ITEM_COLUMNS =
  "id, category_id, name, slug, description, price, image_url, meal_type, " +
  "rating, preparation_time, is_available, is_featured, created_at, updated_at, " +
  "category:categories(id, name, slug)";

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ============================================================================
// Dashboard
// ============================================================================
export async function fetchDashboardStats() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [totalOrdersRes, todayOrdersRes, revenueRes, customersRes, availableMenuRes] = await withTimeout(
    Promise.all([
      supabase.from("orders").select("id", { count: "exact", head: true }),
      supabase.from("orders").select("id", { count: "exact", head: true }).gte("created_at", startOfToday.toISOString()),
      supabase.from("orders").select("total").neq("status", "cancelled"),
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("menu_items").select("id", { count: "exact", head: true }).eq("is_available", true),
    ])
  );

  const firstError = [totalOrdersRes, todayOrdersRes, revenueRes, customersRes, availableMenuRes].find(
    (res) => res.error
  )?.error;
  if (firstError) throw firstError;

  const revenue = (revenueRes.data || []).reduce((sum, order) => sum + Number(order.total), 0);

  return {
    totalOrders: totalOrdersRes.count || 0,
    todayOrders: todayOrdersRes.count || 0,
    revenue,
    customers: customersRes.count || 0,
    availableMenuItems: availableMenuRes.count || 0,
  };
}

// ============================================================================
// Menu items (admin CRUD) — RLS: menu_items_admin_insert/update/delete
// ============================================================================
export async function fetchAdminMenuItems() {
  const { data, error } = await withTimeout(
    supabase.from("menu_items").select(ADMIN_MENU_ITEM_COLUMNS).order("created_at", { ascending: false })
  );
  if (error) throw error;
  return data || [];
}

function menuItemPatch(payload) {
  const patch = {};
  if (payload.categoryId !== undefined) patch.category_id = payload.categoryId || null;
  if (payload.name !== undefined) patch.name = payload.name.trim();
  if (payload.slug !== undefined) patch.slug = (payload.slug || slugify(payload.name || "")).trim();
  if (payload.description !== undefined) patch.description = payload.description?.trim() || null;
  if (payload.price !== undefined) patch.price = Number(payload.price);
  if (payload.imageUrl !== undefined) patch.image_url = payload.imageUrl?.trim() || null;
  if (payload.mealType !== undefined) patch.meal_type = payload.mealType || null;
  if (payload.preparationTime !== undefined) {
    patch.preparation_time = payload.preparationTime === "" || payload.preparationTime == null
      ? null
      : Number(payload.preparationTime);
  }
  if (payload.isAvailable !== undefined) patch.is_available = Boolean(payload.isAvailable);
  if (payload.isFeatured !== undefined) patch.is_featured = Boolean(payload.isFeatured);
  return patch;
}

export async function createMenuItem(payload) {
  const row = menuItemPatch(payload);
  if (!row.slug) row.slug = slugify(payload.name || "");

  const { data, error } = await withTimeout(
    supabase.from("menu_items").insert(row).select(ADMIN_MENU_ITEM_COLUMNS).single()
  );
  if (error) throw error;
  return data;
}

export async function updateMenuItem(itemId, payload) {
  const { data, error } = await withTimeout(
    supabase.from("menu_items").update(menuItemPatch(payload)).eq("id", itemId).select(ADMIN_MENU_ITEM_COLUMNS).single()
  );
  if (error) throw error;
  return data;
}

export async function deleteMenuItem(itemId) {
  const { error } = await withTimeout(supabase.from("menu_items").delete().eq("id", itemId));
  if (error) throw error;
}

// ============================================================================
// Categories (admin CRUD) — RLS: categories_admin_insert/update/delete
// ============================================================================
export async function fetchAdminCategories() {
  const { data, error } = await withTimeout(
    supabase.from("categories").select("*").order("sort_order", { ascending: true })
  );
  if (error) throw error;
  return data || [];
}

export async function createCategory({ name, sortOrder }) {
  const { data, error } = await withTimeout(
    supabase
      .from("categories")
      .insert({ name: name.trim(), slug: slugify(name), sort_order: Number(sortOrder) || 0, is_active: true })
      .select()
      .single()
  );
  if (error) throw error;
  return data;
}

export async function updateCategoryActive(categoryId, isActive) {
  const { data, error } = await withTimeout(
    supabase.from("categories").update({ is_active: Boolean(isActive) }).eq("id", categoryId).select().single()
  );
  if (error) throw error;
  return data;
}

export async function deleteCategory(categoryId) {
  const { error } = await withTimeout(supabase.from("categories").delete().eq("id", categoryId));
  if (error) throw error;
}

// ============================================================================
// Orders (admin) — status changes go through admin_update_order_status()
// (see supabase/migrations/003_functions.sql), never a direct table write.
// ============================================================================
export async function fetchAdminOrders() {
  const { data: orders, error } = await withTimeout(
    supabase
      .from("orders")
      .select("id, order_number, status, payment_method, payment_status, total, created_at, user_id")
      .order("created_at", { ascending: false })
  );
  if (error) throw error;
  if (!orders || orders.length === 0) return [];

  // orders.user_id references auth.users, not profiles, so PostgREST can't
  // auto-embed profiles here (no direct FK) — a small manual merge instead
  // of changing the schema just for this admin list's convenience.
  const userIds = [...new Set(orders.map((order) => order.user_id))];
  const { data: profiles, error: profileError } = await withTimeout(
    supabase.from("profiles").select("id, full_name, phone").in("id", userIds)
  );
  if (profileError) throw profileError;

  const profileById = new Map((profiles || []).map((profile) => [profile.id, profile]));
  return orders.map((order) => ({
    ...order,
    customerName: profileById.get(order.user_id)?.full_name || "Unknown",
    customerPhone: profileById.get(order.user_id)?.phone || null,
  }));
}

export async function updateOrderStatus(orderId, status) {
  const { data, error } = await withTimeout(
    supabase.rpc("admin_update_order_status", {
      p_order_id: orderId,
      p_status: status,
    })
  );
  if (error) throw error;
  return data;
}

// ============================================================================
// Users (admin, read-only this phase) — see 008_admin_list_users.sql for
// exactly what is and isn't exposed.
// ============================================================================
export async function fetchAdminUsers() {
  const { data, error } = await withTimeout(supabase.rpc("admin_list_users"));
  if (error) throw error;
  return data || [];
}
