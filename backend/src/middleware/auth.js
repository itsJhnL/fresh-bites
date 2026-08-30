const { verifyToken } = require("../utils/jwt");
const pool = require("../db/pool");

/**
 * Requires a valid Bearer token. Attaches the current user (from DB, not just
 * the token payload) to req.user so role/status is always fresh.
 */
async function authenticate(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Missing or invalid Authorization header." });
  }

  try {
    const payload = verifyToken(token);
    const { rows } = await pool.query(
      "SELECT id, name, email, role FROM users WHERE id = $1",
      [payload.sub]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "User no longer exists." });
    }

    req.user = rows[0];
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
}

/** Requires authenticate() to have already run. */
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required." });
  }
  return next();
}

module.exports = { authenticate, requireAdmin };
