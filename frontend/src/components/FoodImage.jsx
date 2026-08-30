import { useState } from "react";

// Renders the real photo when one exists; otherwise (or if it fails to
// load) falls back to a plain branded placeholder instead of ever pointing
// an <img> at a path that doesn't exist. `alt` is always required and is
// applied either to the <img> or via role="img" on the placeholder, so a
// screen reader still gets the dish name even with no photo.
function PlaceholderGlyph() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="h-1/3 w-1/3">
      <circle cx="24" cy="24" r="20" fill="currentColor" opacity="0.12" />
      <circle cx="24" cy="24" r="12" fill="none" stroke="currentColor" strokeWidth="2" />
      <path
        d="M24 15v18M20.5 15v7a1.75 1.75 0 0 0 3.5 0v-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FoodImage({ src, alt, className = "" }) {
  const [failed, setFailed] = useState(false);
  const showPlaceholder = !src || failed;

  if (showPlaceholder) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center bg-terracotta-50 text-terracotta-400 ${className}`}
      >
        <PlaceholderGlyph />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
