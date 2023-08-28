import React from "react";
import "../index.css";
import Chicken from "../assets/images/chicken1.png";
import { Link } from "react-router-dom";
import Footer from "./Footer";

function HomePage() {
  return (
    <div>
      <div className="bg-[#DDE6D5]">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="">
            <div className="">
              <span className="Pacifico text-[#667B68] font-normal text-5xl">
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
                className="p-2 px-5 bg-[#667B68] text-white font-semibold rounded-full"
              >
                Show More
              </Link>
            </div>
          </div>
          <div className="object-scale-down h-96 w-96 my-28">
            <img src={Chicken} alt="" />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;
