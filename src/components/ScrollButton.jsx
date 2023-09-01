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
    <div>
      <button onClick={scrollToTop} className="fixed bottom-5 right-5 tran">
        <i>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="50"
            height="50"
            viewBox="0 0 24 24"
            style={{ display: visible ? "inline" : "none" }}
          >
            <path
              fill="#435334"
              d="M12 22A10 10 0 0 1 2 12A10 10 0 0 1 12 2a10 10 0 0 1 10 10a10 10 0 0 1-10 10m0-15l-5 5h3v4h4v-4h3l-5-5Z"
            />
          </svg>
        </i>
      </button>
    </div>
  );
}
