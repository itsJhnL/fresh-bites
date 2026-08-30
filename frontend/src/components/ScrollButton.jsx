import { useEffect, useState } from "react";

export default function ScrollButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisible = () => {
      setVisible(document.documentElement.scrollTop > 300);
    };
    window.addEventListener("scroll", toggleVisible, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisible);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      style={{ display: visible ? "flex" : "none" }}
      className="fixed bottom-5 right-5 z-10 h-11 w-11 items-center justify-center rounded-full bg-terracotta-500 text-cream-50 shadow-card transition hover:-translate-y-1 hover:bg-terracotta-600"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
        <path fill="currentColor" d="M5 15h4v6h6v-6h4l-7-8zM4 3h16v2H4z" />
      </svg>
    </button>
  );
}
