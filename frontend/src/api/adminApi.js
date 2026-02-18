import apiClient from "./client";

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
