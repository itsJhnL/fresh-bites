import { useState } from "react";
import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import { useShop } from "../context/ShopContext";
import { useAuth } from "../context/AuthContext";

// Logo/wordmark reinstated per the latest homepage reference (reverses the
// earlier "no logo in the header" decision — a deliberate direction change,
// not an oversight). Since Navbar is shared by every route, this and the
// rest of this file's styling apply site-wide, not just to the homepage.
const PRIMARY_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/Menu", label: "Menu" },
  { to: "/About", label: "About" },
  { to: "/Contact", label: "Contact" },
];

function CountBadge({ count }) {
  if (!count) return null;
  return (
    <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-terracotta-500 px-1 text-[10px] font-bold text-cream-50">
      {count}
    </span>
  );
}

function IconLink({ to, label, icon, count, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      aria-label={label}
      className="relative text-ink-700 transition hover:text-terracotta-500"
    >
      {icon}
      <CountBadge count={count} />
    </NavLink>
  );
}

export default function Navbar() {
  const { favoritesCount, cartCount } = useShop();
  const { isAuthenticated, isAdmin } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const scrollUp = () => window.scrollTo({ top: 0, behavior: "auto" });
  const closeDrawer = () => setDrawerOpen(false);
  const accountPath = isAuthenticated ? "/profile" : "/User";

  return (
    <>
    {/* backdrop-blur-sm below intentionally wraps ONLY <nav> — CSS spec
        makes an element with an active backdrop-filter/filter the
        containing block for `position: fixed` descendants, which broke the
        mobile drawer/backdrop below (they'd resolve `fixed` against this
        thin sticky bar instead of the viewport, corrupting their layout
        and compositing). Keeping the drawer as a sibling avoids that trap. */}
    <div className="sticky top-0 z-50 border-b border-cream-200 bg-cream-50/95 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
        {/* Tagline hides below sm: — at 320px its letter-spaced caps text is
            wider than "Fresh Bites" itself and was pushing the header past
            the viewport (confirmed: 20px horizontal overflow on every
            page, since Navbar is global — measured, not guessed). */}
        <NavLink to="/" end onClick={scrollUp} className="flex min-w-0 items-center gap-1.5 sm:gap-2" aria-label="FreshBite home">
          <SpaOutlinedIcon className="shrink-0 text-pine-600" fontSize="medium" />
          <span className="min-w-0 leading-tight">
            <span className="font-playfair text-lg font-semibold text-graphite-900 sm:text-2xl">
              Fresh <span className="italic text-terracotta-500">Bites</span>
            </span>
            <span className="hidden font-inter text-[10px] font-medium uppercase tracking-[0.15em] text-graphite-500 sm:block">
              Real food. Made to order.
            </span>
          </span>
        </NavLink>

        <div className="hidden items-center gap-8 lg:flex">
          {PRIMARY_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={scrollUp}
              className={({ isActive }) =>
                `border-b-2 pb-0.5 text-sm font-semibold transition ${
                  isActive
                    ? "border-terracotta-500 text-terracotta-500"
                    : "border-transparent text-ink-900 hover:text-terracotta-500"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-5">
          <span className="hidden lg:inline-flex">
            <IconLink to="/Menu" label="Search the menu" icon={<SearchIcon />} onClick={scrollUp} />
          </span>
          <span className="hidden lg:inline-flex">
            <IconLink
              to="/Menu?view=favorites"
              label="Favorites"
              icon={<FavoriteBorderIcon fontSize="small" />}
              count={favoritesCount}
              onClick={scrollUp}
            />
          </span>
          <IconLink
            to="/Cart"
            label="Cart"
            icon={<ShoppingCartOutlinedIcon />}
            count={cartCount}
            onClick={scrollUp}
          />
          <span className="hidden lg:inline-flex">
            <IconLink to={accountPath} label="Account" icon={<PersonOutlineOutlinedIcon />} onClick={scrollUp} />
          </span>
          {isAdmin && (
            <NavLink
              to="/admin"
              onClick={scrollUp}
              className="hidden rounded-full border border-sage-500 px-3 py-1 text-xs font-bold text-sage-600 transition hover:bg-sage-50 lg:inline-flex"
            >
              Admin
            </NavLink>
          )}
          {/* Primary CTA — the header's one job besides navigation. */}
          <NavLink
            to="/Menu"
            onClick={scrollUp}
            className="hidden rounded-full bg-terracotta-500 px-5 py-2 text-sm font-bold text-cream-50 transition hover:bg-terracotta-600 lg:inline-flex"
          >
            Order Now
          </NavLink>

          <button
            type="button"
            onClick={() => setDrawerOpen((open) => !open)}
            aria-label={drawerOpen ? "Close menu" : "Open menu"}
            aria-expanded={drawerOpen}
            className="rounded-lg p-1 text-ink-900 transition hover:text-terracotta-500 lg:hidden"
          >
            {drawerOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>
    </div>

      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={closeDrawer}
              className="fixed inset-0 z-40 bg-ink-900/30 lg:hidden"
              aria-hidden="true"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="fixed right-0 top-0 z-50 h-full w-[78vw] max-w-xs bg-cream-50 p-6 shadow-card lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold uppercase tracking-wide text-ink-500">Menu</span>
                <button
                  type="button"
                  onClick={closeDrawer}
                  aria-label="Close menu"
                  className="rounded-lg p-1 text-ink-700 hover:text-terracotta-500"
                >
                  <CloseIcon />
                </button>
              </div>

              <div className="mt-8 flex flex-col gap-1">
                {PRIMARY_LINKS.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.end}
                    onClick={() => {
                      scrollUp();
                      closeDrawer();
                    }}
                    className={({ isActive }) =>
                      `rounded-lg px-3 py-2.5 text-base font-semibold ${
                        isActive ? "bg-terracotta-50 text-terracotta-500" : "text-ink-900 hover:bg-cream-100"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
                <NavLink
                  to="/Menu?view=favorites"
                  onClick={closeDrawer}
                  className="flex items-center justify-between rounded-lg px-3 py-2.5 text-base font-semibold text-ink-900 hover:bg-cream-100"
                >
                  Favorites
                  {favoritesCount > 0 && (
                    <span className="rounded-full bg-terracotta-100 px-2 py-0.5 text-xs font-bold text-terracotta-600">
                      {favoritesCount}
                    </span>
                  )}
                </NavLink>
                <NavLink
                  to={accountPath}
                  onClick={closeDrawer}
                  className="rounded-lg px-3 py-2.5 text-base font-semibold text-ink-900 hover:bg-cream-100"
                >
                  {isAuthenticated ? "My Account" : "Login / Sign Up"}
                </NavLink>
                {isAdmin && (
                  <NavLink
                    to="/admin"
                    onClick={closeDrawer}
                    className="rounded-lg px-3 py-2.5 text-base font-semibold text-sage-600 hover:bg-sage-50"
                  >
                    Admin Panel
                  </NavLink>
                )}
                <NavLink
                  to="/Menu"
                  onClick={closeDrawer}
                  className="mt-3 rounded-lg bg-terracotta-500 px-3 py-3 text-center text-base font-bold text-cream-50 transition hover:bg-terracotta-600"
                >
                  Order Now
                </NavLink>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
