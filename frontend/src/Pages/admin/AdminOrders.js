import { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";

const fallbackOrders = [
  { id: "FB-1001", customer: "Juan Dela Cruz", total: "P899.00", status: "pending" },
  { id: "FB-1002", customer: "Maria Santos", total: "P1,249.00", status: "preparing" },
  { id: "FB-1003", customer: "Ken Ramos", total: "P599.00", status: "completed" },
];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await adminApi.getOrders();
        setOrders(response.data);
      } catch {
        setOrders(fallbackOrders);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const onStatusChange = async (orderId, status) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status } : order))
    );
    try {
      await adminApi.updateOrderStatus(orderId, status);
    } catch {
      // Keep optimistic update in demo mode.
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1f2937]">Orders</h1>
      <p className="mt-1 text-sm text-[#64748b]">
        {loading ? "Loading orders..." : "Manage incoming and completed orders."}
      </p>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-[#edf1f4] text-[#64748b]">
            <tr>
              <th className="px-3 py-3 font-semibold">Order ID</th>
              <th className="px-3 py-3 font-semibold">Customer</th>
              <th className="px-3 py-3 font-semibold">Total</th>
              <th className="px-3 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-[#f4f6f8]">
                <td className="px-3 py-3 font-semibold text-[#334155]">{order.id}</td>
                <td className="px-3 py-3 text-[#334155]">{order.customer}</td>
                <td className="px-3 py-3 text-[#334155]">{order.total}</td>
                <td className="px-3 py-3">
                  <select
                    value={order.status}
                    onChange={(event) => onStatusChange(order.id, event.target.value)}
                    className="rounded-md border border-[#d6dde5] px-2 py-1 text-xs font-semibold capitalize text-[#1f2937]"
                  >
                    <option value="pending">pending</option>
                    <option value="preparing">preparing</option>
                    <option value="completed">completed</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
