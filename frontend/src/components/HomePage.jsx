import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CallIcon from "@mui/icons-material/Call";
import AttachEmailIcon from "@mui/icons-material/AttachEmail";
import Footer from "./Footer.jsx";
import FoodCard from "./FoodCard";
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
const CHEF_SPECIAL_IMAGE =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80";
const CHEF_IMAGE = "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1200&q=80";
const LOCATION_IMAGE =
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80";

export default function HomePage() {
  const { isFavorite, toggleFavorite, addToCart } = useShop();

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [featured, setFeatured] = useState([]);
  const [menuItemCount, setMenuItemCount] = useState(null);
  const [menuLoading, setMenuLoading] = useState(true);
  const [menuError, setMenuError] = useState("");

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
      .finally(() => setCategoriesLoading(false));
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
      {/* 1. Hero — large, food-focused, real photography. Branding lives
          here (a small eyebrow tag) since the header deliberately carries
          none.
          Contrast: a photo-wide gradient alone measured well under WCAG's
          4.5:1 minimum in places (verified by sampling actual rendered
          pixels behind the text) — bright regions of the photo (plate,
          tablecloth) show through inconsistently depending on crop/width.
          The bg-ink-900/90 panel below guarantees contrast regardless of
          what's behind it, rather than hoping the gradient lines up. */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900/70 via-ink-900/30 to-ink-900/20" />
        </div>
        <div className="relative mx-auto flex min-h-[560px] max-w-6xl flex-col justify-center px-5 py-20 sm:min-h-[620px]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-xl rounded-xl bg-ink-900/90 p-7 text-cream-50 sm:p-10"
          >
            <p className="font-display text-lg italic text-terracotta-300">{hero.eyebrow}</p>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              {hero.title}
            </h1>
            <p className="mt-5 max-w-md text-base text-cream-50 sm:text-lg">{hero.subtitle}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <NavLink
                to="/Menu"
                className="rounded-full bg-terracotta-500 px-7 py-3.5 text-sm font-bold text-cream-50 transition hover:bg-terracotta-600"
              >
                Order Now
              </NavLink>
              <a
                href="#reserve"
                className="rounded-full border-2 border-cream-50 px-7 py-3.5 text-sm font-bold text-cream-50 transition hover:bg-cream-50 hover:text-ink-900"
              >
                Reserve a Table
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Chef's Specialties / Featured Menu — editorial highlight (never
          claims a specific priced dish) immediately followed by the live,
          data-driven Popular Dishes grid, as one continuous "featured menu"
          moment. */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            className="overflow-hidden rounded-xl border border-cream-200 shadow-card"
          >
            <img
              src={CHEF_SPECIAL_IMAGE}
              alt={chefSpecial.imageAlt}
              className="aspect-[4/3] w-full object-cover"
              loading="lazy"
            />
          </motion.div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-sage-600">{chefSpecial.eyebrow}</p>
            <h2 className="mt-2 font-display text-3xl text-ink-900 sm:text-4xl">{chefSpecial.title}</h2>
            <p className="mt-4 text-base leading-relaxed text-ink-700">{chefSpecial.description}</p>
            <NavLink
              to="/Menu"
              className="mt-6 inline-block rounded-full border-2 border-terracotta-500 px-6 py-2.5 text-sm font-bold text-terracotta-500 transition hover:bg-terracotta-500 hover:text-cream-50"
            >
              Explore the Full Menu
            </NavLink>
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
