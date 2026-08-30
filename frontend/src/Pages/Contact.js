import { useState } from "react";
import Footer from "../components/Footer";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CallIcon from "@mui/icons-material/Call";
import AttachEmailIcon from "@mui/icons-material/AttachEmail";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const CONTACT_COOLDOWN_KEY = "freshBitesContactCooldown";
  const ONE_HOUR_MS = 60 * 60 * 1000;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMessage("");

    const emailKey = formData.email.trim().toLowerCase();
    const now = Date.now();
    const raw = localStorage.getItem(CONTACT_COOLDOWN_KEY);
    const cooldownMap = raw ? JSON.parse(raw) : {};
    const lastSentAt = cooldownMap[emailKey] || 0;

    if (now - lastSentAt < ONE_HOUR_MS) {
      const minutesLeft = Math.ceil((ONE_HOUR_MS - (now - lastSentAt)) / 60000);
      setErrorMessage(
        `This email was used recently. Please try again in ${minutesLeft} minute(s).`
      );
      return;
    }

    cooldownMap[emailKey] = now;
    localStorage.setItem(CONTACT_COOLDOWN_KEY, JSON.stringify(cooldownMap));

    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSubmitted(false), 2500);
  };

  return (
    <div className="min-h-screen bg-cream-100">
      <section className="mx-auto max-w-6xl px-5 py-14 sm:py-16">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl text-ink-900 sm:text-4xl">
            Get in touch, let&apos;s talk.
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-ink-500 sm:text-base">
            For inquiries, collaboration opportunities, or simple feedback, send us
            a message and we&apos;ll respond as soon as possible.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-cream-200 bg-cream-50 p-6 shadow-card sm:p-8">
            <h2 className="text-xl font-bold text-ink-900">Contact Information</h2>
            <p className="mt-2 text-sm text-ink-500">
              You can also reach us directly using the details below.
            </p>

            <div className="mt-6 space-y-4">
              <a
                href="https://www.google.com/search?q=nueva+ecija+philippines"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 rounded-lg border border-cream-200 p-4 transition hover:border-terracotta-400"
              >
                <span className="rounded-lg bg-terracotta-50 p-2 text-terracotta-500">
                  <LocationOnIcon fontSize="small" />
                </span>
                <span>
                  <p className="text-sm font-semibold text-ink-900">Location</p>
                  <p className="text-sm text-ink-500">Nueva Ecija, Philippines</p>
                </span>
              </a>

              <a
                href="tel:+639927180980"
                className="flex items-start gap-3 rounded-lg border border-cream-200 p-4 transition hover:border-terracotta-400"
              >
                <span className="rounded-lg bg-terracotta-50 p-2 text-terracotta-500">
                  <CallIcon fontSize="small" />
                </span>
                <span>
                  <p className="text-sm font-semibold text-ink-900">Phone</p>
                  <p className="text-sm text-ink-500">+63 992-718-0980</p>
                </span>
              </a>

              <a
                href="mailto:johnleo.bruno@gmail.com"
                className="flex items-start gap-3 rounded-lg border border-cream-200 p-4 transition hover:border-terracotta-400"
              >
                <span className="rounded-lg bg-terracotta-50 p-2 text-terracotta-500">
                  <AttachEmailIcon fontSize="small" />
                </span>
                <span>
                  <p className="text-sm font-semibold text-ink-900">Email</p>
                  <p className="text-sm text-ink-500">JanggoDev@gmail.com</p>
                </span>
              </a>
            </div>
          </div>

          <div className="rounded-xl border border-cream-200 bg-cream-50 p-6 shadow-card sm:p-8">
            <h2 className="text-xl font-bold text-ink-900">Send a Message</h2>
            <p className="mt-1 text-xs text-ink-500">
              Demo form — messages are kept on this device only and aren&apos;t sent to
              anyone yet.
            </p>
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label htmlFor="name" className="mb-1 block text-sm font-semibold text-ink-700">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-ink-900 outline-none focus:border-sage-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-semibold text-ink-700">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-ink-900 outline-none focus:border-sage-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="mb-1 block text-sm font-semibold text-ink-700"
                >
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-ink-900 outline-none focus:border-sage-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="mb-1 block text-sm font-semibold text-ink-700"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-ink-900 outline-none focus:border-sage-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-terracotta-500 px-4 py-2.5 text-sm font-semibold text-cream-50 transition hover:bg-terracotta-600"
              >
                Send Message
              </button>
              {errorMessage && (
                <p className="text-center text-sm font-semibold text-terracotta-600">
                  {errorMessage}
                </p>
              )}
              {submitted && (
                <p className="text-center text-sm font-semibold text-sage-600">
                  Message sent successfully.
                </p>
              )}
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
