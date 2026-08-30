import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Footer from "../components/Footer.jsx";
import ErrorState from "../components/ErrorState";
import Skeleton from "../components/Skeleton";
import OrderDetailPanels from "../components/OrderDetailPanels";
import { fetchOrderByNumber } from "../lib/orderService";

export default function OrderConfirmation() {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setNotFound(false);
    setError("");

    fetchOrderByNumber(orderNumber)
      .then((data) => {
        if (!active) return;
        if (!data) {
          setNotFound(true);
          return;
        }
        setOrder(data);
      })
      .catch(() => {
        if (active) setError("We couldn't load this order right now. Please try again shortly.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-5">
        <Skeleton className="h-72 w-full rounded-xl" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-5">
        <h1 className="font-display text-3xl text-ink-900">Order not found</h1>
        <p className="mt-2 text-sm text-ink-500">
          We couldn&apos;t find an order with that number on your account.
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

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-5">
        <ErrorState message={error} onRetry={() => navigate(0)} />
      </div>
    );
  }

  return (
    <>
      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-5">
        <div className="rounded-xl border border-sage-100 bg-sage-50 p-6 text-center shadow-card sm:p-10">
          <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-sage-100 text-sage-600">
            <CheckCircleOutlineIcon sx={{ fontSize: 36 }} />
          </div>
          <h1 className="font-display text-3xl text-ink-900">Order Confirmed</h1>
          <p className="mt-2 text-sm text-ink-500">This is a demo order — no real charge was made.</p>

          <div className="mx-auto mt-6 inline-flex flex-col items-center gap-1 rounded-lg border border-cream-200 bg-cream-50 px-8 py-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-ink-500">Order Number</span>
            <span className="text-xl font-bold tracking-wide text-ink-900">{order.order_number}</span>
          </div>
        </div>

        <div className="mt-6">
          <OrderDetailPanels order={order} showEstimatedDelivery />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate(`/orders/${order.id}/track`)}
            className="rounded-lg bg-terracotta-500 px-5 py-2.5 text-sm font-semibold text-cream-50 transition hover:bg-terracotta-600"
          >
            Track Order
          </button>
          <Link
            to={`/orders/${order.id}`}
            className="rounded-lg border border-cream-300 px-5 py-2.5 text-sm font-semibold text-ink-700 transition hover:bg-cream-100"
          >
            View Full Details
          </Link>
          <button
            type="button"
            onClick={() => navigate("/Menu")}
            className="rounded-lg border border-cream-300 px-5 py-2.5 text-sm font-semibold text-ink-700 transition hover:bg-cream-100"
          >
            Continue Ordering
          </button>
        </div>
      </section>
      <Footer />
    </>
  );
}
