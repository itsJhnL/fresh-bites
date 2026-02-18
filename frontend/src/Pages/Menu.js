import React, { useState } from "react";
import Footer from "../components/Footer.jsx";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { dishes } from "../data/data.js";

export default function Menu() {
   const [clicked, setClicked] = useState();

  const scrollUp = () => {
    window.scrollTo({
      top: "0",
      behavior: "smooth",
    });
    setClicked(true);
  };

  return (
    <>
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="grid gap-4 h-full sm:grid-cols-1 max-sm:w-full sm:m-5 md:grid-cols-3 lg:grid-cols-4">
          {dishes.map((data) => {
            return (
              <div className="relative shadow-xl p-7" key={data.id}>
                <div className="flex justify-end hover:cursor-pointer">
                  <i className="text-gray-500 hover:text-[#FF785B]">
                    <FavoriteBorderIcon />
                  </i>
                </div>
                <div className="relative flex flex-col items-center jusity-center">
                  <img
                    src={data.imageURL}
                    alt="Chicken"
                    className="object-contain h-48 w-48"
                  />
                  <span className="text-center space-y-2 pt-5">
                    <h1 className="text-lg text-[#00213F] font-bold">
                      {data.title}
                    </h1>
                  </span>
                </div>
                <div className="flex items-center justify-between pt-5">
                  <p className="text-base text-[#00213F] font-bold">
                    {data.price}
                  </p>
                  <button className="flex items-center justify-between rounded-xl border p-1 border-[#CEDEBD] hover:border-[#FF785B] ">
                    <div className="px-2">Add to Cart </div>
                    <div>
                      <div className="rounded-lg border p-1 bg-[#CEDEBD] text-[#435334] ">
                        <ShoppingCartOutlinedIcon />
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </>
  );
}
