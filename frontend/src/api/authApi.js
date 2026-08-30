import apiClient from "./client";

// SUPERSEDED: customer-facing auth now goes through Supabase Auth
// (see src/context/AuthContext.jsx and src/lib/supabaseClient.js). This
// file is kept, unused, as part of the Express backend that's still the
// reference implementation for parts of the app not yet migrated (order
// creation, the admin panel) — see backend/README.md for current status.
const authApi = {
  register: (payload) => apiClient.post("/auth/register", payload),
  login: (payload) => apiClient.post("/auth/login", payload),
  me: () => apiClient.get("/auth/me"),
};

export default authApi;
