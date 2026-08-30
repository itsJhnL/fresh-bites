const express = require("express");
const bcrypt = require("bcrypt");
const rateLimit = require("express-rate-limit");
const pool = require("../db/pool");
const { signToken } = require("../utils/jwt");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

// Slow down brute-force / credential-stuffing attempts against login.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many attempts. Please try again later." },
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

router.post("/register", authLimiter, async (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !String(name).trim()) {
    return res.status(400).json({ error: "Name is required." });
  }
  if (!email || !EMAIL_RE.test(String(email).trim())) {
    return res.status(400).json({ error: "A valid email is required." });
  }
  if (!password || String(password).length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters." });
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  try {
    const { rows: existing } = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [normalizedEmail]
    );
    if (existing.length > 0) {
      // Same status/message either way to avoid confirming which emails exist... but
      // for a registration flow, telling the user "already registered" is standard UX,
      // so we accept that minor tradeoff here.
      return res.status(409).json({ error: "An account with this email already exists." });
    }

    const passwordHash = await bcrypt.hash(String(password), 12);
    const { rows } = await pool.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, 'customer')
       RETURNING id, name, email, role`,
      [String(name).trim(), normalizedEmail, passwordHash]
    );

    const user = rows[0];
    const token = signToken(user);
    return res.status(201).json({ token, user: publicUser(user) });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ error: "Could not create account." });
  }
});

router.post("/login", authLimiter, async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  try {
    const { rows } = await pool.query(
      "SELECT id, name, email, role, password_hash FROM users WHERE email = $1",
      [normalizedEmail]
    );

    // Deliberately generic error message — don't reveal whether the email exists.
    const genericError = { error: "Invalid email or password." };

    if (rows.length === 0) {
      return res.status(401).json(genericError);
    }

    const user = rows[0];
    const matches = await bcrypt.compare(String(password), user.password_hash);
    if (!matches) {
      return res.status(401).json(genericError);
    }

    const token = signToken(user);
    return res.json({ token, user: publicUser(user) });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Could not log in." });
  }
});

router.get("/me", authenticate, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

module.exports = router;
