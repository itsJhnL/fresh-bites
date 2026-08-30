import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Footer from "../components/Footer.jsx";
import ErrorState from "../components/ErrorState";
import Skeleton from "../components/Skeleton";
import OrderStatusTimeline from "../components/OrderStatusTimeline";
import { fetchOrderById, advanceOrderDemo } from "../lib/orderService";

export default function OrderTracking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");
  const [advancing, setAdvancing] = useState(false);

  const loadOrder = useCallback(() => {
    setLoading(true);
    setNotFound(false);
    setError("");
    return fetchOrderById(id)
      .then((data) => {
        if (!data) {
          setNotFound(true);
          return;
        }
        setOrder(data);
      })
      .catch((err) => {
        // A malformed (non-UUID) route param and "doesn't exist" should
        // look the same to the user — neither is information worth leaking.
        if (err?.code === "22P02") {
          setNotFound(true);
          return;
        }
        setError("We couldn't load this order right now. Please try again shortly.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const handleAdvance = async () => {
    setAdvancing(true);
    try {
      await advanceOrderDemo(order.id);
      await loadOrder();
    } catch {
      setError("Could not advance the demo status right now. Please try again.");
    } finally {
      setAdvancing(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-5">
        <Skeleton className="h-72 w-full rounded-xl" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-5">
        <h1 className="font-display text-3xl text-ink-900">Order not found</h1>
        <p className="mt-2 text-sm text-ink-500">
          We couldn&apos;t find that order on your account.
        </p>
        <Link
          to="/Menu"
          className="mt-5 inline-block rounded-lg bg-terracotta-500 px-5 py-2.5 text-sm font-semibold text-cream-50 transition hover:bg-terracotta-600"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-5">
        <ErrorState message={error} onRetry={loadOrder} />
      </div>
    );
  }

  const canAdvance = !["delivered", "cancelled"].includes(order.status);

  return (
    <>
      <section className="mx-auto max-w-2xl px-4 py-10 sm:px-5">
        <button
          type="button"
          onClick={() => navigate(`/order-confirmation/${order.order_number}`)}
          className="mb-5 inline-flex items-center gap-1 text-sm font-semibold text-ink-700 transition hover:text-terracotta-500"
        >
          <ArrowBackIcon fontSize="small" /> Back to Order
        </button>

        <h1 className="font-display text-3xl text-ink-900">Track Order {order.order_number}</h1>

        <div className="mt-3 flex items-start gap-2 rounded-lg border border-cream-300 bg-cream-100 px-3 py-2.5 text-xs font-semibold text-ink-700">
          <InfoOutlinedIcon fontSize="small" className="mt-0.5 shrink-0 text-ink-500" />
          <span>
            Demo tracking — status changes here are simulated for this demo. There is no real
            delivery or GPS tracking behind this.
          </span>
        </div>

        <div className="mt-6 rounded-xl border border-cream-200 bg-white p-6 shadow-card">
          <OrderStatusTimeline status={order.status} />
        </div>

        {error && (
          <p className="mt-3 text-sm font-semibold text-red-600">{error}</p>
        )}

        {canAdvance && (
          <button
            type="button"
            onClick={handleAdvance}
            disabled={advancing}
            className="mt-5 w-full rounded-lg border border-dashed border-sage-400 px-4 py-2.5 text-sm font-semibold text-sage-600 transition hover:bg-sage-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {advancing ? "Advancing..." : "Simulate Next Status (Demo)"}
          </button>
        )}
      </section>
      <Footer />
    </>
  );
}
