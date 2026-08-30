import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Footer from "../components/Footer.jsx";
import Toast from "../components/Toast";
import { fetchCategories, fetchMenuItems, toMenuCardItem } from "../lib/menuService";
import { useShop } from "../context/ShopContext";
import CategoryNav from "../components/CategoryNav";
import SearchBar from "../components/SearchBar";
import FoodCard from "../components/FoodCard";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import { CategoryNavSkeleton, SearchBarSkeleton, MenuGridSkeleton } from "../components/MenuSkeletons";

const MEAL_TYPES = [
  { value: "breakfast", label: "Break Fast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
];

const SORT_OPTIONS = [
  { value: "popular", label: "Popular" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
];

function sortCardItems(list, sortBy) {
  const sorted = [...list];
  switch (sortBy) {
    case "price_asc":
      sorted.sort((a, b) => a.priceValue - b.priceValue);
      break;
    case "price_desc":
      sorted.sort((a, b) => b.priceValue - a.priceValue);
      break;
    case "newest":
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
    case "popular":
    default:
      sorted.sort((a, b) => {
        if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
        const ratingDiff = (b.rating || 0) - (a.rating || 0);
        if (ratingDiff !== 0) return ratingDiff;
        return a.name.localeCompare(b.name);
      });
  }
  return sorted;
}

// Meal-type quick filter — sage-toned to read as a secondary refinement,
// distinct from the category pills (terracotta) above it.
function mealPillClass(active) {
  return `shrink-0 rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
    active
      ? "border-sage-500 bg-sage-500 text-cream-50"
      : "border-transparent bg-cream-100 text-ink-700 hover:border-sage-500 hover:text-sage-600"
  }`;
}

// Top-right view switch (All / Favorites / Cart) — terracotta to match the
// primary brand accent used for navigation-level actions elsewhere.
function viewPillClass(active) {
  return `rounded-full border px-3 py-2 text-center text-xs font-semibold transition sm:px-4 sm:text-sm ${
    active
      ? "border-terracotta-500 bg-terracotta-500 text-cream-50"
      : "border-cream-300 text-ink-700 hover:border-terracotta-500 hover:text-terracotta-500"
  }`;
}

const MEAL_TYPE_VALUES = MEAL_TYPES.map((meal) => meal.value);

export default function Menu() {
  // Seeded once from ?category=<slug> / ?meal=<value> (e.g. a link from the
  // homepage's category tiles or the footer's meal-type links) so that link
  // actually lands on a filtered view instead of just decorating a
  // destination — after that it's plain local state, same as the rest of
  // the filters here.
  const [selectedMeal, setSelectedMeal] = useState(() => {
    const raw = new URLSearchParams(window.location.search).get("meal");
    return MEAL_TYPE_VALUES.includes(raw) ? raw : "all";
  });
  const [selectedCategory, setSelectedCategory] = useState(
    () => new URLSearchParams(window.location.search).get("category") || "all"
  );
  // The view===favorites effect below resets the meal filter on every
  // change of `view` — including the very first render, which would
  // immediately wipe out a ?meal= seed above. Skip that one run.
  const isFirstViewEffect = useRef(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const view = query.get("view") === "favorites" ? "favorites" : "all";
  const isViewActive = (targetView) => view === targetView;

  const { favorites, isFavorite, toggleFavorite, addToCart, cartCount } = useShop();

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");

  const [items, setItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [itemsError, setItemsError] = useState("");
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let active = true;
    setCategoriesLoading(true);
    setCategoriesError("");
    fetchCategories()
      .then((data) => {
        if (active) setCategories(data);
      })
      .catch(() => {
        if (active) setCategoriesError("Could not load categories.");
      })
      .finally(() => {
        if (active) setCategoriesLoading(false);
      });
    return () => {
      active = false;
    };
  }, [reloadToken]);

  useEffect(() => {
    let active = true;
    setItemsLoading(true);
    setItemsError("");
    fetchMenuItems()
      .then((data) => {
        if (active) setItems(data);
      })
      .catch(() => {
        if (active) setItemsError("Could not load the menu right now. Please try again shortly.");
      })
      .finally(() => {
        if (active) setItemsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [reloadToken]);

  useEffect(() => {
    if (isFirstViewEffect.current) {
      isFirstViewEffect.current = false;
      return;
    }
    setSelectedMeal("all");
  }, [view]);

  const retry = useCallback(() => setReloadToken((n) => n + 1), []);

  const cardItems = useMemo(() => items.map(toMenuCardItem), [items]);

  const itemsMealTypeMap = useMemo(() => {
    const map = new Map();
    cardItems.forEach((item) => map.set(item.id, item.mealType));
    return map;
  }, [cardItems]);

  const addMealTypeIfMissing = useCallback(
    (item) => ({
      ...item,
      mealType: item.mealType || itemsMealTypeMap.get(item.id) || null,
    }),
    [itemsMealTypeMap]
  );

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const browseList = useMemo(() => {
    let list = cardItems;

    if (selectedCategory !== "all") {
      list = list.filter((item) => item.categorySlug === selectedCategory);
    }
    if (normalizedSearch) {
      list = list.filter((item) => {
        const haystack = `${item.name} ${item.description || ""}`.toLowerCase();
        return haystack.includes(normalizedSearch);
      });
    }
    return sortCardItems(list, sortBy);
  }, [cardItems, selectedCategory, normalizedSearch, sortBy]);

  const baseList = view === "favorites" ? favorites.map(addMealTypeIfMissing) : browseList;

  const list =
    selectedMeal === "all" ? baseList : baseList.filter((item) => item.mealType === selectedMeal);
  const isBrowseView = view === "all";

  const handleCloseToast = () => setToast((prev) => ({ ...prev, open: false }));

  const handleAddToCart = (item) => {
    const result = addToCart(item);
    if (result?.ok === false) {
      setToast({
        open: true,
        message:
          result.reason === "unavailable"
            ? `${item.name || item.title} is no longer available.`
            : "Could not add this item to your cart.",
        severity: "error",
      });
      return;
    }
    setToast({ open: true, message: `Added ${item.name || item.title} to cart.`, severity: "success" });
  };

  const getTitle = () => (view === "favorites" ? "Favorite Dishes" : "Menu");

  const getSelectedMealLabel = () => {
    const found = MEAL_TYPES.find((meal) => meal.value === selectedMeal);
    return found ? found.label : "All Dishes";
  };

  const hasActiveFilters = selectedCategory !== "all" || Boolean(normalizedSearch);
  const isLoading = itemsLoading || categoriesLoading;
  const hasLoadError = itemsError || categoriesError;

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-3xl text-ink-900">{getTitle()}</h1>
            <p className="mt-1 text-sm font-medium text-ink-500">Showing: {getSelectedMealLabel()}</p>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:items-center">
            <NavLink to="/Menu" className={viewPillClass(isViewActive("all"))}>
              All
            </NavLink>
            <NavLink to="/Menu?view=favorites" className={viewPillClass(isViewActive("favorites"))}>
              Favorites ({favorites.length})
            </NavLink>
            <NavLink to="/Cart" className={viewPillClass(false)}>
              Cart ({cartCount})
            </NavLink>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-cream-200 bg-cream-50 p-5">
          {categoriesLoading ? (
            <CategoryNavSkeleton />
          ) : categoriesError ? (
            <p className="text-sm font-medium text-red-600">{categoriesError}</p>
          ) : (
            <CategoryNav categories={categories} selectedSlug={selectedCategory} onSelect={setSelectedCategory} />
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={() => setSelectedMeal("all")} className={mealPillClass(selectedMeal === "all")}>
              All
            </button>
            {MEAL_TYPES.map((meal) => (
              <button
                key={meal.value}
                type="button"
                onClick={() => setSelectedMeal(meal.value)}
                className={mealPillClass(selectedMeal === meal.value)}
              >
                {meal.label}
              </button>
            ))}
          </div>

          {isBrowseView && (
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="sm:flex-1">
                {itemsLoading ? (
                  <SearchBarSkeleton />
                ) : (
                  <SearchBar value={searchTerm} onChange={setSearchTerm} />
                )}
              </div>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                aria-label="Sort menu items"
                className="rounded-lg border border-cream-300 px-3 py-2.5 text-sm font-semibold text-ink-700 outline-none focus:border-sage-500"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="mt-6">
          {isLoading ? (
            <MenuGridSkeleton />
          ) : hasLoadError ? (
            <ErrorState
              message="We couldn't reach the menu right now. Please check your connection and try again."
              onRetry={retry}
            />
          ) : list.length === 0 ? (
            <EmptyState
              title={
                view === "favorites"
                  ? "No favorites yet"
                  : normalizedSearch
                  ? "We couldn't find anything matching your search."
                  : "No menu items are currently available."
              }
              message={
                view === "favorites"
                  ? "Tap the heart on any dish to save it here."
                  : hasActiveFilters
                  ? "Try a different category, search term, or meal filter."
                  : undefined
              }
              action={
                view === "favorites" ? (
                  <NavLink
                    to="/Menu"
                    className="inline-block rounded-lg bg-sage-500 px-5 py-2.5 text-sm font-semibold text-cream-50 transition hover:bg-sage-600"
                  >
                    Browse Menu
                  </NavLink>
                ) : hasActiveFilters ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory("all");
                      setSearchTerm("");
                      setSelectedMeal("all");
                    }}
                    className="rounded-lg bg-sage-500 px-5 py-2.5 text-sm font-semibold text-cream-50 transition hover:bg-sage-600"
                  >
                    Clear Filters
                  </button>
                ) : undefined
              }
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {list.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <FoodCard
                    item={item}
                    isFavorite={isFavorite(item.id)}
                    onToggleFavorite={toggleFavorite}
                    onAddToCart={handleAddToCart}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Toast open={toast.open} message={toast.message} severity={toast.severity} onClose={handleCloseToast} />
      <Footer />
    </>
  );
}
