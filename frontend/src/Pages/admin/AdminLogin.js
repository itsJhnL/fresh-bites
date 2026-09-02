import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useAuth } from "../../context/AuthContext";

// Same Supabase Auth used everywhere else in the app (see AuthContext) —
// this is not a second authentication system. What makes it "admin login"
// is that, after a normal sign-in, it checks the same is_admin()-backed
// `isAdmin` flag AdminRoute already uses, and refuses entry (with logout)
// if the authenticated account isn't an admin — real authorization, not
// just a differently-skinned login form.
export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isAdmin, loading, login, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);

  const redirectTo = new URLSearchParams(location.search).get("redirect") || "/admin";

  // isAdmin only settles to its real value once AuthContext's own
  // loadUserData has finished (see AuthContext.jsx) — a React state update
  // triggered inside handleSubmit isn't visible in that same function's
  // closure, so the redirect/reject decision lives here instead, driven by
  // the context's own settled state (same pattern ProtectedRoute/AdminRoute
  // already use).
  useEffect(() => {
    if (loading || !isAuthenticated) return;
    if (isAdmin) {
      navigate(redirectTo, { replace: true });
    }
  }, [loading, isAuthenticated, isAdmin, redirectTo, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmittingRef.current) return;
    if (!email.trim() || !password) {
      setError("Please enter email and password.");
      return;
    }

    isSubmittingRef.current = true;
    setSubmitting(true);
    setError("");
    try {
      await login(email.trim(), password);
      // Success/failure of the *admin* check itself is handled by the
      // effect above once context state settles — nothing else to do here.
    } catch (err) {
      setError(err.message || "Invalid email or password.");
    } finally {
      isSubmittingRef.current = false;
      setSubmitting(false);
    }
  };

  const handleNotAdminLogout = async () => {
    await logout();
    setError("");
  };

  if (isAuthenticated && !isAdmin && !loading) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center px-4 py-12">
        <div className="w-full rounded-xl border border-red-200 bg-red-50 p-8 text-center shadow-card">
          <h1 className="text-xl font-bold text-red-700">This account doesn't have admin access</h1>
          <p className="mt-2 text-sm text-red-600">
            You're signed in, but this account isn't an administrator on FreshBite.
          </p>
          <button
            type="button"
            onClick={handleNotAdminLogout}
            className="mt-5 rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
          >
            Sign out and try a different account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center px-4 py-12">
      <form onSubmit={handleSubmit} className="w-full rounded-xl border border-cream-200 bg-cream-50 p-8 shadow-card">
        <div className="text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-ink-900 text-cream-50">
            <LockOutlinedIcon fontSize="small" />
          </span>
          <h1 className="mt-4 text-2xl font-bold text-ink-900">Admin Login</h1>
          <p className="mt-1 text-sm text-ink-500">Sign in with your administrator account.</p>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-ink-700" htmlFor="admin-email">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-cream-300 px-3 py-2 text-sm outline-none focus:border-terracotta-500"
              placeholder="admin@freshbites.com"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-ink-700" htmlFor="admin-password">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-cream-300 px-3 py-2 text-sm outline-none focus:border-terracotta-500"
              placeholder="Enter password"
              autoComplete="current-password"
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-5 w-full rounded-lg bg-ink-900 px-4 py-2.5 text-sm font-semibold text-cream-50 transition hover:bg-ink-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
