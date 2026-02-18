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
        <aside className="rounded-2xl border border-[#e6ecf2] bg-white p-4 shadow-sm">
          <h2 className="px-2 pb-3 text-lg font-bold text-[#1f2937]">Admin Panel</h2>
          <nav className="space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "bg-[#667B68] text-white"
                      : "text-[#334155] hover:bg-[#f8fafc]"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="rounded-2xl border border-[#e6ecf2] bg-white p-5 shadow-sm sm:p-6">
          <Outlet />
        </main>
      </div>
    </section>
  );
}
