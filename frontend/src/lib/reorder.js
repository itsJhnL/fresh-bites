import { fetchMenuItemsByIds } from "./menuService";
import { formatPeso } from "../utils/money";

// Reorder always re-derives pricing from the CURRENT menu — order_items is
// a historical snapshot and is only ever consulted here to know WHAT was
// ordered (menu_item_id, quantity, which customizations) and for the
// display name of anything no longer available. Price, availability, and
// even customization price_modifiers all come from a fresh lookup.
export async function buildReorderPlan(orderItems) {
  const menuItemIds = [...new Set(orderItems.map((item) => item.menu_item_id).filter(Boolean))];
  const currentItems = await fetchMenuItemsByIds(menuItemIds);
  const currentById = new Map(currentItems.map((item) => [item.id, item]));

  const addable = [];
  const unavailableNames = [];

  orderItems.forEach((orderItem) => {
    const current = orderItem.menu_item_id ? currentById.get(orderItem.menu_item_id) : null;

    if (!current) {
      // Either the item was deleted (menu_item_id is null on the snapshot)
      // or it's no longer available (fetchMenuItemsByIds only returns
      // is_available=true rows) — either way, it can't be reordered.
      unavailableNames.push(orderItem.item_name);
      return;
    }

    // Drop any customization whose option no longer exists on the current
    // item, and re-price the ones that do from their CURRENT modifier —
    // never the price_modifier stored in the old snapshot.
    const currentOptions = current.options || [];
    const customizations = (orderItem.customizations || [])
      .map((snapshotOption) => currentOptions.find((option) => option.id === snapshotOption.id))
      .filter(Boolean)
      .map((option) => ({
        id: option.id,
        name: option.name,
        type: option.type,
        price_modifier: Number(option.price_modifier) || 0,
      }));

    addable.push({
      cartItem: {
        id: current.id,
        name: current.name,
        title: current.name,
        priceValue: Number(current.price),
        price: formatPeso(Number(current.price)),
        imageURL: current.image_url || "",
        slug: current.slug,
        description: current.description,
        categoryName: current.category?.name || null,
        mealType: current.meal_type || null,
        rating: current.rating,
        isAvailable: current.is_available,
      },
      quantity: orderItem.quantity,
      customizations,
    });
  });

  return { addable, unavailableNames };
}
