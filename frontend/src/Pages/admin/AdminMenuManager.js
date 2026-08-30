import { useCallback, useEffect, useState } from "react";
import Skeleton from "../../components/Skeleton";
import EmptyState from "../../components/EmptyState";
import ErrorState from "../../components/ErrorState";
import ConfirmDialog from "../../components/ConfirmDialog";
import {
  fetchAdminMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  fetchAdminCategories,
  createCategory,
  updateCategoryActive,
  deleteCategory,
} from "../../lib/adminService";
import { formatPeso } from "../../utils/money";

const MEAL_TYPES = ["breakfast", "lunch", "dinner"];

const EMPTY_ITEM_FORM = {
  name: "",
  description: "",
  price: "",
  imageUrl: "",
  categoryId: "",
  mealType: "",
  preparationTime: "",
  isAvailable: true,
  isFeatured: false,
};

function toItemForm(item) {
  return {
    name: item.name || "",
    description: item.description || "",
    price: String(item.price ?? ""),
    imageUrl: item.image_url || "",
    categoryId: item.category_id || "",
    mealType: item.meal_type || "",
    preparationTime: item.preparation_time != null ? String(item.preparation_time) : "",
    isAvailable: item.is_available,
    isFeatured: item.is_featured,
  };
}

export default function AdminMenuManager() {
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("");
  const [categorySaving, setCategorySaving] = useState(false);
  const [deleteCategoryTarget, setDeleteCategoryTarget] = useState(null);

  const [items, setItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [itemsError, setItemsError] = useState("");
  const [formMode, setFormMode] = useState(null); // null | "add" | <item id>
  const [form, setForm] = useState(EMPTY_ITEM_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [deleteItemTarget, setDeleteItemTarget] = useState(null);

  const loadCategories = useCallback(async () => {
    setCategoriesLoading(true);
    try {
      setCategories(await fetchAdminCategories());
    } catch {
      // Non-fatal for the item list; the category select just falls back
      // to "Uncategorized" only, and the categories panel shows an error.
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  const loadItems = useCallback(async () => {
    setItemsLoading(true);
    setItemsError("");
    try {
      setItems(await fetchAdminMenuItems());
    } catch {
      setItemsError("Could not load menu items.");
    } finally {
      setItemsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
    loadItems();
  }, [loadCategories, loadItems]);

  // ---- categories ----
  const handleAddCategory = async (event) => {
    event.preventDefault();
    if (!categoryName.trim()) return;
    setCategorySaving(true);
    try {
      await createCategory({ name: categoryName.trim(), sortOrder: categories.length + 1 });
      setCategoryName("");
      await loadCategories();
    } catch {
      // Kept minimal — this panel already shows current categories, a
      // failed add just leaves the input filled so the admin can retry.
    } finally {
      setCategorySaving(false);
    }
  };

  const handleToggleCategoryActive = async (category) => {
    const previous = categories;
    setCategories((prev) => prev.map((c) => (c.id === category.id ? { ...c, is_active: !c.is_active } : c)));
    try {
      await updateCategoryActive(category.id, !category.is_active);
    } catch {
      setCategories(previous);
    }
  };

  const confirmDeleteCategory = async () => {
    const target = deleteCategoryTarget;
    setDeleteCategoryTarget(null);
    if (!target) return;
    try {
      await deleteCategory(target.id);
      await loadCategories();
      await loadItems();
    } catch {
      // Category list will simply still show it; acceptable for a demo.
    }
  };

  // ---- menu items ----
  const startAdd = () => {
    setForm(EMPTY_ITEM_FORM);
    setFormError("");
    setFormMode("add");
  };

  const startEdit = (item) => {
    setForm(toItemForm(item));
    setFormError("");
    setFormMode(item.id);
  };

  const cancelForm = () => {
    setFormMode(null);
    setForm(EMPTY_ITEM_FORM);
    setFormError("");
  };

  const updateField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const validate = () => {
    if (!form.name.trim()) return "Name is required.";
    const price = Number(form.price);
    if (!Number.isFinite(price) || price < 0) return "Price must be a non-negative number.";
    return "";
  };

  const handleSaveItem = async () => {
    const validationError = validate();
    if (validationError) {
      setFormError(validationError);
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      if (formMode === "add") {
        await createMenuItem(form);
      } else {
        await updateMenuItem(formMode, form);
      }
      await loadItems();
      cancelForm();
    } catch {
      setFormError("Could not save this item. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDeleteItem = async () => {
    const target = deleteItemTarget;
    setDeleteItemTarget(null);
    if (!target) return;
    const previous = items;
    setItems((prev) => prev.filter((item) => item.id !== target.id));
    try {
      await deleteMenuItem(target.id);
    } catch {
      setItems(previous);
    }
  };

  const renderItemForm = () => (
    <div className="mt-3 grid gap-3 rounded-xl border border-dashed border-sage-400 bg-sage-50 p-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label className="mb-1 block text-xs font-semibold text-ink-700">Name</label>
        <input
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
          className="w-full rounded-lg border border-cream-300 px-3 py-2 text-sm outline-none focus:border-sage-400"
          placeholder="Dish name"
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
        <label className="mb-1 block text-xs font-semibold text-ink-700">Preparation Time (min)</label>
        <input
          value={form.preparationTime}
          onChange={(e) => updateField("preparationTime", e.target.value)}
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
      <div className="sm:col-span-2">
        <label className="mb-1 block text-xs font-semibold text-ink-700">Image URL</label>
        <input
          value={form.imageUrl}
          onChange={(e) => updateField("imageUrl", e.target.value)}
          className="w-full rounded-lg border border-cream-300 px-3 py-2 text-sm outline-none focus:border-sage-400"
          placeholder="https://..."
        />
      </div>
      <div className="flex items-center gap-4 sm:col-span-2">
        <label className="flex items-center gap-2 text-sm text-ink-700">
          <input
            type="checkbox"
            checked={form.isAvailable}
            onChange={(e) => updateField("isAvailable", e.target.checked)}
          />
          Available
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
      <div className="flex gap-2 sm:col-span-2">
        <button
          type="button"
          onClick={handleSaveItem}
          disabled={saving}
          className="rounded-lg bg-sage-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sage-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={cancelForm}
          className="rounded-lg border border-cream-300 px-4 py-2 text-sm font-semibold text-ink-700 transition hover:bg-cream-100"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-900">Menu Manager</h1>
      <p className="mt-1 text-sm text-ink-500">Manage categories and menu items for your storefront.</p>

      <section className="mt-6 rounded-xl border border-cream-200 p-4">
        <h2 className="text-sm font-bold text-ink-700">Categories</h2>
        {categoriesLoading ? (
          <Skeleton className="mt-3 h-10 w-full rounded-lg" />
        ) : (
          <>
            <div className="mt-3 flex flex-wrap gap-2">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                    category.is_active
                      ? "border-sage-400 bg-sage-50 text-ink-700"
                      : "border-cream-300 bg-cream-50 text-ink-300 line-through"
                  }`}
                >
                  {category.name}
                  <button
                    type="button"
                    onClick={() => handleToggleCategoryActive(category)}
                    className="text-ink-500 hover:text-terracotta-500"
                    title={category.is_active ? "Deactivate" : "Activate"}
                  >
                    {category.is_active ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteCategoryTarget(category)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
            <form onSubmit={handleAddCategory} className="mt-3 flex gap-2">
              <input
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="New category name"
                className="min-w-0 flex-1 rounded-lg border border-cream-300 px-3 py-2 text-sm outline-none focus:border-sage-400"
              />
              <button
                type="submit"
                disabled={categorySaving}
                className="shrink-0 rounded-lg bg-sage-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-sage-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Add Category
              </button>
            </form>
          </>
        )}
      </section>

      <section className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-ink-700">Menu Items</h2>
          {formMode === null && (
            <button
              type="button"
              onClick={startAdd}
              className="rounded-lg bg-terracotta-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-terracotta-600"
            >
              + Add Menu Item
            </button>
          )}
        </div>

        {formMode === "add" && renderItemForm()}

        {itemsLoading ? (
          <div className="mt-4 space-y-2">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        ) : itemsError ? (
          <div className="mt-4">
            <ErrorState message={itemsError} onRetry={loadItems} />
          </div>
        ) : items.length === 0 ? (
          <div className="mt-4">
            <EmptyState title="No menu items yet" message="Add your first one above." />
          </div>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item) =>
              formMode === item.id ? (
                <div key={item.id} className="sm:col-span-2 xl:col-span-3">
                  {renderItemForm()}
                </div>
              ) : (
                <div key={item.id} className="rounded-xl border border-cream-200 bg-cream-50 p-4 shadow-card">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-ink-900">{item.name}</p>
                      <p className="mt-1 text-sm text-ink-500">{formatPeso(Number(item.price))}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-1 text-xs text-ink-300">
                        {item.category?.name && <span>{item.category.name}</span>}
                        {item.meal_type && <span className="capitalize">· {item.meal_type}</span>}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                            item.is_available ? "bg-sage-100 text-sage-600" : "bg-red-100 text-red-600"
                          }`}
                        >
                          {item.is_available ? "Available" : "Unavailable"}
                        </span>
                        {item.is_featured && (
                          <span className="rounded-full bg-terracotta-100 px-2 py-0.5 text-[11px] font-semibold text-terracotta-600">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      className="rounded-lg border border-cream-300 px-2 py-1 text-xs font-semibold text-ink-700 transition hover:border-sage-400"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteItemTarget(item)}
                      className="rounded-lg border border-red-200 px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </section>

      <ConfirmDialog
        open={Boolean(deleteItemTarget)}
        title="Delete menu item?"
        message={`"${deleteItemTarget?.name}" will be permanently removed from the menu. This can't be undone.`}
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDeleteItem}
        onCancel={() => setDeleteItemTarget(null)}
      />
      <ConfirmDialog
        open={Boolean(deleteCategoryTarget)}
        title="Delete category?"
        message={`"${deleteCategoryTarget?.name}" will be removed. Menu items in this category will become uncategorized, not deleted.`}
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDeleteCategory}
        onCancel={() => setDeleteCategoryTarget(null)}
      />
    </div>
  );
}
