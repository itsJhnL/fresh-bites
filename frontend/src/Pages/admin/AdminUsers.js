import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import CloseIcon from "@mui/icons-material/Close";
import Skeleton from "../../components/Skeleton";
import EmptyState from "../../components/EmptyState";
import ErrorState from "../../components/ErrorState";
import ConfirmDialog from "../../components/ConfirmDialog";
import Toast from "../../components/Toast";
import { useAuth } from "../../context/AuthContext";
import { fetchAdminUsers, setUserRole, createAdminAccount } from "../../lib/adminService";

const ROLE_BADGE = {
  admin: "bg-sage-100 text-sage-600",
  customer: "bg-cream-200 text-ink-700",
};

const STATUS_BADGE = {
  Active: "bg-sage-100 text-sage-600",
  Unconfirmed: "bg-terracotta-100 text-terracotta-600",
  Banned: "bg-red-100 text-red-600",
};

// Derived, not stored — auth.users already has both fields (see
// admin_list_users() in supabase/migrations/011_admin_management_hardening.sql).
// No "banned" workflow exists in this app yet, but the field is real and
// free to surface rather than inventing a fake "Status" value.
function statusOf(user) {
  if (user.banned_until && new Date(user.banned_until) > new Date()) return "Banned";
  if (!user.email_confirmed_at) return "Unconfirmed";
  return "Active";
}

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [detailsUser, setDetailsUser] = useState(null);
  const [roleAction, setRoleAction] = useState(null); // { user, nextRole }
  const [addAdminOpen, setAddAdminOpen] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });
  const [busyUserId, setBusyUserId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setUsers(await fetchAdminUsers());
    } catch {
      setError("Could not load users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const adminCount = useMemo(() => users.filter((u) => u.role === "admin").length, [users]);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    return users.filter((u) => {
      if (roleFilter !== "all" && u.role !== roleFilter) return false;
      if (statusFilter !== "all" && statusOf(u) !== statusFilter) return false;
      if (term) {
        const haystack = `${u.full_name || ""} ${u.email || ""}`.toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      return true;
    });
  }, [users, search, roleFilter, statusFilter]);

  const notify = (message, severity = "success") => setToast({ open: true, message, severity });

  const askRoleChange = (targetUser, nextRole) => {
    if (nextRole === "customer" && adminCount <= 1) {
      notify("You cannot remove the last administrator. Add another administrator first.", "warning");
      return;
    }
    setRoleAction({ user: targetUser, nextRole });
  };

  const confirmRoleChange = async () => {
    if (!roleAction) return;
    const { user: targetUser, nextRole } = roleAction;
    setRoleAction(null);
    setBusyUserId(targetUser.id);
    try {
      await setUserRole(targetUser.id, nextRole);
      notify(nextRole === "admin" ? `${targetUser.full_name || targetUser.email} is now an administrator.` : "Admin access removed.");
      await load();
    } catch (err) {
      notify(err.message || "Could not update this user's role.", "error");
    } finally {
      setBusyUserId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Users</h1>
          <p className="mt-1 text-sm text-ink-500">Manage accounts, roles, and administrator access.</p>
        </div>
        <button
          type="button"
          onClick={() => setAddAdminOpen(true)}
          className="rounded-lg bg-terracotta-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-terracotta-600"
        >
          + Add New Admin
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="min-w-[220px] flex-1 rounded-lg border border-cream-300 px-3 py-2 text-sm outline-none focus:border-sage-400"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-lg border border-cream-300 px-3 py-2 text-sm outline-none focus:border-sage-400"
        >
          <option value="all">All roles</option>
          <option value="admin">Admin</option>
          <option value="customer">Customer</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-cream-300 px-3 py-2 text-sm outline-none focus:border-sage-400"
        >
          <option value="all">All statuses</option>
          <option value="Active">Active</option>
          <option value="Unconfirmed">Unconfirmed</option>
          <option value="Banned">Banned</option>
        </select>
      </div>

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
      ) : filteredUsers.length === 0 ? (
        <div className="mt-5">
          <EmptyState title="No users match these filters" />
        </div>
      ) : (
        <div className="mt-5 overflow-x-auto rounded-lg border border-cream-200">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-cream-100 text-xs font-semibold uppercase tracking-wide text-ink-500">
              <tr>
                <th className="px-3 py-3">User</th>
                <th className="px-3 py-3">Email</th>
                <th className="px-3 py-3">Role</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Created</th>
                <th className="px-3 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => {
                const status = statusOf(u);
                const isSelf = u.id === currentUser?.id;
                const isLastAdmin = u.role === "admin" && adminCount <= 1;
                return (
                  <tr key={u.id} className="border-t border-cream-200 hover:bg-cream-50">
                    <td className="px-3 py-3 font-semibold text-ink-700">
                      <button type="button" onClick={() => setDetailsUser(u)} className="text-left hover:underline">
                        {u.full_name || "-"}
                      </button>
                    </td>
                    <td className="px-3 py-3 text-ink-700">{u.email}</td>
                    <td className="px-3 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${ROLE_BADGE[u.role] || "bg-cream-200 text-ink-700"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_BADGE[status]}`}>{status}</span>
                    </td>
                    <td className="px-3 py-3 text-ink-300">{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="px-3 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setDetailsUser(u)}
                          className="rounded-lg border border-cream-300 px-2.5 py-1 text-xs font-semibold text-ink-700 transition hover:border-sage-400"
                        >
                          View
                        </button>
                        {u.role === "admin" ? (
                          <button
                            type="button"
                            disabled={isSelf || isLastAdmin || busyUserId === u.id}
                            title={isSelf ? "You can't change your own role." : isLastAdmin ? "You cannot remove the last administrator." : undefined}
                            onClick={() => askRoleChange(u, "customer")}
                            className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Remove Admin Access
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={busyUserId === u.id}
                            onClick={() => askRoleChange(u, "admin")}
                            className="rounded-lg border border-sage-300 px-2.5 py-1 text-xs font-semibold text-sage-700 transition hover:bg-sage-50 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Make Admin
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <UserDetailsDialog user={detailsUser} onClose={() => setDetailsUser(null)} />

      <AddAdminDialog
        open={addAdminOpen}
        onClose={() => setAddAdminOpen(false)}
        onCreated={async () => {
          setAddAdminOpen(false);
          notify("Administrator account created.");
          await load();
        }}
      />

      <ConfirmDialog
        open={Boolean(roleAction)}
        title={roleAction?.nextRole === "admin" ? "Make this user an admin?" : "Remove admin access?"}
        message={
          roleAction?.nextRole === "admin"
            ? "This user will gain access to the FreshBites Admin Dashboard and administrative functionality."
            : "This user will lose access to the FreshBites Admin Dashboard."
        }
        confirmLabel={roleAction?.nextRole === "admin" ? "Make Admin" : "Remove Access"}
        destructive={roleAction?.nextRole !== "admin"}
        onConfirm={confirmRoleChange}
        onCancel={() => setRoleAction(null)}
      />

      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      />
    </div>
  );
}

function UserDetailsDialog({ user, onClose }) {
  if (!user) return null;
  const status = statusOf(user);
  return (
    <Dialog open={Boolean(user)} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span className="text-lg font-bold text-ink-900">User Details</span>
        <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-1 text-ink-500 hover:bg-cream-100">
          <CloseIcon fontSize="small" />
        </button>
      </DialogTitle>
      <DialogContent>
        <dl className="grid gap-3 pb-2 text-sm">
          <Row label="Name" value={user.full_name || "—"} />
          <Row label="Email" value={user.email} />
          <Row label="Role" value={<span className="capitalize">{user.role}</span>} />
          <Row label="Status" value={status} />
          <Row label="Phone" value={user.phone || "—"} />
          <Row label="Created" value={new Date(user.created_at).toLocaleString()} />
          <Row label="User ID" value={<span className="break-all font-mono text-xs text-ink-500">{user.id}</span>} />
        </dl>
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-ink-300">{label}</dt>
      <dd className="mt-0.5 text-ink-900">{value}</dd>
    </div>
  );
}

const EMPTY_ADMIN_FORM = { fullName: "", email: "", password: "" };

function AddAdminDialog({ open, onClose, onCreated }) {
  const [form, setForm] = useState(EMPTY_ADMIN_FORM);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    if (open) {
      setForm(EMPTY_ADMIN_FORM);
      setError("");
    }
  }, [open]);

  const updateField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmittingRef.current) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    isSubmittingRef.current = true;
    setSaving(true);
    setError("");
    try {
      await createAdminAccount({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      await onCreated();
    } catch (err) {
      setError(err.message || "Could not create this administrator account.");
    } finally {
      isSubmittingRef.current = false;
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span className="text-lg font-bold text-ink-900">Add New Admin</span>
        <button type="button" onClick={onClose} disabled={saving} aria-label="Close" className="rounded-lg p-1 text-ink-500 hover:bg-cream-100 disabled:opacity-50">
          <CloseIcon fontSize="small" />
        </button>
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} className="grid gap-3 pt-1 pb-2">
          <p className="text-xs text-ink-500">
            Creates a new, pre-confirmed Supabase account with administrator access. The account can sign in at
            /admin/login immediately with the password set here.
          </p>
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-700">Full Name</label>
            <input
              value={form.fullName}
              onChange={(e) => updateField("fullName", e.target.value)}
              className="w-full rounded-lg border border-cream-300 px-3 py-2 text-sm outline-none focus:border-sage-400"
              autoFocus
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-700">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              className="w-full rounded-lg border border-cream-300 px-3 py-2 text-sm outline-none focus:border-sage-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-700">Temporary Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
              className="w-full rounded-lg border border-cream-300 px-3 py-2 text-sm outline-none focus:border-sage-400"
              placeholder="At least 8 characters"
            />
          </div>
          {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
          <div className="mt-1 flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-terracotta-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-terracotta-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Creating..." : "Create Admin"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border border-cream-300 px-4 py-2 text-sm font-semibold text-ink-700 transition hover:bg-cream-100 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
