# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Customers (guests and registered accounts) ordering food for delivery from a single restaurant. Guests may browse the menu, search, view food details, and add items to a cart; checkout requires an account. Registered customers additionally manage a profile, saved delivery addresses (with a default), order history, and reorder past orders. A separate admin role manages the menu, categories, and orders, and views the customer directory.

## Product Purpose

FreshBite is an online restaurant food-ordering application: browse a menu, customize and add dishes to a cart, check out with a demo payment, and track the resulting order through a simulated delivery pipeline. It exists as a functional demonstration of a production-style ordering experience — not a static mockup — built on Supabase (Auth, Postgres, Row Level Security). A legacy Express/Postgres backend is kept in the repo only as a reference implementation during migration, not as a second live system.

## Positioning

A single-restaurant ordering app that behaves like a real commercial platform end-to-end (search, customization, cart, demo checkout, order tracking, reorder) rather than a portfolio-style UI mockup — explicitly a demo, but one where every visible interaction is real and wired to a real backend.

## Operating Context

- **Customer flow:** Home → Menu (search / category / meal-type filter / sort) → Food Details (customization, quantity) → Cart → Checkout (delivery address + demo payment: Cash on Delivery / Demo Card / Demo E-Wallet) → Order Confirmation → Order Tracking (demo-simulated status timeline) → Order History → Reorder.
- **Account flow:** Supabase Auth (signup / login / logout / password reset), Profile (name, phone, avatar), saved delivery addresses.
- **Admin flow:** Dashboard stats, menu/category CRUD, order status management, read-only user directory — all authorized through Postgres RLS/RPC (`is_admin()`), never a client-side flag alone.

## Capabilities and Constraints

- Payment is explicitly **demo only** — no real payment provider is integrated, no real charge is ever made, and this must stay visibly labeled in the UI.
- Order pricing is always authoritative server-side (a Postgres RPC recalculates subtotal / delivery fee / discount / total from current menu prices); the client cart is never trusted for final pricing.
- Order statuses: `pending`, `confirmed`, `preparing`, `ready`, `out_for_delivery`, `delivered`, `cancelled` — progressed via a narrowly-scoped demo self-advance RPC, not real logistics.
- Menu items belong to a **category** (primary organization: Burgers, Pizza, Chicken, Pasta, Salads, Desserts, Drinks) and independently carry an optional **meal_type** (breakfast/lunch/dinner) as a secondary filter — both axes are kept, never merged into one.
- Reorder always re-derives current prices and availability from the live menu; it never reuses a historical order's snapshot pricing.
- The legacy Express-backed code remains in the repo as a reference implementation during the Supabase migration and must not be deleted.

## Brand Commitments

Name: FreshBite. No formal logo system beyond a placeholder chicken-illustration wordmark currently in the navbar; no photography library exists yet.

## Evidence on Hand

- No real food photography exists for menu items yet — every menu item currently renders a branded placeholder glyph in place of a photo. Future work must not fabricate or imply stock photography that isn't there.
- Demo menu, category, and seed data exist (Supabase migrations) but represent a fictional restaurant's placeholder content, not a real business's actual menu or pricing.
- No real customer testimonials exist; homepage review copy is placeholder and must not be presented as genuine.

## Product Principles

1. Every interactive element must be genuinely wired — no dead buttons, fake links, or decorative-only affordances.
2. The server (Postgres RLS/RPC) is the actual authority for pricing and authorization; the UI reflects that truth, it never substitutes for it.
3. Demo payment and demo order-tracking must always read as honest simulations, never disguised as real transactions or real logistics.
4. A redesign changes presentation, not the underlying flow or data contracts — preserve working functionality through visual change.

## Accessibility & Inclusion

Semantic HTML, keyboard navigation, visible focus states, labeled form fields, alt text, and `prefers-reduced-motion` support are existing product requirements, not new asks for this phase.
