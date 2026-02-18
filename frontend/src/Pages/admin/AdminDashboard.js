import { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";

const fallbackStats = {
  totalOrders: 128,
  pendingOrders: 14,
  totalUsers: 86,
  totalSales: "P48,900.00",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(fallbackStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await adminApi.getDashboardStats();
        setStats(response.data);
      } catch {
        setStats(fallbackStats);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1f2937]">Dashboard</h1>
      <p className="mt-1 text-sm text-[#64748b]">
        {loading ? "Loading stats..." : "Overview of current platform performance."}
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card label="Total Orders" value={stats.totalOrders} />
        <Card label="Pending Orders" value={stats.pendingOrders} />
        <Card label="Total Users" value={stats.totalUsers} />
        <Card label="Total Sales" value={stats.totalSales} />
      </div>
    </div>
  );
}

function Card({ label, value }) {
  return (
    <div className="rounded-xl border border-[#ecf1f5] bg-[#fbfdff] p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#64748b]">{label}</p>
      <p className="mt-2 text-2xl font-bold text-[#1f2937]">{value}</p>
    </div>
  );
}
