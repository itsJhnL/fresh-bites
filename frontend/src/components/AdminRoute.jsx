import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return null;
  }

  // Not logged in at all -> the dedicated admin login, not the customer
  // /User page — same Supabase Auth underneath, distinct entry point.
  if (!isAuthenticated) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/admin/login?redirect=${redirect}`} replace />;
  }

  // Logged in but not an admin -> AdminLogin itself shows the "not an
  // admin" state (with a sign-out option) rather than silently bouncing
  // them home, which would look like a broken link with no explanation.
  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
