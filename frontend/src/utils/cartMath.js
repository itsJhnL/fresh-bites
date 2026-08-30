import { toNumber } from "./money";

// Flat delivery fee, matching supabase/migrations/003_functions.sql's
// create_order() v_delivery_fee constant. Discount is always 0 for now —
// there's no promo/discount engine yet, same as the backend RPC. Keep both
// in sync if either side ever changes.
export const DELIVERY_FEE = 49;
export const MAX_QUANTITY_PER_ITEM = 50;

function priceOf(item) {
  return typeof item.priceValue === "number" ? item.priceValue : toNumber(item.price);
}

// The one place cart totals get computed. Menu, Cart, and Checkout all call
// this instead of each keeping their own reduce() — this output is for
// DISPLAY only; the create_order RPC recalculates everything authoritatively
// server-side and never trusts what the client sends.
export function calculateCartTotals(items) {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + priceOf(item) * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? DELIVERY_FEE : 0;
  const discount = 0;
  const total = subtotal + deliveryFee - discount;
  return { itemCount, subtotal, deliveryFee, discount, total };
}
