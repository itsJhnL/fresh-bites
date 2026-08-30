// motion-safe: so prefers-reduced-motion users get a static block instead
// of an endlessly pulsing one.
export default function Skeleton({ className = "" }) {
  return <div aria-hidden="true" className={`motion-safe:animate-pulse rounded-md bg-cream-200 ${className}`} />;
}
