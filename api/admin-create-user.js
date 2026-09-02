// Vercel serverless function (Node runtime) — the ONLY place in this project
// that ever touches the Supabase service-role key. It never reaches the
// browser: SUPABASE_SERVICE_ROLE_KEY is a plain (non REACT_APP_-prefixed)
// Vercel environment variable, so Create React App's build never inlines it
// into the frontend bundle. Plain fetch() against Supabase's REST/Auth Admin
// API is used instead of @supabase/supabase-js so this function has zero
// npm dependencies of its own to install/deploy.
//
// Flow:
//   1. Take the caller's own Supabase access token (sent by the browser,
//      the same session AdminUsers.js already has via useAuth()/supabase-js).
//   2. Resolve which user that token belongs to, then check THAT user's row
//      in user_roles is 'admin' — re-checked here, exactly like every RLS
//      policy and SECURITY DEFINER RPC elsewhere in this project. A stale or
//      forged client-side "isAdmin" belief is never trusted.
//   3. Only if that passes: create the new Supabase Auth user (pre-confirmed,
//      so no email delivery is required), promote it to role='admin' in
//      user_roles, and record the action in admin_activity_log.
//
// on_auth_user_created (see supabase/migrations/001_initial_schema.sql)
// still fires for step 3 like any other new auth.users row, so the new
// account gets its profiles row and a default 'customer' user_roles row
// automatically — this function's user_roles write immediately upgrades
// that to 'admin'.

function json(res, status, body) {
  res.status(status).json(body);
}

async function supabaseFetch(path, { method = "GET", serviceKey, body, extraHeaders } = {}) {
  const url = `${process.env.SUPABASE_URL}${path}`;
  const response = await fetch(url, {
    method,
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      ...extraHeaders,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }
  return { ok: response.ok, status: response.status, data };
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return json(res, 405, { error: "Method not allowed." });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    console.error("admin-create-user: missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env var.");
    return json(res, 500, { error: "Server is not configured for this action." });
  }

  const authHeader = req.headers.authorization || "";
  const callerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!callerToken) {
    return json(res, 401, { error: "Missing authorization." });
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }
  const fullName = (body?.fullName || "").trim();
  const email = (body?.email || "").trim().toLowerCase();
  const password = body?.password || "";

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json(res, 400, { error: "A valid email address is required." });
  }
  if (!password || password.length < 8) {
    return json(res, 400, { error: "Password must be at least 8 characters." });
  }

  // Step 1+2: resolve the caller and re-check their role server-side.
  const callerRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: { apikey: serviceKey, Authorization: `Bearer ${callerToken}` },
  });
  if (!callerRes.ok) {
    return json(res, 401, { error: "Your session is invalid or has expired. Please sign in again." });
  }
  const caller = await callerRes.json();

  const roleRes = await supabaseFetch(
    `/rest/v1/user_roles?user_id=eq.${caller.id}&select=role`,
    { serviceKey }
  );
  const callerRole = roleRes.data?.[0]?.role;
  if (!roleRes.ok || callerRole !== "admin") {
    return json(res, 403, { error: "Admin access required." });
  }

  // Step 3: create the account, pre-confirmed (no SMTP dependency).
  const createRes = await supabaseFetch("/auth/v1/admin/users", {
    method: "POST",
    serviceKey,
    body: {
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    },
  });

  if (!createRes.ok) {
    const message =
      createRes.data?.msg || createRes.data?.error_description || createRes.data?.error || "Could not create this account.";
    const friendly = /registered|already exists/i.test(message)
      ? "An account with this email already exists."
      : message;
    return json(res, createRes.status === 422 ? 409 : 400, { error: friendly });
  }

  const newUserId = createRes.data.id;

  // Promote to admin. on_auth_user_created already inserted a 'customer' row
  // for this user by the time admin.createUser's response returned (it runs
  // synchronously in the same transaction as the auth.users insert), so this
  // is an update via upsert, not a race against that trigger.
  const roleUpsertRes = await supabaseFetch("/rest/v1/user_roles", {
    method: "POST",
    serviceKey,
    body: { user_id: newUserId, role: "admin" },
    extraHeaders: { Prefer: "resolution=merge-duplicates" },
  });
  if (!roleUpsertRes.ok) {
    console.error("admin-create-user: failed to set role=admin for", newUserId, roleUpsertRes.data);
    return json(res, 500, {
      error: "Account was created but could not be granted admin access. Promote it manually from Users.",
    });
  }

  await supabaseFetch("/rest/v1/admin_activity_log", {
    method: "POST",
    serviceKey,
    body: {
      actor_user_id: caller.id,
      action: "admin_account_created",
      target_type: "user",
      target_id: newUserId,
      metadata: { email },
    },
  }).catch(() => {});

  return json(res, 200, { id: newUserId, email });
};
