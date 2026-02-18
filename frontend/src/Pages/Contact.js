import React from "react";
import Footer from "../components/Footer";
import image from "../assets/images/background.png";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CallIcon from "@mui/icons-material/Call";
import AttachEmailIcon from "@mui/icons-material/AttachEmail";

export default function Contact() {
 /*  const background = {
    backgroundImage: `url(${image})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    // height: "100vh",
    // width: "100%",
    backgroundColor: "#FFF",
  }; */
  return (
    <div className="h-screen" /* style={background} */>
      <div className="flex flex-col items-center justify-center">
        <div className="grid grid-cols-2 sm:grid-cols-1 lg:grid-cols-2 max-w-6xl mx-auto py-24">
          <div>
            <div className="text-4xl text-black font-bold p-5">
              <h1>Get in touch, let's talk.</h1>
              <p className="border-t-4 border-[#435334] w-24"></p>
            </div>
            <div className="text-base text-justify text-black font-normal">
              <p className="m-5">
                For any inquiries, collaboration opportunities, or simply to say
                hello, feel free to reach out to us through the following
                contact information.
              </p>
            </div>
            <div className="p-5 text-black font-medium space-y-3">
              <div className="flex text-[#00213F] hover:text-[#FF785B] hover:translate-x-2 duration-200 ease-in-out">
                <i className="pr-5">
                  <LocationOnIcon />
                </i>
                <p>Nueva Ecija, Philippines</p>
              </div>
              <div className="flex text-[#00213F] hover:text-[#FF785B] hover:translate-x-2 duration-200 ease-in-out">
                <i className="pr-5 ">
                  <CallIcon />
                </i>
                <p>{"+63 992-718-0980"}</p>
              </div>
              <div className="flex text-[#00213F] hover:text-[#FF785B] hover:translate-x-2 duration-200 ease-in-out">
                <i className="pr-5 ">
                  <AttachEmailIcon />
                </i>
                <p>
                  <a
                    href="mailto:johnleo.bruno@gmail.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    JanggoDev@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div className="px-5">
            <form action="">
              <div className="space-y-6">
                <div className="flex flex-col">
                  <label htmlFor="name" className="font-bold">
                    Name{" "}
                    <span className="text-[#435334]" title="required">
                      *
                    </span>
                  </label>
                  <input
                    className="border border-[#CEDEBD] p-2 focus:outline-none focus:border-[#435334]"
                    type="text"
                    id="name"
                    placeholder=""
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="email" className="font-bold">
                    Email{" "}
                    <span className="text-[#435334]" title="required">
                      *
                    </span>
                  </label>
                  <input
                    className="border border-[#CEDEBD] p-2 focus:outline-none focus:border-[#435334]"
                    type="email"
                    id="email"
                    placeholder=""
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="subject" className="font-bold">
                    Subject{" "}
                    <span className="text-[#435334]" title="required">
                      *
                    </span>
                  </label>
                  <input
                    className="border border-[#CEDEBD] p-2 focus:outline-none focus:border-[#435334]"
                    type="text"
                    id="subject"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="message" className="font-bold">
                    Message{" "}
                    <span className="text-[#435334]" title="required">
                      *
                    </span>
                  </label>
                  <textarea
                    className=" border border-[#CEDEBD] p-2 focus:outline-none focus:border-[#435334]"
                    name=""
                    id="message"
                    cols="40"
                    rows="4"
                    required
                  ></textarea>
                </div>
              </div>
              <div className="text-center pt-6">
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#FF785B] hover:bg-[#E8FBFF] hover:text-[#00213F] text-white font-semibold rounded-full"
                >
                  Send message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
