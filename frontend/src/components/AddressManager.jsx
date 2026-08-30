import { useEffect, useState } from "react";
import AddressForm from "./AddressForm";
import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";
import Skeleton from "./Skeleton";
import {
  fetchAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../lib/addressService";

const EMPTY_FORM = {
  label: "",
  fullName: "",
  phone: "",
  addressLine: "",
  city: "",
  postalCode: "",
  deliveryNotes: "",
  saveAsDefault: false,
};

function toFormValue(address) {
  return {
    label: address.label || "",
    fullName: address.full_name || "",
    phone: address.phone || "",
    addressLine: address.address_line || "",
    city: address.city || "",
    postalCode: address.postal_code || "",
    deliveryNotes: address.delivery_notes || "",
    saveAsDefault: Boolean(address.is_default),
  };
}

export default function AddressManager({ userId }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // null = not editing anything, "add" = add-new form, otherwise the id of
  // the address currently being edited in place.
  const [mode, setMode] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");

  const load = () => {
    setLoading(true);
    setError("");
    return fetchAddresses()
      .then(setAddresses)
      .catch(() => setError("Could not load your addresses."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startAdd = () => {
    setForm(EMPTY_FORM);
    setActionError("");
    setMode("add");
  };

  const startEdit = (address) => {
    setForm(toFormValue(address));
    setActionError("");
    setMode(address.id);
  };

  const cancelForm = () => {
    setMode(null);
    setForm(EMPTY_FORM);
    setActionError("");
  };

  const validate = () => {
    if (!form.fullName.trim() || !form.phone.trim() || !form.addressLine.trim() || !form.city.trim()) {
      return "Please fill in full name, phone, address, and city.";
    }
    return "";
  };

  const handleSave = async () => {
    const validationError = validate();
    if (validationError) {
      setActionError(validationError);
      return;
    }
    setSaving(true);
    setActionError("");
    try {
      if (mode === "add") {
        await createAddress(userId, form);
      } else {
        await updateAddress(userId, mode, form);
      }
      await load();
      cancelForm();
    } catch {
      setActionError("Could not save this address. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (addressId) => {
    const previous = addresses;
    setAddresses((prev) => prev.filter((address) => address.id !== addressId));
    try {
      await deleteAddress(addressId);
    } catch {
      setAddresses(previous);
      setActionError("Could not delete this address. Please try again.");
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      await setDefaultAddress(userId, addressId);
      await load();
    } catch {
      setActionError("Could not update your default address. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-20 w-full rounded-xl" />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={load} />;
  }

  return (
    <div>
      {addresses.length === 0 && mode === null && (
        <EmptyState
          title="No saved addresses"
          message="Add an address to make checkout faster."
          action={
            <button
              type="button"
              onClick={startAdd}
              className="inline-block rounded-xl bg-sage-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sage-600"
            >
              + Add Address
            </button>
          }
        />
      )}

      {addresses.length > 0 && (
        <div className="space-y-3">
          {addresses.map((address) =>
            mode === address.id ? (
              <div key={address.id} className="rounded-xl border border-sage-500 bg-sage-50 p-4">
                <AddressForm value={form} onChange={setForm} defaultCheckboxLabel="Set as default address" />
                {actionError && <p className="mt-2 text-sm font-semibold text-red-600">{actionError}</p>}
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="rounded-xl bg-sage-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sage-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={cancelForm}
                    className="rounded-xl border border-cream-300 px-4 py-2 text-sm font-semibold text-ink-700 transition hover:bg-cream-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div key={address.id} className="flex items-start justify-between gap-3 rounded-xl border border-cream-200 p-4">
                <div className="text-sm">
                  <p className="font-semibold text-ink-900">
                    {address.label || "Address"}
                    {address.is_default && (
                      <span className="ml-2 rounded-full bg-sage-100 px-2 py-0.5 text-xs font-semibold text-sage-600">
                        Default
                      </span>
                    )}
                  </p>
                  <p className="mt-1 text-ink-500">
                    {address.full_name} · {address.phone}
                  </p>
                  <p className="text-ink-500">
                    {address.address_line}, {address.city}
                    {address.postal_code ? ` ${address.postal_code}` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2 text-xs font-semibold">
                  <button type="button" onClick={() => startEdit(address)} className="text-sage-600 hover:text-terracotta-500">
                    Edit
                  </button>
                  {!address.is_default && (
                    <button
                      type="button"
                      onClick={() => handleSetDefault(address.id)}
                      className="text-sage-600 hover:text-terracotta-500"
                    >
                      Set Default
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(address.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}

      {mode === "add" && (
        <div className="mt-4 rounded-xl border border-dashed border-sage-500 bg-sage-50 p-4">
          <AddressForm value={form} onChange={setForm} defaultCheckboxLabel="Set as default address" />
          {actionError && <p className="mt-2 text-sm font-semibold text-red-600">{actionError}</p>}
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-xl bg-sage-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sage-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Address"}
            </button>
            <button
              type="button"
              onClick={cancelForm}
              className="rounded-xl border border-cream-300 px-4 py-2 text-sm font-semibold text-ink-700 transition hover:bg-cream-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {addresses.length > 0 && mode === null && (
        <button
          type="button"
          onClick={startAdd}
          className="mt-4 rounded-xl border border-dashed border-cream-300 px-4 py-2.5 text-sm font-semibold text-ink-700 transition hover:border-sage-500 hover:text-sage-600"
        >
          + Add New Address
        </button>
      )}
    </div>
  );
}
