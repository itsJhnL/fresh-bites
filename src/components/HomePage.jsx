import React from "react";
import "../index.css";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import Chicken from "../assets/images/chicken1.png";
import Pizza from "../assets/images/pizza1.png";
import Chicken1 from "../assets/images/chicken2.png";
import Chicken2 from "../assets/images/chicken3.png";
import Chicken5 from "../assets/images/chicken5.png";
import Pizza2 from "../assets/images/pizza2.png";
import Pasta from "../assets/images/pasta.png";
import Pizza3 from "../assets/images/pizza3.png";

function HomePage() {
  return (
    <div>
      <div className="bg-[#FAF1E4] h-screen">
        <div className="flex items-center justify-between max-w-6xl mx-auto h-full w-full">
          <div className="mb-28">
            <div>
              <span className="Pacifico text-[#435334] font-normal text-5xl">
                Welcome to
              </span>
              <h1 className="Pacifico font-normal text-8xl">Fresh Bites</h1>
              <p className="pt-5">
                Indulge in the extraordinary with our Unforgettable Chicken Bite
              </p>
              <p className="text-justify max-w-lg pt-4">
                Immerse your taste buds in a symphony of flavors that lingers
                long after your last bite. Crafted to perfection, each tender
                piece of succulent chicken is infused with a harmonious blend of
                exquisite spices and seasonings. A remarkable burst of taste
                that's simply unforgettable.
              </p>
            </div>
            <div className="pt-7">
              <Link to="/Menu" className="p-2 px-5 bg-[#435334] text-white">
                Show More
              </Link>
            </div>
          </div>
          <div className="object-scale-down mb-28 h-96 w-96">
            <img src={Chicken} alt="" />
          </div>
        </div>
      </div>
      <div className="bg-[#CEDEBD] py-24">
        {/* Best Selling Dishes */}
        <div className="text-center pb-5">
          <h1 className="text-lg">SPECIALTIES</h1>
          <p className="text-xl font-bold">Our Best Selling</p>
        </div>
        <div className="flex items-center justify-center max-w-6xl mx-auto">
          <div className="grid grid-cols-4 gap-4">
            <div className="flex flex-col items-center justify-center bg-[#FAF1E4] p-10 space-y-5">
              <img src={Chicken1} alt="" className="h-[200px] w-[200px]" />
              <span className="text-center">
                <p className="text-[#435334] text-base font-bold">
                  &#8369; 160
                </p>
                <h1 className="text-lg font-bold"> Chicken NOKNOK</h1>
              </span>
              <button className="border border-[#435334] text-[#435334] hover:bg-[#CEDEBD] hover:text-[#000] p-2">
                ORDER NOW
              </button>
            </div>
            <div className="flex flex-col items-center justify-center bg-[#FAF1E4] p-10 space-y-5">
              <img src={Pizza3} alt="" className="h-[200px] w-[200px]" />
              <span className="text-center">
                <p className="text-[#435334] text-base font-bold">
                  &#8369; 160
                </p>
                <h1 className="text-lg font-bold"> Chicken NOKNOK</h1>
              </span>
              <button className="border border-[#435334] text-[#435334] hover:bg-[#CEDEBD] hover:text-[#000] p-2">
                ORDER NOW
              </button>
            </div>
            <div className="flex flex-col items-center justify-center bg-[#FAF1E4] p-10 space-y-5">
              <img src={Chicken5} alt="" className="h-[200px] w-[200px]" />
              <span className="text-center">
                <p className="text-[#435334] text-base font-bold">
                  &#8369; 160
                </p>
                <h1 className="text-lg font-bold"> Chicken NOKNOK</h1>
              </span>
              <button className="border border-[#435334] text-[#435334] hover:bg-[#CEDEBD] hover:text-[#000] p-2">
                ORDER NOW
              </button>
            </div>
            <div className="flex flex-col items-center justify-center bg-[#FAF1E4] p-10 space-y-5">
              <img src={Chicken2} alt="" className="h-[200px] w-[200px]" />
              <span className="text-center">
                <p className="text-[#435334] text-base font-bold">
                  &#8369; 160
                </p>
                <h1 className="text-lg font-bold"> Chicken NOKNOK</h1>
              </span>
              <button className="border border-[#435334] text-[#435334] hover:bg-[#CEDEBD] hover:text-[#000] p-2">
                ORDER NOW
              </button>
            </div>
            <div className="flex flex-col items-center justify-center bg-[#FAF1E4] p-10 space-y-5">
              <img src={Pizza2} alt="" className="h-[200px] w-[200px]" />
              <span className="text-center">
                <p className="text-[#435334] text-base font-bold">
                  &#8369; 160
                </p>
                <h1 className="text-lg font-bold"> Chicken NOKNOK</h1>
              </span>
              <button className="border border-[#435334] text-[#435334] hover:bg-[#CEDEBD] hover:text-[#000] p-2">
                ORDER NOW
              </button>
            </div>
            <div className="flex flex-col items-center justify-center bg-[#FAF1E4] p-10 space-y-5">
              <img src={Pasta} alt="" className="h-[200px] w-[200px]" />
              <span className="text-center">
                <p className="text-[#435334] text-base font-bold">
                  &#8369; 160
                </p>
                <h1 className="text-lg font-bold"> Chicken NOKNOK</h1>
              </span>
              <button className="border border-[#435334] text-[#435334] hover:bg-[#CEDEBD] hover:text-[#000] p-2">
                ORDER NOW
              </button>
            </div>
            <div className="flex flex-col items-center justify-center bg-[#FAF1E4] p-10 space-y-5">
              <img src={Pasta} alt="" className="h-[200px] w-[200px]" />
              <span className="text-center">
                <p className="text-[#435334] text-base font-bold">
                  &#8369; 160
                </p>
                <h1 className="text-lg font-bold"> Chicken NOKNOK</h1>
              </span>
              <button className="border border-[#435334] text-[#435334] hover:bg-[#CEDEBD] hover:text-[#000] p-2">
                ORDER NOW
              </button>
            </div>
            <div className="flex flex-col items-center justify-center bg-[#FAF1E4] p-10 space-y-5">
              <img src={Pasta} alt="" className="h-[200px] w-[200px]" />
              <span className="text-center">
                <p className="text-[#435334] text-base font-bold">
                  &#8369; 160
                </p>
                <h1 className="text-lg font-bold"> Chicken NOKNOK</h1>
              </span>
              <button className="border border-[#435334] text-[#435334] hover:bg-[#CEDEBD] hover:text-[#000] p-2">
                ORDER NOW
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#f1f1f1]">
        {/* What we serve */}
        <div className="text-center">
          <h1>WHAT WE SERVE</h1>
          <p>Your Favorite Food Delivery Partner</p>
        </div>
        <div className="flext items-center justify-center">
          <div className="flex">
            <div>
              <img src={Chicken} alt="" />
            </div>
            <div>
              <img src={Chicken} alt="" />
            </div>
            <div>
              <img src={Chicken} alt="" />
            </div>
          </div>
        </div>
      </div>
      <div>
        {/* About Us */}
        <div className="flex items-center justify-center">
          <div className="">
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
      <div className="bg-[#f1f1f1]">{/* Reviews */}</div>
      <Footer />
    </div>
  );
}

export default HomePage;
