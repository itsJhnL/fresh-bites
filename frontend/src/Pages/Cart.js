import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Footer from "../components/Footer.jsx";
import FoodCard from "../components/FoodCard";
import PriceSummary from "../components/PriceSummary";
import EmptyState from "../components/EmptyState";
import Skeleton from "../components/Skeleton";
import { useCart } from "../context/CartContext";
import { useShop } from "../context/ShopContext";
import { useAuth } from "../context/AuthContext";
import { fetchAvailableItemIds } from "../lib/menuService";

export default function Cart() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { items, subtotal, deliveryFee, discount, total, removeItem, increaseQuantity, decreaseQuantity } =
    useCart();
  const { isFavorite, toggleFavorite } = useShop();

  const [unavailableIds, setUnavailableIds] = useState(() => new Set());
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  // Availability must be checked against the real menu_items.id
  // (item.menuItemId), never the cart-LINE id (item.id) — a customized line
  // gets a composite id like "<menuItemId>::<signature>" (see
  // CartContext's buildCartLineId) that never matches a real menu item, so
  // checking `item.id` here falsely flagged every customized cart line as
  // unavailable and silently disabled "Proceed to Checkout".
  const menuItemIds = useMemo(() => [...new Set(items.map((item) => item.menuItemId))], [items]);

  useEffect(() => {
    if (menuItemIds.length === 0) {
      setUnavailableIds(new Set());
      return undefined;
    }

    let active = true;
    setCheckingAvailability(true);
    fetchAvailableItemIds(menuItemIds)
      .then((availableIds) => {
        if (!active) return;
        const availableSet = new Set(availableIds);
        const unavailableLineIds = items
          .filter((item) => !availableSet.has(item.menuItemId))
          .map((item) => item.id);
        setUnavailableIds(new Set(unavailableLineIds));
      })
      .catch(() => {
        // Non-fatal — this is a display-only heads-up. If the check itself
        // fails, don't block the user from proceeding to checkout, where
        // create_order() will enforce availability authoritatively anyway.
      })
      .finally(() => {
        if (active) setCheckingAvailability(false);
      });

    return () => {
      active = false;
    };
  }, [menuItemIds, items]);

  const hasUnavailableItems = unavailableIds.size > 0;

  const handleRemoveUnavailable = () => {
    unavailableIds.forEach((id) => removeItem(id));
  };

  const handleProceedToCheckout = () => {
    if (items.length === 0 || hasUnavailableItems) return;
    if (!isAuthenticated) {
      setLoginDialogOpen(true);
      return;
    }
    navigate("/Order");
  };

  const handleProceedToLogin = () => {
    setLoginDialogOpen(false);
    navigate("/User?redirect=/Order");
  };

  if (items.length === 0) {
    return (
      <>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-5">
        <h1 className="sr-only">Your Cart</h1>
        <EmptyState
          title="Your cart is waiting for something delicious."
          message="Browse the menu and add a dish to get started."
          action={
            <button
              type="button"
              onClick={() => navigate("/Menu")}
              className="inline-block rounded-lg bg-sage-500 px-5 py-2.5 text-sm font-semibold text-cream-50 transition hover:bg-sage-600"
            >
              Browse Menu
            </button>
          }
        />
      </div>
      <Footer />
      </>
    );
  }

  return (
    <>
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-5">
      <h1 className="font-display text-3xl text-ink-900">Your Cart</h1>
      <p className="mt-1 text-sm text-ink-500">
        {items.reduce((sum, item) => sum + item.quantity, 0)} item(s) in your cart.
      </p>

      {hasUnavailableItems && (
        <div className="mt-5 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-red-700">
            Some items in your cart are no longer available. Remove them to continue.
          </p>
          <button
            type="button"
            onClick={handleRemoveUnavailable}
            className="shrink-0 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Remove Unavailable Items
          </button>
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <FoodCard
                item={unavailableIds.has(item.id) ? { ...item, isAvailable: false } : item}
                isCartView
                isFavorite={isFavorite(item.id)}
                onToggleFavorite={toggleFavorite}
                onIncrease={increaseQuantity}
                onDecrease={decreaseQuantity}
                onRemove={removeItem}
              />
            </motion.div>
          ))}
        </div>

        <div className="h-fit rounded-xl border border-cream-200 bg-cream-50 p-6 shadow-card lg:sticky lg:top-24">
          <h2 className="text-lg font-bold text-ink-900">Order Summary</h2>
          <div className="mt-4">
            <PriceSummary subtotal={subtotal} deliveryFee={deliveryFee} discount={discount} total={total} />
          </div>

          {checkingAvailability && <Skeleton className="mt-4 h-4 w-2/3" />}

          <button
            type="button"
            onClick={handleProceedToCheckout}
            disabled={items.length === 0 || hasUnavailableItems}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-sage-500 px-4 py-3.5 text-base font-semibold text-cream-50 transition hover:bg-sage-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Proceed to Checkout
            <ArrowForwardIcon fontSize="small" />
          </button>
        </div>
      </div>

      <Dialog
        open={loginDialogOpen}
        onClose={() => setLoginDialogOpen(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: 3,
            border: "1px solid #EEDCC2" /* cream-300 */,
            boxShadow: "0 18px 45px rgba(36,28,21,0.12)",
            p: 0.5,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <span className="text-xl font-bold text-ink-900">Login Required</span>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#7A6C5B" /* ink-500 */ }}>
            Please login first so we can continue to your checkout securely.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, pt: 0, gap: 1 }}>
          <Button
            onClick={() => setLoginDialogOpen(false)}
            color="inherit"
            sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleProceedToLogin}
            variant="contained"
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 700,
              bgcolor: "#4B5D3A" /* sage-500 */,
              "&:hover": { bgcolor: "#3C4A2E" /* sage-600 */ },
            }}
          >
            Login Now
          </Button>
        </DialogActions>
      </Dialog>
    </div>
    <Footer />
    </>
  );
}
