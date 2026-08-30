import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Toast from "../components/Toast";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Footer from "../components/Footer.jsx";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import Skeleton from "../components/Skeleton";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { fetchMyOrders } from "../lib/orderService";
import { buildReorderPlan } from "../lib/reorder";
import { formatPeso } from "../utils/money";
import { PAYMENT_METHOD_LABEL, STATUS_LABEL, STATUS_BADGE_CLASS } from "../utils/orderLabels";

export default function Orders() {
  const { user } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });
  const [reorderingId, setReorderingId] = useState(null);

  const load = useCallback(() => {
    if (!user?.id) return undefined;
    setLoading(true);
    setError("");
    return fetchMyOrders(user.id)
      .then(setOrders)
      .catch(() => setError("We couldn't load your orders right now. Please try again shortly."))
      .finally(() => setLoading(false));
  }, [user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleReorder = async (order) => {
    setReorderingId(order.id);
    try {
      const { addable, unavailableNames } = await buildReorderPlan(order.order_items);
      addable.forEach(({ cartItem, quantity, customizations }) => addItem(cartItem, quantity, customizations));

      if (unavailableNames.length > 0) {
        setToast({
          open: true,
          message:
            addable.length > 0
              ? `Added ${addable.length} item(s) to cart. Unavailable: ${unavailableNames.join(", ")}.`
              : `None of these items are available anymore: ${unavailableNames.join(", ")}.`,
          severity: addable.length > 0 ? "warning" : "error",
        });
      } else {
        setToast({ open: true, message: "Added items to your cart.", severity: "success" });
      }
    } catch {
      setToast({ open: true, message: "Could not reorder right now. Please try again.", severity: "error" });
    } finally {
      setReorderingId(null);
    }
  };

  return (
    <>
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-5">
        <h1 className="font-display text-3xl text-ink-900">My Orders</h1>

        {loading ? (
          <div className="mt-6 space-y-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-28 w-full rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <div className="mt-6">
            <ErrorState message={error} onRetry={load} />
          </div>
        ) : orders.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              title="You haven't placed an order yet."
              action={
                <Link
                  to="/Menu"
                  className="inline-block rounded-lg bg-terracotta-500 px-5 py-2.5 text-sm font-semibold text-cream-50 transition hover:bg-terracotta-600"
                >
                  Browse Menu
                </Link>
              }
            />
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-xl border border-cream-200 bg-cream-50 p-5 shadow-card transition hover:border-terracotta-400"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className="group flex items-center gap-1 text-left"
                  >
                    <div>
                      <p className="font-bold text-ink-900 group-hover:text-terracotta-500">
                        {order.order_number}
                      </p>
                      <p className="text-xs text-ink-300">{new Date(order.created_at).toLocaleString()}</p>
                    </div>
                    <ChevronRightIcon
                      fontSize="small"
                      className="text-ink-300 transition group-hover:translate-x-0.5 group-hover:text-terracotta-500"
                    />
                  </button>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      STATUS_BADGE_CLASS[order.status] || "bg-cream-200 text-ink-700"
                    }`}
                  >
                    {STATUS_LABEL[order.status] || order.status}
                  </span>
                </div>

                <p className="mt-3 truncate text-sm text-ink-500">
                  {order.order_items.map((item) => `${item.item_name} x${item.quantity}`).join(", ")}
                </p>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-cream-200 pt-3">
                  <p className="text-sm text-ink-700">
                    <span className="font-semibold text-ink-900">{formatPeso(Number(order.total))}</span> ·{" "}
                    {PAYMENT_METHOD_LABEL[order.payment_method] || order.payment_method}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="rounded-lg border border-cream-300 px-3 py-1.5 text-xs font-semibold text-ink-700 transition hover:border-terracotta-400"
                    >
                      View Order
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReorder(order)}
                      disabled={reorderingId === order.id}
                      className="rounded-lg bg-terracotta-500 px-3 py-1.5 text-xs font-semibold text-cream-50 transition hover:bg-terracotta-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {reorderingId === order.id ? "Reordering..." : "Reorder"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        autoHideDuration={3000}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      />
      <Footer />
    </>
  );
}
