import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { calculateCartTotals, MAX_QUANTITY_PER_ITEM } from "../utils/cartMath";
import { toNumber, formatPeso } from "../utils/money";

const CartContext = createContext(null);

// Guest and authenticated carts both persist here (localStorage). A
// database-backed cart was deliberately skipped per the "don't build
// unnecessary DB complexity unless a database cart is explicitly needed"
// call — this already satisfies "survives refresh / route changes / closing
// the browser" for both guest and logged-in users.
const STORAGE_KEY = "freshbite.cart.v1";

function readStoredCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isStoredItemShapeValid) : [];
  } catch {
    return [];
  }
}

function isStoredItemShapeValid(item) {
  return Boolean(item) && (typeof item.id === "string" || typeof item.id === "number") && Number.isFinite(item.quantity);
}

function clampQuantity(quantity) {
  const rounded = Math.floor(Number(quantity));
  if (!Number.isFinite(rounded)) return 0;
  return Math.min(Math.max(rounded, 0), MAX_QUANTITY_PER_ITEM);
}

// A cart LINE's identity is the menu item id plus which customizations were
// picked — not just the menu item id. Without this, adding "Margherita
// Pizza (Large)" and later "Margherita Pizza (Regular, Extra Cheese)" would
// collide on the same id and the second add would silently merge into the
// first, discarding its customizations instead of creating a second line.
// Uncustomized items keep a plain id (just the menu item id), so the common
// no-customization case is unaffected.
function buildCartLineId(menuItemId, customizations) {
  if (!customizations || customizations.length === 0) return String(menuItemId);
  const signature = customizations
    .map((option) => `${option.type}:${option.name}`)
    .sort()
    .join("|");
  return `${menuItemId}::${signature}`;
}

function normalizeItem(item, customizations = []) {
  const menuItemId = item.menuItemId || item.id;
  const name = item.name || item.title || item.subtitle || "Food Item";
  const normalizedCustomizations = Array.isArray(customizations) ? customizations : [];
  const basePrice = typeof item.priceValue === "number" ? item.priceValue : toNumber(item.price);
  const modifierTotal = normalizedCustomizations.reduce(
    (sum, option) => sum + (Number(option.price_modifier) || 0),
    0
  );
  const unitPrice = basePrice + modifierTotal;

  return {
    id: buildCartLineId(menuItemId, normalizedCustomizations),
    menuItemId,
    name,
    title: name,
    price: formatPeso(unitPrice),
    priceValue: unitPrice,
    imageURL: item.imageURL || item.image_url || "",
    slug: item.slug || null,
    description: item.description || null,
    categoryName: item.categoryName || null,
    mealType: item.mealType || null,
    rating: item.rating ?? null,
    customizations: normalizedCustomizations,
  };
}

// Guards what's allowed INTO the cart in the first place — invalid ids,
// items explicitly known to be unavailable, and non-finite/negative prices
// never make it into state. This is a display/UX guard only: the
// authoritative check happens again server-side in create_order(), which
// never trusts a client-submitted price either way.
function isAddable(item) {
  if (!item || (typeof item.id !== "string" && typeof item.id !== "number")) return false;
  if (item.isAvailable === false) return false;
  const price = typeof item.priceValue === "number" ? item.priceValue : toNumber(item.price);
  return Number.isFinite(price) && price >= 0;
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => readStoredCart());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage can fail (private browsing, quota exceeded) — the cart
      // still works for the rest of this session, it just won't survive a
      // refresh. Not worth surfacing as a user-facing error.
    }
  }, [items]);

  const addItem = useCallback((item, quantity = 1, customizations = []) => {
    if (!isAddable(item)) {
      return { ok: false, reason: item?.isAvailable === false ? "unavailable" : "invalid" };
    }
    const qty = clampQuantity(quantity);
    if (qty <= 0) return { ok: false, reason: "invalid-quantity" };

    const normalized = normalizeItem(item, customizations);
    setItems((prev) => {
      const existing = prev.find((cartItem) => cartItem.id === normalized.id);
      if (existing) {
        return prev.map((cartItem) =>
          cartItem.id === normalized.id
            ? { ...cartItem, quantity: clampQuantity(cartItem.quantity + qty) }
            : cartItem
        );
      }
      return [...prev, { ...normalized, quantity: qty }];
    });
    return { ok: true };
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // quantity <= 0 removes the item — same rule decreaseQuantity already
  // follows, so the two never disagree about what "zero" means.
  const setQuantity = useCallback((id, quantity) => {
    const qty = clampQuantity(quantity);
    if (qty <= 0) {
      setItems((prev) => prev.filter((item) => item.id !== id));
      return;
    }
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item)));
  }, []);

  const increaseQuantity = useCallback((id) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: clampQuantity(item.quantity + 1) } : item))
    );
  }, []);

  const decreaseQuantity = useCallback((id) => {
    setItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: clampQuantity(item.quantity - 1) } : item))
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totals = useMemo(() => calculateCartTotals(items), [items]);

  const value = useMemo(
    () => ({
      items,
      ...totals,
      addItem,
      removeItem,
      setQuantity,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
    }),
    [items, totals, addItem, removeItem, setQuantity, increaseQuantity, decreaseQuantity, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider.");
  }
  return context;
}
