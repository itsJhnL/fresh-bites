import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Toast from "../components/Toast";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Footer from "../components/Footer.jsx";
import ErrorState from "../components/ErrorState";
import Skeleton from "../components/Skeleton";
import OrderDetailPanels from "../components/OrderDetailPanels";
import { useCart } from "../context/CartContext";
import { fetchOrderById } from "../lib/orderService";
import { buildReorderPlan } from "../lib/reorder";
import { STATUS_LABEL, STATUS_BADGE_CLASS } from "../utils/orderLabels";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");
  const [reordering, setReordering] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    let active = true;
    setLoading(true);
    setNotFound(false);
    setError("");

    fetchOrderById(id)
      .then((data) => {
        if (!active) return;
        if (!data) {
          setNotFound(true);
          return;
        }
        setOrder(data);
      })
      .catch((err) => {
        if (!active) return;
        if (err?.code === "22P02") {
          setNotFound(true);
          return;
        }
        setError("We couldn't load this order right now. Please try again shortly.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  const handleReorder = async () => {
    setReordering(true);
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
      setReordering(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-5">
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-5">
        <h1 className="font-display text-3xl text-ink-900">Order not found</h1>
        <p className="mt-2 text-sm text-ink-500">We couldn&apos;t find that order on your account.</p>
        <Link
          to="/orders"
          className="mt-5 inline-block rounded-lg bg-terracotta-500 px-5 py-2.5 text-sm font-semibold text-cream-50 transition hover:bg-terracotta-600"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-5">
        <ErrorState message={error} onRetry={() => navigate(0)} />
      </div>
    );
  }

  return (
    <>
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-5">
        <button
          type="button"
          onClick={() => navigate("/orders")}
          className="mb-5 inline-flex items-center gap-1 text-sm font-semibold text-ink-700 transition hover:text-terracotta-500"
        >
          <ArrowBackIcon fontSize="small" /> Back to Orders
        </button>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-3xl text-ink-900">Order {order.order_number}</h1>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  STATUS_BADGE_CLASS[order.status] || "bg-cream-200 text-ink-700"
                }`}
              >
                {STATUS_LABEL[order.status] || order.status}
              </span>
            </div>
            <p className="mt-1 text-sm text-ink-500">{new Date(order.created_at).toLocaleString()}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => navigate(`/orders/${order.id}/track`)}
              className="rounded-lg bg-terracotta-500 px-4 py-2 text-sm font-semibold text-cream-50 transition hover:bg-terracotta-600"
            >
              Track Order
            </button>
            <button
              type="button"
              onClick={handleReorder}
              disabled={reordering}
              className="rounded-lg border border-cream-300 px-4 py-2 text-sm font-semibold text-ink-700 transition hover:border-terracotta-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {reordering ? "Reordering..." : "Reorder"}
            </button>
          </div>
        </div>

        <OrderDetailPanels order={order} />
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
