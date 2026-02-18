import LocationOnIcon from "@mui/icons-material/LocationOn";
import CallIcon from "@mui/icons-material/Call";
import AttachEmailIcon from "@mui/icons-material/AttachEmail";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { NavLink } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t border-[#efe3d8] bg-[linear-gradient(180deg,#fffdfb_0%,#fff7ef_100%)]">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <h2 className="Pacifico text-4xl font-normal text-[#00213F]">Fresh Bites</h2>
          <p className="text-sm leading-relaxed text-[#475569]">
            Freshly prepared meals delivered fast. Order your favorites anytime.
          </p>
          <div className="space-y-2 text-sm text-[#334155]">
            <a
              href="https://www.google.com/search?q=nueva+ecija+philippines"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-[#FF785B]"
            >
              <LocationOnIcon fontSize="small" />
              Nueva Ecija, Philippines
            </a>
            <a
              href="tel:+639123456789"
              className="flex items-center gap-2 hover:text-[#FF785B]"
            >
              <CallIcon fontSize="small" />
              +63 912 345 6789
            </a>
            <a
              href="mailto:info@freshbites.com"
              className="flex items-center gap-2 hover:text-[#FF785B]"
            >
              <AttachEmailIcon fontSize="small" />
              info@freshbites.com
            </a>
          </div>
        </div>

        <div>
          <h3 className="pb-4 text-base font-bold text-[#00213F]">Our Menu</h3>
          <div className="space-y-2 text-sm text-[#475569]">
            <p>Break Fast</p>
            <p>Lunch</p>
            <p>Dinner</p>
            <p>All Dishes</p>
          </div>
        </div>

        <div>
          <h3 className="pb-4 text-base font-bold text-[#00213F]">Quick Links</h3>
          <div className="space-y-2 text-sm text-[#475569]">
            <NavLink to="/" className="block hover:text-[#FF785B]">
              Home
            </NavLink>
            <NavLink to="/Menu" className="block hover:text-[#FF785B]">
              Menu
            </NavLink>
            <NavLink to="/Contact" className="block hover:text-[#FF785B]">
              Contact
            </NavLink>
            <NavLink to="/Menu?view=cart" className="block hover:text-[#FF785B]">
              Your Cart
            </NavLink>
          </div>
        </div>

        <div>
          <h3 className="pb-4 text-base font-bold text-[#00213F]">Socials</h3>
          <div className="flex items-center gap-3 text-[#334155]">
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-[#e5d5c9] p-2 transition hover:border-[#FF785B] hover:text-[#FF785B]"
              aria-label="Facebook"
            >
              <FacebookIcon fontSize="small" />
            </a>
            <a
              href="https://x.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-[#e5d5c9] p-2 transition hover:border-[#FF785B] hover:text-[#FF785B]"
              aria-label="Twitter"
            >
              <TwitterIcon fontSize="small" />
            </a>
            <a
              href="https://www.youtube.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-[#e5d5c9] p-2 transition hover:border-[#FF785B] hover:text-[#FF785B]"
              aria-label="YouTube"
            >
              <YouTubeIcon fontSize="small" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-[#f1e6dd] bg-[#fffaf5] px-5 py-4 text-center text-sm text-[#64748b]">
        <p className="font-medium">All Rights Reserved &copy; {currentYear} Fresh Bites</p>
        <p className="mt-1 font-medium text-[#334155]">
          Made by{" "}
          <a
            href="https://janggodev.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[#ff785b] underline underline-offset-2 hover:text-[#d95f43]"
          >
            JanggoDev
          </a>
        </p>
      </div>
    </footer>
  );
}
