require("dotenv").config();
const bcrypt = require("bcrypt");
const pool = require("./pool");

// Same dishes that used to be hardcoded in the frontend (src/data/data.js).
// This is the one-time move of that data into the database.
const dishes = [
  { title: "Lemon Herb Roasted Chicken", price: 499, imageUrl: "/menu/chicken1.png", mealType: "dinner" },
  { title: "Roasted Chicken with Carrots", price: 499, imageUrl: "/menu/chicken2.png", mealType: "lunch" },
  { title: "Roast Bites", price: 399, imageUrl: "/menu/chicken6.png", mealType: "lunch" },
  { title: "Lemon Herb Chicken", price: 569, imageUrl: "/menu/chicken3.png", mealType: "dinner" },
  { title: "Roasted Chicken Legs", price: 199, imageUrl: "/menu/chicken5.png", mealType: "dinner" },
  { title: "Pizza Bites", price: 699, imageUrl: "/menu/pizza1.png", mealType: "lunch" },
  { title: "Strawchoco Pizza", price: 900, imageUrl: "/menu/pizza3.png", mealType: "dinner" },
  { title: "Margherita Pizza", price: 499, imageUrl: "/menu/pizza2.png", mealType: "lunch" },
  { title: "Burger Bite King", price: 259, imageUrl: "/menu/burger1.png", mealType: "breakfast" },
  { title: "Burger Overload", price: 399, imageUrl: "/menu/burger2.png", mealType: "breakfast" },
  { title: "Spaghetti Bolognese", price: 199, imageUrl: "/menu/pasta.png", mealType: "lunch" },
  { title: "Meatballs Pasta", price: 199, imageUrl: "/menu/meatballs.png", mealType: "dinner" },
];

async function seed() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { rows: existing } = await client.query("SELECT COUNT(*)::int AS count FROM menu_items");
    if (existing[0].count === 0) {
      for (const dish of dishes) {
        await client.query(
          `INSERT INTO menu_items (title, price, image_url, meal_type)
           VALUES ($1, $2, $3, $4)`,
          [dish.title, dish.price, dish.imageUrl, dish.mealType]
        );
      }
      console.log(`Seeded ${dishes.length} menu items.`);
    } else {
      console.log("Menu items already exist, skipping menu seed.");
    }

    // Optional admin bootstrap account. Override via env vars, and change the
    // password immediately after first login.
    const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@freshbites.com";
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";

    const { rows: adminExists } = await client.query(
      "SELECT id FROM users WHERE email = $1",
      [adminEmail]
    );

    if (adminExists.length === 0) {
      const passwordHash = await bcrypt.hash(adminPassword, 12);
      await client.query(
        `INSERT INTO users (name, email, password_hash, role)
         VALUES ($1, $2, $3, 'admin')`,
        ["Admin", adminEmail, passwordHash]
      );
      console.log(`Created admin user: ${adminEmail} / ${adminPassword} (CHANGE THIS PASSWORD)`);
    } else {
      console.log("Admin user already exists, skipping.");
    }

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
