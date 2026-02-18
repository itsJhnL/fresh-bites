import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ShopContext = createContext(null);

export function ShopProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  const normalizeItem = useCallback(
    (item) => ({
      id: item.id,
      title: item.title || item.subtitle || "Food Item",
      price: item.price || "",
      imageURL: item.imageURL || "",
      mealType: item.mealType || null,
    }),
    []
  );

  const toggleFavorite = useCallback(
    (item) => {
      const normalized = normalizeItem(item);
      setFavorites((prev) => {
        const exists = prev.some((fav) => fav.id === normalized.id);
        if (exists) {
          return prev.filter((fav) => fav.id !== normalized.id);
        }

        return [...prev, normalized];
      });
    },
    [normalizeItem]
  );

  const isFavorite = useCallback(
    (id) => favorites.some((fav) => fav.id === id),
    [favorites]
  );

  const addToCart = useCallback(
    (item) => {
      const normalized = normalizeItem(item);
      setCartItems((prev) => {
        const existingItem = prev.find((cartItem) => cartItem.id === normalized.id);
        if (existingItem) {
          return prev.map((cartItem) =>
            cartItem.id === normalized.id
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          );
        }

        return [
          ...prev,
          {
            ...normalized,
            quantity: 1,
          },
        ];
      });
    },
    [normalizeItem]
  );

  const removeFromCart = useCallback((id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const increaseCartQuantity = useCallback((id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }, []);

  const decreaseCartQuantity = useCallback((id) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity - 1) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const value = useMemo(
    () => ({
      favorites,
      cartItems,
      favoritesCount: favorites.length,
      cartCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      toggleFavorite,
      isFavorite,
      addToCart,
      removeFromCart,
      increaseCartQuantity,
      decreaseCartQuantity,
      clearCart,
    }),
    [
      favorites,
      cartItems,
      toggleFavorite,
      isFavorite,
      addToCart,
      removeFromCart,
      increaseCartQuantity,
      decreaseCartQuantity,
      clearCart,
    ]
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
