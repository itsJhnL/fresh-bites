import LocationOnIcon from "@mui/icons-material/LocationOn";
import CallIcon from "@mui/icons-material/Call";
import AttachEmailIcon from "@mui/icons-material/AttachEmail";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Every link below routes somewhere real — no social icons, since no real
// FreshBite social accounts exist yet and a placeholder-looking
// facebook.com/x.com/youtube.com link is worse than no icon at all.
const MEAL_LINKS = [
  { to: "/Menu?meal=breakfast", label: "Breakfast" },
  { to: "/Menu?meal=lunch", label: "Lunch" },
  { to: "/Menu?meal=dinner", label: "Dinner" },
  { to: "/Menu", label: "All Dishes" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <footer className="mt-16 border-t border-cream-200 bg-cream-100">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4 sm:col-span-2 lg:col-span-1">
          <h2 className="font-display text-3xl italic text-terracotta-500">Fresh Bites</h2>
          <p className="text-sm leading-relaxed text-ink-700">
            Freshly prepared meals delivered fast. Order your favorites anytime.
          </p>
          <div className="space-y-2 text-sm text-ink-700">
            <a
              href="https://www.google.com/maps/search/?api=1&query=Nueva+Ecija%2C+Philippines"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition hover:text-terracotta-500"
            >
              <LocationOnIcon fontSize="small" />
              Nueva Ecija, Philippines
            </a>
            <a href="tel:+639123456789" className="flex items-center gap-2 transition hover:text-terracotta-500">
              <CallIcon fontSize="small" />
              +63 912 345 6789
            </a>
            <a
              href="mailto:info@freshbites.com"
              className="flex items-center gap-2 transition hover:text-terracotta-500"
            >
              <AttachEmailIcon fontSize="small" />
              info@freshbites.com
            </a>
          </div>
        </div>

        <div>
          <h3 className="pb-4 text-sm font-bold uppercase tracking-wide text-ink-900">Menu</h3>
          <div className="space-y-2 text-sm text-ink-700">
            {MEAL_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} className="block transition hover:text-terracotta-500">
                {link.label}
              </NavLink>
            ))}
            <NavLink to="/Menu?view=favorites" className="block transition hover:text-terracotta-500">
              Favorites
            </NavLink>
          </div>
        </div>

        <div>
          <h3 className="pb-4 text-sm font-bold uppercase tracking-wide text-ink-900">Quick Links</h3>
          <div className="space-y-2 text-sm text-ink-700">
            <NavLink to="/" className="block transition hover:text-terracotta-500">
              Home
            </NavLink>
            <NavLink to="/About" className="block transition hover:text-terracotta-500">
              About
            </NavLink>
            <NavLink to="/Contact" className="block transition hover:text-terracotta-500">
              Contact
            </NavLink>
            <NavLink to="/Cart" className="block transition hover:text-terracotta-500">
              Your Cart
            </NavLink>
          </div>
        </div>

        <div>
          <h3 className="pb-4 text-sm font-bold uppercase tracking-wide text-ink-900">Account</h3>
          <div className="space-y-2 text-sm text-ink-700">
            {isAuthenticated ? (
              <>
                <NavLink to="/orders" className="block transition hover:text-terracotta-500">
                  My Orders
                </NavLink>
                <NavLink to="/profile" className="block transition hover:text-terracotta-500">
                  Profile
                </NavLink>
              </>
            ) : (
              <>
                <NavLink to="/User" className="block transition hover:text-terracotta-500">
                  Login
                </NavLink>
                <NavLink to="/Register" className="block transition hover:text-terracotta-500">
                  Register
                </NavLink>
              </>
            )}
            {isAdmin && (
              <NavLink to="/admin" className="block transition hover:text-terracotta-500">
                Admin Panel
              </NavLink>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-cream-200 px-5 py-4 text-center text-sm text-ink-500">
        <p className="font-medium">All Rights Reserved &copy; {currentYear} Fresh Bites</p>
        <p className="mt-1 font-medium text-ink-700">
          Made by{" "}
          <a
            href="https://janggodev.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-terracotta-500 underline underline-offset-2 hover:text-terracotta-600"
          >
            JanggoDev
          </a>
        </p>
      </div>
    </footer>
  );
}
