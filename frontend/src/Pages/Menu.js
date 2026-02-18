import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import Footer from "../components/Footer.jsx";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { dishes } from "../data/data.js";
import { useShop } from "../context/ShopContext";

const toNumber = (price) => Number(String(price || "0").replace(/[^\d.]/g, "")) || 0;
const formatPeso = (value) => `P${value.toFixed(2)}`;

export default function Menu() {
  const [selectedMeal, setSelectedMeal] = useState("all");
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const view = query.get("view") || "all";
  const isViewActive = (targetView) => view === targetView;

  const {
    favorites,
    cartItems,
    isFavorite,
    toggleFavorite,
    addToCart,
    removeFromCart,
    increaseCartQuantity,
    decreaseCartQuantity,
  } = useShop();

  useEffect(() => {
    setSelectedMeal("all");
  }, [view]);

  const dishesMealTypeMap = useMemo(() => {
    const map = new Map();
    dishes.forEach((item) => {
      map.set(item.id, item.mealType);
    });
    return map;
  }, []);

  const addMealTypeIfMissing = useCallback(
    (item) => ({
      ...item,
      mealType: item.mealType || dishesMealTypeMap.get(item.id) || null,
    }),
    [dishesMealTypeMap]
  );

  const baseList = useMemo(() => {
    if (view === "favorites") {
      return favorites.map(addMealTypeIfMissing);
    }
    if (view === "cart") {
      return cartItems.map(addMealTypeIfMissing);
    }
    return dishes;
  }, [view, favorites, cartItems, addMealTypeIfMissing]);

  const list =
    selectedMeal === "all"
      ? baseList
      : baseList.filter((item) => item.mealType === selectedMeal);
  const isCartView = view === "cart";

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + toNumber(item.price) * item.quantity,
    0
  );
  const isLoggedIn =
    localStorage.getItem("isLoggedIn") === "true" ||
    Boolean(localStorage.getItem("token"));

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      return;
    }

    if (!isLoggedIn) {
      setLoginDialogOpen(true);
      return;
    }

    navigate("/Order");
  };

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  const handleProceedToLogin = () => {
    setLoginDialogOpen(false);
    navigate("/User?redirect=/Order");
  };

  const getTitle = () => {
    if (view === "favorites") return "Favorite Dishes";
    if (view === "cart") return "Your Cart Items";
    return "Menu";
  };

  const getSelectedMealLabel = () => {
    if (selectedMeal === "breakfast") return "Break Fast";
    if (selectedMeal === "lunch") return "Lunch";
    if (selectedMeal === "dinner") return "Dinner";
    return "All Dishes";
  };

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-5">
        <div className="mb-6 rounded-2xl border border-[#f3dfd6] bg-[#fffaf5] p-5">
          <h2 className="text-2xl font-bold text-[#00213F]">Our Menu</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedMeal("breakfast")}
              className={`rounded-full px-3 py-1 text-sm font-semibold transition ${
                selectedMeal === "breakfast"
                  ? "bg-[#667B68] text-white"
                  : "bg-white text-[#435334] hover:bg-[#f6f8f3]"
              }`}
            >
              Break Fast
            </button>
            <button
              type="button"
              onClick={() => setSelectedMeal("lunch")}
              className={`rounded-full px-3 py-1 text-sm font-semibold transition ${
                selectedMeal === "lunch"
                  ? "bg-[#667B68] text-white"
                  : "bg-white text-[#435334] hover:bg-[#f6f8f3]"
              }`}
            >
              Lunch
            </button>
            <button
              type="button"
              onClick={() => setSelectedMeal("dinner")}
              className={`rounded-full px-3 py-1 text-sm font-semibold transition ${
                selectedMeal === "dinner"
                  ? "bg-[#667B68] text-white"
                  : "bg-white text-[#435334] hover:bg-[#f6f8f3]"
              }`}
            >
              Dinner
            </button>
            <button
              type="button"
              onClick={() => setSelectedMeal("all")}
              className={`rounded-full px-3 py-1 text-sm font-semibold transition ${
                selectedMeal === "all"
                  ? "bg-[#FF785B] text-white"
                  : "bg-white text-[#435334] hover:bg-[#fff0eb]"
              }`}
            >
              All
            </button>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#00213F]">{getTitle()}</h1>
            <p className="mt-1 text-sm font-medium text-[#64748b]">
              Showing: {getSelectedMealLabel()}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:items-center">
            <NavLink
              to="/Menu"
              className={`rounded-full border px-3 py-2 text-center text-xs font-semibold transition sm:px-4 sm:text-sm ${
                isViewActive("all")
                  ? "border-[#FF785B] bg-[#FF785B] text-white"
                  : "text-[#334155] hover:border-[#FF785B] hover:text-[#FF785B]"
              }`}
            >
              All
            </NavLink>
            <NavLink
              to="/Menu?view=favorites"
              className={`rounded-full border px-3 py-2 text-center text-xs font-semibold transition sm:px-4 sm:text-sm ${
                isViewActive("favorites")
                  ? "border-[#FF785B] bg-[#FF785B] text-white"
                  : "text-[#334155] hover:border-[#FF785B] hover:text-[#FF785B]"
              }`}
            >
              Favorites ({favorites.length})
            </NavLink>
            <NavLink
              to="/Menu?view=cart"
              className={`rounded-full border px-3 py-2 text-center text-xs font-semibold transition sm:px-4 sm:text-sm ${
                isViewActive("cart")
                  ? "border-[#FF785B] bg-[#FF785B] text-white"
                  : "text-[#334155] hover:border-[#FF785B] hover:text-[#FF785B]"
              }`}
            >
              Cart ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
            </NavLink>
          </div>
        </div>

        {isCartView && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 flex flex-col gap-3 rounded-xl border border-[#dbe7d0] bg-[#f9fff3] p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <p className="text-sm font-semibold text-[#334155]">
              Total Price:{" "}
              <span className="text-lg font-bold text-[#435334]">
                {formatPeso(totalPrice)}
              </span>
            </p>
            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={cartItems.length === 0}
              className="rounded-xl bg-[#667B68] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#556657] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Place Order
            </button>
          </motion.div>
        )}

        {list.length === 0 ? (
          <div className="rounded-xl border border-dashed p-10 text-center text-gray-500">
            {view === "favorites" &&
              `No favorite dishes ${
                selectedMeal === "all" ? "" : `for ${selectedMeal}`
              }.`}
            {view === "cart" &&
              `No cart items ${selectedMeal === "all" ? "" : `for ${selectedMeal}`}.`}
            {view === "all" &&
              `No ${
                selectedMeal === "all" ? "" : `${selectedMeal} `
              }dishes available.`}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {list.map((data, index) => {
              const liked = isFavorite(data.id);
              const quantity = data.quantity || 0;
              const itemTotal = toNumber(data.price) * quantity;

              return (
                <motion.div
                  key={data.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative flex h-full flex-col rounded-2xl border bg-white p-5 shadow-md"
                >
                  <div className="mb-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => toggleFavorite(data)}
                      className={`${
                        liked
                          ? "text-[#FF785B]"
                          : "text-gray-500 transition hover:text-[#FF785B]"
                      }`}
                      aria-label={`Favorite ${data.title}`}
                    >
                      {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </button>
                  </div>

                  <div className="flex flex-1 flex-col items-center">
                    <img
                      src={data.imageURL}
                      alt={data.title}
                      className="h-40 w-40 object-contain sm:h-44 sm:w-44"
                    />
                    <h1 className="flex min-h-[56px] items-center pt-3 text-center text-base font-bold text-[#00213F] sm:text-lg">
                      {data.title}
                    </h1>
                    <p className="mt-2 rounded-full bg-[#fff3ec] px-3 py-1 text-sm font-bold text-[#ff785b]">
                      {data.price}
                    </p>
                  </div>

                  <div className="mt-auto pt-4">
                    {isCartView ? (
                      <div className="space-y-3">
                        <p className="rounded-lg bg-[#f8fafc] px-3 py-2 text-sm font-semibold text-[#334155]">
                          Item Total: {formatPeso(itemTotal)}
                        </p>
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => decreaseCartQuantity(data.id)}
                              className="h-8 w-8 rounded-full bg-[#f1f5f9] text-lg font-bold text-[#334155] transition hover:bg-[#e2e8f0]"
                              aria-label={`Decrease ${data.title}`}
                            >
                              -
                            </button>
                            <span className="min-w-8 text-center text-sm font-bold text-[#1f2937]">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => increaseCartQuantity(data.id)}
                              className="h-8 w-8 rounded-full bg-[#CEDEBD] text-lg font-bold text-[#334155] transition hover:bg-[#bcd6a5]"
                              aria-label={`Increase ${data.title}`}
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromCart(data.id)}
                            className="rounded-xl border border-[#ffd4d4] p-2 text-[#d12c2c] hover:bg-[#fff3f3]"
                            aria-label={`Remove ${data.title} from cart`}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => addToCart(data)}
                        className="flex w-full flex-nowrap items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#667B68] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#556657] active:scale-[0.98]"
                      >
                        <span className="truncate">Add to Cart</span>
                        <span className="shrink-0 rounded-lg bg-white/25 p-1 text-white">
                          <ShoppingCartOutlinedIcon fontSize="small" />
                        </span>
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
      <Snackbar
        open={toast.open}
        autoHideDuration={2200}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
      <Dialog
        open={loginDialogOpen}
        onClose={() => setLoginDialogOpen(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: 3,
            border: "1px solid #f2e7de",
            boxShadow: "0 18px 45px rgba(0,0,0,0.12)",
            p: 0.5,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <span className="text-xl font-bold text-[#1f2937]">Login Required</span>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#475569" }}>
            Please login first so we can continue to your checkout securely.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, pt: 0, gap: 1 }}>
          <Button
            onClick={() => setLoginDialogOpen(false)}
            color="inherit"
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleProceedToLogin}
            variant="contained"
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 700,
              bgcolor: "#667B68",
              "&:hover": { bgcolor: "#556657" },
            }}
          >
            Login Now
          </Button>
        </DialogActions>
      </Dialog>
      <Footer />
    </>
  );
}
