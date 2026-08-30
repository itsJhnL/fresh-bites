const express = require("express");
const pool = require("../db/pool");
const { authenticate, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// Public: anyone can browse the menu, no login required.
router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, title, subtitle, price, image_url AS "imageUrl", meal_type AS "mealType"
       FROM menu_items
       WHERE is_available = true
       ORDER BY id ASC`
    );
    res.json(rows);
  } catch (err) {
    console.error("Get menu error:", err);
    res.status(500).json({ error: "Could not load menu." });
  }
});

// --- Admin-only management below ---
const adminRouter = express.Router();
adminRouter.use(authenticate, requireAdmin);

adminRouter.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, title, subtitle, price, image_url AS "imageUrl", meal_type AS "mealType", is_available AS "isAvailable"
       FROM menu_items
       ORDER BY id ASC`
    );
    res.json(rows);
  } catch (err) {
    console.error("Admin get menu error:", err);
    res.status(500).json({ error: "Could not load menu." });
  }
});

adminRouter.post("/", async (req, res) => {
  const { title, subtitle, price, imageUrl, mealType } = req.body || {};

  if (!title || !String(title).trim()) {
    return res.status(400).json({ error: "Title is required." });
  }
  const numericPrice = Number(price);
  if (!Number.isFinite(numericPrice) || numericPrice < 0) {
    return res.status(400).json({ error: "Price must be a non-negative number." });
  }
  if (mealType && !["breakfast", "lunch", "dinner"].includes(mealType)) {
    return res.status(400).json({ error: "Invalid meal type." });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO menu_items (title, subtitle, price, image_url, meal_type)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, title, subtitle, price, image_url AS "imageUrl", meal_type AS "mealType", is_available AS "isAvailable"`,
      [String(title).trim(), subtitle || null, numericPrice, imageUrl || null, mealType || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Create menu item error:", err);
    res.status(500).json({ error: "Could not create menu item." });
  }
});

adminRouter.patch("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "Invalid menu item id." });
  }

  const { title, subtitle, price, imageUrl, mealType, isAvailable } = req.body || {};

  if (price !== undefined && (!Number.isFinite(Number(price)) || Number(price) < 0)) {
    return res.status(400).json({ error: "Price must be a non-negative number." });
  }
  if (mealType && !["breakfast", "lunch", "dinner"].includes(mealType)) {
    return res.status(400).json({ error: "Invalid meal type." });
  }

  try {
    const { rows } = await pool.query(
      `UPDATE menu_items SET
         title = COALESCE($1, title),
         subtitle = COALESCE($2, subtitle),
         price = COALESCE($3, price),
         image_url = COALESCE($4, image_url),
         meal_type = COALESCE($5, meal_type),
         is_available = COALESCE($6, is_available)
       WHERE id = $7
       RETURNING id, title, subtitle, price, image_url AS "imageUrl", meal_type AS "mealType", is_available AS "isAvailable"`,
      [
        title ?? null,
        subtitle ?? null,
        price !== undefined ? Number(price) : null,
        imageUrl ?? null,
        mealType ?? null,
        isAvailable !== undefined ? Boolean(isAvailable) : null,
        id,
      ]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Menu item not found." });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Update menu item error:", err);
    res.status(500).json({ error: "Could not update menu item." });
  }
});

adminRouter.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "Invalid menu item id." });
  }

  try {
    const { rowCount } = await pool.query("DELETE FROM menu_items WHERE id = $1", [id]);
    if (rowCount === 0) {
      return res.status(404).json({ error: "Menu item not found." });
    }
    res.status(204).send();
  } catch (err) {
    console.error("Delete menu item error:", err);
    res.status(500).json({ error: "Could not delete menu item." });
  }
});

module.exports = { publicRouter: router, adminRouter };
