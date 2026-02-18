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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff8ef_0%,_#fffdf8_55%,_#ffffff_100%)]">
      <section className="mx-auto max-w-6xl px-5 py-14 sm:py-16">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-[#1f2937] sm:text-4xl">
            Get in touch, let&apos;s talk.
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-[#64748b] sm:text-base">
            For inquiries, collaboration opportunities, or simple feedback, send us
            a message and we&apos;ll respond as soon as possible.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-[#f1e4d8] bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-[#00213F]">Contact Information</h2>
            <p className="mt-2 text-sm text-[#64748b]">
              You can also reach us directly using the details below.
            </p>

            <div className="mt-6 space-y-4">
              <a
                href="https://www.google.com/search?q=nueva+ecija+philippines"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 rounded-xl border border-[#f2ebe4] p-4 transition hover:border-[#FF785B]"
              >
                <span className="rounded-lg bg-[#fff2eb] p-2 text-[#FF785B]">
                  <LocationOnIcon fontSize="small" />
                </span>
                <span>
                  <p className="text-sm font-semibold text-[#334155]">Location</p>
                  <p className="text-sm text-[#64748b]">Nueva Ecija, Philippines</p>
                </span>
              </a>

              <a
                href="tel:+639927180980"
                className="flex items-start gap-3 rounded-xl border border-[#f2ebe4] p-4 transition hover:border-[#FF785B]"
              >
                <span className="rounded-lg bg-[#fff2eb] p-2 text-[#FF785B]">
                  <CallIcon fontSize="small" />
                </span>
                <span>
                  <p className="text-sm font-semibold text-[#334155]">Phone</p>
                  <p className="text-sm text-[#64748b]">+63 992-718-0980</p>
                </span>
              </a>

              <a
                href="mailto:johnleo.bruno@gmail.com"
                className="flex items-start gap-3 rounded-xl border border-[#f2ebe4] p-4 transition hover:border-[#FF785B]"
              >
                <span className="rounded-lg bg-[#fff2eb] p-2 text-[#FF785B]">
                  <AttachEmailIcon fontSize="small" />
                </span>
                <span>
                  <p className="text-sm font-semibold text-[#334155]">Email</p>
                  <p className="text-sm text-[#64748b]">JanggoDev@gmail.com</p>
                </span>
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-[#f1e4d8] bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-[#00213F]">Send a Message</h2>
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label htmlFor="name" className="mb-1 block text-sm font-semibold text-[#334155]">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[#d5dde5] px-3 py-2 text-sm outline-none focus:border-[#667B68]"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-semibold text-[#334155]">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[#d5dde5] px-3 py-2 text-sm outline-none focus:border-[#667B68]"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="mb-1 block text-sm font-semibold text-[#334155]"
                >
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[#d5dde5] px-3 py-2 text-sm outline-none focus:border-[#667B68]"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="mb-1 block text-sm font-semibold text-[#334155]"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[#d5dde5] px-3 py-2 text-sm outline-none focus:border-[#667B68]"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-[#FF785B] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#e96b4f]"
              >
                Send Message
              </button>
              {errorMessage && (
                <p className="text-center text-sm font-semibold text-[#b42318]">
                  {errorMessage}
                </p>
              )}
              {submitted && (
                <p className="text-center text-sm font-semibold text-[#2f6d31]">
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
