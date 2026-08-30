import axios from "axios";

// NOTE: this client attaches the OLD Express JWT (localStorage "token"),
// which nothing sets anymore now that customer login/signup goes through
// Supabase Auth (src/context/AuthContext.jsx). Nothing in the app calls
// through this client anymore either — authApi, menuApi, ordersApi, and
// adminApi are all superseded by Supabase equivalents (see each file's own
// comment) and kept only as the Express backend's reference implementation,
// per instructions not to delete it yet.
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
