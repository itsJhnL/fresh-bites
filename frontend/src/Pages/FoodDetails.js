import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Toast from "../components/Toast";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import StarIcon from "@mui/icons-material/Star";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Footer from "../components/Footer.jsx";
import FoodImage from "../components/FoodImage";
import ErrorState from "../components/ErrorState";
import { MenuCardSkeleton } from "../components/MenuSkeletons";
import { fetchMenuItemBySlug } from "../lib/menuService";
import { useShop } from "../context/ShopContext";
import { formatPeso } from "../utils/money";
import { MAX_QUANTITY_PER_ITEM } from "../utils/cartMath";

// "size" is single-select (radio-like) — you're eating one size, not two.
// Add-ons and removals are independent multi-selects.
const SINGLE_SELECT_TYPES = new Set(["size"]);
const OPTION_GROUP_ORDER = ["size", "addon", "removal"];
const OPTION_GROUP_LABEL = { size: "Size", addon: "Add-ons", removal: "Remove" };

function toCardItem(raw) {
  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    title: raw.name,
    description: raw.description,
    priceValue: Number(raw.price),
    price: formatPeso(Number(raw.price)),
    imageURL: raw.image_url || "",
    mealType: raw.meal_type || null,
    categoryName: raw.category?.name || null,
    rating: raw.rating,
    isAvailable: raw.is_available,
    preparationTime: raw.preparation_time,
    ingredients: raw.ingredients || [],
    options: raw.options || [],
  };
}

export default function FoodDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite, addToCart } = useShop();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptionIds, setSelectedOptionIds] = useState(() => new Set());
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    setNotFound(false);
    setQuantity(1);

    fetchMenuItemBySlug(slug)
      .then((data) => {
        if (!active) return;
        if (!data) {
          setNotFound(true);
          return;
        }
        const nextItem = toCardItem(data);
        setItem(nextItem);

        // Pre-select the first option of any required group (e.g. a
        // default "Regular" size) so the displayed price is always correct
        // and Add to Cart isn't blocked on a selection the user shouldn't
        // have to think about for a sensible default.
        const requiredTypes = [...new Set(nextItem.options.filter((o) => o.is_required).map((o) => o.type))];
        const defaults = new Set();
        requiredTypes.forEach((type) => {
          const firstOfType = nextItem.options.find((o) => o.type === type);
          if (firstOfType) defaults.add(firstOfType.id);
        });
        setSelectedOptionIds(defaults);
      })
      .catch(() => {
        if (active) setError("We couldn't load this dish right now. Please try again shortly.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [slug]);

  const optionsByType = useMemo(() => {
    if (!item) return {};
    const groups = {};
    item.options.forEach((option) => {
      if (!groups[option.type]) groups[option.type] = [];
      groups[option.type].push(option);
    });
    return groups;
  }, [item]);

  const requiredTypes = useMemo(() => {
    if (!item) return [];
    return [...new Set(item.options.filter((o) => o.is_required).map((o) => o.type))];
  }, [item]);

  const selectedOptions = useMemo(() => {
    if (!item) return [];
    return item.options.filter((option) => selectedOptionIds.has(option.id));
  }, [item, selectedOptionIds]);

  const modifierTotal = selectedOptions.reduce((sum, option) => sum + (Number(option.price_modifier) || 0), 0);
  const unitPrice = item ? item.priceValue + modifierTotal : 0;

  const missingRequiredTypes = requiredTypes.filter(
    (type) => !selectedOptions.some((option) => option.type === type)
  );

  const toggleOption = (option) => {
    setSelectedOptionIds((prev) => {
      const next = new Set(prev);
      if (SINGLE_SELECT_TYPES.has(option.type)) {
        (optionsByType[option.type] || []).forEach((o) => next.delete(o.id));
        next.add(option.id);
      } else if (next.has(option.id)) {
        next.delete(option.id);
      } else {
        next.add(option.id);
      }
      return next;
    });
  };

  const handleAddToCart = () => {
    if (!item || missingRequiredTypes.length > 0) return;

    const customizations = selectedOptions.map((option) => ({
      id: option.id,
      name: option.name,
      type: option.type,
      price_modifier: Number(option.price_modifier) || 0,
    }));

    const result = addToCart(item, quantity, customizations);
    if (result?.ok === false) {
      setToast({
        open: true,
        message:
          result.reason === "unavailable"
            ? "This dish is no longer available."
            : "Could not add this dish to your cart.",
        severity: "error",
      });
      return;
    }
    setToast({ open: true, message: `Added ${quantity} × ${item.name} to cart.`, severity: "success" });
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-5">
        <MenuCardSkeleton />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center sm:px-5">
        <h1 className="text-2xl font-bold text-ink-900">Dish not found</h1>
        <p className="mt-2 text-sm text-ink-500">
          This item may have been removed or is no longer available.
        </p>
        <Link
          to="/Menu"
          className="mt-5 inline-block rounded-lg bg-sage-500 px-5 py-2.5 text-sm font-semibold text-cream-50 transition hover:bg-sage-600"
        >
          Back to Menu
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-5">
        <ErrorState message={error} onRetry={() => navigate(0)} />
      </div>
    );
  }

  const liked = isFavorite(item.id);

  return (
    <>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-5">
        <button
          type="button"
          onClick={() => navigate("/Menu")}
          className="mb-5 inline-flex items-center gap-1 text-sm font-semibold text-ink-700 transition hover:text-terracotta-500"
        >
          <ArrowBackIcon fontSize="small" /> Back to Menu
        </button>

        <div className="grid gap-8 rounded-xl border border-cream-200 bg-cream-50 p-6 shadow-card md:grid-cols-2 md:p-8">
          <FoodImage
            src={item.imageURL}
            alt={item.name}
            className="aspect-square w-full rounded-xl object-cover"
          />

          <div className="flex flex-col">
            <div className="flex items-start justify-between gap-3">
              <div>
                {item.categoryName && (
                  <span className="rounded-full bg-sage-100 px-2.5 py-1 text-xs font-semibold text-sage-600">
                    {item.categoryName}
                  </span>
                )}
                <h1 className="mt-2 font-display text-2xl text-ink-900 sm:text-3xl">{item.name}</h1>
              </div>
              <button
                type="button"
                onClick={() => toggleFavorite(item)}
                className={liked ? "text-terracotta-500" : "text-ink-300 transition hover:text-terracotta-500"}
                aria-label={`Favorite ${item.name}`}
              >
                {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </button>
            </div>

            {item.description && (
              <p className="mt-3 text-sm leading-relaxed text-ink-500">{item.description}</p>
            )}

            {item.ingredients.length > 0 && (
              <div className="mt-3">
                <h2 className="text-sm font-bold text-ink-700">Ingredients</h2>
                <p className="mt-1 text-sm text-ink-500">{item.ingredients.join(", ")}</p>
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <p className="text-3xl font-bold text-terracotta-500">{formatPeso(unitPrice)}</p>
              {item.rating ? (
                <span className="flex items-center gap-1 text-sm font-semibold text-gold-500">
                  <StarIcon fontSize="small" /> {Number(item.rating).toFixed(1)}
                </span>
              ) : null}
              {item.preparationTime ? (
                <span className="text-sm text-ink-500">~{item.preparationTime} min</span>
              ) : null}
              {item.mealType && (
                <span className="rounded-full border border-cream-300 px-3 py-1 text-xs font-semibold capitalize text-ink-700">
                  {item.mealType}
                </span>
              )}
            </div>

            {item.isAvailable === false ? (
              <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
                Currently unavailable
              </p>
            ) : (
              <>
                {OPTION_GROUP_ORDER.filter((type) => optionsByType[type]?.length > 0).map((type) => (
                  <div key={type} className="mt-5">
                    <h2 className="text-sm font-bold text-ink-700">
                      {OPTION_GROUP_LABEL[type] || type}
                      {requiredTypes.includes(type) && (
                        <span className="ml-1 text-xs font-normal text-ink-300">(required)</span>
                      )}
                    </h2>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {optionsByType[type].map((option) => {
                        const selected = selectedOptionIds.has(option.id);
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => toggleOption(option)}
                            aria-pressed={selected}
                            className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
                              selected
                                ? "border-sage-500 bg-sage-500 text-cream-50"
                                : "border-cream-300 text-ink-700 hover:border-sage-500 hover:text-sage-600"
                            }`}
                          >
                            {option.name}
                            {Number(option.price_modifier) > 0 &&
                              ` (+${formatPeso(Number(option.price_modifier))})`}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <div className="mt-6 flex items-center gap-3">
                  <span className="text-sm font-semibold text-ink-700">Quantity</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="h-9 w-9 rounded-full bg-cream-200 text-lg font-bold text-ink-700 transition hover:bg-cream-300"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="min-w-8 text-center text-base font-bold text-ink-900">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(MAX_QUANTITY_PER_ITEM, q + 1))}
                      className="h-9 w-9 rounded-full bg-sage-100 text-lg font-bold text-sage-600 transition hover:bg-sage-100/70"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-lg bg-cream-100 px-4 py-3">
                  <span className="text-sm font-semibold text-ink-700">Total</span>
                  <span className="text-xl font-bold text-ink-900">{formatPeso(unitPrice * quantity)}</span>
                </div>

                {missingRequiredTypes.length > 0 && (
                  <p className="mt-2 text-xs font-semibold text-red-600">
                    Please select a {missingRequiredTypes.map((type) => OPTION_GROUP_LABEL[type] || type).join(", ")}.
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={missingRequiredTypes.length > 0}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-sage-500 px-4 py-3.5 text-base font-semibold text-cream-50 transition hover:bg-sage-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Add {quantity > 1 ? `${quantity} ` : ""}to Cart
                  <span className="rounded-md bg-cream-50/20 p-1 text-cream-50">
                    <ShoppingCartOutlinedIcon fontSize="small" />
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      />

      <Footer />
    </>
  );
}
