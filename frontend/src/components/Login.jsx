import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PAGE_WRAP = "mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center px-4 py-12";
const CARD = "w-full rounded-xl border border-cream-200 bg-cream-50 p-8 shadow-card";
const WORDMARK = "mb-6 block text-center font-display text-2xl italic text-terracotta-500";
const LABEL = "mb-1 block text-sm font-semibold text-ink-700";
const INPUT =
  "w-full rounded-lg border border-cream-300 px-3 py-2 text-sm text-ink-900 outline-none focus:border-terracotta-500";
const PRIMARY_BUTTON =
  "w-full rounded-lg bg-terracotta-500 px-4 py-2.5 text-sm font-semibold text-cream-50 transition hover:bg-terracotta-600 disabled:cursor-not-allowed disabled:opacity-60";
const SECONDARY_LINK = "text-sm font-semibold text-ink-700 transition hover:text-terracotta-500";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, isAuthenticated, login, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get("redirect") || "/";

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter email and password.");
      return;
    }

    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate(redirectPath);
    } catch (err) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (isAuthenticated) {
    return (
      <div className={PAGE_WRAP}>
        <div className={CARD}>
          <Link to="/" className={WORDMARK}>
            Fresh Bites
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-ink-900">You&apos;re logged in</h1>
            <p className="mt-2 text-sm text-ink-500">
              Signed in as{" "}
              <span className="font-semibold text-ink-700">{profile?.full_name || user.email}</span>
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-3">
            <button type="button" onClick={() => navigate("/profile")} className={PRIMARY_BUTTON}>
              My Profile
            </button>
            <button
              type="button"
              onClick={() => navigate("/orders")}
              className="w-full rounded-lg border border-cream-300 px-4 py-2.5 text-sm font-semibold text-ink-700 transition hover:bg-cream-100"
            >
              My Orders
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={PAGE_WRAP}>
      <form onSubmit={handleLogin} className={CARD}>
        <Link to="/" className={WORDMARK}>
          Fresh Bites
        </Link>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-ink-900">Login</h1>
          <p className="mt-1 text-sm text-ink-500">Sign in to continue your order.</p>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className={LABEL} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={INPUT}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
          <div>
            <label className={LABEL} htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={INPUT}
              placeholder="Enter password"
              autoComplete="current-password"
            />
            <button type="button" onClick={() => navigate("/ForgotPassword")} className={`mt-2 ${SECONDARY_LINK}`}>
              Forgot password?
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <button type="submit" disabled={submitting} className={`mt-5 ${PRIMARY_BUTTON}`}>
          {submitting ? "Logging in..." : "Login"}
        </button>
        <button
          type="button"
          onClick={() => navigate(`/Register?redirect=${encodeURIComponent(redirectPath)}`)}
          className={`mt-4 block w-full text-center ${SECONDARY_LINK}`}
        >
          No account? Sign Up
        </button>
      </form>
    </div>
  );
}
