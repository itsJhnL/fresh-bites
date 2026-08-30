import { useCallback, useEffect, useState } from "react";
import Skeleton from "../../components/Skeleton";
import ErrorState from "../../components/ErrorState";
import { fetchDashboardStats } from "../../lib/adminService";
import { formatPeso } from "../../utils/money";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    return fetchDashboardStats()
      .then(setStats)
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
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <div className="mt-6">
          <ErrorState message={error} onRetry={load} />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <Card label="Total Orders" value={stats.totalOrders} />
          <Card label="Today's Orders" value={stats.todayOrders} />
          <Card label="Revenue" value={formatPeso(stats.revenue)} />
          <Card label="Customers" value={stats.customers} />
          <Card label="Available Menu Items" value={stats.availableMenuItems} />
        </div>
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
