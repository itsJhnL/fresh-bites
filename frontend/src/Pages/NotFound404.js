import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

export default function NotFound404() {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_#fff6ed_0%,_#fffaf5_45%,_#fffdfb_100%)] px-5 py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-16 top-12 h-40 w-40 rounded-full bg-[#ff785b]/20 blur-3xl" />
        <div className="absolute right-0 top-28 h-52 w-52 rounded-full bg-[#667B68]/15 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative mx-auto max-w-3xl rounded-3xl border border-[#f0e3d8] bg-white/90 p-8 text-center shadow-[0_12px_35px_rgba(0,0,0,0.08)] sm:p-12"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#ff785b]">
          Error 404
        </p>
        <h1 className="mt-3 text-4xl font-extrabold text-[#1f2937] sm:text-5xl">
          Page Not Found
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#64748b] sm:text-base">
          The page you are looking for might have been moved, removed, or never
          existed. Let us get you back to Fresh Bites.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <NavLink
            to="/"
            className="rounded-xl bg-[#667B68] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#556657]"
          >
            Go Home
          </NavLink>
          <NavLink
            to="/Menu"
            className="rounded-xl border border-[#d9e1d2] bg-white px-5 py-2.5 text-sm font-semibold text-[#435334] transition hover:border-[#667B68]"
          >
            Browse Menu
          </NavLink>
        </div>
      </motion.div>
    </section>
  );
}
