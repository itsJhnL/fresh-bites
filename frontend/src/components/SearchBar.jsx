import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

export default function SearchBar({ value, onChange, placeholder = "Search dishes..." }) {
  return (
    <div className="relative">
      <SearchIcon
        fontSize="small"
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-300"
      />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label="Search menu"
        className="w-full rounded-lg border border-cream-300 py-2.5 pl-10 pr-10 text-sm text-ink-900 outline-none focus:border-sage-500"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-ink-300 transition hover:bg-cream-100 hover:text-ink-700"
        >
          <CloseIcon fontSize="small" />
        </button>
      )}
    </div>
  );
}
