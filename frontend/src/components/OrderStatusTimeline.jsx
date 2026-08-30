import CheckIcon from "@mui/icons-material/Check";

const STEPS = [
  { key: "pending", label: "Order Placed" },
  { key: "confirmed", label: "Confirmed" },
  { key: "preparing", label: "Preparing" },
  { key: "ready", label: "Ready" },
  { key: "out_for_delivery", label: "Out for Delivery" },
  { key: "delivered", label: "Delivered" },
];

// Demo-only: status changes here are simulated (checkout, or the tracking
// page's own demo-advance button), not real kitchen/delivery events.
export default function OrderStatusTimeline({ status }) {
  if (status === "cancelled") {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
        <p className="text-sm font-bold text-red-700">This order was cancelled.</p>
      </div>
    );
  }

  const currentIndex = STEPS.findIndex((step) => step.key === status);

  return (
    <ol>
      {STEPS.map((step, index) => {
        const isComplete = currentIndex >= 0 && index <= currentIndex;
        const isCurrent = index === currentIndex;
        return (
          <li key={step.key} className="relative flex gap-3 pb-6 last:pb-0">
            {index < STEPS.length - 1 && (
              <span
                aria-hidden="true"
                className={`absolute left-[11px] top-6 h-full w-0.5 ${
                  index < currentIndex ? "bg-sage-500" : "bg-cream-200"
                }`}
              />
            )}
            <span
              className={`z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                isComplete ? "bg-sage-500 text-cream-50" : "bg-cream-200 text-ink-300"
              }`}
            >
              {isComplete ? <CheckIcon sx={{ fontSize: 14 }} /> : index + 1}
            </span>
            <div>
              <p className={`text-sm font-semibold ${isComplete ? "text-ink-900" : "text-ink-300"}`}>
                {step.label}
              </p>
              {isCurrent && <p className="text-xs text-sage-600">Current status</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
