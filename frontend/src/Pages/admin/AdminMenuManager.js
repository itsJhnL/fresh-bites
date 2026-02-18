import { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import { dishes } from "../../data/data";

const seedItems = dishes.map((item) => ({
  id: item.id,
  title: item.title,
  price: item.price,
}));

export default function AdminMenuManager() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: "", price: "" });

  useEffect(() => {
    const loadItems = async () => {
      try {
        const response = await adminApi.getMenuItems();
        setItems(response.data);
      } catch {
        setItems(seedItems);
      }
    };

    loadItems();
  }, []);

  const addItem = async (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.price.trim()) {
      return;
    }

    const newItem = { id: Date.now(), title: form.title.trim(), price: form.price.trim() };
    setItems((prev) => [newItem, ...prev]);
    setForm({ title: "", price: "" });

    try {
      await adminApi.createMenuItem(newItem);
    } catch {
      // Demo fallback.
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1f2937]">Menu Manager</h1>
      <p className="mt-1 text-sm text-[#64748b]">
        Add and review menu items for your storefront.
      </p>

      <form onSubmit={addItem} className="mt-5 grid gap-3 rounded-xl border border-[#edf1f4] p-4 sm:grid-cols-3">
        <input
          value={form.title}
          onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          className="rounded-lg border border-[#d6dde5] px-3 py-2 text-sm outline-none focus:border-[#667B68] sm:col-span-2"
          placeholder="Dish name"
        />
        <div className="flex gap-2">
          <input
            value={form.price}
            onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
            className="w-full rounded-lg border border-[#d6dde5] px-3 py-2 text-sm outline-none focus:border-[#667B68]"
            placeholder="Price"
          />
          <button
            type="submit"
            className="rounded-lg bg-[#667B68] px-3 py-2 text-sm font-semibold text-white hover:bg-[#556657]"
          >
            Add
          </button>
        </div>
      </form>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-[#edf1f4] bg-[#fbfdff] p-4">
            <p className="font-semibold text-[#1f2937]">{item.title}</p>
            <p className="mt-1 text-sm text-[#64748b]">{item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
