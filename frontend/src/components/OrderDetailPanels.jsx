import { formatPeso } from "../utils/money";
import { PAYMENT_METHOD_LABEL, DELIVERY_ESTIMATE_MINUTES } from "../utils/orderLabels";
import OrderStatusTimeline from "./OrderStatusTimeline";

function estimateDeliveryTime(createdAt) {
  const date = new Date(createdAt);
  date.setMinutes(date.getMinutes() + DELIVERY_ESTIMATE_MINUTES);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Shared by OrderConfirmation and OrderDetails so an order's items/delivery
// info/status render identically in both places — one place to fix, not two.
export default function OrderDetailPanels({ order, showEstimatedDelivery = false }) {
  const address = order.delivery_address || {};

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-cream-200 bg-cream-50 p-6 shadow-card">
        <h2 className="text-lg font-bold text-ink-900">Items</h2>
        <div className="mt-3 space-y-3">
          {order.order_items.map((item) => (
            <div key={item.id} className="flex items-start justify-between gap-3 text-sm">
              <span className="text-ink-700">
                {item.item_name} x{item.quantity}
                {item.customizations?.length > 0 && (
                  <span className="block text-xs text-ink-300">
                    {item.customizations.map((c) => c.name).join(", ")}
                  </span>
                )}
              </span>
              <span className="shrink-0 font-semibold text-ink-900">
                {formatPeso(Number(item.total_price))}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-1 border-t border-cream-200 pt-3 text-sm">
          <div className="flex justify-between text-ink-500">
            <span>Subtotal</span>
            <span>{formatPeso(Number(order.subtotal))}</span>
          </div>
          <div className="flex justify-between text-ink-500">
            <span>Delivery Fee</span>
            <span>{formatPeso(Number(order.delivery_fee))}</span>
          </div>
          {Number(order.discount) > 0 && (
            <div className="flex justify-between text-sage-600">
              <span>Discount</span>
              <span>-{formatPeso(Number(order.discount))}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-cream-200 pt-2 text-base font-bold text-ink-900">
            <span>Total</span>
            <span>{formatPeso(Number(order.total))}</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl border border-cream-200 bg-cream-50 p-6 shadow-card">
          <h2 className="text-lg font-bold text-ink-900">Delivery &amp; Payment</h2>
          <div className="mt-3 space-y-1 text-sm text-ink-500">
            <p>
              <span className="font-semibold text-ink-900">Deliver to:</span> {address.full_name}
            </p>
            <p>
              {address.address_line}, {address.city}
              {address.postal_code ? ` ${address.postal_code}` : ""}
            </p>
            {address.delivery_notes && (
              <p className="text-xs text-ink-300">Note: {address.delivery_notes}</p>
            )}
            <p className="pt-2">
              <span className="font-semibold text-ink-900">Payment:</span>{" "}
              {PAYMENT_METHOD_LABEL[order.payment_method] || order.payment_method} (
              {order.payment_status === "paid" ? "Paid" : "Unpaid"})
            </p>
            {showEstimatedDelivery && (
              <p>
                <span className="font-semibold text-ink-900">Estimated Delivery:</span> ~
                {estimateDeliveryTime(order.created_at)}
              </p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-cream-200 bg-cream-50 p-6 shadow-card">
          <h2 className="text-lg font-bold text-ink-900">Status</h2>
          <div className="mt-4">
            <OrderStatusTimeline status={order.status} />
          </div>
        </div>
      </div>
    </div>
  );
}
