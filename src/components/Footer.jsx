import React from "react";
import Logo from "../assets/logo/Chicken.png";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CallIcon from "@mui/icons-material/Call";
import AttachEmailIcon from "@mui/icons-material/AttachEmail";
import FacebookIcon from "@mui/icons-material/Facebook";
// import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";

export default function Footer() {
  return (
    <div className="bg-[#FFF] border-t-4">
      <div className="max-w-6xl mx-auto py-10 px-5">
        <div className="grid lg:grid-cols-5 sm:grid-cols-1 md:grid-cols-2 gap-4">
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
              <h1 className="text-base font-bold text-[#00213F] pt-5">
                Sign up to get 10% off your first order
              </h1>
              <form className="flex items-center justify-between pt-2">
                <input
                  type="email"
                  placeholder="Your Email Address"
                  className="border p-2 outline-none w-full"
                />
                <button className="hover:bg-[#E8FBFF] bg-[#FF785B] rounded-r-full text-white hover:text-[#00213F] p-2">
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <div className="">
            <h1 className="text-base font-bold pb-5 text-[#00213F]">
              Location
            </h1>
            <div className="space-y-2 text-gray-700">
              <p className="cursor-pointer hover:text-[#FF785B] hover:translate-x-2 duration-200 ease-in-out">
                123 Nueva Ecija, DF 4422
              </p>
              <p className="cursor-pointer hover:text-[#FF785B] hover:translate-x-2 duration-200 ease-in-out">
                144 Metro Manila, FF 4444
              </p>
              <p className="cursor-pointer hover:text-[#FF785B] hover:translate-x-2 duration-200 ease-in-out">
                42 Tagaytay, SOP 4009
              </p>
            </div>
          </div>
          <div>
            <h1 className="text-base font-bold pb-5 text-[#00213F]">
              Useful Links
            </h1>
            <div className="space-y-2 text-gray-700">
              <p className="cursor-pointer hover:text-[#FF785B] hover:translate-x-2 duration-200 ease-in-out">
                Your Account
              </p>
              <p className="cursor-pointer hover:text-[#FF785B] hover:translate-x-2 duration-200 ease-in-out"></p>
              <p className="cursor-pointer hover:text-[#FF785B] hover:translate-x-2 duration-200 ease-in-out">
                Investors
              </p>
              <p className="cursor-pointer hover:text-[#FF785B] hover:translate-x-2 duration-200 ease-in-out">
                Help Center
              </p>
              <p className="cursor-pointer hover:text-[#FF785B] hover:translate-x-2 duration-200 ease-in-out">
                FAQs
              </p>
            </div>
          </div>
          <div className="">
            <h1 className="text-base font-bold pb-5 text-[#00213F]">
              Contact Us
            </h1>
            <div className="space-y-2 text-gray-700">
              <div className="flex hover:text-[#FF785B] hover:translate-x-2 duration-200 ease-in-out">
                <i>
                  <LocationOnIcon />
                </i>
                <span className="pl-3">Nueva Ecija, Philippines</span>
              </div>
              <div className="flex hover:text-[#FF785B] hover:translate-x-2 duration-200 ease-in-out">
                <i>
                  <CallIcon />
                </i>
                <span className="pl-3">{"+63 992-718-0980"}</span>
              </div>
              <div className="flex hover:text-[#FF785B] hover:translate-x-2 duration-200 ease-in-out">
                <i>
                  <AttachEmailIcon />
                </i>
                <span className="pl-3">JanggoDev@gmail.com</span>
              </div>
              <div className="">
                <h1 className="text-base font-bold text-[#00213F] py-5">
                  Socials
                </h1>
                <ul className="flex items-center justify-between text-gray-700">
                  <li className="cursor-pointer hover:text-[#FF785B] hover:-translate-y-1 duration-200 ease-in-out">
                    <FacebookIcon />
                  </li>
                  <li className="cursor-pointer hover:text-[#FF785B] hover:-translate-y-1 duration-200 ease-in-out">
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
                  <li className="cursor-pointer hover:text-[#FF785B] hover:-translate-y-1 duration-200 ease-in-out">
                    <TwitterIcon />
                  </li>
                  <li className="cursor-pointer hover:text-[#FF785B] hover:-translate-y-1 duration-200 ease-in-out">
                    <YouTubeIcon />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-5 bg-[#F1F1F1] text-center">
        <p className="text-base">
          All Rights Reserved &copy; 2023 Copyright | Made by{" "}
          <a
            href="https://janggo-dev.vercel.app/"
            target="blank"
            rel="noopenner"
            className="text-[#435334]"
          >
            <b>JanggoDev</b>
          </a>
        </p>
      </div>
    </div>
  );
}
