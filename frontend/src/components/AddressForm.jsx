// Shared by checkout's "new address" section and the profile page's address
// manager, so the same fields/validation UX exist in exactly one place.
export default function AddressForm({ value, onChange, showDefaultCheckbox = true, defaultCheckboxLabel = "Save as my default address" }) {
  const updateField = (name, fieldValue) => onChange({ ...value, [name]: fieldValue });

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label className="mb-1 block text-sm font-semibold text-ink-700">Full Name</label>
        <input
          type="text"
          value={value.fullName}
          onChange={(e) => updateField("fullName", e.target.value)}
          className="w-full rounded-lg border border-cream-300 px-3 py-2 text-sm outline-none focus:border-sage-500"
          placeholder="Juan Dela Cruz"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold text-ink-700">Phone</label>
        <input
          type="tel"
          value={value.phone}
          onChange={(e) => updateField("phone", e.target.value)}
          className="w-full rounded-lg border border-cream-300 px-3 py-2 text-sm outline-none focus:border-sage-500"
          placeholder="09XXXXXXXXX"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold text-ink-700">Postal Code</label>
        <input
          type="text"
          value={value.postalCode}
          onChange={(e) => updateField("postalCode", e.target.value)}
          className="w-full rounded-lg border border-cream-300 px-3 py-2 text-sm outline-none focus:border-sage-500"
          placeholder="3100"
        />
      </div>
      <div className="sm:col-span-2">
        <label className="mb-1 block text-sm font-semibold text-ink-700">Address</label>
        <input
          type="text"
          value={value.addressLine}
          onChange={(e) => updateField("addressLine", e.target.value)}
          className="w-full rounded-lg border border-cream-300 px-3 py-2 text-sm outline-none focus:border-sage-500"
          placeholder="House / Street / Barangay"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold text-ink-700">City</label>
        <input
          type="text"
          value={value.city}
          onChange={(e) => updateField("city", e.target.value)}
          className="w-full rounded-lg border border-cream-300 px-3 py-2 text-sm outline-none focus:border-sage-500"
          placeholder="Cabanatuan City"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold text-ink-700">Label (optional)</label>
        <input
          type="text"
          value={value.label}
          onChange={(e) => updateField("label", e.target.value)}
          className="w-full rounded-lg border border-cream-300 px-3 py-2 text-sm outline-none focus:border-sage-500"
          placeholder="Home, Work, ..."
        />
      </div>
      <div className="sm:col-span-2">
        <label className="mb-1 block text-sm font-semibold text-ink-700">Delivery Notes (optional)</label>
        <textarea
          value={value.deliveryNotes}
          onChange={(e) => updateField("deliveryNotes", e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-cream-300 px-3 py-2 text-sm outline-none focus:border-sage-500"
          placeholder="Gate code, landmark, delivery instructions..."
        />
      </div>
      {showDefaultCheckbox && (
        <div className="sm:col-span-2">
          <label className="flex items-center gap-2 text-sm text-ink-700">
            <input
              type="checkbox"
              checked={value.saveAsDefault}
              onChange={(e) => updateField("saveAsDefault", e.target.checked)}
            />
            {defaultCheckboxLabel}
          </label>
        </div>
      )}
    </div>
  );
}
