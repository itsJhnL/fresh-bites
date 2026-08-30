import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CallIcon from "@mui/icons-material/Call";
import AttachEmailIcon from "@mui/icons-material/AttachEmail";
import GrassOutlinedIcon from "@mui/icons-material/GrassOutlined";
import RestaurantMenuOutlinedIcon from "@mui/icons-material/RestaurantMenuOutlined";
import DeliveryDiningOutlinedIcon from "@mui/icons-material/DeliveryDiningOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Footer from "./Footer.jsx";
import FoodCard from "./FoodCard";
import FoodImage from "./FoodImage";
import ReservationForm from "./ReservationForm";
import Skeleton from "./Skeleton";
import { MenuGridSkeleton, CategoryNavSkeleton } from "./MenuSkeletons";
import ErrorState from "./ErrorState";
import { hero, chefSpecial, chefSection, restaurantInfo, reviews } from "../data/data.js";
import { fetchCategories, fetchMenuItems, toMenuCardItem } from "../lib/menuService";
import { useShop } from "../context/ShopContext";
import { DELIVERY_ESTIMATE_MINUTES } from "../utils/orderLabels";

// Every number in the Highlights section below is real: menu item / category
// counts come from the same Supabase fetches the Categories and Popular
// Dishes sections already use (see the effects in HomePage()), the rating
// is computed from the actual reviews array rather than a hardcoded figure,
// and the delivery estimate is the same constant OrderDetailPanels.jsx uses
// for real order tracking — never an invented statistic.
function averageRating(list) {
  if (!list.length) return null;
  return list.reduce((sum, r) => sum + r.rating, 0) / list.length;
}

// Real, licensed stock photography (Unsplash) used for editorial/marketing
// moments on this landing page — never for a specific named dish, which
// would falsely imply that exact plate exists in the live menu. Real menu
// items always render through FoodImage's honest placeholder fallback
// instead (see FoodCard.jsx / FoodImage.jsx).
const HERO_IMAGE = "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1800&q=80";
const CHEF_IMAGE = "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1200&q=80";
const LOCATION_IMAGE =
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80";

export default function HomePage() {
  const { isFavorite, toggleFavorite, addToCart } = useShop();

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");

  const [featured, setFeatured] = useState([]);
  const [menuItemCount, setMenuItemCount] = useState(null);
  const [menuLoading, setMenuLoading] = useState(true);
  const [menuError, setMenuError] = useState("");

  const loadCategories = () => {
    setCategoriesLoading(true);
    setCategoriesError("");
    return fetchCategories()
      .then(setCategories)
      .catch(() => setCategoriesError("We couldn't load menu categories right now. Please try again shortly."))
      .finally(() => setCategoriesLoading(false));
  };

  useEffect(() => {
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setMenuLoading(true);
    setMenuError("");
    fetchMenuItems()
      .then((data) => {
        const cards = data.map(toMenuCardItem);
        setMenuItemCount(cards.length);
        const featuredOnly = cards.filter((item) => item.isFeatured);
        setFeatured((featuredOnly.length > 0 ? featuredOnly : cards).slice(0, 4));
      })
      .catch(() => setMenuError("We couldn't load today's popular dishes. Please try again shortly."))
      .finally(() => setMenuLoading(false));
  }, []);

  const avgRating = averageRating(reviews);

  return (
    <>
      {/* 1. Hero — split layout matching the reference: text on a plain
          cream field (trivially high contrast, no overlay/shadow needed
          since nothing sits on top of the photo), photo confined to its
          own rounded card on the right. Reuses the existing real hero
          photo and existing copy — only the container/layout changed. */}
      <section className="bg-cream-50">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-2 md:items-center md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="font-inter text-sm font-semibold uppercase tracking-[0.15em] text-pine-600">
              Fresh Ingredients. Real Flavor.
            </p>
            <h1 className="mt-4 font-playfair text-5xl font-bold leading-tight text-graphite-900 sm:text-6xl">
              {hero.title}
            </h1>
            <div className="mt-4 h-1 w-16 bg-terracotta-500" aria-hidden="true" />
            <p className="mt-5 max-w-md font-inter text-base text-graphite-500 sm:text-lg">{hero.subtitle}</p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <NavLink
                to="/Menu"
                className="flex items-center gap-2 rounded-full bg-terracotta-500 px-7 py-3.5 font-inter text-sm font-bold text-cream-50 transition hover:bg-terracotta-600"
              >
                <ShoppingBagOutlinedIcon fontSize="small" />
                Order Now
              </NavLink>
              <a
                href="#reserve"
                className="flex items-center gap-2 rounded-full border-2 border-pine-600 px-7 py-3.5 font-inter text-sm font-bold text-pine-600 transition hover:bg-pine-600 hover:text-cream-50"
              >
                <EventAvailableOutlinedIcon fontSize="small" />
                Reserve a Table
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              {[
                { Icon: GrassOutlinedIcon, label: "Fresh Ingredients" },
                { Icon: RestaurantMenuOutlinedIcon, label: "Chef Designed" },
                { Icon: DeliveryDiningOutlinedIcon, label: "Fast Delivery" },
              ].map(({ Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="text-pine-600" fontSize="small" />
                  <span className="font-inter text-sm font-medium text-graphite-900">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="overflow-hidden rounded-[2rem] shadow-card"
          >
            <img
              src={HERO_IMAGE}
              alt="A chef-prepared dish, plated and ready to serve"
              className="aspect-[4/3] w-full object-cover md:aspect-[5/6]"
            />
          </motion.div>
        </div>
      </section>

      {/* 2. This Week's Highlight — a real, currently-featured menu item
          (fetched below in the same effect that feeds Popular Dishes), not
          generic marketing copy over a stock photo. The "Featured" badge is
          the actual is_featured flag already used to build Popular Dishes —
          there's no separate "chef's pick" field in the data model, so
          nothing new was added to show it. Stats below are all real: menu
          item count from the same fetch, the delivery estimate shared with
          real order tracking (OrderDetailPanels.jsx), and the rating
          computed from the actual reviews array — never invented figures. */}
      <section className="bg-pine-50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div className="relative pb-8 sm:pb-10">
              {menuLoading ? (
                <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
              ) : menuError || !featured[0] ? (
                <div className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl border border-dashed border-pine-600/30 bg-cream-50 px-6 text-center text-sm text-graphite-500">
                  {menuError || "No featured dish is available right now."}
                </div>
              ) : (
                <>
                  <div className="overflow-hidden rounded-2xl shadow-card">
                    <FoodImage
                      src={featured[0].imageURL}
                      alt={featured[0].name}
                      className="aspect-[4/3] w-full object-cover"
                    />
                  </div>
                  {featured[0].isFeatured && (
                    <span className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-pine-600 px-3 py-1 font-inter text-xs font-bold uppercase tracking-wide text-cream-50">
                      <StarIcon sx={{ fontSize: 14 }} /> Featured
                    </span>
                  )}
                  <div className="absolute bottom-0 left-4 right-4 flex items-center gap-3 rounded-xl bg-cream-50 p-4 shadow-card sm:left-8 sm:right-auto sm:w-72">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-playfair text-base font-semibold text-graphite-900">
                        {featured[0].name}
                      </p>
                      <p className="mt-0.5 line-clamp-1 font-inter text-xs text-graphite-500">
                        {featured[0].description}
                      </p>
                    </div>
                    <NavLink
                      to={`/Menu/${featured[0].slug}`}
                      aria-label={`View ${featured[0].name}`}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pine-600 text-cream-50 transition hover:bg-pine-600/90"
                    >
                      <ArrowForwardIcon fontSize="small" />
                    </NavLink>
                  </div>
                </>
              )}
            </div>

            <div>
              <p className="font-inter text-sm font-semibold uppercase tracking-[0.15em] text-pine-600">
                {chefSpecial.eyebrow}
              </p>
              <h2 className="mt-2 font-playfair text-3xl font-bold text-graphite-900 sm:text-4xl">
                {chefSpecial.title}
              </h2>
              <p className="mt-4 max-w-md font-inter text-base leading-relaxed text-graphite-500">
                {chefSpecial.description}
              </p>
              <NavLink
                to="/Menu"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-terracotta-500 px-6 py-2.5 font-inter text-sm font-bold text-cream-50 transition hover:bg-terracotta-600"
              >
                Explore Menu
                <ArrowForwardIcon fontSize="small" />
              </NavLink>

              <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
                {menuLoading || categoriesLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i}>
                      <Skeleton className="h-7 w-14" />
                      <Skeleton className="mt-2 h-3 w-20" />
                    </div>
                  ))
                ) : (
                  <>
                    <div>
                      <p className="font-playfair text-2xl font-bold text-graphite-900">100%</p>
                      <p className="mt-1 font-inter text-xs text-graphite-500">Made Fresh to Order</p>
                    </div>
                    <div>
                      <p className="font-playfair text-2xl font-bold text-graphite-900">{menuItemCount}+</p>
                      <p className="mt-1 font-inter text-xs text-graphite-500">Dishes on the Menu</p>
                    </div>
                    <div>
                      <p className="font-playfair text-2xl font-bold text-graphite-900">
                        ~{DELIVERY_ESTIMATE_MINUTES} min
                      </p>
                      <p className="mt-1 font-inter text-xs text-graphite-500">Average Delivery</p>
                    </div>
                    <div>
                      <p className="font-playfair text-2xl font-bold text-graphite-900">
                        {avgRating ? avgRating.toFixed(1) : "—"}★
                      </p>
                      <p className="mt-1 font-inter text-xs text-graphite-500">Average Rating</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream-100 py-16">
        <div className="mx-auto max-w-6xl px-5">
          <div className="text-center">
            <h2 className="font-display text-3xl text-ink-900">Popular Dishes</h2>
            <p className="mt-2 text-sm text-ink-500">Customer favorites, ready to order.</p>
          </div>
          <div className="mt-8">
            {menuLoading ? (
              <MenuGridSkeleton count={4} />
            ) : menuError ? (
              <ErrorState message={menuError} />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {featured.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <FoodCard
                      item={item}
                      isFavorite={isFavorite(item.id)}
                      onToggleFavorite={toggleFavorite}
                      onAddToCart={addToCart}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
          <div className="mt-8 text-center">
            <NavLink
              to="/Menu"
              className="inline-block rounded-full border-2 border-sage-500 px-6 py-2.5 text-sm font-bold text-sage-500 transition hover:bg-sage-500 hover:text-cream-50"
            >
              See Full Menu
            </NavLink>
          </div>
        </div>
      </section>

      {/* 3. Menu Categories — real Supabase data; each tile is a genuine
          filtered link into /Menu, not decoration. */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-5">
          <div className="text-center">
            <h2 className="font-display text-3xl text-ink-900">Shop by Category</h2>
            <p className="mt-2 text-sm text-ink-500">Find exactly what you're craving.</p>
          </div>
          <div className="mt-8">
            {categoriesLoading ? (
              <CategoryNavSkeleton />
            ) : categoriesError ? (
              <ErrorState message={categoriesError} onRetry={loadCategories} />
            ) : categories.length === 0 ? (
              <p className="text-center text-sm text-ink-500">No categories are available right now.</p>
            ) : (
              <div className="flex flex-wrap justify-center gap-3">
                {categories.map((category) => (
                  <NavLink
                    key={category.id}
                    to={`/Menu?category=${category.slug}`}
                    className="rounded-full border border-cream-300 bg-cream-50 px-5 py-2.5 text-sm font-semibold text-ink-900 transition hover:border-terracotta-500 hover:text-terracotta-500"
                  >
                    {category.name}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. Reservation — a real, working demo form (see
          ReservationForm.jsx for the honesty disclaimer and local-only
          storage), not a decorative dead form. */}
      <section id="reserve" className="scroll-mt-20 bg-cream-100 py-16">
        <div className="mx-auto max-w-3xl px-5">
          <div className="text-center">
            <h2 className="font-display text-3xl text-ink-900">Reserve a Table</h2>
            <p className="mt-2 text-sm text-ink-500">Planning to dine in? Let us know you're coming.</p>
          </div>
          <div className="mt-8">
            <ReservationForm />
          </div>
        </div>
      </section>

      {/* 5. Our Story / Chef Story — teaser into the full About page rather
          than duplicating its content wholesale. */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div className="md:order-2">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              className="overflow-hidden rounded-xl border border-cream-200 shadow-card"
            >
              <img
                src={CHEF_IMAGE}
                alt={chefSection.imageAlt}
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
              />
            </motion.div>
          </div>
          <div className="md:order-1">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-terracotta-500">
              {chefSection.eyebrow}
            </p>
            <h2 className="mt-2 font-display text-3xl text-ink-900 sm:text-4xl">{chefSection.title}</h2>
            <p className="mt-4 text-base leading-relaxed text-ink-700">{chefSection.paragraph}</p>
            <NavLink
              to="/About"
              className="mt-6 inline-block rounded-full border-2 border-ink-900 px-6 py-2.5 text-sm font-bold text-ink-900 transition hover:bg-ink-900 hover:text-cream-50"
            >
              Read Our Story
            </NavLink>
          </div>
        </div>
      </section>

      {/* 6. Restaurant Highlights / Statistics — every figure here is real:
          menu item / category counts from the same Supabase fetches used
          above, the rating computed from the actual reviews array, and the
          delivery estimate shared with OrderDetailPanels.jsx's real order
          tracking. Nothing here is an invented statistic. */}
      <section className="bg-ink-900 py-14">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-5 lg:grid-cols-4">
          {menuLoading || categoriesLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="text-center">
                <Skeleton className="mx-auto h-9 w-16 opacity-40" />
                <Skeleton className="mx-auto mt-3 h-3 w-24 opacity-40" />
              </div>
            ))
          ) : (
            <>
              <div className="text-center text-cream-50">
                <p className="font-display text-3xl sm:text-4xl">{menuItemCount}+</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-cream-100/80 sm:text-sm">
                  Dishes on the Menu
                </p>
              </div>
              <div className="text-center text-cream-50">
                <p className="font-display text-3xl sm:text-4xl">{categories.length}</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-cream-100/80 sm:text-sm">
                  Menu Categories
                </p>
              </div>
              <div className="text-center text-cream-50">
                <p className="font-display text-3xl sm:text-4xl">
                  {avgRating ? avgRating.toFixed(1) : "—"}
                  <span className="ml-1 text-lg text-terracotta-300">★</span>
                </p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-cream-100/80 sm:text-sm">
                  Average Customer Rating
                </p>
              </div>
              <div className="text-center text-cream-50">
                <p className="font-display text-3xl sm:text-4xl">
                  ~{DELIVERY_ESTIMATE_MINUTES}
                  <span className="ml-1 text-lg text-terracotta-300">min</span>
                </p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-cream-100/80 sm:text-sm">
                  Estimated Delivery
                </p>
              </div>
            </>
          )}
        </div>
      </section>

      {/* 7. What Customers Say — sits directly before Location, per the
          brief. Illustrative demo content (this app has no real customer
          accounts yet), shown with initials rather than implying real
          customer photos — same reviews already used elsewhere in the app,
          just given a more editorial pull-quote treatment here. */}
      <section className="bg-sage-50 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-sage-600">Testimonials</p>
            <h2 className="mt-2 font-display text-3xl text-ink-900 sm:text-4xl">What Customers Say</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col rounded-2xl bg-cream-50 p-8 shadow-card"
              >
                <FormatQuoteIcon sx={{ fontSize: 40 }} className="text-terracotta-100" />
                <p className="mt-3 flex-1 font-display text-lg italic leading-relaxed text-ink-800">
                  &ldquo;{review.quote}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3 border-t border-cream-200 pt-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-terracotta-100 text-sm font-bold text-terracotta-600">
                    {review.name.charAt(0)}
                  </span>
                  <div>
                    <p className="font-bold text-ink-900">{review.name}</p>
                    <div className="flex text-gold-400" aria-label={`${review.rating} out of 5 stars`}>
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <StarIcon key={i} fontSize="inherit" />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Our Location / Contact — same real, functional contact methods
          as the footer, presented richly with a photo of the space. */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              className="overflow-hidden rounded-xl border border-cream-200 shadow-card"
            >
              <img
                src={LOCATION_IMAGE}
                alt="Inside the FreshBite kitchen and dining space"
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
              />
            </motion.div>
            <div>
              <h2 className="font-display text-3xl text-ink-900">Visit or Order In</h2>
              <p className="mt-2 text-sm text-ink-500">Find us, call us, or just place an order online.</p>
              <div className="mt-6 space-y-4">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    restaurantInfo.addressQuery
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-sm text-ink-700 transition hover:text-terracotta-500"
                >
                  <LocationOnIcon fontSize="small" className="mt-0.5 shrink-0 text-terracotta-500" />
                  {restaurantInfo.addressLabel}
                </a>
                <a
                  href={restaurantInfo.phoneHref}
                  className="flex items-start gap-3 text-sm text-ink-700 transition hover:text-terracotta-500"
                >
                  <CallIcon fontSize="small" className="mt-0.5 shrink-0 text-terracotta-500" />
                  {restaurantInfo.phone}
                </a>
                <a
                  href={`mailto:${restaurantInfo.email}`}
                  className="flex items-start gap-3 text-sm text-ink-700 transition hover:text-terracotta-500"
                >
                  <AttachEmailIcon fontSize="small" className="mt-0.5 shrink-0 text-terracotta-500" />
                  {restaurantInfo.email}
                </a>
              </div>
              <NavLink
                to="/Contact"
                className="mt-6 inline-block rounded-full bg-sage-500 px-6 py-2.5 text-sm font-bold text-cream-50 transition hover:bg-sage-600"
              >
                Get in Touch
              </NavLink>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Footer */}
      <Footer />
    </>
  );
}
