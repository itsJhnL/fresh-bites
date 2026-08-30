import supabase from "./supabaseClient";
import { withTimeout } from "./withTimeout";

export async function fetchAddresses() {
  const { data, error } = await withTimeout(
    supabase
      .from("addresses")
      .select("id, label, full_name, phone, address_line, city, postal_code, delivery_notes, is_default, created_at")
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false })
  );

  if (error) throw error;
  return data || [];
}

// payload matches AddressForm's controlled shape (src/components/AddressForm.jsx)
// directly — saveAsDefault, not isDefault — so every call site can just pass
// the form state straight through instead of re-mapping field names itself.
function toRow(payload) {
  return {
    label: payload.label || null,
    full_name: payload.fullName,
    phone: payload.phone,
    address_line: payload.addressLine,
    city: payload.city,
    postal_code: payload.postalCode || null,
    delivery_notes: payload.deliveryNotes || null,
    is_default: Boolean(payload.saveAsDefault),
  };
}

// The DB only allows one default address per user (a partial unique index),
// so setting a second row as default without clearing the first would fail
// outright rather than just quietly becoming the new default.
async function clearOtherDefaults(userId, keepAddressId) {
  let query = supabase.from("addresses").update({ is_default: false }).eq("user_id", userId).eq("is_default", true);
  if (keepAddressId) query = query.neq("id", keepAddressId);
  const { error } = await withTimeout(query);
  if (error) throw error;
}

// userId is passed in explicitly (from useAuth()) rather than re-fetched via
// supabase.auth.getUser() here — the caller already has it, no reason for a
// second network round trip. RLS (addresses_insert_own / update_own /
// delete_own, see 002_rls_policies.sql) is what actually enforces "only
// your own addresses" for every function below — user_id filters here
// target the right rows, they aren't the security boundary.
export async function createAddress(userId, payload) {
  if (payload.saveAsDefault) {
    await clearOtherDefaults(userId);
  }

  const { data, error } = await withTimeout(
    supabase
      .from("addresses")
      .insert({ user_id: userId, ...toRow(payload) })
      .select()
      .single()
  );

  if (error) throw error;
  return data;
}

export async function updateAddress(userId, addressId, payload) {
  if (payload.saveAsDefault) {
    await clearOtherDefaults(userId, addressId);
  }

  const { data, error } = await withTimeout(
    supabase.from("addresses").update(toRow(payload)).eq("id", addressId).select().single()
  );

  if (error) throw error;
  return data;
}

export async function deleteAddress(addressId) {
  const { error } = await withTimeout(supabase.from("addresses").delete().eq("id", addressId));
  if (error) throw error;
}

export async function setDefaultAddress(userId, addressId) {
  await clearOtherDefaults(userId, addressId);

  const { data, error } = await withTimeout(
    supabase.from("addresses").update({ is_default: true }).eq("id", addressId).select().single()
  );

  if (error) throw error;
  return data;
}
