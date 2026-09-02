import { useCallback, useEffect, useState } from "react";
import Skeleton from "../../components/Skeleton";
import ErrorState from "../../components/ErrorState";
import EmptyState from "../../components/EmptyState";
import { fetchDashboardStats, fetchRecentActivity } from "../../lib/adminService";
import { formatPeso } from "../../utils/money";

// Turns a stored action string ("menu_item_created") into a readable
// sentence for the activity feed — see admin_activity_log in
// supabase/migrations/011_admin_management_hardening.sql for the exact set
// of actions this project ever writes.
const ACTIVITY_LABEL = {
  menu_item_created: "added menu item",
  menu_item_updated: "updated menu item",
  menu_item_availability_changed: "changed availability of",
  menu_item_deleted: "deleted menu item",
  category_created: "added category",
  category_updated: "updated category",
  category_deleted: "deleted category",
  user_promoted_to_admin: "promoted a user to admin",
  admin_access_removed: "removed admin access from a user",
  admin_account_created: "created a new admin account",
};

function describeActivity(entry) {
  const verb = ACTIVITY_LABEL[entry.action] || entry.action;
  const name = entry.metadata?.name || entry.metadata?.email;
  return `${entry.actorName}${name ? ` ${verb} "${name}"` : ` ${verb}`}`;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    return Promise.all([fetchDashboardStats(), fetchRecentActivity()])
      .then(([statsData, activityData]) => {
        setStats(statsData);
        setActivity(activityData);
      })
      .catch(() => setError("Could not load dashboard stats."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-900">Dashboard</h1>
      <p className="mt-1 text-sm text-ink-500">Overview of current platform performance.</p>

      {loading ? (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {[0, 1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {[0, 1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        </>
      ) : error ? (
        <div className="mt-6">
          <ErrorState message={error} onRetry={load} />
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Card label="Total Orders" value={stats.totalOrders} />
            <Card label="Today's Orders" value={stats.todayOrders} />
            <Card label="Revenue" value={formatPeso(stats.revenue)} />
            <Card label="Available Menu Items" value={stats.availableMenuItems} />
          </div>

          <h2 className="mt-10 text-sm font-bold uppercase tracking-wide text-ink-500">Menu Management</h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <Card label="Total Menu Items" value={stats.totalMenuItems} />
            <Card label="Active Items" value={stats.availableMenuItems} />
            <Card label="Inactive Items" value={stats.inactiveMenuItems} />
            <Card label="Categories" value={stats.categoriesCount} />
            <Card label="Added Last 7 Days" value={stats.recentMenuItems} />
          </div>

          <h2 className="mt-10 text-sm font-bold uppercase tracking-wide text-ink-500">Users</h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-3">
            <Card label="Total Users" value={stats.totalUsers} />
            <Card label="Customers" value={stats.customers} />
            <Card label="Administrators" value={stats.administrators} />
          </div>

          <h2 className="mt-10 text-sm font-bold uppercase tracking-wide text-ink-500">Recent Activity</h2>
          <div className="mt-3 rounded-xl border border-cream-200 bg-cream-50 p-2">
            {activity.length === 0 ? (
              <EmptyState title="No admin activity yet" message="Menu, category, and user-role changes will show up here." />
            ) : (
              <ul className="divide-y divide-cream-200">
                {activity.map((entry) => (
                  <li key={entry.id} className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm">
                    <span className="text-ink-700">{describeActivity(entry)}</span>
                    <span className="shrink-0 text-xs text-ink-300">{new Date(entry.created_at).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function Card({ label, value }) {
  return (
    <div className="rounded-xl border border-cream-200 bg-cream-50 p-5 shadow-card">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-ink-900">{value}</p>
    </div>
  );
}
