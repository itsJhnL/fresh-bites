import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Warn loudly instead of letting createClient() throw and hard-crash the
  // whole app on import when no project is configured yet. Copy
  // frontend/.env.example to frontend/.env and fill in your project's URL +
  // anon (public) key — never the service role key, which must never reach
  // frontend code. Until then, Supabase calls will fail individually
  // (network/auth errors) rather than the app failing to boot at all.
  console.error(
    "Missing REACT_APP_SUPABASE_URL or REACT_APP_SUPABASE_ANON_KEY. " +
      "Copy frontend/.env.example to frontend/.env and fill them in."
  );
}

// Single shared client for the whole app — auth, database, everything goes
// through this instance so there's one source of truth for the session.
const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);

export default supabase;
