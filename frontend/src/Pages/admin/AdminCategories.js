import { useCallback, useEffect, useState } from "react";
import Skeleton from "../../components/Skeleton";
import EmptyState from "../../components/EmptyState";
import ErrorState from "../../components/ErrorState";
import ConfirmDialog from "../../components/ConfirmDialog";
import Toast from "../../components/Toast";
import {
  fetchAdminCategories,
  createCategory,
  updateCategory,
  updateCategoryActive,
  deleteCategory,
  countMenuItemsInCategory,
} from "../../lib/adminService";

const EMPTY_FORM = { name: "", description: "", sortOrder: "0" };

function toForm(category) {
  return {
    name: category.name || "",
    description: category.description || "",
    sortOrder: String(category.sort_order ?? 0),
  };
}

// RLS (categories_admin_insert/update/delete, see
// supabase/migrations/002_rls_policies.sql) is what actually enforces
// "only admins can write here" — this page reaching a non-admin would just
// have every write rejected by the database, not merely hidden by the UI.
export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formMode, setFormMode] = useState(null); // null | "add" | <category id>
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [checkingDelete, setCheckingDelete] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    return fetchAdminCategories()
      .then(setCategories)
      .catch(() => setError("Could not load categories."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const startAdd = () => {
    setForm({ ...EMPTY_FORM, sortOrder: String(categories.length) });
    setFormError("");
    setFormMode("add");
  };

  const startEdit = (category) => {
    setForm(toForm(category));
    setFormError("");
    setFormMode(category.id);
  };

  const cancelForm = () => {
    setFormMode(null);
    setForm(EMPTY_FORM);
    setFormError("");
  };

  const updateField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (saving) return; // synchronous guard against a double-click submitting twice
    if (!form.name.trim()) {
      setFormError("Name is required.");
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      if (formMode === "add") {
        await createCategory(form);
        setToast({ open: true, message: "Category added.", severity: "success" });
      } else {
        await updateCategory(formMode, form);
        setToast({ open: true, message: "Category updated.", severity: "success" });
      }
      await load();
      cancelForm();
    } catch {
      setFormError("Could not save this category. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (category) => {
    const previous = categories;
    setCategories((prev) => prev.map((c) => (c.id === category.id ? { ...c, is_active: !c.is_active } : c)));
    try {
      await updateCategoryActive(category.id, !category.is_active);
    } catch {
      setCategories(previous);
      setToast({ open: true, message: "Could not update that category. Please try again.", severity: "error" });
    }
  };

  // menu_items.category_id is ON DELETE SET NULL, so the database itself
  // would happily delete a populated category and orphan its items — this
  // check is what actually prevents that from happening silently (rule: no
  // deletion that would break existing menu relationships without an
  // explicit reassignment step, which this app doesn't have yet).
  const requestDelete = async (category) => {
    setCheckingDelete(true);
    try {
      const itemCount = await countMenuItemsInCategory(category.id);
      if (itemCount > 0) {
        setToast({
          open: true,
          message: `"${category.name}" has ${itemCount} menu item${itemCount === 1 ? "" : "s"}. Move them to another category first.`,
          severity: "warning",
        });
        return;
      }
      setDeleteTarget(category);
    } catch {
      setToast({ open: true, message: "Could not check this category. Please try again.", severity: "error" });
    } finally {
      setCheckingDelete(false);
    }
  };

  const confirmDelete = async () => {
    const target = deleteTarget;
    setDeleteTarget(null);
    if (!target) return;
    try {
      await deleteCategory(target.id);
      setToast({ open: true, message: `"${target.name}" deleted.`, severity: "success" });
      await load();
    } catch {
      setToast({ open: true, message: "Could not delete this category. Please try again.", severity: "error" });
    }
  };

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="mt-4 grid gap-3 rounded-xl border border-dashed border-sage-400 bg-sage-50 p-4 sm:grid-cols-3">
      <div className="sm:col-span-2">
        <label className="mb-1 block text-xs font-semibold text-ink-700">Name</label>
        <input
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
          className="w-full rounded-lg border border-cream-300 px-3 py-2 text-sm outline-none focus:border-sage-400"
          placeholder="e.g. Desserts"
          autoFocus
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
      <div className="sm:col-span-3">
        <label className="mb-1 block text-xs font-semibold text-ink-700">Description (optional)</label>
        <textarea
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-cream-300 px-3 py-2 text-sm outline-none focus:border-sage-400"
        />
      </div>
      {formError && <p className="text-sm font-semibold text-red-600 sm:col-span-3">{formError}</p>}
      <div className="flex gap-2 sm:col-span-3">
        <button
          type="submit"
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
    </form>
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Categories</h1>
          <p className="mt-1 text-sm text-ink-500">Organize the menu into browsable sections.</p>
        </div>
        {formMode === null && (
          <button
            type="button"
            onClick={startAdd}
            className="rounded-lg bg-terracotta-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-terracotta-600"
          >
            + Add Category
          </button>
        )}
      </div>

      {formMode === "add" && renderForm()}

      {loading ? (
        <div className="mt-6 space-y-2">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <div className="mt-6">
          <ErrorState message={error} onRetry={load} />
        </div>
      ) : categories.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="No categories yet" message="Add your first category above." />
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-cream-200">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-cream-100 text-xs font-semibold uppercase tracking-wide text-ink-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Sort Order</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) =>
                formMode === category.id ? (
                  <tr key={category.id}>
                    <td colSpan={5} className="px-4 py-3">
                      {renderForm()}
                    </td>
                  </tr>
                ) : (
                  <tr key={category.id} className="border-t border-cream-200 hover:bg-cream-50">
                    <td className="px-4 py-3 font-semibold text-ink-900">{category.name}</td>
                    <td className="max-w-xs truncate px-4 py-3 text-ink-500">{category.description || "—"}</td>
                    <td className="px-4 py-3 text-ink-700">{category.sort_order}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(category)}
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold transition ${
                          category.is_active
                            ? "bg-sage-100 text-sage-600 hover:bg-sage-200"
                            : "bg-red-100 text-red-600 hover:bg-red-200"
                        }`}
                      >
                        {category.is_active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(category)}
                          className="rounded-lg border border-cream-300 px-2.5 py-1 text-xs font-semibold text-ink-700 transition hover:border-sage-400"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          disabled={checkingDelete}
                          onClick={() => requestDelete(category)}
                          className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete category?"
        message={`"${deleteTarget?.name}" will be removed. This category has no menu items.`}
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
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
