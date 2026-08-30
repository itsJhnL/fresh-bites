import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "../components/Toast";
import PersonIcon from "@mui/icons-material/Person";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer.jsx";
import AddressManager from "../components/AddressManager";
import { updateProfile } from "../lib/profileService";

export default function Profile() {
  const navigate = useNavigate();
  const { user, profile, refreshUser, logout } = useAuth();
  const [form, setForm] = useState({ fullName: "", phone: "", avatarUrl: "" });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  // Sync from context whenever profile changes, rather than a one-time
  // useState initializer — profile can still be loading on first render.
  useEffect(() => {
    setForm({
      fullName: profile?.full_name || "",
      phone: profile?.phone || "",
      avatarUrl: profile?.avatar_url || "",
    });
  }, [profile]);

  const updateField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const handleSave = async (event) => {
    event.preventDefault();
    if (!form.fullName.trim()) {
      setToast({ open: true, message: "Please enter your name.", severity: "warning" });
      return;
    }
    setSaving(true);
    try {
      await updateProfile(user.id, form);
      await refreshUser();
      setToast({ open: true, message: "Profile updated.", severity: "success" });
    } catch {
      setToast({ open: true, message: "Could not update your profile. Please try again.", severity: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const initials = (form.fullName || user?.email || "")
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <>
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-5 md:py-14">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl text-ink-900 sm:text-4xl">My Account</h1>
            <p className="mt-1 text-sm text-ink-500">Manage your profile, delivery addresses, and orders.</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            <LogoutIcon fontSize="small" />
            Logout
          </button>
        </div>

        {/* Order history — a real, clearly-clickable action, not a bare link. */}
        <button
          type="button"
          onClick={() => navigate("/orders")}
          className="mb-6 flex w-full items-center gap-4 rounded-xl border border-cream-200 bg-white p-4 text-left shadow-card transition hover:border-terracotta-400 sm:p-5"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-terracotta-50 text-terracotta-500">
            <ReceiptLongIcon fontSize="small" />
          </span>
          <span className="flex-1">
            <span className="block text-sm font-bold text-ink-900">Order History</span>
            <span className="block text-sm text-ink-500">Track current orders and review past ones.</span>
          </span>
          <ChevronRightIcon className="shrink-0 text-ink-300" />
        </button>

        <div className="rounded-xl border border-cream-200 bg-white p-6 shadow-card sm:p-8">
          <div className="mb-6 flex items-center gap-2">
            <PersonIcon className="text-terracotta-500" fontSize="small" />
            <div>
              <h2 className="font-display text-xl text-ink-900">Profile Details</h2>
              <p className="text-sm text-ink-500">Update your name and contact information.</p>
            </div>
          </div>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="flex shrink-0 justify-center sm:justify-start">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-cream-300 bg-cream-100 text-xl font-bold text-ink-500">
                {form.avatarUrl ? (
                  <img src={form.avatarUrl} alt="Profile avatar" className="h-full w-full object-cover" />
                ) : (
                  initials || <PersonIcon className="text-ink-300" />
                )}
              </div>
            </div>

            <form onSubmit={handleSave} className="grid flex-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-semibold text-ink-700">Email</label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full rounded-lg border border-cream-200 bg-cream-50 px-3 py-2 text-sm text-ink-300"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-ink-700">Full Name</label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  className="w-full rounded-lg border border-cream-300 px-3 py-2 text-sm outline-none focus:border-sage-500"
                  placeholder="Juan Dela Cruz"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-ink-700">Phone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className="w-full rounded-lg border border-cream-300 px-3 py-2 text-sm outline-none focus:border-sage-500"
                  placeholder="09XXXXXXXXX"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-semibold text-ink-700">Avatar URL (optional)</label>
                <input
                  type="url"
                  value={form.avatarUrl}
                  onChange={(e) => updateField("avatarUrl", e.target.value)}
                  className="w-full rounded-lg border border-cream-300 px-3 py-2 text-sm outline-none focus:border-sage-500"
                  placeholder="https://..."
                />
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-terracotta-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-terracotta-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-cream-200 bg-white p-6 shadow-card sm:p-8">
          <div className="mb-6 flex items-center gap-2">
            <LocationOnIcon className="text-terracotta-500" fontSize="small" />
            <div>
              <h2 className="font-display text-xl text-ink-900">Delivery Addresses</h2>
              <p className="text-sm text-ink-500">Manage where we deliver your orders.</p>
            </div>
          </div>
          <AddressManager userId={user?.id} />
        </div>
      </section>

      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      />
      <Footer />
    </>
  );
}
