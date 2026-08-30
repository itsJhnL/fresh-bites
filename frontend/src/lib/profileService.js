import supabase from "./supabaseClient";
import { withTimeout } from "./withTimeout";

// RLS (profiles_update_own, see supabase/migrations/002_rls_policies.sql)
// is what actually enforces "users can only edit themselves" — the
// .eq("id", userId) here targets the right row, it isn't the security
// boundary. A user attempting to update someone else's id would just
// match zero rows under RLS regardless of what's passed here.
export async function updateProfile(userId, { fullName, phone, avatarUrl }) {
  const { data, error } = await withTimeout(
    supabase
      .from("profiles")
      .update({
        full_name: fullName.trim(),
        phone: phone?.trim() || null,
        avatar_url: avatarUrl?.trim() || null,
      })
      .eq("id", userId)
      .select()
      .single()
  );

  if (error) throw error;
  return data;
}
