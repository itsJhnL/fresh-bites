const { Pool } = require("pg");

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not set. Copy .env.example to .env and fill it in."
  );
}

// Neon/Supabase require SSL. Allow opting out for a fully local Postgres install.
const useSSL = process.env.PGSSL !== "false";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: useSSL ? { rejectUnauthorized: false } : false,
});

pool.on("error", (err) => {
  // Log and keep the process alive; a single bad idle client shouldn't crash the server.
  console.error("Unexpected error on idle Postgres client", err);
});

module.exports = pool;
