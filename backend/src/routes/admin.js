const express = require("express");
const pool = require("../db/pool");
const { authenticate, requireAdmin } = require("../middleware/auth");

const router = express.Router();
router.use(authenticate, requireAdmin);

router.get("/dashboard", async (req, res) => {
  try {
    const [{ rows: orderStats }, { rows: userStats }] = await Promise.all([
      pool.query(`
        SELECT
          COUNT(*)::int AS "totalOrders",
          COUNT(*) FILTER (WHERE status = 'pending')::int AS "pendingOrders",
          COALESCE(SUM(total) FILTER (WHERE status != 'cancelled'), 0) AS "totalSalesRaw"
        FROM orders
      `),
      pool.query(`SELECT COUNT(*)::int AS "totalUsers" FROM users`),
    ]);

    const totalSales = Number(orderStats[0].totalSalesRaw || 0);

    res.json({
      totalOrders: orderStats[0].totalOrders,
      pendingOrders: orderStats[0].pendingOrders,
      totalUsers: userStats[0].totalUsers,
      totalSales: `P${totalSales.toFixed(2)}`,
    });
  } catch (err) {
    console.error("Admin dashboard error:", err);
    res.status(500).json({ error: "Could not load dashboard stats." });
  }
});

router.get("/orders", async (req, res) => {
  try {
    const { rows: orders } = await pool.query(`
      SELECT o.id, o.status, o.subtotal, o.service_fee AS "serviceFee", o.total,
             o.payment_method AS "paymentMethod", o.payment_reference AS "paymentReference",
             o.created_at AS "createdAt", u.name AS "customerName", u.email AS "customerEmail"
      FROM orders o
      JOIN users u ON u.id = o.user_id
      ORDER BY o.created_at DESC
    `);
    res.json(orders);
  } catch (err) {
    console.error("Admin get orders error:", err);
    res.status(500).json({ error: "Could not load orders." });
  }
});

const VALID_STATUSES = ["pending", "preparing", "out_for_delivery", "completed", "cancelled"];

router.patch("/orders/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body || {};

  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "Invalid order id." });
  }
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `Status must be one of: ${VALID_STATUSES.join(", ")}` });
  }

  try {
    const { rows } = await pool.query(
      `UPDATE orders SET status = $1 WHERE id = $2
       RETURNING id, status, subtotal, service_fee AS "serviceFee", total, payment_method AS "paymentMethod", created_at AS "createdAt"`,
      [status, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Order not found." });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Admin update order error:", err);
    res.status(500).json({ error: "Could not update order." });
  }
});

router.get("/users", async (req, res) => {
  try {
    // password_hash is intentionally never selected here.
    const { rows } = await pool.query(
      `SELECT id, name, email, role, created_at AS "createdAt" FROM users ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error("Admin get users error:", err);
    res.status(500).json({ error: "Could not load users." });
  }
});

module.exports = router;
