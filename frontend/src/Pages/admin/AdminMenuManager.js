import { useCallback, useEffect, useMemo, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import Skeleton from "../../components/Skeleton";
import EmptyState from "../../components/EmptyState";
import ErrorState from "../../components/ErrorState";
import ConfirmDialog from "../../components/ConfirmDialog";
import Toast from "../../components/Toast";
import MenuItemFormDialog from "../../components/admin/MenuItemFormDialog";
import { fetchAdminMenuItems, createMenuItem, updateMenuItem, deleteMenuItem, fetchAdminCategories } from "../../lib/adminService";
import { deleteMenuImageByPath, pathFromPublicUrl } from "../../lib/storageService";
import { formatPeso } from "../../utils/money";

const PAGE_SIZE = 10;

const SORT_OPTIONS = [
  { value: "sort_order-asc", label: "Sort Order" },
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
  { value: "price-asc", label: "Price (Low to High)" },
  { value: "price-desc", label: "Price (High to Low)" },
  { value: "created_at-desc", label: "Newest First" },
];

function sortItems(list, sortValue) {
  const [field, direction] = sortValue.split("-");
  const sorted = [...list];
  sorted.sort((a, b) => {
    let result;
    if (field === "name") result = a.name.localeCompare(b.name);
    else if (field === "price") result = Number(a.price) - Number(b.price);
    else if (field === "created_at") result = new Date(a.created_at) - new Date(b.created_at);
    else result = (a.sort_order ?? 0) - (b.sort_order ?? 0);
    return direction === "desc" ? -result : result;
  });
  return sorted;
}

// RLS (menu_items_admin_insert/update/delete, see
// supabase/migrations/002_rls_policies.sql) is the real enforcement layer
// for every write below — reaching this page as a non-admin would have
// every mutation rejected by the database regardless of what the UI shows.
export default function AdminMenuManager() {
  const [items, setItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [itemsError, setItemsError] = useState("");

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [mealTypeFilter, setMealTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortValue, setSortValue] = useState("sort_order-asc");
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  const loadItems = useCallback(() => {
    setItemsLoading(true);
    setItemsError("");
    return fetchAdminMenuItems()
      .then(setItems)
      .catch(() => setItemsError("Could not load menu items."))
      .finally(() => setItemsLoading(false));
  }, []);

  const loadCategories = useCallback(() => {
    setCategoriesLoading(true);
    return fetchAdminCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
      .finally(() => setCategoriesLoading(false));
  }, []);

  useEffect(() => {
    loadItems();
    loadCategories();
  }, [loadItems, loadCategories]);

  useEffect(() => {
    setPage(1);
  }, [search, categoryFilter, mealTypeFilter, statusFilter]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    let list = items;
    if (term) {
      list = list.filter((item) => item.name.toLowerCase().includes(term));
    }
    if (categoryFilter !== "all") {
      list = list.filter((item) =>
        categoryFilter === "uncategorized" ? !item.category_id : item.category_id === categoryFilter
      );
    }
    if (mealTypeFilter !== "all") {
      list = list.filter((item) =>
        mealTypeFilter === "none" ? !item.meal_type : item.meal_type === mealTypeFilter
      );
    }
    if (statusFilter !== "all") {
      list = list.filter((item) => (statusFilter === "active" ? item.is_available : !item.is_available));
    }
    return sortItems(list, sortValue);
  }, [items, search, categoryFilter, mealTypeFilter, statusFilter, sortValue]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openAddForm = () => {
    setEditingItem(null);
    setFormOpen(true);
  };
  const openEditForm = (item) => {
    setEditingItem(item);
    setFormOpen(true);
  };
  const closeForm = () => setFormOpen(false);

  const handleSave = async (payload) => {
    if (editingItem) {
      await updateMenuItem(editingItem.id, payload);
      setToast({ open: true, message: "Menu item updated.", severity: "success" });
    } else {
      await createMenuItem(payload);
      setToast({ open: true, message: "Menu item added.", severity: "success" });
    }
    await loadItems();
    setFormOpen(false);
  };

  const handleToggleAvailable = async (item) => {
    setTogglingId(item.id);
    const previous = items;
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, is_available: !i.is_available } : i)));
    try {
      await updateMenuItem(item.id, { isAvailable: !item.is_available });
    } catch {
      setItems(previous);
      setToast({ open: true, message: "Could not update that item. Please try again.", severity: "error" });
    } finally {
      setTogglingId(null);
    }
  };

  const confirmDelete = async () => {
    const target = deleteTarget;
    setDeleteTarget(null);
    if (!target) return;
    const previous = items;
    setItems((prev) => prev.filter((item) => item.id !== target.id));
    try {
      await deleteMenuItem(target.id);
      // Best-effort — only cleans up images this CMS itself uploaded (a
      // manually-pasted external URL from before uploads existed correctly
      // resolves to no path and is left alone).
      const path = pathFromPublicUrl(target.image_url);
      if (path) await deleteMenuImageByPath(path);
      setToast({ open: true, message: `"${target.name}" deleted.`, severity: "success" });
    } catch {
      setItems(previous);
      setToast({ open: true, message: "Could not delete this item. Please try again.", severity: "error" });
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Menu Manager</h1>
          <p className="mt-1 text-sm text-ink-500">Manage every dish shown on the storefront.</p>
        </div>
        <button
          type="button"
          onClick={openAddForm}
          className="rounded-lg bg-terracotta-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-terracotta-600"
        >
          + Add Menu Item
        </button>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <SearchIcon fontSize="small" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name..."
            aria-label="Search menu items"
            className="w-full rounded-lg border border-cream-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-sage-400"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          aria-label="Filter by category"
          className="rounded-lg border border-cream-300 px-3 py-2 text-sm outline-none focus:border-sage-400"
        >
          <option value="all">All Categories</option>
          <option value="uncategorized">Uncategorized</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          value={mealTypeFilter}
          onChange={(e) => setMealTypeFilter(e.target.value)}
          aria-label="Filter by meal type"
          className="rounded-lg border border-cream-300 px-3 py-2 text-sm outline-none focus:border-sage-400"
        >
          <option value="all">All Meal Types</option>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="none">None</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter by status"
          className="rounded-lg border border-cream-300 px-3 py-2 text-sm outline-none focus:border-sage-400"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select
          value={sortValue}
          onChange={(e) => setSortValue(e.target.value)}
          aria-label="Sort menu items"
          className="rounded-lg border border-cream-300 px-3 py-2 text-sm outline-none focus:border-sage-400"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              Sort: {option.label}
            </option>
          ))}
        </select>
      </div>

      {itemsLoading || categoriesLoading ? (
        <div className="mt-4 space-y-2">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : itemsError ? (
        <div className="mt-4">
          <ErrorState message={itemsError} onRetry={loadItems} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            title={items.length === 0 ? "No menu items yet" : "No items match your filters"}
            message={items.length === 0 ? "Add your first one above." : "Try a different search or filter."}
          />
        </div>
      ) : (
        <>
          <div className="mt-4 overflow-x-auto rounded-xl border border-cream-200">
            <table className="w-full min-w-[960px] text-left text-sm">
              <thead className="bg-cream-100 text-xs font-semibold uppercase tracking-wide text-ink-500">
                <tr>
                  <th className="px-4 py-3">Image</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Meal Type</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Sort Order</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((item) => (
                  <tr key={item.id} className="border-t border-cream-200 hover:bg-cream-50">
                    <td className="px-4 py-3">
                      <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-lg border border-cream-300 bg-cream-100">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                        ) : (
                          <ImageOutlinedIcon fontSize="small" className="text-ink-300" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-ink-900">{item.name}</p>
                      {item.is_featured && (
                        <span className="mt-0.5 inline-block rounded-full bg-terracotta-100 px-2 py-0.5 text-[11px] font-semibold text-terracotta-600">
                          Featured
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-ink-500">{item.category?.name || "Uncategorized"}</td>
                    <td className="px-4 py-3 text-ink-500 capitalize">{item.meal_type || "—"}</td>
                    <td className="px-4 py-3 font-semibold text-ink-900">{formatPeso(Number(item.price))}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleToggleAvailable(item)}
                        disabled={togglingId === item.id}
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold transition disabled:opacity-50 ${
                          item.is_available
                            ? "bg-sage-100 text-sage-600 hover:bg-sage-200"
                            : "bg-red-100 text-red-600 hover:bg-red-200"
                        }`}
                      >
                        {item.is_available ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-ink-700">{item.sort_order}</td>
                    <td className="px-4 py-3 text-ink-500">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditForm(item)}
                          className="rounded-lg border border-cream-300 px-2.5 py-1 text-xs font-semibold text-ink-700 transition hover:border-sage-400"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(item)}
                          className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between text-sm text-ink-500">
              <p>
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-lg border border-cream-300 px-3 py-1.5 text-xs font-semibold text-ink-700 transition hover:border-sage-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded-lg border border-cream-300 px-3 py-1.5 text-xs font-semibold text-ink-700 transition hover:border-sage-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <MenuItemFormDialog
        open={formOpen}
        item={editingItem}
        categories={categories}
        onClose={closeForm}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete menu item?"
        message={`"${deleteTarget?.name}" will be permanently removed from the menu. This can't be undone.`}
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
