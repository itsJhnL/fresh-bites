# Fresh Bites API

Express + PostgreSQL backend for Fresh Bites, with JWT + bcrypt authentication.

> **Migration status:** customer-facing authentication has moved to Supabase
> Auth (see `/supabase/migrations` and `frontend/src/context/AuthContext.jsx`).
> The routes below (`/api/auth/*`) are no longer called by the frontend but
> are kept as the reference implementation while the rest of the app —
> order creation, the admin panel — is migrated to Supabase in later phases.
> This server is not being deleted yet.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a Postgres database. Easiest options that work great with a Vercel-hosted frontend:
   - [Neon](https://neon.tech) — free tier, gives you a `DATABASE_URL` instantly
   - [Supabase](https://supabase.com) — same idea, also gives you a Postgres connection string

3. Copy the env file and fill it in:
   ```bash
   cp .env.example .env
   ```
   - `DATABASE_URL`: paste the connection string from Neon/Supabase
   - `JWT_SECRET`: generate one with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`
   - `CORS_ORIGIN`: your frontend's URL (e.g. `http://localhost:3000` for local dev, then your deployed frontend URL in production)

4. Run the migration to create tables:
   ```bash
   npm run migrate
   ```

5. Seed the menu (moves the old hardcoded dishes into the DB) and create a bootstrap admin account:
   ```bash
   npm run seed
   ```
   This prints the admin login it created (default `admin@freshbites.com` / `ChangeMe123!` unless you set `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` env vars first). **Log in and treat that password as temporary** — there's no "change password" UI yet, so for now the safest thing is to set your own `SEED_ADMIN_PASSWORD` before seeding rather than relying on the default.

6. Start the server:
   ```bash
   npm run dev    # auto-restarts on file changes
   # or
   npm start
   ```

The API runs on `http://localhost:5000` by default. Health check: `GET /api/health`.

## Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Create account |
| POST | `/api/auth/login` | — | Log in, get JWT |
| GET | `/api/auth/me` | Bearer token | Current user |
| GET | `/api/menu` | — | Public menu list |
| GET/POST/PATCH/DELETE | `/api/admin/menu` | Bearer token + admin | Manage menu items |
| POST | `/api/orders` | Bearer token | Place an order from cart |
| GET | `/api/orders/me` | Bearer token | Your order history |
| GET | `/api/admin/dashboard` | Bearer token + admin | Aggregate stats |
| GET | `/api/admin/orders` | Bearer token + admin | All orders |
| PATCH | `/api/admin/orders/:id` | Bearer token + admin | Update order status |
| GET | `/api/admin/users` | Bearer token + admin | All users (no password hashes) |

## Security notes

- Passwords are hashed with bcrypt (cost 12), never stored or logged in plaintext.
- JWTs are signed with `JWT_SECRET` and expire (`JWT_EXPIRES_IN`, default 7 days).
- All SQL uses parameterized queries — no string-concatenated SQL anywhere, so no injection risk from user input.
- Rate limiting is applied globally and more tightly on `/api/auth/*` to slow down brute-force attempts.
- `helmet` sets sensible security headers; CORS is locked to the origins you list in `CORS_ORIGIN`.
- Order totals are always recalculated server-side from the current `menu_items` prices — the client's cart is never trusted for pricing.
- **No real payment gateway is wired in.** Orders are marked `completed` immediately, same as the old frontend's fake payment simulation. Before accepting real money, integrate a PCI-compliant processor (Stripe, PayMongo, etc.) and only mark an order paid after that provider confirms the charge — never handle raw card numbers/CVVs in your own code.
