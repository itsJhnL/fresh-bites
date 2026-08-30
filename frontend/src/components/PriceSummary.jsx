import { formatPeso } from "../utils/money";

// Shared by the Cart page and Checkout so the same numbers are computed
// once (see src/utils/cartMath.js) and rendered the same way everywhere.
export default function PriceSummary({ subtotal, deliveryFee, discount, total, className = "" }) {
  return (
    <div className={`space-y-2 text-sm ${className}`}>
      <div className="flex items-center justify-between text-ink-500">
        <span>Subtotal</span>
        <span>{formatPeso(subtotal)}</span>
      </div>
      <div className="flex items-center justify-between text-ink-500">
        <span>Delivery Fee</span>
        <span>{formatPeso(deliveryFee)}</span>
      </div>
      {discount > 0 && (
        <div className="flex items-center justify-between text-sage-600">
          <span>Discount</span>
          <span>-{formatPeso(discount)}</span>
        </div>
      )}
      <div className="flex items-center justify-between border-t border-cream-200 pt-2 text-base font-bold text-ink-900">
        <span>Total</span>
        <span>{formatPeso(total)}</span>
      </div>
    </div>
  );
}
