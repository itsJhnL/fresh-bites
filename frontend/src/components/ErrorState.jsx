// Only ever shown with a friendly, pre-written message — never pass a raw
// Supabase/Postgres error message here (see agents.md: never expose SQL /
// Supabase internals to end users).
export default function ErrorState({ title = "Something went wrong", message, onRetry }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-10 text-center">
      <p className="text-base font-bold text-red-700">{title}</p>
      {message && <p className="mt-2 text-sm text-red-600">{message}</p>}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
