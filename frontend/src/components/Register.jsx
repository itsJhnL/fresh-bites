import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";

const PAGE_WRAP = "mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center px-4 py-12";
const CARD = "w-full rounded-xl border border-cream-200 bg-cream-50 p-8 shadow-card";
const WORDMARK = "mb-6 block text-center font-display text-2xl italic text-terracotta-500";
const LABEL = "mb-1 block text-sm font-semibold text-ink-700";
const INPUT =
  "w-full rounded-lg border border-cream-300 px-3 py-2 text-sm text-ink-900 outline-none focus:border-terracotta-500";
const PRIMARY_BUTTON =
  "w-full rounded-lg bg-terracotta-500 px-4 py-2.5 text-sm font-semibold text-cream-50 transition hover:bg-terracotta-600 disabled:cursor-not-allowed disabled:opacity-60";
const SECONDARY_LINK = "text-sm font-semibold text-ink-700 transition hover:text-terracotta-500";

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [pendingConfirmation, setPendingConfirmation] = useState(false);

  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get("redirect") || "/";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const data = await signUp(name.trim(), email.trim(), password);

      // Supabase returns a user with an empty `identities` array (and no
      // error) when the email is already registered — this avoids leaking
      // which emails exist to an attacker, but we still want to tell a
      // genuine user what happened.
      if (Array.isArray(data?.user?.identities) && data.user.identities.length === 0) {
        setError("An account with this email already exists. Try logging in instead.");
        return;
      }

      if (!data?.session) {
        // Email confirmation is required before this account can log in.
        setPendingConfirmation(true);
        return;
      }

      navigate(redirectPath);
    } catch (err) {
      setError(err.message || "Could not create account.");
    } finally {
      setSubmitting(false);
    }
  };

  if (pendingConfirmation) {
    return (
      <div className={PAGE_WRAP}>
        <div className={`${CARD} text-center`}>
          <Link to="/" className={WORDMARK}>
            Fresh Bites
          </Link>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sage-100 text-sage-600">
            <MarkEmailReadOutlinedIcon />
          </div>
          <h1 className="text-2xl font-bold text-ink-900">Check your email</h1>
          <p className="mt-3 text-sm text-ink-700">
            We sent a confirmation link to <span className="font-semibold">{email.trim()}</span>. Confirm your
            email, then log in to continue.
          </p>
          <button
            type="button"
            onClick={() => navigate(`/User?redirect=${encodeURIComponent(redirectPath)}`)}
            className={`mt-6 ${PRIMARY_BUTTON}`}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={PAGE_WRAP}>
      <form onSubmit={handleSubmit} className={CARD}>
        <Link to="/" className={WORDMARK}>
          Fresh Bites
        </Link>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-ink-900">Sign Up</h1>
          <p className="mt-1 text-sm text-ink-500">Create an account to continue.</p>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className={LABEL} htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={INPUT}
              placeholder="Juan Dela Cruz"
              autoComplete="name"
            />
          </div>
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
              placeholder="At least 8 characters"
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className={LABEL} htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className={INPUT}
              placeholder="Confirm password"
              autoComplete="new-password"
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <button type="submit" disabled={submitting} className={`mt-5 ${PRIMARY_BUTTON}`}>
          {submitting ? "Creating account..." : "Sign Up"}
        </button>
        <button
          type="button"
          onClick={() => navigate(`/User?redirect=${encodeURIComponent(redirectPath)}`)}
          className={`mt-4 block w-full text-center ${SECONDARY_LINK}`}
        >
          Already have an account? Login
        </button>
      </form>
    </div>
  );
}
