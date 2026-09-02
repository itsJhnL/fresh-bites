import supabase from "./supabaseClient";
import { withTimeout } from "./withTimeout";

// Every write in this file targets tables/RPCs whose actual admin-only
// enforcement is Postgres RLS or a SECURITY DEFINER function that checks
// is_admin() itself (see supabase/migrations/002_rls_policies.sql,
// 003_functions.sql, 008_admin_list_users.sql) — never the fact that
// AdminRoute let the current user reach this page. A non-admin calling any
// of these directly gets rejected by the database, not just hidden by the UI.

// No separate image_path column — the storage path used to delete a
// replaced/removed image is deterministically recoverable from image_url
// itself (see storageService.pathFromPublicUrl), so a second column
// storing the same information redundantly wasn't added.
const ADMIN_MENU_ITEM_COLUMNS =
  "id, category_id, name, slug, description, price, image_url, meal_type, " +
  "rating, preparation_time, is_available, is_featured, sort_order, created_at, updated_at, " +
  "category:categories(id, name, slug)";

// Best-effort audit trail (see supabase/migrations/011_admin_management_hardening.sql)
// — actor_user_id defaults to auth.uid() on the DB side, so callers here
// only ever send what happened, never who. Never allowed to fail the
// caller's actual write: a lost log entry is a minor issue, a blocked menu
// edit because logging failed would not be.
async function logActivity(action, targetType, targetId, metadata = {}) {
  try {
    await supabase.from("admin_activity_log").insert({
      action,
      target_type: targetType,
      target_id: targetId != null ? String(targetId) : null,
      metadata,
    });
  } catch {
    // Non-fatal — see comment above.
  }
}

// actor_user_id references auth.users, not profiles, so PostgREST can't
// auto-embed a name the way fetchAdminOrders() embeds categories on
// menu_items — same manual-merge pattern as fetchAdminOrders() below.
export async function fetchRecentActivity(limit = 8) {
  const { data: rows, error } = await withTimeout(
    supabase
      .from("admin_activity_log")
      .select("id, actor_user_id, action, target_type, target_id, metadata, created_at")
      .order("created_at", { ascending: false })
      .limit(limit)
  );
  if (error) throw error;
  if (!rows || rows.length === 0) return [];

  const actorIds = [...new Set(rows.map((row) => row.actor_user_id).filter(Boolean))];
  if (actorIds.length === 0) return rows.map((row) => ({ ...row, actorName: "Unknown" }));

  const { data: profiles, error: profileError } = await withTimeout(
    supabase.from("profiles").select("id, full_name").in("id", actorIds)
  );
  if (profileError) throw profileError;

  const nameById = new Map((profiles || []).map((profile) => [profile.id, profile.full_name]));
  return rows.map((row) => ({ ...row, actorName: nameById.get(row.actor_user_id) || "Unknown" }));
}

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
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [
    totalOrdersRes,
    todayOrdersRes,
    revenueRes,
    totalUsersRes,
    adminsRes,
    availableMenuRes,
    totalMenuRes,
    unavailableMenuRes,
    categoriesRes,
    recentMenuRes,
  ] = await withTimeout(
    Promise.all([
      supabase.from("orders").select("id", { count: "exact", head: true }),
      supabase.from("orders").select("id", { count: "exact", head: true }).gte("created_at", startOfToday.toISOString()),
      supabase.from("orders").select("total").neq("status", "cancelled"),
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("user_roles").select("user_id", { count: "exact", head: true }).eq("role", "admin"),
      supabase.from("menu_items").select("id", { count: "exact", head: true }).eq("is_available", true),
      supabase.from("menu_items").select("id", { count: "exact", head: true }),
      supabase.from("menu_items").select("id", { count: "exact", head: true }).eq("is_available", false),
      supabase.from("categories").select("id", { count: "exact", head: true }),
      supabase.from("menu_items").select("id", { count: "exact", head: true }).gte("created_at", sevenDaysAgo.toISOString()),
    ])
  );

  const firstError = [
    totalOrdersRes,
    todayOrdersRes,
    revenueRes,
    totalUsersRes,
    adminsRes,
    availableMenuRes,
    totalMenuRes,
    unavailableMenuRes,
    categoriesRes,
    recentMenuRes,
  ].find((res) => res.error)?.error;
  if (firstError) throw firstError;

  const revenue = (revenueRes.data || []).reduce((sum, order) => sum + Number(order.total), 0);
  const totalUsers = totalUsersRes.count || 0;
  const administrators = adminsRes.count || 0;

  return {
    totalOrders: totalOrdersRes.count || 0,
    todayOrders: todayOrdersRes.count || 0,
    revenue,
    totalUsers,
    administrators,
    customers: Math.max(totalUsers - administrators, 0),
    availableMenuItems: availableMenuRes.count || 0,
    totalMenuItems: totalMenuRes.count || 0,
    inactiveMenuItems: unavailableMenuRes.count || 0,
    categoriesCount: categoriesRes.count || 0,
    recentMenuItems: recentMenuRes.count || 0,
  };
}

// ============================================================================
// Menu items (admin CRUD) — RLS: menu_items_admin_insert/update/delete
// ============================================================================
export async function fetchAdminMenuItems() {
  const { data, error } = await withTimeout(
    supabase.from("menu_items").select(ADMIN_MENU_ITEM_COLUMNS).order("sort_order", { ascending: true })
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
  if (payload.sortOrder !== undefined) {
    patch.sort_order = payload.sortOrder === "" || payload.sortOrder == null ? 0 : Number(payload.sortOrder);
  }
  return patch;
}

export async function createMenuItem(payload) {
  const row = menuItemPatch(payload);
  if (!row.slug) row.slug = slugify(payload.name || "");

  const { data, error } = await withTimeout(
    supabase.from("menu_items").insert(row).select(ADMIN_MENU_ITEM_COLUMNS).single()
  );
  if (error) throw error;
  logActivity("menu_item_created", "menu_item", data.id, { name: data.name });
  return data;
}

export async function updateMenuItem(itemId, payload) {
  const { data, error } = await withTimeout(
    supabase.from("menu_items").update(menuItemPatch(payload)).eq("id", itemId).select(ADMIN_MENU_ITEM_COLUMNS).single()
  );
  if (error) throw error;
  const action = payload.isAvailable !== undefined && Object.keys(payload).length === 1
    ? "menu_item_availability_changed"
    : "menu_item_updated";
  logActivity(action, "menu_item", itemId, { name: data.name, is_available: data.is_available });
  return data;
}

export async function deleteMenuItem(itemId) {
  const { error } = await withTimeout(supabase.from("menu_items").delete().eq("id", itemId));
  if (error) throw error;
  logActivity("menu_item_deleted", "menu_item", itemId);
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

export async function createCategory({ name, description, sortOrder }) {
  const { data, error } = await withTimeout(
    supabase
      .from("categories")
      .insert({
        name: name.trim(),
        slug: slugify(name),
        description: description?.trim() || null,
        sort_order: Number(sortOrder) || 0,
        is_active: true,
      })
      .select()
      .single()
  );
  if (error) throw error;
  logActivity("category_created", "category", data.id, { name: data.name });
  return data;
}

export async function updateCategoryActive(categoryId, isActive) {
  const { data, error } = await withTimeout(
    supabase.from("categories").update({ is_active: Boolean(isActive) }).eq("id", categoryId).select().single()
  );
  if (error) throw error;
  logActivity("category_updated", "category", categoryId, { name: data.name, is_active: data.is_active });
  return data;
}

// Used by the delete confirmation flow (AdminCategories.js) to refuse
// deleting a category that still has menu items pointing at it, rather than
// silently orphaning them — menu_items.category_id is ON DELETE SET NULL,
// so the database itself would allow it, but that's not what an admin
// clicking "Delete" on a populated category actually wants to happen.
export async function countMenuItemsInCategory(categoryId) {
  const { count, error } = await withTimeout(
    supabase.from("menu_items").select("id", { count: "exact", head: true }).eq("category_id", categoryId)
  );
  if (error) throw error;
  return count || 0;
}

// Full field edit (name/description/sort order) — updateCategoryActive
// above stays a separate, smaller call since the quick activate/deactivate
// toggle used throughout the category list doesn't need the rest of the
// edit form's validation/state around it.
export async function updateCategory(categoryId, { name, description, sortOrder }) {
  const patch = {};
  if (name !== undefined) {
    patch.name = name.trim();
    patch.slug = slugify(name);
  }
  if (description !== undefined) patch.description = description?.trim() || null;
  if (sortOrder !== undefined) patch.sort_order = sortOrder === "" || sortOrder == null ? 0 : Number(sortOrder);

  const { data, error } = await withTimeout(
    supabase.from("categories").update(patch).eq("id", categoryId).select().single()
  );
  if (error) throw error;
  logActivity("category_updated", "category", categoryId, { name: data.name });
  return data;
}

export async function deleteCategory(categoryId) {
  const { error } = await withTimeout(supabase.from("categories").delete().eq("id", categoryId));
  if (error) throw error;
  logActivity("category_deleted", "category", categoryId);
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
// Users — see 008/011_*.sql for exactly what is and isn't exposed.
// ============================================================================
export async function fetchAdminUsers() {
  const { data, error } = await withTimeout(supabase.rpc("admin_list_users"));
  if (error) throw error;
  return data || [];
}

// The ONLY way a role ever changes — admin_set_user_role() (see
// 011_admin_management_hardening.sql) re-checks is_admin() itself, refuses
// self-demotion, and refuses demoting the last remaining admin. This
// function is used for BOTH "Make Admin" and "Remove Admin Access" — same
// RPC, different p_role — the UI-side last-admin/self-lockout checks in
// AdminUsers.js are a friendlier pre-check, not the actual enforcement.
export async function setUserRole(userId, role) {
  const { error } = await withTimeout(supabase.rpc("admin_set_user_role", { p_user_id: userId, p_role: role }));
  if (error) throw error;
}

// Creating a new Supabase Auth user requires the service-role key, which
// must never reach the browser — this calls the Vercel serverless function
// at /api/admin-create-user (server-side only) instead of doing it here.
// See api/admin-create-user.js for the actual account creation + the
// server-side re-check that the CALLER is an admin before it does anything.
export async function createAdminAccount({ fullName, email, password }) {
  const { data: sessionData, error: sessionError } = await withTimeout(supabase.auth.getSession());
  if (sessionError) throw sessionError;
  const accessToken = sessionData?.session?.access_token;
  if (!accessToken) throw new Error("Your session has expired. Please sign in again.");

  const response = await fetch("/api/admin-create-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ fullName, email, password }),
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.error || "Could not create this administrator account.");
  }
  return body;
}
