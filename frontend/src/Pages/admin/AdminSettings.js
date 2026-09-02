import { useCallback, useEffect, useRef, useState } from "react";
import Skeleton from "../../components/Skeleton";
import ErrorState from "../../components/ErrorState";
import Toast from "../../components/Toast";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import { fetchRestaurantSettings, updateRestaurantSettings } from "../../lib/settingsService";
import { uploadMenuImage, validateImageFile } from "../../lib/storageService";

// Backed by the real restaurant_settings singleton (see
// supabase/migrations/012_restaurant_settings.sql) — every field here is
// admin-editable and actually stored, and delivery_fee is genuinely
// load-bearing (create_order() and the customer cart both read it). Only
// fields the rest of the app can plausibly use are included — no currency
// selector, since peso formatting is hardcoded app-wide (utils/money.js).
function toForm(settings) {
  return {
    restaurantName: settings?.restaurant_name || "",
    description: settings?.description || "",
    contactEmail: settings?.contact_email || "",
    contactPhone: settings?.contact_phone || "",
    address: settings?.address || "",
    openingHours: settings?.opening_hours || "",
    deliveryFee: String(settings?.delivery_fee ?? "49"),
    logoUrl: settings?.logo_url || "",
    heroImageUrl: settings?.hero_image_url || "",
  };
}

export default function AdminSettings() {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });
  const isSubmittingRef = useRef(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setForm(toForm(await fetchRestaurantSettings()));
    } catch {
      setError("Could not load settings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const handleImagePick = async (field, event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const validationError = validateImageFile(file);
    if (validationError) {
      setToast({ open: true, message: validationError, severity: "error" });
      return;
    }
    try {
      const { publicUrl } = await uploadMenuImage(file);
      updateField(field, publicUrl);
    } catch {
      setToast({ open: true, message: "Could not upload this image. Please try again.", severity: "error" });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmittingRef.current) return;
    const fee = Number(form.deliveryFee);
    if (!Number.isFinite(fee) || fee < 0) {
      setSaveError("Delivery fee must be a non-negative number.");
      return;
    }

    isSubmittingRef.current = true;
    setSaving(true);
    setSaveError("");
    try {
      await updateRestaurantSettings(form);
      setToast({ open: true, message: "Settings saved.", severity: "success" });
    } catch {
      setSaveError("Could not save settings. Please try again.");
    } finally {
      isSubmittingRef.current = false;
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-900">Settings</h1>
      <p className="mt-1 text-sm text-ink-500">Restaurant information, business details, and branding.</p>

      {loading ? (
        <div className="mt-6 space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : error ? (
        <div className="mt-6">
          <ErrorState message={error} onRetry={load} />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 max-w-2xl space-y-8">
          <Section title="Restaurant Information">
            <Field label="Restaurant Name">
              <input
                value={form.restaurantName}
                onChange={(e) => updateField("restaurantName", e.target.value)}
                className="w-full rounded-lg border border-cream-300 px-3 py-2 text-sm outline-none focus:border-sage-400"
              />
            </Field>
            <Field label="Description">
              <textarea
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-cream-300 px-3 py-2 text-sm outline-none focus:border-sage-400"
              />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Contact Email">
                <input
                  type="email"
                  value={form.contactEmail}
                  onChange={(e) => updateField("contactEmail", e.target.value)}
                  className="w-full rounded-lg border border-cream-300 px-3 py-2 text-sm outline-none focus:border-sage-400"
                />
              </Field>
              <Field label="Phone">
                <input
                  value={form.contactPhone}
                  onChange={(e) => updateField("contactPhone", e.target.value)}
                  className="w-full rounded-lg border border-cream-300 px-3 py-2 text-sm outline-none focus:border-sage-400"
                />
              </Field>
            </div>
            <Field label="Address">
              <input
                value={form.address}
                onChange={(e) => updateField("address", e.target.value)}
                className="w-full rounded-lg border border-cream-300 px-3 py-2 text-sm outline-none focus:border-sage-400"
              />
            </Field>
          </Section>

          <Section title="Business">
            <Field label="Opening Hours">
              <textarea
                value={form.openingHours}
                onChange={(e) => updateField("openingHours", e.target.value)}
                rows={2}
                placeholder="e.g. Mon–Sat 10am–9pm, Sun 11am–8pm"
                className="w-full rounded-lg border border-cream-300 px-3 py-2 text-sm outline-none focus:border-sage-400"
              />
            </Field>
            <Field label="Delivery Fee (₱)" hint="Charged on every order — used by both checkout and the cart summary.">
              <input
                value={form.deliveryFee}
                onChange={(e) => updateField("deliveryFee", e.target.value)}
                inputMode="decimal"
                className="w-full max-w-[160px] rounded-lg border border-cream-300 px-3 py-2 text-sm outline-none focus:border-sage-400"
              />
            </Field>
          </Section>

          <Section title="Branding">
            <ImageField label="Logo" value={form.logoUrl} onPick={(e) => handleImagePick("logoUrl", e)} />
            <ImageField label="Hero / Restaurant Image" value={form.heroImageUrl} onPick={(e) => handleImagePick("heroImageUrl", e)} />
          </Section>

          {saveError && <p className="text-sm font-semibold text-red-600">{saveError}</p>}

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-sage-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sage-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </form>
      )}

      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      />
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-sm font-bold uppercase tracking-wide text-ink-500">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-ink-700">{label}</label>
      {children}
      {hint && <p className="mt-1 text-[11px] text-ink-300">{hint}</p>}
    </div>
  );
}

function ImageField({ label, value, onPick }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-ink-700">{label}</label>
      <div className="flex items-center gap-3">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-cream-300 bg-cream-100">
          {value ? <img src={value} alt="" className="h-full w-full object-cover" /> : <ImageOutlinedIcon className="text-ink-300" />}
        </div>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={onPick}
          className="block flex-1 text-xs text-ink-700 file:mr-3 file:rounded-lg file:border-0 file:bg-sage-500 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-sage-600"
        />
      </div>
    </div>
  );
}
