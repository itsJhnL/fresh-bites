import React, { useState } from "react";

export default function ScrollButton() {
  const [visible, SetVisible] = useState();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    SetVisible(true);
  };

  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 300) {
      SetVisible(true);
    } else if (scrolled <= 300) {
      SetVisible(false);
    }
  };

  window.addEventListener("scroll", toggleVisible);

  return (
    <>
      <button
        onClick={scrollToTop}
        className="bg-[#FF785B] text-white z-10 fixed bottom-3 right-3 hover:-translate-y-1 duration-300 ease-in"
      >
        <i>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="45"
            height="45"
            viewBox="0 0 24 24"
            style={{ display: visible ? "inline" : "none" }}
          >
            <path fill="currentColor" d="M5 15h4v6h6v-6h4l-7-8zM4 3h16v2H4z" />
          </svg>
        </i>
      </button>
    </>
  );
}
