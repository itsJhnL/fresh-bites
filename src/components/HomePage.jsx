import React from "react";
import "../index.css";
import Chicken from "../assets/images/chicken1.png";
import { Link } from "react-router-dom";
import Footer from "./Footer";

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
              <Link
                to="/Menu"
                className="p-2 px-5 bg-[#435334] text-white rounded-md"
              >
                Show More
              </Link>
            </div>
          </div>
          <div className="object-scale-down mb-28 h-96 w-96">
            <img src={Chicken} alt=""/>
          </div>
        </div>
      </div>
      <div className="bg-[#f1f1f1]">
        {/* Best Selling Dishes */}
        <div className="flex items-center justify-center">
          <div className="grid grid-cols-3 gap-4">
            <div>Image</div>
            <div>Image</div>
            <div>Image</div>
            <div>Image</div>
            <div>Image</div>
            <div>Image</div>
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
