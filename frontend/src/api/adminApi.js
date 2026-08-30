import apiClient from "./client";

// SUPERSEDED: the admin panel (src/Pages/admin/*) now reads/writes Supabase
// directly (src/lib/adminService.js) — dashboard stats, menu/category CRUD,
// order status, and the user list are all RLS/RPC-enforced there. This file
// is kept, unused, as part of the Express backend that remains the
// reference implementation until fully retired — see backend/README.md.
const adminApi = {
  getDashboardStats: () => apiClient.get("/admin/dashboard"),
  getOrders: () => apiClient.get("/admin/orders"),
  updateOrderStatus: (orderId, status) =>
    apiClient.patch(`/admin/orders/${orderId}`, { status }),
  getMenuItems: () => apiClient.get("/admin/menu"),
  createMenuItem: (payload) => apiClient.post("/admin/menu", payload),
  updateMenuItem: (itemId, payload) =>
    apiClient.patch(`/admin/menu/${itemId}`, payload),
  deleteMenuItem: (itemId) => apiClient.delete(`/admin/menu/${itemId}`),
  getUsers: () => apiClient.get("/admin/users"),
};

export default adminApi;
