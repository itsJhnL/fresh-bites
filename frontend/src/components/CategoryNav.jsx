function pillClass(active) {
  return `shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
    active
      ? "border-terracotta-500 bg-terracotta-500 text-cream-50"
      : "border-transparent bg-cream-50 text-ink-700 hover:border-terracotta-500 hover:text-terracotta-500"
  }`;
}

export default function CategoryNav({ categories, selectedSlug, onSelect }) {
  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1"
      role="tablist"
      aria-label="Menu categories"
    >
      <button
        type="button"
        role="tab"
        aria-selected={selectedSlug === "all"}
        onClick={() => onSelect("all")}
        className={pillClass(selectedSlug === "all")}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          role="tab"
          aria-selected={selectedSlug === category.slug}
          onClick={() => onSelect(category.slug)}
          className={pillClass(selectedSlug === category.slug)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
