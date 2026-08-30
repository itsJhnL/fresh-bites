import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../lib/supabaseClient";
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

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    setSubmitting(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/ResetPassword`,
      });
      if (resetError) throw resetError;
      // Supabase doesn't reveal whether the email exists — this same
      // "sent" state shows either way, which is the correct, safe behavior.
      setSent(true);
    } catch (err) {
      setError(err.message || "Could not send reset email. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
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
            If an account exists for <span className="font-semibold">{email.trim()}</span>, we sent a password
            reset link to it.
          </p>
          <button type="button" onClick={() => navigate("/User")} className={`mt-6 ${PRIMARY_BUTTON}`}>
            Back to Login
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
          <h1 className="text-2xl font-bold text-ink-900">Forgot Password</h1>
          <p className="mt-1 text-sm text-ink-500">
            Enter your email and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        <div className="mt-6">
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

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <button type="submit" disabled={submitting} className={`mt-5 ${PRIMARY_BUTTON}`}>
          {submitting ? "Sending..." : "Send Reset Link"}
        </button>
        <button
          type="button"
          onClick={() => navigate("/User")}
          className={`mt-4 block w-full text-center ${SECONDARY_LINK}`}
        >
          Back to Login
        </button>
      </form>
    </div>
  );
}
