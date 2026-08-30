import { NavLink, Outlet } from "react-router-dom";

const links = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/menu", label: "Menu Manager" },
  { to: "/admin/users", label: "Users" },
];

export default function AdminLayout() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-8">
      <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
        {/* min-w-0 for the same reason as <main> below: this is a grid item
            (the `grid` wrapper above applies at every width, not just lg:)
            containing a horizontally-scrollable nav — without it, the grid
            item won't shrink below the nav pills' combined content width on
            narrow screens, and overflow-x-auto never gets a chance to kick
            in because the item (and the page) grows to fit them instead. */}
        <aside className="min-w-0 rounded-xl border border-cream-200 bg-cream-50 p-4 shadow-card">
          <h2 className="px-2 pb-3 text-lg font-bold text-ink-900">Admin Panel</h2>
          <nav className="flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-1 lg:overflow-visible lg:pb-0">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `block shrink-0 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "bg-sage-500 text-white"
                      : "text-ink-700 hover:bg-cream-100"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* A <div>, not <main> — App.js already wraps every route's output
            in the document's one <main> landmark, and nesting a second
            <main> inside it would be invalid HTML.
            min-w-0 overrides a grid item's default min-width:auto, which
            otherwise refuses to shrink below the content's intrinsic width
            (here, a table with min-w-[720px]) and pushes the whole page
            into horizontal scroll instead of letting the table's own
            overflow-x-auto contain it. */}
        <div className="min-w-0 rounded-xl border border-cream-200 bg-cream-50 p-5 shadow-card sm:p-6">
          <Outlet />
        </div>
      </div>
    </section>
  );
}
