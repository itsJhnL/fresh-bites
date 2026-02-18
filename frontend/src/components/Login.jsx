import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const USERS_KEY = "freshBitesUsers";

const getUsers = () => {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const isLoggedIn = useMemo(
    () =>
      localStorage.getItem("isLoggedIn") === "true" ||
      Boolean(localStorage.getItem("token")),
    []
  );

  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get("redirect") || "/";
  const savedEmail = localStorage.getItem("userEmail") || "User";

  const handleLogin = (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (isSignUp) {
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      const users = getUsers();
      const exists = users.some((user) => user.email === email.trim().toLowerCase());
      if (exists) {
        setError("Account already exists. Please login instead.");
        return;
      }
      users.push({ email: email.trim().toLowerCase(), password });
      saveUsers(users);
    } else {
      const users = getUsers();
      if (users.length > 0) {
        const user = users.find(
          (item) =>
            item.email === email.trim().toLowerCase() && item.password === password
        );
        if (!user) {
          setError("Invalid email or password.");
          return;
        }
      }
    }

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("token", `fresh-bites-${Date.now()}`);
    localStorage.setItem("userEmail", email.trim());

    navigate(redirectPath);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  if (isLoggedIn) {
    return (
      <div className="mx-auto w-full max-w-md rounded-2xl border border-[#e9e2d7] bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-[#00213F]">You are logged in</h2>
        <p className="mt-2 text-sm text-[#475569]">
          Signed in as <span className="font-semibold">{savedEmail}</span>
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="rounded-xl bg-[#667B68] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#556657]"
          >
            Go Home
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl border border-[#f0c9c9] px-4 py-2 text-sm font-semibold text-[#b42318] transition hover:bg-[#fff5f5]"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleLogin}
      className="mx-auto w-full max-w-md rounded-2xl border border-[#e9e2d7] bg-white p-6 shadow-sm"
    >
      <h2 className="text-2xl font-bold text-[#00213F]">Login</h2>
      <p className="mt-1 text-sm text-[#64748b]">
        {isSignUp
          ? "Create an account to continue."
          : "Sign in to continue your order."}
      </p>

      <div className="mt-5 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-semibold text-[#334155]" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-[#d5dde5] px-3 py-2 text-sm outline-none focus:border-[#667B68]"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label
            className="mb-1 block text-sm font-semibold text-[#334155]"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-[#d5dde5] px-3 py-2 text-sm outline-none focus:border-[#667B68]"
            placeholder="Enter password"
          />
        </div>
        {isSignUp && (
          <div>
            <label
              className="mb-1 block text-sm font-semibold text-[#334155]"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full rounded-lg border border-[#d5dde5] px-3 py-2 text-sm outline-none focus:border-[#667B68]"
              placeholder="Confirm password"
            />
          </div>
        )}
      </div>

      {error && <p className="mt-3 text-sm font-medium text-[#b42318]">{error}</p>}

      <button
        type="submit"
        className="mt-5 w-full rounded-xl bg-[#667B68] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#556657]"
      >
        {isSignUp ? "Sign Up" : "Login"}
      </button>
      <button
        type="button"
        onClick={() => {
          setIsSignUp((prev) => !prev);
          setError("");
          setPassword("");
          setConfirmPassword("");
        }}
        className="mt-3 w-full text-sm font-semibold text-[#435334] hover:text-[#FF785B]"
      >
        {isSignUp ? "Already have an account? Login" : "No account? Sign Up"}
      </button>
    </form>
  );
}
