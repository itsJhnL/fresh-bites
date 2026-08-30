import supabase from "./supabaseClient";
import { withTimeout } from "./withTimeout";

// The only path an order is ever created through — see
// supabase/migrations/003_functions.sql's create_order(). It re-validates
// everything server-side (auth, item availability, quantities) and
// recalculates subtotal/delivery/discount/total itself; the client cannot
// influence the final price by editing anything sent here.
export async function createOrder({ items, paymentMethod, deliveryAddress }) {
  const { data, error } = await withTimeout(
    supabase.rpc("create_order", {
      p_items: items,
      p_payment_method: paymentMethod,
      p_delivery_address: deliveryAddress,
    })
  );

  if (error) throw error;
  return data;
}

const ORDER_COLUMNS =
  "id, order_number, status, payment_method, payment_status, subtotal, delivery_fee, discount, total, " +
  "delivery_address, created_at, updated_at, " +
  "order_items(id, menu_item_id, item_name, unit_price, quantity, customizations, total_price)";

// RLS (orders_select_own / order_items_select_own, see
// 002_rls_policies.sql) is what actually enforces "only your own orders" —
// both of these will simply return null/empty for another user's order
// rather than needing any check here. That's deliberate: the trust
// boundary is the database, not a client-side guard on a route param.
export async function fetchOrderByNumber(orderNumber) {
  const { data, error } = await withTimeout(
    supabase.from("orders").select(ORDER_COLUMNS).eq("order_number", orderNumber).maybeSingle()
  );

  if (error) throw error;
  return data;
}

export async function fetchOrderById(id) {
  const { data, error } = await withTimeout(
    supabase.from("orders").select(ORDER_COLUMNS).eq("id", id).maybeSingle()
  );

  if (error) throw error;
  return data;
}

// See supabase/migrations/007_demo_order_progression.sql — a deliberately
// narrow demo-only RPC, not the admin status-update path.
export async function advanceOrderDemo(orderId) {
  const { data, error } = await withTimeout(
    supabase.rpc("demo_advance_order_status", { p_order_id: orderId })
  );
  if (error) throw error;
  return data;
}

// Order history list — lighter than ORDER_COLUMNS (no full delivery address
// snapshot) since the list view only needs enough to show and reorder each
// row; OrderDetails/OrderConfirmation fetch the full record when needed.
export async function fetchMyOrders(userId) {
  const { data, error } = await withTimeout(
    supabase
      .from("orders")
      .select(
        "id, order_number, status, payment_method, payment_status, total, created_at, " +
          "order_items(id, menu_item_id, item_name, quantity, customizations)"
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
  );

  if (error) throw error;
  return data || [];
}
