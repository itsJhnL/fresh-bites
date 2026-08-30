export default function EmptyState({ title, message, action }) {
  return (
    <div className="rounded-xl border border-dashed border-cream-300 bg-cream-50 p-10 text-center">
      <p className="text-base font-bold text-ink-900">{title}</p>
      {message && <p className="mt-2 text-sm text-ink-500">{message}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
