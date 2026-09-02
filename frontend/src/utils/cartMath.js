import { toNumber } from "./money";

// Fallback only — used before restaurant_settings has loaded (or if that
// fetch fails) so the cart still renders a sane total instead of ₱0.
// supabase/migrations/012_restaurant_settings.sql's create_order() RPC is
// the actual source of truth for what gets charged; this is DISPLAY only,
// same as the rest of this file.
export const DEFAULT_DELIVERY_FEE = 49;
export const MAX_QUANTITY_PER_ITEM = 50;

function priceOf(item) {
  return typeof item.priceValue === "number" ? item.priceValue : toNumber(item.price);
}

// The one place cart totals get computed. Menu, Cart, and Checkout all call
// this instead of each keeping their own reduce() — this output is for
// DISPLAY only; the create_order RPC recalculates everything authoritatively
// server-side (reading the same restaurant_settings.delivery_fee) and never
// trusts what the client sends.
export function calculateCartTotals(items, deliveryFee = DEFAULT_DELIVERY_FEE) {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + priceOf(item) * item.quantity, 0);
  const fee = subtotal > 0 ? deliveryFee : 0;
  const discount = 0;
  const total = subtotal + fee - discount;
  return { itemCount, subtotal, deliveryFee: fee, discount, total };
}
