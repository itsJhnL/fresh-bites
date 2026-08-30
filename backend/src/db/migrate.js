require("dotenv").config();
const fs = require("fs");
const path = require("path");
const pool = require("./pool");

async function migrate() {
  const sqlPath = path.join(__dirname, "..", "..", "migrations", "001_init.sql");
  const sql = fs.readFileSync(sqlPath, "utf8");

  console.log("Running migration: 001_init.sql");
  await pool.query(sql);
  console.log("Migration complete.");
  await pool.end();
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
