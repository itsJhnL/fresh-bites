// The one real, existing delivery-time estimate in the app (see
// OrderDetailPanels.jsx) — shared here so nothing else (e.g. the homepage
// highlights section) invents a different number.
export const DELIVERY_ESTIMATE_MINUTES = 45;

export const PAYMENT_METHOD_LABEL = {
  cod: "Cash on Delivery",
  demo_card: "Demo Card",
  demo_ewallet: "Demo E-Wallet",
};

export const STATUS_LABEL = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  ready: "Ready",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

// Same sage/terracotta/red semantics used for the admin order-status
// badges: sage = positive/in-progress, terracotta = pending attention,
// red = cancelled/error.
export const STATUS_BADGE_CLASS = {
  pending: "bg-terracotta-100 text-terracotta-600",
  confirmed: "bg-sage-100 text-sage-600",
  preparing: "bg-sage-100 text-sage-600",
  ready: "bg-sage-100 text-sage-600",
  out_for_delivery: "bg-sage-100 text-sage-600",
  delivered: "bg-sage-100 text-sage-600",
  cancelled: "bg-red-100 text-red-700",
};
