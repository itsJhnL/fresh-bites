/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    // Standard Tailwind breakpoints (sm 640 / md 768 / lg 1024 / xl 1280 /
    // 2xl 1536). Don't reintroduce a custom `screens` override without
    // checking every sm:/md:/lg: usage in the app — a prior override here
    // (sm: "1px") silently broke every "hidden on mobile" pattern in the app.
    extend: {
      colors: {
        // FreshBite's committed palette (see DESIGN.md) — warm editorial
        // restaurant, not a generic SaaS blue/purple system. Prefer these
        // tokens over new arbitrary hex values in new work; the remaining
        // inline hex classes are being migrated to these incrementally.
        cream: {
          50: "#FFFDF9",
          100: "#FDF6EC",
          200: "#F7EAD8",
          300: "#EEDCC2",
        },
        ink: {
          900: "#241C15",
          700: "#453A2E",
          500: "#7A6C5B",
          300: "#A8998A",
        },
        terracotta: {
          50: "#FDF0EA",
          100: "#FBE1D3",
          400: "#D9713F",
          500: "#C1502D",
          600: "#A23F21",
          700: "#82331B",
        },
        sage: {
          50: "#F1F4EC",
          100: "#E1E9D5",
          400: "#5D7248",
          500: "#4B5D3A",
          600: "#3C4A2E",
          700: "#2F3A24",
        },
        gold: {
          400: "#C88A1F",
          500: "#A8730F",
        },
        // Added for the homepage hero/highlight redesign + header logo —
        // the reference palette's dark green and near-black text didn't
        // have a close enough match in the tokens above (sage/ink are both
        // warmer/more olive-brown than this reference's cooler pine-green
        // and green-gray). terracotta-500 and cream-100 WERE close enough
        // to the reference's accent-orange/cream-background and are reused
        // as-is rather than duplicated here.
        pine: {
          50: "#E8F1E6",
          600: "#2E4A3B",
        },
        graphite: {
          500: "#5B635A",
          900: "#1F2A22",
        },
      },
      fontFamily: {
        // Display serif with real editorial character for headings/hero
        // copy — never the workhorse UI sans at display size.
        display: ["\"Ibarra Real Nova\"", "Georgia", "serif"],
        // Body/UI sans for everything functional: forms, tables, nav,
        // buttons, cart, checkout, admin.
        sans: ["Figtree", "system-ui", "sans-serif"],
        // Added for the homepage hero/highlight redesign + header logo
        // (see index.css for the Google Fonts import). Deliberately
        // additive — `display`/`sans` above are untouched, so every other
        // page keeps rendering in Ibarra Real Nova/Figtree exactly as before.
        playfair: ["\"Playfair Display\"", "Georgia", "serif"],
        inter: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        // One soft elevation tier, used deliberately, not stacked.
        card: "0 1px 2px rgba(36,28,21,0.04), 0 8px 24px -12px rgba(36,28,21,0.18)",
      },
    },
  },
  plugins: [],
};
