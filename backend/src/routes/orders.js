const express = require("express");
const pool = require("../db/pool");
const { authenticate } = require("../middleware/auth");

const router = express.Router();
router.use(authenticate);

const SERVICE_FEE = 49;

function generateReference() {
  const now = new Date();
  const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
    now.getDate()
  ).padStart(2, "0")}`;
  const randomPart = Math.floor(100000 + Math.random() * 900000);
  return `FB-${datePart}-${randomPart}`;
}

// Create an order from the current cart. Prices are re-looked-up server-side
// from menu_items so a tampered client request can't set its own price.
router.post("/", async (req, res) => {
  const { items, paymentMethod } = req.body || {};

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Cart is empty." });
  }
  if (!paymentMethod || !["card", "wallet"].includes(paymentMethod)) {
    return res.status(400).json({ error: "Invalid payment method." });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const menuItemIds = items.map((item) => Number(item.id)).filter(Number.isInteger);
    if (menuItemIds.length !== items.length) {
      throw Object.assign(new Error("Invalid item id in cart."), { status: 400 });
    }

    const { rows: menuRows } = await client.query(
      `SELECT id, title, price FROM menu_items WHERE id = ANY($1::int[]) AND is_available = true`,
      [menuItemIds]
    );
    const menuById = new Map(menuRows.map((row) => [row.id, row]));

    let subtotal = 0;
    const resolvedItems = items.map((item) => {
      const menuItem = menuById.get(Number(item.id));
      if (!menuItem) {
        throw Object.assign(new Error(`Menu item ${item.id} is not available.`), { status: 400 });
      }
      const quantity = Number(item.quantity);
      if (!Number.isInteger(quantity) || quantity <= 0) {
        throw Object.assign(new Error("Invalid quantity."), { status: 400 });
      }
      subtotal += Number(menuItem.price) * quantity;
      return { menuItemId: menuItem.id, title: menuItem.title, price: menuItem.price, quantity };
    });

    const serviceFee = subtotal > 0 ? SERVICE_FEE : 0;
    const total = subtotal + serviceFee;
    const reference = generateReference();

    // NOTE: no real payment gateway is wired in here (none existed in the original
    // app either). This records the order as "completed" the same way the old
    // frontend simulated a successful payment. Before taking real payments, wire
    // this up to a PCI-compliant processor like Stripe/PayMongo and only mark the
    // order completed once that provider confirms the charge.
    const { rows: orderRows } = await client.query(
      `INSERT INTO orders (user_id, status, subtotal, service_fee, total, payment_method, payment_reference)
       VALUES ($1, 'completed', $2, $3, $4, $5, $6)
       RETURNING id, status, subtotal, service_fee AS "serviceFee", total, payment_method AS "paymentMethod", payment_reference AS "paymentReference", created_at AS "createdAt"`,
      [req.user.id, subtotal, serviceFee, total, paymentMethod, reference]
    );
    const order = orderRows[0];

    for (const item of resolvedItems) {
      await client.query(
        `INSERT INTO order_items (order_id, menu_item_id, title, price, quantity)
         VALUES ($1, $2, $3, $4, $5)`,
        [order.id, item.menuItemId, item.title, item.price, item.quantity]
      );
    }

    await client.query("COMMIT");
    res.status(201).json({ ...order, items: resolvedItems });
  } catch (err) {
    await client.query("ROLLBACK");
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    console.error("Create order error:", err);
    res.status(500).json({ error: "Could not place order." });
  } finally {
    client.release();
  }
});

router.get("/me", async (req, res) => {
  try {
    const { rows: orders } = await pool.query(
      `SELECT id, status, subtotal, service_fee AS "serviceFee", total, payment_method AS "paymentMethod",
              payment_reference AS "paymentReference", created_at AS "createdAt"
       FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
      [req.user.id]
    );

    if (orders.length === 0) {
      return res.json([]);
    }

    const orderIds = orders.map((o) => o.id);
    const { rows: items } = await pool.query(
      `SELECT order_id AS "orderId", title, price, quantity FROM order_items WHERE order_id = ANY($1::int[])`,
      [orderIds]
    );

    const itemsByOrder = new Map();
    for (const item of items) {
      if (!itemsByOrder.has(item.orderId)) itemsByOrder.set(item.orderId, []);
      itemsByOrder.get(item.orderId).push(item);
    }

    res.json(orders.map((order) => ({ ...order, items: itemsByOrder.get(order.id) || [] })));
  } catch (err) {
    console.error("Get my orders error:", err);
    res.status(500).json({ error: "Could not load orders." });
  }
});

module.exports = router;
