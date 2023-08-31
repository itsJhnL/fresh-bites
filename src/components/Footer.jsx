import React from "react";
import Logo from "../assets/logo/Chicken.png";

export default function Footer() {
  return (
    <div className="bg-[#FFF] border-t-4">
      <div className="max-w-6xl mx-auto py-10">
        <div className="grid grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <img src={Logo} alt="" />
            <div className="text-justify space-y-2 text-gray-700 pt-5">
              <p>
                Welcome to our platform! We're here to provide top-quality
                products/services and ensure a seamless experience. Explore,
                inquire, and enjoy our offerings. Your satisfaction is our
                priority.
              </p>
            </div>
            <div className="flex flex-col">
              <h1 className="text-base font-bold text-gray-700 pt-5">
                Sign up to get 10% off your first order
              </h1>
              <form className="flex items-center justify-between pt-2 gap-2">
                <input
                  type="email"
                  placeholder="Your Email Address"
                  className="border  p-2 outline-none border-[#435334] w-full"
                />
                <button className="bg-[#435334]  text-white p-2">
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <div className="">
            <h1 className="text-base font-bold pb-5 text-[#435334]">
              Location
            </h1>
            <div className="space-y-2 text-gray-700">
              <p className="cursor-pointer hover:text-[#9EB384]">
                123 Nueva Ecija, DF 4422
              </p>
              <p className="cursor-pointer hover:text-[#9EB384]">
                144 Metro Manila, FF 4444
              </p>
              <p className="cursor-pointer hover:text-[#9EB384]">
                42 Tagaytay, SOP 4009
              </p>
            </div>
          </div>
          <div>
            <h1 className="text-base font-bold pb-5 text-[#435334]">
              Useful Links
            </h1>
            <div className="space-y-2 text-gray-700">
              <p className="cursor-pointer hover:text-[#9EB384]">
                Your Account
              </p>
              <p className="cursor-pointer hover:text-[#9EB384]"></p>
              <p className="cursor-pointer hover:text-[#9EB384]">Investors</p>
              <p className="cursor-pointer hover:text-[#9EB384]">Help Center</p>
              <p className="cursor-pointer hover:text-[#9EB384]">FAQs</p>
            </div>
          </div>
          <div className="">
            <h1 className="text-base font-bold pb-5 text-[#435334]">
              Contact Us
            </h1>
            <div className="space-y-2 text-gray-700">
              <div className="flex hover:text-[#9EB384]">
                <i>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M12 11.5A2.5 2.5 0 0 1 9.5 9A2.5 2.5 0 0 1 12 6.5A2.5 2.5 0 0 1 14.5 9a2.5 2.5 0 0 1-2.5 2.5M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Z"
                    />
                  </svg>
                </i>
                <span className="pl-3">Nueva Ecija, Philippines</span>
              </div>
              <div className="flex hover:text-[#9EB384]">
                <i>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24c1.12.37 2.33.57 3.57.57c.55 0 1 .45 1 1V20c0 .55-.45 1-1 1c-9.39 0-17-7.61-17-17c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1c0 1.25.2 2.45.57 3.57c.11.35.03.74-.25 1.02l-2.2 2.2z"
                    />
                  </svg>
                </i>
                <span className="pl-3">{"(123) 123-1234"}</span>
              </div>
              <div className="flex hover:text-[#9EB384]">
                <i>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 36 36"
                  >
                    <path
                      fill="currentColor"
                      d="M32.33 6a2 2 0 0 0-.41 0h-28a2 2 0 0 0-.53.08l14.45 14.39Z"
                      class="clr-i-solid clr-i-solid-path-1"
                    />
                    <path
                      fill="currentColor"
                      d="m33.81 7.39l-14.56 14.5a2 2 0 0 1-2.82 0L2 7.5a2 2 0 0 0-.07.5v20a2 2 0 0 0 2 2h28a2 2 0 0 0 2-2V8a2 2 0 0 0-.12-.61ZM5.3 28H3.91v-1.43l7.27-7.21l1.41 1.41Zm26.61 0h-1.4l-7.29-7.23l1.41-1.41l7.27 7.21Z"
                      class="clr-i-solid clr-i-solid-path-2"
                    />
                    <path fill="none" d="M0 0h36v36H0z" />
                  </svg>
                </i>
                <span className="pl-3">Freshbites@me.com</span>
              </div>
              <div className="">
                <h1 className="text-base font-bold text-black py-5">Socials</h1>
                <ul className="flex items-center justify-between text-gray-700">
                  <li className="cursor-pointer hover:text-[#9EB384]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"
                      />
                    </svg>
                  </li>
                  <li className="cursor-pointer hover:text-[#9EB384]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M12 9.52A2.48 2.48 0 1 0 14.48 12A2.48 2.48 0 0 0 12 9.52Zm9.93-2.45a6.53 6.53 0 0 0-.42-2.26a4 4 0 0 0-2.32-2.32a6.53 6.53 0 0 0-2.26-.42C15.64 2 15.26 2 12 2s-3.64 0-4.93.07a6.53 6.53 0 0 0-2.26.42a4 4 0 0 0-2.32 2.32a6.53 6.53 0 0 0-.42 2.26C2 8.36 2 8.74 2 12s0 3.64.07 4.93a6.86 6.86 0 0 0 .42 2.27a3.94 3.94 0 0 0 .91 1.4a3.89 3.89 0 0 0 1.41.91a6.53 6.53 0 0 0 2.26.42C8.36 22 8.74 22 12 22s3.64 0 4.93-.07a6.53 6.53 0 0 0 2.26-.42a3.89 3.89 0 0 0 1.41-.91a3.94 3.94 0 0 0 .91-1.4a6.6 6.6 0 0 0 .42-2.27C22 15.64 22 15.26 22 12s0-3.64-.07-4.93Zm-2.54 8a5.73 5.73 0 0 1-.39 1.8A3.86 3.86 0 0 1 16.87 19a5.73 5.73 0 0 1-1.81.35H8.94A5.73 5.73 0 0 1 7.13 19a3.51 3.51 0 0 1-1.31-.86A3.51 3.51 0 0 1 5 16.87a5.49 5.49 0 0 1-.34-1.81V8.94A5.49 5.49 0 0 1 5 7.13a3.51 3.51 0 0 1 .86-1.31A3.59 3.59 0 0 1 7.13 5a5.73 5.73 0 0 1 1.81-.35h6.12a5.73 5.73 0 0 1 1.81.35a3.51 3.51 0 0 1 1.31.86A3.51 3.51 0 0 1 19 7.13a5.73 5.73 0 0 1 .35 1.81V12c0 2.06.07 2.27.04 3.06Zm-1.6-7.44a2.38 2.38 0 0 0-1.41-1.41A4 4 0 0 0 15 6H9a4 4 0 0 0-1.38.26a2.38 2.38 0 0 0-1.41 1.36A4.27 4.27 0 0 0 6 9v6a4.27 4.27 0 0 0 .26 1.38a2.38 2.38 0 0 0 1.41 1.41a4.27 4.27 0 0 0 1.33.26h6a4 4 0 0 0 1.38-.26a2.38 2.38 0 0 0 1.41-1.41a4 4 0 0 0 .26-1.38V9a3.78 3.78 0 0 0-.26-1.38ZM12 15.82A3.81 3.81 0 0 1 8.19 12A3.82 3.82 0 1 1 12 15.82Zm4-6.89a.9.9 0 0 1 0-1.79a.9.9 0 0 1 0 1.79Z"
                      />
                    </svg>
                  </li>
                  <li className="cursor-pointer hover:text-[#9EB384]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M22.46 6c-.77.35-1.6.58-2.46.69c.88-.53 1.56-1.37 1.88-2.38c-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29c0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15c0 1.49.75 2.81 1.91 3.56c-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07a4.28 4.28 0 0 0 4 2.98a8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21C16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56c.84-.6 1.56-1.36 2.14-2.23Z"
                      />
                    </svg>
                  </li>
                  <li className="cursor-pointer hover:text-[#9EB384]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="m10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9c.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83c-.25.9-.83 1.48-1.73 1.73c-.47.13-1.33.22-2.65.28c-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44c-.9-.25-1.48-.83-1.73-1.73c-.13-.47-.22-1.1-.28-1.9c-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83c.25-.9.83-1.48 1.73-1.73c.47-.13 1.33-.22 2.65-.28c1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44c.9.25 1.48.83 1.73 1.73Z"
                      />
                    </svg>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-5">
        <p className="text-base">
          All Rights Reserved &copy; 2023 Copyright | Made by{" "}
          <a href="JanggoDev.com" className="text-[#435334]">
            <b>JanggoDev</b>
          </a>
        </p>
      </div>
    </div>
  );
}
