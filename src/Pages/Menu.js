import React, { useState } from "react";
import Footer from "../components/Footer";
import chicken1 from "../assets/images/menu/chicken1.png";
import chicken2 from "../assets/images/menu/chicken2.png";
import chicken6 from "../assets/images/menu/chicken6.png";
import burger2 from "../assets/images/menu/burger2.png";
import burger1 from "../assets/images/menu/burger1.png";
import pizza from "../assets/images/menu/pizza1.png";
import Pizza2 from "../assets/images/menu/pizza2.png";
import Chicken2 from "../assets/images/menu/chicken3.png";
import Chicken5 from "../assets/images/menu/chicken5.png";
import Pizza3 from "../assets/images/menu/pizza3.png";
import Pasta from "../assets/images/menu/pasta.png";
import Burger2 from "../assets/images/menu/burger2.png";
import Meatballs from "../assets/images/menu/meatballs.png";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

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
      <div className="shadow-md">
        <div className="flex flex-wrap items-center justify-center max-w-6xl mx-auto py-24">
          <div className="grid grid-cols-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-5">
            <div className="border shadow-md ">
              <div className="relative p-10">
                <div className="absolute top-5 right-5 hover:cursor-pointer">
                  <i className="text-gray-500 hover:text-[#FF785B]">
                    <FavoriteBorderIcon />
                  </i>
                </div>
                <div className="flex flex-col items-center jusity-center">
                  <img
                    src={chicken1}
                    alt=""
                    className="object-contain h-56 w-56"
                  />
                  <span className="text-center space-y-2 pt-5">
                    <h1 className="text-lg text-[#00213F] font-bold">
                      {" "}
                      Lemon Herb Roasted Chicken
                    </h1>
                  </span>
                </div>
              </div>
              <div className="bg-[#CEDEBD] flex items-center justify-between text-center p-5">
                <p className="text-2xl text-[#00213F] font-bold">
                  <span className="text-lg">&#36;</span>49.00
                </p>
                <button className="border-[#435334] text-[#FFF] font-bold bg-[#FF785B] hover:bg-[#E8FBFF] hover:text-[#00213F] p-3">
                  <span className="pr-2">
                    <ShoppingCartOutlinedIcon />
                  </span>
                  Add to Cart
                </button>
              </div>
            </div>
            <div className="border shadow-md ">
              <div className="relative p-10">
                <div className="absolute top-5 right-5 hover:cursor-pointer">
                  <i className="text-gray-500 hover:text-[#FF785B]">
                    <FavoriteBorderIcon />
                  </i>
                </div>
                <div className="flex flex-col items-center jusity-center">
                  <img
                    src={chicken2}
                    alt=""
                    className="object-contain h-56 w-56"
                  />
                  <span className="text-center space-y-2 pt-5">
                    <h1 className="text-lg text-[#00213F] font-bold">
                      {" "}
                      Roasted Chicken with Carrots
                    </h1>
                  </span>
                </div>
              </div>
              <div className="bg-[#CEDEBD] flex items-center justify-between text-center p-5">
                <p className="text-2xl text-[#00213F] font-bold">
                  <span className="text-lg">&#36;</span>49.00
                </p>
                <button className="border-[#435334] text-[#FFF] font-bold bg-[#FF785B] hover:bg-[#E8FBFF] hover:text-[#00213F] p-3">
                  <span className="pr-2">
                    <ShoppingCartOutlinedIcon />
                  </span>
                  Add to Cart
                </button>
              </div>
            </div>
            <div className="border shadow-md ">
              <div className="relative p-10">
                <div className="absolute top-5 right-5 hover:cursor-pointer">
                  <i className="text-gray-500 hover:text-[#FF785B]">
                    <FavoriteBorderIcon />
                  </i>
                </div>
                <div className="flex flex-col items-center jusity-center">
                  <img
                    src={Pizza2}
                    alt=""
                    className="object-contain h-56 w-56"
                  />
                  <span className="text-center space-y-2 pt-5">
                    <h1 className="text-lg text-[#00213F] font-bold">
                      {" "}
                      Margherita Pizza
                    </h1>
                  </span>
                </div>
              </div>
              <div className="bg-[#CEDEBD] flex items-center justify-between text-center p-5">
                <p className="text-2xl text-[#00213F] font-bold">
                  <span className="text-lg">&#36;</span>49.00
                </p>
                <button className="border-[#435334] text-[#FFF] font-bold bg-[#FF785B] hover:bg-[#E8FBFF] hover:text-[#00213F] p-3">
                  <span className="pr-2">
                    <ShoppingCartOutlinedIcon />
                  </span>
                  Add to Cart
                </button>
              </div>
            </div>
            <div className="border shadow-md ">
              <div className="relative p-10">
                <div className="absolute top-5 right-5 hover:cursor-pointer">
                  <i className="text-gray-500 hover:text-[#FF785B]">
                    <FavoriteBorderIcon />
                  </i>
                </div>
                <div className="flex flex-col items-center jusity-center">
                  <img
                    src={pizza}
                    alt=""
                    className="object-contain h-56 w-56"
                  />
                  <span className="text-center space-y-2 pt-5">
                    <h1 className="text-lg text-[#00213F] font-bold">
                      {" "}
                      Pizza Bites
                    </h1>
                  </span>
                </div>
              </div>
              <div className="bg-[#CEDEBD] flex items-center justify-between text-center p-5">
                <p className="text-2xl text-[#00213F] font-bold">
                  <span className="text-lg">&#36;</span>49.00
                </p>
                <button className="border-[#435334] text-[#FFF] font-bold bg-[#FF785B] hover:bg-[#E8FBFF] hover:text-[#00213F] p-3">
                  <span className="pr-2">
                    <ShoppingCartOutlinedIcon />
                  </span>
                  Add to Cart
                </button>
              </div>
            </div>
            <div className="border shadow-md ">
              <div className="relative p-10">
                <div className="absolute top-5 right-5 hover:cursor-pointer">
                  <i className="text-gray-500 hover:text-[#FF785B]">
                    <FavoriteBorderIcon />
                  </i>
                </div>
                <div className="flex flex-col items-center jusity-center">
                  <img
                    src={chicken6}
                    alt=""
                    className="object-contain h-56 w-56"
                  />
                  <span className="text-center space-y-2 pt-5">
                    <h1 className="text-lg text-[#00213F] font-bold">
                      {" "}
                      Roasted Chicken with Potatoes
                    </h1>
                  </span>
                </div>
              </div>
              <div className="bg-[#CEDEBD] flex items-center justify-between text-center p-5">
                <p className="text-2xl text-[#00213F] font-bold">
                  <span className="text-lg">&#36;</span>49.00
                </p>
                <button className="border-[#435334] text-[#FFF] font-bold bg-[#FF785B] hover:bg-[#E8FBFF] hover:text-[#00213F] p-3">
                  <span className="pr-2">
                    <ShoppingCartOutlinedIcon />
                  </span>
                  Add to Cart
                </button>
              </div>
            </div>
            <div className="border shadow-md ">
              <div className="relative p-10">
                <div className="absolute top-5 right-5 hover:cursor-pointer">
                  <i className="text-gray-500 hover:text-[#FF785B]">
                    <FavoriteBorderIcon />
                  </i>
                </div>
                <div className="flex flex-col items-center jusity-center">
                  <img
                    src={burger2}
                    alt=""
                    className="object-contain h-56 w-56"
                  />
                  <span className="text-center space-y-2 pt-5">
                    <h1 className="text-lg text-[#00213F] font-bold">
                      {" "}
                      Burger Bite King
                    </h1>
                  </span>
                </div>
              </div>
              <div className="bg-[#CEDEBD] flex items-center justify-between text-center p-5">
                <p className="text-2xl text-[#00213F] font-bold">
                  <span className="text-lg">&#36;</span>49.00
                </p>
                <button className="border-[#435334] text-[#FFF] font-bold bg-[#FF785B] hover:bg-[#E8FBFF] hover:text-[#00213F] p-3">
                  <span className="pr-2">
                    <ShoppingCartOutlinedIcon />
                  </span>
                  Add to Cart
                </button>
              </div>
            </div>
            <div className="border shadow-md ">
              <div className="relative p-10">
                <div className="absolute top-5 right-5 hover:cursor-pointer">
                  <i className="text-gray-500 hover:text-[#FF785B]">
                    <FavoriteBorderIcon />
                  </i>
                </div>
                <div className="flex flex-col items-center jusity-center">
                  <img
                    src={burger1}
                    alt=""
                    className="object-contain h-56 w-56"
                  />
                  <span className="text-center space-y-2 pt-5">
                    <h1 className="text-lg text-[#00213F] font-bold">
                      {" "}
                      Burger Overload
                    </h1>
                  </span>
                </div>
              </div>
              <div className="bg-[#CEDEBD] flex items-center justify-between text-center p-5">
                <p className="text-2xl text-[#00213F] font-bold">
                  <span className="text-lg">&#36;</span>49.00
                </p>
                <button className="border-[#435334] text-[#FFF] font-bold bg-[#FF785B] hover:bg-[#E8FBFF] hover:text-[#00213F] p-3">
                  <span className="pr-2">
                    <ShoppingCartOutlinedIcon />
                  </span>
                  Add to Cart
                </button>
              </div>
            </div>
            <div className="border shadow-md ">
              <div className="relative p-10">
                <div className="absolute top-5 right-5 hover:cursor-pointer">
                  <i className="text-gray-500 hover:text-[#FF785B]">
                    <FavoriteBorderIcon />
                  </i>
                </div>
                <div className="flex flex-col items-center jusity-center">
                  <img
                    src={Chicken2}
                    alt=""
                    className="object-contain h-56 w-56"
                  />
                  <span className="text-center space-y-2 pt-5">
                    <h1 className="text-lg text-[#00213F] font-bold">
                      {" "}
                      Chicken NOKNOK
                    </h1>
                  </span>
                </div>
              </div>
              <div className="bg-[#CEDEBD] flex items-center justify-between text-center p-5">
                <p className="text-2xl text-[#00213F] font-bold">
                  <span className="text-lg">&#36;</span>49.00
                </p>
                <button className="border-[#435334] text-[#FFF] font-bold bg-[#FF785B] hover:bg-[#E8FBFF] hover:text-[#00213F] p-3">
                  <span className="pr-2">
                    <ShoppingCartOutlinedIcon />
                  </span>
                  Add to Cart
                </button>
              </div>
            </div>
            <div className="border shadow-md ">
              <div className="relative p-10">
                <div className="absolute top-5 right-5 hover:cursor-pointer">
                  <i className="text-gray-500 hover:text-[#FF785B]">
                    <FavoriteBorderIcon />
                  </i>
                </div>
                <div className="flex flex-col items-center jusity-center">
                  <img
                    src={Chicken5}
                    alt=""
                    className="object-contain h-56 w-56"
                  />
                  <span className="text-center space-y-2 pt-5">
                    <h1 className="text-lg text-[#00213F] font-bold">
                      {" "}
                      Roasted Chicken with Legs
                    </h1>
                  </span>
                </div>
              </div>
              <div className="bg-[#CEDEBD] flex items-center justify-between text-center p-5">
                <p className="text-2xl text-[#00213F] font-bold">
                  <span className="text-lg">&#36;</span>49.00
                </p>
                <button className="border-[#435334] text-[#FFF] font-bold bg-[#FF785B] hover:bg-[#E8FBFF] hover:text-[#00213F] p-3">
                  <span className="pr-2">
                    <ShoppingCartOutlinedIcon />
                  </span>
                  Add to Cart
                </button>
              </div>
            </div>
            <div className="border shadow-md ">
              <div className="relative p-10">
                <div className="absolute top-5 right-5 hover:cursor-pointer">
                  <i className="text-gray-500 hover:text-[#FF785B]">
                    <FavoriteBorderIcon />
                  </i>
                </div>
                <div className="flex flex-col items-center jusity-center">
                  <img
                    src={Pizza3}
                    alt=""
                    className="object-contain h-56 w-56"
                  />
                  <span className="text-center space-y-2 pt-5">
                    <h1 className="text-lg text-[#00213F] font-bold">
                      {" "}
                      Chocolate and Strawberry Pizza
                    </h1>
                  </span>
                </div>
              </div>
              <div className="bg-[#CEDEBD] flex items-center justify-between text-center p-5">
                <p className="text-2xl text-[#00213F] font-bold">
                  <span className="text-lg">&#36;</span>49.00
                </p>
                <button className="border-[#435334] text-[#FFF] font-bold bg-[#FF785B] hover:bg-[#E8FBFF] hover:text-[#00213F] p-3">
                  <span className="pr-2">
                    <ShoppingCartOutlinedIcon />
                  </span>
                  Add to Cart
                </button>
              </div>
            </div>
            <div className="border shadow-md ">
              <div className="relative p-10">
                <div className="absolute top-5 right-5 hover:cursor-pointer">
                  <i className="text-gray-500 hover:text-[#FF785B]">
                    <FavoriteBorderIcon />
                  </i>
                </div>
                <div className="flex flex-col items-center jusity-center">
                  <img
                    src={Pasta}
                    alt=""
                    className="object-contain h-56 w-56"
                  />
                  <span className="text-center space-y-2 pt-5">
                    <h1 className="text-lg text-[#00213F] font-bold">
                      {" "}
                      Spaghetti Bolognese
                    </h1>
                  </span>
                </div>
              </div>
              <div className="bg-[#CEDEBD] flex items-center justify-between text-center p-5">
                <p className="text-2xl text-[#00213F] font-bold">
                  <span className="text-lg">&#36;</span>49.00
                </p>
                <button className="border-[#435334] text-[#FFF] font-bold bg-[#FF785B] hover:bg-[#E8FBFF] hover:text-[#00213F] p-3">
                  <span className="pr-2">
                    <ShoppingCartOutlinedIcon />
                  </span>
                  Add to Cart
                </button>
              </div>
            </div>
            <div className="border shadow-md ">
              <div className="relative p-10">
                <div className="absolute top-5 right-5 hover:cursor-pointer">
                  <i className="text-gray-500 hover:text-[#FF785B]">
                    <FavoriteBorderIcon />
                  </i>
                </div>
                <div className="flex flex-col items-center jusity-center">
                  <img
                    src={Meatballs}
                    alt=""
                    className="object-cover object-contain h-56 w-56"
                  />
                  <span className="text-center space-y-2 pt-5">
                    <h1 className="text-lg text-[#00213F] font-bold">
                      {" "}
                      Meatballs Pasta
                    </h1>
                  </span>
                </div>
              </div>
              <div className="bg-[#CEDEBD] flex items-center justify-between text-center p-5">
                <p className="text-2xl text-[#00213F] font-bold">
                  <span className="text-lg">&#36;</span>49.00
                </p>
                <button className="border-[#435334] text-[#FFF] font-bold bg-[#FF785B] hover:bg-[#E8FBFF] hover:text-[#00213F] p-3">
                  <span className="pr-2">
                    <ShoppingCartOutlinedIcon />
                  </span>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="flex items-center justify-center pb-10">
          <button
            onClick={scrollUp}
            className="border p-3 bg-[#FF785B] text-white hover:bg-[#E8FBFF] hover:text-[#00213F]  rounded-full"
          >
            {clicked ? "Back to Top" : "Back to Top"}
          </button>
        </div> */}
      </div>
      <Footer />
    </>
  );
}
