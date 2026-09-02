import { useEffect, useRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import CloseIcon from "@mui/icons-material/Close";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import { uploadMenuImage, deleteMenuImageByPath, pathFromPublicUrl, validateImageFile } from "../../lib/storageService";

const MEAL_TYPES = ["breakfast", "lunch", "dinner"];

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  categoryId: "",
  mealType: "",
  preparationTime: "",
  sortOrder: "0",
  isAvailable: true,
  isFeatured: false,
};

function toForm(item) {
  return {
    name: item.name || "",
    description: item.description || "",
    price: String(item.price ?? ""),
    categoryId: item.category_id || "",
    mealType: item.meal_type || "",
    preparationTime: item.preparation_time != null ? String(item.preparation_time) : "",
    sortOrder: String(item.sort_order ?? 0),
    isAvailable: item.is_available,
    isFeatured: item.is_featured,
  };
}

// Shared by "Add Menu Item" and "Edit Menu Item" — same form either way,
// only the initial values and save call differ (see AdminMenuManager.js).
// Owns the image upload/replace flow end to end (pick -> preview -> upload
// -> pass the resulting URL to onSave), so callers just get back a plain
// payload ready for createMenuItem/updateMenuItem.
export default function MenuItemFormDialog({ open, item, categories, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageError, setImageError] = useState("");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    if (!open) return;
    setForm(item ? toForm(item) : EMPTY_FORM);
    setImageFile(null);
    setImagePreview(item?.image_url || "");
    setImageError("");
    setFormError("");
  }, [open, item]);

  const updateField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const validationError = validateImageFile(file);
    if (validationError) {
      setImageError(validationError);
      return;
    }
    setImageError("");
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const validate = () => {
    if (!form.name.trim()) return "Name is required.";
    const price = Number(form.price);
    if (!Number.isFinite(price) || price < 0) return "Price must be a non-negative number.";
    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmittingRef.current) return;
    const validationError = validate();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    isSubmittingRef.current = true;
    setSaving(true);
    setFormError("");
    try {
      let imageUrl = item?.image_url || "";
      let uploadedPath = null;

      if (imageFile) {
        const uploaded = await uploadMenuImage(imageFile);
        imageUrl = uploaded.publicUrl;
        uploadedPath = uploaded.path;
      }

      try {
        await onSave({ ...form, imageUrl });
      } catch (saveErr) {
        // The item write failed — don't leave an unreferenced file behind
        // in storage for an item that was never actually saved.
        if (uploadedPath) await deleteMenuImageByPath(uploadedPath);
        throw saveErr;
      }

      // Save succeeded — now it's safe to clean up the OLD image (if this
      // was a replace on an item that already had one of our own uploads).
      if (imageFile && item?.image_url) {
        const oldPath = pathFromPublicUrl(item.image_url);
        if (oldPath) await deleteMenuImageByPath(oldPath);
      }
    } catch {
      setFormError("Could not save this item. Please try again.");
    } finally {
      isSubmittingRef.current = false;
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span className="text-lg font-bold text-ink-900">{item ? "Edit Menu Item" : "Add Menu Item"}</span>
        <button
          type="button"
          onClick={onClose}
          disabled={saving}
          aria-label="Close"
          className="rounded-lg p-1 text-ink-500 hover:bg-cream-100 disabled:opacity-50"
        >
          <CloseIcon fontSize="small" />
        </button>
      </DialogTitle>
      <DialogContent>
        <form id="menu-item-form" onSubmit={handleSubmit} className="grid gap-3 pt-1 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold text-ink-700">Image</label>
            <div className="flex items-center gap-3">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-cream-300 bg-cream-100">
                {imagePreview ? (
                  <img src={imagePreview} alt="" className="h-full w-full object-cover" />
                ) : (
                  <ImageOutlinedIcon className="text-ink-300" />
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileChange}
                  className="block w-full text-xs text-ink-700 file:mr-3 file:rounded-lg file:border-0 file:bg-sage-500 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-sage-600"
                />
                <p className="mt-1 text-[11px] text-ink-300">
                  JPEG, PNG, WEBP, or GIF, up to 5MB. Leave empty to keep the current image.
                </p>
                {imageError && <p className="mt-1 text-xs font-semibold text-red-600">{imageError}</p>}
              </div>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold text-ink-700">Name</label>
            <input
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              className="w-full rounded-lg border border-cream-300 px-3 py-2 text-sm outline-none focus:border-sage-400"
              placeholder="Dish name"
              autoFocus
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold text-ink-700">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-cream-300 px-3 py-2 text-sm outline-none focus:border-sage-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-700">Price</label>
            <input
              value={form.price}
              onChange={(e) => updateField("price", e.target.value)}
              inputMode="decimal"
              className="w-full rounded-lg border border-cream-300 px-3 py-2 text-sm outline-none focus:border-sage-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-700">Sort Order</label>
            <input
              value={form.sortOrder}
              onChange={(e) => updateField("sortOrder", e.target.value)}
              inputMode="numeric"
              className="w-full rounded-lg border border-cream-300 px-3 py-2 text-sm outline-none focus:border-sage-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-700">Category</label>
            <select
              value={form.categoryId}
              onChange={(e) => updateField("categoryId", e.target.value)}
              className="w-full rounded-lg border border-cream-300 px-3 py-2 text-sm outline-none focus:border-sage-400"
            >
              <option value="">Uncategorized</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-700">Meal Type</label>
            <select
              value={form.mealType}
              onChange={(e) => updateField("mealType", e.target.value)}
              className="w-full rounded-lg border border-cream-300 px-3 py-2 text-sm outline-none focus:border-sage-400"
            >
              <option value="">None</option>
              {MEAL_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-700">Preparation Time (min)</label>
            <input
              value={form.preparationTime}
              onChange={(e) => updateField("preparationTime", e.target.value)}
              inputMode="numeric"
              className="w-full rounded-lg border border-cream-300 px-3 py-2 text-sm outline-none focus:border-sage-400"
            />
          </div>
          <div className="flex items-center gap-4 sm:col-span-2">
            <label className="flex items-center gap-2 text-sm text-ink-700">
              <input
                type="checkbox"
                checked={form.isAvailable}
                onChange={(e) => updateField("isAvailable", e.target.checked)}
              />
              Active
            </label>
            <label className="flex items-center gap-2 text-sm text-ink-700">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => updateField("isFeatured", e.target.checked)}
              />
              Featured
            </label>
          </div>

          {formError && <p className="text-sm font-semibold text-red-600 sm:col-span-2">{formError}</p>}

          <div className="mt-2 flex gap-2 sm:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-sage-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sage-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save"}
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
