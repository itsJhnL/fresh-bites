import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";

export default function NotFound404() {
  return (
    <section className="bg-cream-100 px-5 py-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mx-auto max-w-2xl rounded-xl border border-cream-200 bg-cream-50 p-8 text-center shadow-card sm:p-12"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-terracotta-50 text-terracotta-500">
          <RestaurantOutlinedIcon fontSize="medium" />
        </div>
        <p className="mt-5 text-sm font-semibold uppercase tracking-[0.2em] text-terracotta-500">
          Error 404
        </p>
        <h1 className="mt-3 font-display text-4xl text-ink-900 sm:text-5xl">
          Page Not Found
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink-500 sm:text-base">
          The page you're looking for might have been moved, removed, or never
          existed. Let's get you back to something worth ordering.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <NavLink
            to="/"
            className="rounded-full bg-terracotta-500 px-6 py-2.5 text-sm font-bold text-cream-50 transition hover:bg-terracotta-600"
          >
            Go Home
          </NavLink>
          <NavLink
            to="/Menu"
            className="rounded-full border-2 border-sage-500 px-6 py-2.5 text-sm font-bold text-sage-500 transition hover:bg-sage-500 hover:text-cream-50"
          >
            Browse Menu
          </NavLink>
        </div>
      </motion.div>
    </section>
  );
}
