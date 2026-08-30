import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useCart } from "./CartContext";

const ShopContext = createContext(null);

// Cart state/logic lives in CartContext (src/context/CartContext.jsx) —
// that's the actual single source of truth for cart data, persistence, and
// calculations. This context just re-exposes it under the names existing
// call sites (Navbar, HomePage, Menu, FoodCard, FoodDetails) already use,
// so none of them needed to change, while favorites stays owned here since
// it's a separate concern from the cart rework this phase is about.
export function ShopProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const cart = useCart();

  const normalizeFavorite = useCallback(
    (item) => ({
      id: item.id,
      title: item.title || item.subtitle || item.name || "Food Item",
      price: item.price || "",
      imageURL: item.imageURL || item.image_url || "",
      mealType: item.mealType || null,
      slug: item.slug || null,
      description: item.description || null,
      categoryName: item.categoryName || null,
      rating: item.rating ?? null,
    }),
    []
  );

  const toggleFavorite = useCallback(
    (item) => {
      const normalized = normalizeFavorite(item);
      setFavorites((prev) => {
        const exists = prev.some((fav) => fav.id === normalized.id);
        if (exists) {
          return prev.filter((fav) => fav.id !== normalized.id);
        }

        return [...prev, normalized];
      });
    },
    [normalizeFavorite]
  );

  const isFavorite = useCallback(
    (id) => favorites.some((fav) => fav.id === id),
    [favorites]
  );

  const value = useMemo(
    () => ({
      favorites,
      favoritesCount: favorites.length,
      toggleFavorite,
      isFavorite,
      cartItems: cart.items,
      cartCount: cart.itemCount,
      addToCart: cart.addItem,
      removeFromCart: cart.removeItem,
      increaseCartQuantity: cart.increaseQuantity,
      decreaseCartQuantity: cart.decreaseQuantity,
      clearCart: cart.clearCart,
    }),
    [favorites, toggleFavorite, isFavorite, cart]
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used inside ShopProvider.");
  }

  return context;
}
