import { useState } from "react";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const STORAGE_KEY = "freshbite.reservations.demo.v1";
const EMPTY_FORM = { fullName: "", phone: "", partySize: "2", date: "", time: "", notes: "" };

function saveReservation(entry) {
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    existing.push({ ...entry, id: Date.now(), createdAt: new Date().toISOString() });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch {
    // Non-fatal — the on-screen confirmation is the real feedback here,
    // losing the local demo record isn't worth surfacing an error for.
  }
}

// Demo-only: there is no restaurant reservation system behind this app (it's
// a food-ordering platform), so a submission here is saved to this device's
// localStorage and confirmed on-screen — never sent anywhere or promised as
// a real booking. The disclaimer below says exactly that.
export default function ReservationForm() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(null);

  const updateField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.fullName.trim() || !form.phone.trim() || !form.date || !form.time) {
      setError("Please fill in your name, phone number, date, and time.");
      return;
    }
    setError("");
    saveReservation(form);
    setSubmitted({ ...form });
    setForm(EMPTY_FORM);
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-sage-200 bg-sage-50 p-8 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sage-100 text-sage-600">
          <EventAvailableIcon />
        </span>
        <h3 className="mt-4 font-display text-xl text-ink-900">Reservation request received</h3>
        <p className="mt-2 text-sm text-ink-700">
          {submitted.fullName}, we've noted a table for {submitted.partySize} on {submitted.date} at {submitted.time}.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(null)}
          className="mt-5 rounded-lg border border-sage-300 px-4 py-2 text-sm font-semibold text-sage-700 transition hover:bg-sage-100"
        >
          Make another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-cream-200 bg-cream-50 p-6 shadow-card sm:p-8">
      <div className="mb-4 flex items-start gap-2 rounded-lg border border-terracotta-100 bg-terracotta-50 px-3 py-2.5 text-xs font-semibold text-terracotta-700">
        <InfoOutlinedIcon fontSize="small" />
        <span>Demo feature — reservation requests are saved on this device only and aren't sent to the restaurant.</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="res-name" className="mb-1 block text-sm font-semibold text-ink-700">
            Full Name
          </label>
          <input
            id="res-name"
            type="text"
            value={form.fullName}
            onChange={(e) => updateField("fullName", e.target.value)}
            placeholder="Juan Dela Cruz"
            className="w-full rounded-lg border border-cream-300 px-3 py-2 text-sm outline-none focus:border-sage-500"
          />
        </div>
        <div>
          <label htmlFor="res-phone" className="mb-1 block text-sm font-semibold text-ink-700">
            Phone
          </label>
          <input
            id="res-phone"
            type="tel"
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            placeholder="09XXXXXXXXX"
            className="w-full rounded-lg border border-cream-300 px-3 py-2 text-sm outline-none focus:border-sage-500"
          />
        </div>
        <div>
          <label htmlFor="res-party" className="mb-1 block text-sm font-semibold text-ink-700">
            Party Size
          </label>
          <select
            id="res-party"
            value={form.partySize}
            onChange={(e) => updateField("partySize", e.target.value)}
            className="w-full rounded-lg border border-cream-300 px-3 py-2 text-sm outline-none focus:border-sage-500"
          >
            {["1", "2", "3", "4", "5", "6", "7+"].map((n) => (
              <option key={n} value={n}>
                {n} {n === "1" ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="res-date" className="mb-1 block text-sm font-semibold text-ink-700">
            Date
          </label>
          <input
            id="res-date"
            type="date"
            value={form.date}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => updateField("date", e.target.value)}
            className="w-full rounded-lg border border-cream-300 px-3 py-2 text-sm outline-none focus:border-sage-500"
          />
        </div>
        <div>
          <label htmlFor="res-time" className="mb-1 block text-sm font-semibold text-ink-700">
            Time
          </label>
          <input
            id="res-time"
            type="time"
            value={form.time}
            onChange={(e) => updateField("time", e.target.value)}
            className="w-full rounded-lg border border-cream-300 px-3 py-2 text-sm outline-none focus:border-sage-500"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="res-notes" className="mb-1 block text-sm font-semibold text-ink-700">
            Notes (optional)
          </label>
          <textarea
            id="res-notes"
            value={form.notes}
            onChange={(e) => updateField("notes", e.target.value)}
            rows={2}
            placeholder="Allergies, special occasion, seating preference..."
            className="w-full rounded-lg border border-cream-300 px-3 py-2 text-sm outline-none focus:border-sage-500"
          />
        </div>
      </div>

      {error && <p className="mt-3 text-sm font-semibold text-red-600">{error}</p>}

      <button
        type="submit"
        className="mt-5 w-full rounded-lg bg-terracotta-500 px-5 py-3 text-sm font-bold text-cream-50 transition hover:bg-terracotta-600 sm:w-auto"
      >
        Request a Table
      </button>
    </form>
  );
}
