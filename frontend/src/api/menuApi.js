import apiClient from "./client";

// SUPERSEDED: customer-facing menu reads now go through Supabase
// (src/lib/menuService.js) — see backend/README.md for migration status.
const menuApi = {
  getMenu: () => apiClient.get("/menu"),
};

export default menuApi;
