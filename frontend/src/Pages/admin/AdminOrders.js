import { useCallback, useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Skeleton from "../../components/Skeleton";
import EmptyState from "../../components/EmptyState";
import ErrorState from "../../components/ErrorState";
import OrderDetailPanels from "../../components/OrderDetailPanels";
import { fetchAdminOrders, updateOrderStatus } from "../../lib/adminService";
import { fetchOrderById } from "../../lib/orderService";
import { formatPeso } from "../../utils/money";
import { STATUS_LABEL } from "../../utils/orderLabels";

const STATUS_OPTIONS = ["pending", "confirmed", "preparing", "ready", "out_for_delivery", "delivered", "cancelled"];

// Consistent status-pill semantics, shared visually with AdminMenuManager's
// availability badges: sage = positive/in-progress, terracotta = pending
// attention, red = cancelled/error.
const STATUS_BADGE = {
  pending: "bg-terracotta-100 text-terracotta-600",
  confirmed: "bg-sage-100 text-sage-600",
  preparing: "bg-sage-100 text-sage-600",
  ready: "bg-sage-100 text-sage-600",
  out_for_delivery: "bg-sage-100 text-sage-600",
  delivered: "bg-sage-100 text-sage-600",
  cancelled: "bg-red-100 text-red-600",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [detailOrder, setDetailOrder] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchAdminOrders();
      setOrders(data);
    } catch {
      setError("Could not load orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const onStatusChange = async (orderId, status) => {
    const previous = orders;
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status } : order)));
    try {
      await updateOrderStatus(orderId, status);
    } catch (err) {
      // Roll back the optimistic update if the RPC rejected it (e.g. a
      // non-admin session that lost its role mid-visit — is_admin() is
      // re-checked server-side on every call, not just at page load).
      setOrders(previous);
      setError(err.message || "Could not update order status.");
    }
  };

  const openDetails = async (orderId) => {
    setDetailLoading(true);
    setDetailError("");
    setDetailOrder({ id: orderId });
    try {
      const full = await fetchOrderById(orderId);
      setDetailOrder(full);
    } catch {
      setDetailError("Could not load this order's details.");
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-900">Orders</h1>
      <p className="mt-1 text-sm text-ink-500">Manage incoming and completed orders.</p>

      {loading ? (
        <div className="mt-5 space-y-2">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <div className="mt-5">
          <ErrorState message={error} onRetry={loadOrders} />
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-5">
          <EmptyState title="No orders yet" />
        </div>
      ) : (
        <div className="mt-5 overflow-x-auto rounded-lg border border-cream-200">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-cream-100 text-ink-500">
              <tr>
                <th className="px-3 py-3 font-semibold">Order</th>
                <th className="px-3 py-3 font-semibold">Customer</th>
                <th className="px-3 py-3 font-semibold">Total</th>
                <th className="px-3 py-3 font-semibold">Status</th>
                <th className="px-3 py-3 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-cream-200 hover:bg-cream-50">
                  <td className="px-3 py-3 font-semibold text-ink-700">
                    {order.order_number}
                    <div className="text-xs font-normal text-ink-300">
                      {new Date(order.created_at).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-ink-700">
                    {order.customerName}
                    {order.customerPhone && <div className="text-xs text-ink-300">{order.customerPhone}</div>}
                  </td>
                  <td className="px-3 py-3 text-ink-700">{formatPeso(Number(order.total))}</td>
                  <td className="px-3 py-3">
                    <select
                      value={order.status}
                      onChange={(event) => onStatusChange(order.id, event.target.value)}
                      className={`rounded-full border-0 px-2.5 py-1 text-xs font-semibold capitalize outline-none ${
                        STATUS_BADGE[order.status] || "bg-cream-100 text-ink-700"
                      }`}
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {STATUS_LABEL[status] || status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-3">
                    <button
                      type="button"
                      onClick={() => openDetails(order.id)}
                      className="rounded-lg border border-cream-300 px-3 py-1.5 text-xs font-semibold text-ink-700 transition hover:border-sage-400 hover:bg-cream-50"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={Boolean(detailOrder)} onClose={() => setDetailOrder(null)} fullWidth maxWidth="md">
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span className="text-lg font-bold text-ink-900">
            {detailOrder?.order_number ? `Order ${detailOrder.order_number}` : "Order Details"}
          </span>
          <IconButton onClick={() => setDetailOrder(null)} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {detailLoading ? (
            <Skeleton className="h-64 w-full rounded-xl" />
          ) : detailError ? (
            <ErrorState message={detailError} />
          ) : (
            detailOrder?.order_items && <OrderDetailPanels order={detailOrder} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
