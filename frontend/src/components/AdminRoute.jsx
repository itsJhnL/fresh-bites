import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return null;
  }

  // Not logged in at all -> send to login.
  if (!isAuthenticated) {
    return <Navigate to="/User?redirect=/admin" replace />;
  }

  // Logged in but not an admin -> do NOT send them to login (they'd just bounce
  // right back here); send them home instead.
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
