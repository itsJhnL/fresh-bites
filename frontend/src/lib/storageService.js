import supabase from "./supabaseClient";

// Mirrors the bucket's own file_size_limit/allowed_mime_types (see
// supabase/migrations/010_menu_images_storage.sql) so a bad file is
// rejected with a friendly message client-side instead of a raw storage
// API error — Supabase still enforces the real limit server-side either way.
const BUCKET = "menu-images";
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export function validateImageFile(file) {
  if (!file) return "Please choose an image file.";
  if (!ALLOWED_TYPES.includes(file.type)) return "Please choose a JPEG, PNG, WEBP, or GIF image.";
  if (file.size > MAX_FILE_SIZE) return "Image must be smaller than 5MB.";
  return "";
}

function extensionFor(file) {
  const fromName = file.name.split(".").pop();
  return fromName && fromName.length <= 5 && /^[a-z0-9]+$/i.test(fromName) ? fromName.toLowerCase() : "jpg";
}

// Random filename so two admins uploading a same-named file never
// overwrite each other's image, and so replacing an item's photo doesn't
// require guessing/reusing its previous path.
export async function uploadMenuImage(file) {
  const validationError = validateImageFile(file);
  if (validationError) throw new Error(validationError);

  const path = `${crypto.randomUUID()}.${extensionFor(file)}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { path, publicUrl: data.publicUrl };
}

// Best-effort cleanup after a menu item's image is replaced or removed —
// never allowed to fail the caller's actual save, an orphaned file left in
// storage is a minor issue, not worth blocking the admin over.
export async function deleteMenuImageByPath(path) {
  if (!path) return;
  try {
    await supabase.storage.from(BUCKET).remove([path]);
  } catch {
    // Non-fatal — see comment above.
  }
}

// Recovers the storage path from a public URL previously saved on a
// menu_items row, so it can be passed to deleteMenuImageByPath. Only
// resolves URLs that actually live in this bucket — a manually-pasted
// external URL (from before uploads existed, e.g. seed data) correctly
// resolves to null, since there's nothing in our storage to clean up.
export function pathFromPublicUrl(url) {
  if (!url) return null;
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return url.slice(index + marker.length);
}
