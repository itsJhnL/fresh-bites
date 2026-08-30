import { useCallback, useEffect, useState } from "react";
import Skeleton from "../../components/Skeleton";
import EmptyState from "../../components/EmptyState";
import ErrorState from "../../components/ErrorState";
import { fetchAdminUsers } from "../../lib/adminService";

// Consistent pill semantics with the other admin views: sage = elevated
// (admin), a neutral cream pill for the default "customer" role.
const ROLE_BADGE = {
  admin: "bg-sage-100 text-sage-600",
  customer: "bg-cream-200 text-ink-700",
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setUsers(await fetchAdminUsers());
    } catch {
      // The RPC itself is what actually blocks a non-admin (raises "Admin
      // access required.") — this generic message is just what a genuine
      // admin sees if the read itself fails for some other reason.
      setError("Could not load users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-900">Users</h1>
      <p className="mt-1 text-sm text-ink-500">Monitor user accounts and roles.</p>

      {loading ? (
        <div className="mt-5 space-y-2">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : error ? (
        <div className="mt-5">
          <ErrorState message={error} onRetry={load} />
        </div>
      ) : users.length === 0 ? (
        <div className="mt-5">
          <EmptyState title="No users yet" />
        </div>
      ) : (
        <div className="mt-5 overflow-x-auto rounded-lg border border-cream-200">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead className="bg-cream-100 text-ink-500">
              <tr>
                <th className="px-3 py-3 font-semibold">Name</th>
                <th className="px-3 py-3 font-semibold">Email</th>
                <th className="px-3 py-3 font-semibold">Phone</th>
                <th className="px-3 py-3 font-semibold">Role</th>
                <th className="px-3 py-3 font-semibold">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-cream-200 hover:bg-cream-50">
                  <td className="px-3 py-3 font-semibold text-ink-700">{user.full_name || "-"}</td>
                  <td className="px-3 py-3 text-ink-700">{user.email}</td>
                  <td className="px-3 py-3 text-ink-700">{user.phone || "-"}</td>
                  <td className="px-3 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                        ROLE_BADGE[user.role] || "bg-cream-200 text-ink-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-ink-300">{new Date(user.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
