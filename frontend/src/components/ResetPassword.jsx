import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../lib/supabaseClient";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const PAGE_WRAP = "mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center px-4 py-12";
const CARD = "w-full rounded-xl border border-cream-200 bg-cream-50 p-8 shadow-card";
const WORDMARK = "mb-6 block text-center font-display text-2xl italic text-terracotta-500";
const LABEL = "mb-1 block text-sm font-semibold text-ink-700";
const INPUT =
  "w-full rounded-lg border border-cream-300 px-3 py-2 text-sm text-ink-900 outline-none focus:border-terracotta-500";
const PRIMARY_BUTTON =
  "w-full rounded-lg bg-terracotta-500 px-4 py-2.5 text-sm font-semibold text-cream-50 transition hover:bg-terracotta-600 disabled:cursor-not-allowed disabled:opacity-60";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [hasRecoverySession, setHasRecoverySession] = useState(null);

  useEffect(() => {
    // supabase-js parses the recovery token out of the URL automatically
    // (detectSessionInUrl, on by default) and establishes a short-lived
    // session for it — this just confirms that happened before we let the
    // user try to set a new password.
    supabase.auth.getSession().then(({ data }) => {
      setHasRecoverySession(Boolean(data.session));
    });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

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
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Could not reset your password. Please request a new link.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className={PAGE_WRAP}>
        <div className={`${CARD} text-center`}>
          <Link to="/" className={WORDMARK}>
            Fresh Bites
          </Link>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sage-100 text-sage-600">
            <CheckCircleOutlineIcon />
          </div>
          <h1 className="text-2xl font-bold text-ink-900">Password updated</h1>
          <p className="mt-3 text-sm text-ink-700">You can now continue using your account.</p>
          <button type="button" onClick={() => navigate("/")} className={`mt-6 ${PRIMARY_BUTTON}`}>
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (hasRecoverySession === false) {
    return (
      <div className={PAGE_WRAP}>
        <div className={`${CARD} text-center`}>
          <Link to="/" className={WORDMARK}>
            Fresh Bites
          </Link>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
            <ErrorOutlineIcon />
          </div>
          <h1 className="text-2xl font-bold text-ink-900">Link expired</h1>
          <p className="mt-3 text-sm text-ink-700">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <button type="button" onClick={() => navigate("/ForgotPassword")} className={`mt-6 ${PRIMARY_BUTTON}`}>
            Request New Link
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
          <h1 className="text-2xl font-bold text-ink-900">Reset Password</h1>
          <p className="mt-1 text-sm text-ink-500">Choose a new password for your account.</p>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className={LABEL} htmlFor="password">
              New Password
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
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className={INPUT}
              placeholder="Confirm new password"
              autoComplete="new-password"
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
          disabled={submitting || hasRecoverySession === null}
          className={`mt-5 ${PRIMARY_BUTTON}`}
        >
          {submitting ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}
