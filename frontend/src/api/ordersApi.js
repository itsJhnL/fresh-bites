import apiClient from "./client";

// SUPERSEDED: order creation/history now go through Supabase
// (src/lib/orderService.js — create_order RPC, fetchMyOrders, etc.) — see
// backend/README.md for migration status.
const ordersApi = {
  createOrder: (payload) => apiClient.post("/orders", payload),
  getMyOrders: () => apiClient.get("/orders/me"),
};

export default ordersApi;
