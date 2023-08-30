import React from "react";
import Footer from "../components/Footer";
import image from "../assets/images/background.png";

export default function Contact() {
  const background = {
    backgroundImage: `url(${image})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    // height: "100vh",
    // width: "100%",
    backgroundColor: "#CEDEBD",
  };
  return (
    <div className="h-screen" style={background}>
      <div className="flex flex-col items-center justify-between h-full w-full">
        <div className="grid grid-cols-2 max-w-6xl mx-auto py-24">
          <div className="">
            <div className="text-4xl text-black font-bold p-5">
              <h1>Get in touch, let's talk.</h1>
              <p className="border-t-4 border-[#435334] w-24"></p>
            </div>
            <div className="text-base text-justify text-black font-normal">
              <p className="w-80 m-5">
                For any inquiries, collaboration opportunities, or simply to say
                hello, feel free to reach out to us through the following
                contact information.
              </p>
            </div>
            <div className="p-5 text-black font-medium space-y-3">
              <div className="flex">
                <i className="pr-5 text-[#435334]">
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
                <p>Nueva Ecija, Philippines</p>
              </div>
              <div className="flex">
                <i className="pr-5 text-[#435334]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      fill-rule="evenodd"
                      d="M19.47 4.03c.14.141.22.332.22.53v3.83a.75.75 0 1 1-1.5 0V6.37l-3.16 3.16a.75.75 0 1 1-1.06-1.061l3.159-3.16H15.11a.75.75 0 0 1 0-1.5h3.828a.75.75 0 0 1 .53.22Z"
                      clip-rule="evenodd"
                    />
                    <path
                      fill="currentColor"
                      d="M5 9.86a18.466 18.466 0 0 0 9.566 9.292l.68.303a3.5 3.5 0 0 0 4.33-1.247l.889-1.324a1 1 0 0 0-.203-1.335l-3.012-2.43a1 1 0 0 0-1.431.183l-.932 1.257a12.14 12.14 0 0 1-5.51-5.511l1.256-.932a1 1 0 0 0 .183-1.431l-2.43-3.012a1 1 0 0 0-1.335-.203l-1.333.894a3.5 3.5 0 0 0-1.237 4.355L5 9.86Z"
                    />
                  </svg>
                </i>
                <p>{"(123) 123-1234"}</p>
              </div>
              <div className="flex">
                <i className="pr-5 text-[#435334]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill="currentColor"
                      fill-rule="evenodd"
                      d="m7.172 11.334l2.83 1.935l2.728-1.882l6.115 6.033c-.161.052-.333.08-.512.08H1.667c-.22 0-.43-.043-.623-.12l6.128-6.046ZM20 6.376v9.457c0 .247-.054.481-.15.692l-5.994-5.914L20 6.376ZM0 6.429l6.042 4.132l-5.936 5.858A1.663 1.663 0 0 1 0 15.833V6.43ZM18.333 2.5c.92 0 1.667.746 1.667 1.667v.586L9.998 11.648L0 4.81v-.643C0 3.247.746 2.5 1.667 2.5h16.666Z"
                    />
                  </svg>
                </i>
                <p>
                  <a
                    href="mailto:johnleo.bruno@gmail.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    freshbites@me.com
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div className="flex border bg-[#FAF1E4] p-5">
            <form action="">
              <div className="space-y-5">
                <div className="flex flex-col">
                  <label htmlFor="name" className="font-bold">
                    Name <span className="text-[#435334]">*</span>
                  </label>
                  <input
                    className="border border-[#CEDEBD] p-2 focus:outline-none focus:border-[#435334] bg-[#FAF1E4]"
                    type="text"
                    id="name"
                    placeholder=""
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="email" className="font-bold">
                    Email <span className="text-[#435334]">*</span>
                  </label>
                  <input
                    className="border border-[#CEDEBD] p-2 focus:outline-none focus:border-[#435334] bg-[#FAF1E4]"
                    type="email"
                    id="email"
                    placeholder=""
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="subject" className="font-bold">
                    Subject <span className="text-[#435334]">*</span>
                  </label>
                  <input
                    className="border border-[#CEDEBD] p-2 focus:outline-none focus:border-[#435334] bg-[#FAF1E4]"
                    type="text"
                    id="subject"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="message" className="font-bold">
                    Message <span className="text-[#435334]">*</span>
                  </label>
                  <textarea
                    className=" border border-[#CEDEBD] p-2 focus:outline-none focus:border-[#435334] bg-[#FAF1E4]"
                    name=""
                    id="message"
                    cols="50"
                    rows="6"
                    required
                  ></textarea>
                </div>
              </div>
              <div className="text-center pt-6">
                <button
                  type="submit"
                  className="border border-[#CEDEBD]  px-5 py-2 bg-[#435334] text-white"
                >
                  Send message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>{" "}
      <Footer />
    </div>
  );
}
