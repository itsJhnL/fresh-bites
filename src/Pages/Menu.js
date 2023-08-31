import React from "react";
import Footer from "../components/Footer";
import chicken1 from "../assets/images/chicken1.png";
import chicken2 from "../assets/images/chicken2.png";
import chicken6 from "../assets/images/chicken6.png";
import burger2 from "../assets/images/burger2.png";
import burger1 from "../assets/images/burger1.png";
import pizza from "../assets/images/pizza1.png";

export default function Menu() {
  return (
    <div>
      <div className="bg-[#FFF]">
        <div className="flex items-center justify-center max-w-6xl mx-auto py-24">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#FAF1E4] flex flex-col items-center justify-center p-10 space-y-4">
              <img src={chicken1} alt="" className="h-[200px] w-[200px]" />
              <span className="text-center text-lg font-bold">
                Lemon Herb Roasted Chicken
              </span>
              <p className="text-justify text-gray-700">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. In
                laudantium obcaecati quibusdam hic harum pariatur porro
                excepturi? Eos, expedita harum.
              </p>
              <h1 className="text-lg font-bold text-[#435334]">&#8369; 399</h1>
              <div>
                <button className="border border-[#435334] bg-[#435334] text-white p-2 px-4 ">
                  ORDER NOW
                </button>
              </div>
            </div>
            <div className="bg-[#FAF1E4] flex flex-col items-center justify-center p-10 space-y-4">
              <img src={chicken2} alt="" className="h-[200px] w-[200px]" />
              <span className="text-center text-lg font-bold">
                Roasted Chicken with Carrots
              </span>
              <p className="text-justify text-gray-700">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. In
                laudantium obcaecati quibusdam hic harum pariatur porro
                excepturi? Eos, expedita harum.
              </p>
              <h1 className="text-lg font-bold text-[#435334]">&#8369; 399</h1>
              <div>
                <button className="border border-[#435334] bg-[#435334] text-white p-2 px-4 ">
                  ORDER NOW
                </button>
              </div>
            </div>
            <div className="bg-[#FAF1E4] flex flex-col items-center justify-center p-10 space-y-4">
              <img src={chicken6} alt="" className="h-[200px] w-[200px]" />
              <span className="text-center text-lg font-bold">
                Roasted Chicken with Potatoes
              </span>
              <p className="text-justify text-gray-700">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. In
                laudantium obcaecati quibusdam hic harum pariatur porro
                excepturi? Eos, expedita harum.
              </p>
              <h1 className="text-lg font-bold text-[#435334]">&#8369; 399</h1>
              <div>
                <button className="border border-[#435334] bg-[#435334] text-white p-2 px-4 ">
                  ORDER NOW
                </button>
              </div>
            </div>
            <div className="bg-[#FAF1E4] flex flex-col items-center justify-center p-10 space-y-4">
              <img src={burger1} alt="" className="h-[200px] w-[200px]" />
              <span className="text-center text-lg font-bold">
                Burger Overload
              </span>
              <p className="text-justify text-gray-700">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. In
                laudantium obcaecati quibusdam hic harum pariatur porro
                excepturi? Eos, expedita harum.
              </p>
              <h1 className="text-lg font-bold text-[#435334]">&#8369; 149</h1>
              <div>
                <button className="border border-[#435334] bg-[#435334] text-white p-2 px-4 ">
                  ORDER NOW
                </button>
              </div>
            </div>
            <div className="bg-[#FAF1E4] flex flex-col items-center justify-center p-10 space-y-4">
              <img src={burger2} alt="" className="h-[200px] w-[200px]" />
              <span className="text-center text-lg font-bold">
                Burger Bite King
              </span>
              <p className="text-justify text-gray-700">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. In
                laudantium obcaecati quibusdam hic harum pariatur porro
                excepturi? Eos, expedita harum.
              </p>
              <h1 className="text-lg font-bold text-[#435334]">&#8369; 289</h1>
              <div>
                <button className="border border-[#435334] bg-[#435334] text-white p-2 px-4 ">
                  ORDER NOW
                </button>
              </div>
            </div>
            <div className="bg-[#FAF1E4] flex flex-col items-center justify-center p-10 space-y-4">
              <img src={pizza} alt="" className="h-[200px] w-[200px]" />
              <span className="text-center text-lg font-bold">Pizza Bites</span>
              <p className="text-justify text-gray-700">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. In
                laudantium obcaecati quibusdam hic harum pariatur porro
                excepturi? Eos, expedita harum.
              </p>
              <h1 className="text-lg font-bold text-[#435334]">&#8369; 499</h1>
              <div>
                <button className="border border-[#435334] bg-[#435334] text-white p-2 px-4 ">
                  ORDER NOW
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
