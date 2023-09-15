import React from "react";
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

export default function Menu() {
  return (
    <>
      <div className="shadow-md">
        <div className="flex flex-wrap items-center justify-center max-w-6xl mx-auto py-24">
          <div className="grid grid-cols-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-5">
            <div className="border shadow-md ">
              <div className="relative p-10">
                <div className="absolute top-5 right-5 hover:cursor-pointer">
                  <i>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="gray"
                        d="m12.1 18.55l-.1.1l-.11-.1C7.14 14.24 4 11.39 4 8.5C4 6.5 5.5 5 7.5 5c1.54 0 3.04 1 3.57 2.36h1.86C13.46 6 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5c0 2.89-3.14 5.74-7.9 10.05M16.5 3c-1.74 0-3.41.81-4.5 2.08C10.91 3.81 9.24 3 7.5 3C4.42 3 2 5.41 2 8.5c0 3.77 3.4 6.86 8.55 11.53L12 21.35l1.45-1.32C18.6 15.36 22 12.27 22 8.5C22 5.41 19.58 3 16.5 3Z"
                      />
                    </svg>
                  </i>
                </div>
                <div className="flex flex-col items-center jusity-center">
                  <img src={chicken1} alt="" className="h-[200px] w-[200px]" />
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
                <button className="border-[#435334] text-[#FFF] font-bold bg-[#FF785B] hover:bg-[#E8FBFF] hover:text-[#00213F] rounded-full p-3">
                  Add to Cart
                </button>
              </div>
            </div>
            <div className="border shadow-md ">
              <div className="relative p-10">
                <div className="absolute top-5 right-5 hover:cursor-pointer">
                  <i>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="gray"
                        d="m12.1 18.55l-.1.1l-.11-.1C7.14 14.24 4 11.39 4 8.5C4 6.5 5.5 5 7.5 5c1.54 0 3.04 1 3.57 2.36h1.86C13.46 6 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5c0 2.89-3.14 5.74-7.9 10.05M16.5 3c-1.74 0-3.41.81-4.5 2.08C10.91 3.81 9.24 3 7.5 3C4.42 3 2 5.41 2 8.5c0 3.77 3.4 6.86 8.55 11.53L12 21.35l1.45-1.32C18.6 15.36 22 12.27 22 8.5C22 5.41 19.58 3 16.5 3Z"
                      />
                    </svg>
                  </i>
                </div>
                <div className="flex flex-col items-center jusity-center">
                  <img src={chicken2} alt="" className="h-[200px] w-[200px]" />
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
                <button className="border-[#435334] text-[#FFF] font-bold bg-[#FF785B] hover:bg-[#E8FBFF] hover:text-[#00213F] rounded-full p-3">
                  Add to Cart
                </button>
              </div>
            </div>
            <div className="border shadow-md ">
              <div className="relative p-10">
                <div className="absolute top-5 right-5 hover:cursor-pointer">
                  <i>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="gray"
                        d="m12.1 18.55l-.1.1l-.11-.1C7.14 14.24 4 11.39 4 8.5C4 6.5 5.5 5 7.5 5c1.54 0 3.04 1 3.57 2.36h1.86C13.46 6 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5c0 2.89-3.14 5.74-7.9 10.05M16.5 3c-1.74 0-3.41.81-4.5 2.08C10.91 3.81 9.24 3 7.5 3C4.42 3 2 5.41 2 8.5c0 3.77 3.4 6.86 8.55 11.53L12 21.35l1.45-1.32C18.6 15.36 22 12.27 22 8.5C22 5.41 19.58 3 16.5 3Z"
                      />
                    </svg>
                  </i>
                </div>
                <div className="flex flex-col items-center jusity-center">
                  <img src={Pizza2} alt="" className="h-[200px] w-[200px]" />
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
                <button className="border-[#435334] text-[#FFF] font-bold bg-[#FF785B] hover:bg-[#E8FBFF] hover:text-[#00213F] rounded-full p-3">
                  Add to Cart
                </button>
              </div>
            </div>
            <div className="border shadow-md ">
              <div className="relative p-10">
                <div className="absolute top-5 right-5 hover:cursor-pointer">
                  <i>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="gray"
                        d="m12.1 18.55l-.1.1l-.11-.1C7.14 14.24 4 11.39 4 8.5C4 6.5 5.5 5 7.5 5c1.54 0 3.04 1 3.57 2.36h1.86C13.46 6 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5c0 2.89-3.14 5.74-7.9 10.05M16.5 3c-1.74 0-3.41.81-4.5 2.08C10.91 3.81 9.24 3 7.5 3C4.42 3 2 5.41 2 8.5c0 3.77 3.4 6.86 8.55 11.53L12 21.35l1.45-1.32C18.6 15.36 22 12.27 22 8.5C22 5.41 19.58 3 16.5 3Z"
                      />
                    </svg>
                  </i>
                </div>
                <div className="flex flex-col items-center jusity-center">
                  <img src={pizza} alt="" className="h-[200px] w-[200px]" />
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
                <button className="border-[#435334] text-[#FFF] font-bold bg-[#FF785B] hover:bg-[#E8FBFF] hover:text-[#00213F] rounded-full p-3">
                  Add to Cart
                </button>
              </div>
            </div>
            <div className="border shadow-md ">
              <div className="relative p-10">
                <div className="absolute top-5 right-5 hover:cursor-pointer">
                  <i>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="gray"
                        d="m12.1 18.55l-.1.1l-.11-.1C7.14 14.24 4 11.39 4 8.5C4 6.5 5.5 5 7.5 5c1.54 0 3.04 1 3.57 2.36h1.86C13.46 6 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5c0 2.89-3.14 5.74-7.9 10.05M16.5 3c-1.74 0-3.41.81-4.5 2.08C10.91 3.81 9.24 3 7.5 3C4.42 3 2 5.41 2 8.5c0 3.77 3.4 6.86 8.55 11.53L12 21.35l1.45-1.32C18.6 15.36 22 12.27 22 8.5C22 5.41 19.58 3 16.5 3Z"
                      />
                    </svg>
                  </i>
                </div>
                <div className="flex flex-col items-center jusity-center">
                  <img src={chicken6} alt="" className="h-[200px] w-[200px]" />
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
                <button className="border-[#435334] text-[#FFF] font-bold bg-[#FF785B] hover:bg-[#E8FBFF] hover:text-[#00213F] rounded-full p-3">
                  Add to Cart
                </button>
              </div>
            </div>
            <div className="border shadow-md ">
              <div className="relative p-10">
                <div className="absolute top-5 right-5 hover:cursor-pointer">
                  <i>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="gray"
                        d="m12.1 18.55l-.1.1l-.11-.1C7.14 14.24 4 11.39 4 8.5C4 6.5 5.5 5 7.5 5c1.54 0 3.04 1 3.57 2.36h1.86C13.46 6 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5c0 2.89-3.14 5.74-7.9 10.05M16.5 3c-1.74 0-3.41.81-4.5 2.08C10.91 3.81 9.24 3 7.5 3C4.42 3 2 5.41 2 8.5c0 3.77 3.4 6.86 8.55 11.53L12 21.35l1.45-1.32C18.6 15.36 22 12.27 22 8.5C22 5.41 19.58 3 16.5 3Z"
                      />
                    </svg>
                  </i>
                </div>
                <div className="flex flex-col items-center jusity-center">
                  <img src={burger2} alt="" className="h-[200px] w-[200px]" />
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
                <button className="border-[#435334] text-[#FFF] font-bold bg-[#FF785B] hover:bg-[#E8FBFF] hover:text-[#00213F] rounded-full p-3">
                  Add to Cart
                </button>
              </div>
            </div>
            <div className="border shadow-md ">
              <div className="relative p-10">
                <div className="absolute top-5 right-5 hover:cursor-pointer">
                  <i>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="gray"
                        d="m12.1 18.55l-.1.1l-.11-.1C7.14 14.24 4 11.39 4 8.5C4 6.5 5.5 5 7.5 5c1.54 0 3.04 1 3.57 2.36h1.86C13.46 6 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5c0 2.89-3.14 5.74-7.9 10.05M16.5 3c-1.74 0-3.41.81-4.5 2.08C10.91 3.81 9.24 3 7.5 3C4.42 3 2 5.41 2 8.5c0 3.77 3.4 6.86 8.55 11.53L12 21.35l1.45-1.32C18.6 15.36 22 12.27 22 8.5C22 5.41 19.58 3 16.5 3Z"
                      />
                    </svg>
                  </i>
                </div>
                <div className="flex flex-col items-center jusity-center">
                  <img src={burger1} alt="" className="h-[200px] w-[200px]" />
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
                <button className="border-[#435334] text-[#FFF] font-bold bg-[#FF785B] hover:bg-[#E8FBFF] hover:text-[#00213F] rounded-full p-3">
                  Add to Cart
                </button>
              </div>
            </div>
            <div className="border shadow-md ">
              <div className="relative p-10">
                <div className="absolute top-5 right-5 hover:cursor-pointer">
                  <i>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="gray"
                        d="m12.1 18.55l-.1.1l-.11-.1C7.14 14.24 4 11.39 4 8.5C4 6.5 5.5 5 7.5 5c1.54 0 3.04 1 3.57 2.36h1.86C13.46 6 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5c0 2.89-3.14 5.74-7.9 10.05M16.5 3c-1.74 0-3.41.81-4.5 2.08C10.91 3.81 9.24 3 7.5 3C4.42 3 2 5.41 2 8.5c0 3.77 3.4 6.86 8.55 11.53L12 21.35l1.45-1.32C18.6 15.36 22 12.27 22 8.5C22 5.41 19.58 3 16.5 3Z"
                      />
                    </svg>
                  </i>
                </div>
                <div className="flex flex-col items-center jusity-center">
                  <img src={Chicken2} alt="" className="h-[200px] w-[200px]" />
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
                <button className="border-[#435334] text-[#FFF] font-bold bg-[#FF785B] hover:bg-[#E8FBFF] hover:text-[#00213F] rounded-full p-3">
                  Add to Cart
                </button>
              </div>
            </div>
            <div className="border shadow-md ">
              <div className="relative p-10">
                <div className="absolute top-5 right-5 hover:cursor-pointer">
                  <i>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="gray"
                        d="m12.1 18.55l-.1.1l-.11-.1C7.14 14.24 4 11.39 4 8.5C4 6.5 5.5 5 7.5 5c1.54 0 3.04 1 3.57 2.36h1.86C13.46 6 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5c0 2.89-3.14 5.74-7.9 10.05M16.5 3c-1.74 0-3.41.81-4.5 2.08C10.91 3.81 9.24 3 7.5 3C4.42 3 2 5.41 2 8.5c0 3.77 3.4 6.86 8.55 11.53L12 21.35l1.45-1.32C18.6 15.36 22 12.27 22 8.5C22 5.41 19.58 3 16.5 3Z"
                      />
                    </svg>
                  </i>
                </div>
                <div className="flex flex-col items-center jusity-center">
                  <img src={Chicken5} alt="" className="h-[200px] w-[200px]" />
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
                <button className="border-[#435334] text-[#FFF] font-bold bg-[#FF785B] hover:bg-[#E8FBFF] hover:text-[#00213F] rounded-full p-3">
                  Add to Cart
                </button>
              </div>
            </div>
            <div className="border shadow-md ">
              <div className="relative p-10">
                <div className="absolute top-5 right-5 hover:cursor-pointer">
                  <i>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="gray"
                        d="m12.1 18.55l-.1.1l-.11-.1C7.14 14.24 4 11.39 4 8.5C4 6.5 5.5 5 7.5 5c1.54 0 3.04 1 3.57 2.36h1.86C13.46 6 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5c0 2.89-3.14 5.74-7.9 10.05M16.5 3c-1.74 0-3.41.81-4.5 2.08C10.91 3.81 9.24 3 7.5 3C4.42 3 2 5.41 2 8.5c0 3.77 3.4 6.86 8.55 11.53L12 21.35l1.45-1.32C18.6 15.36 22 12.27 22 8.5C22 5.41 19.58 3 16.5 3Z"
                      />
                    </svg>
                  </i>
                </div>
                <div className="flex flex-col items-center jusity-center">
                  <img src={Pizza3} alt="" className="h-[200px] w-[200px]" />
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
                <button className="border-[#435334] text-[#FFF] font-bold bg-[#FF785B] hover:bg-[#E8FBFF] hover:text-[#00213F] rounded-full p-3">
                  Add to Cart
                </button>
              </div>
            </div>
            <div className="border shadow-md ">
              <div className="relative p-10">
                <div className="absolute top-5 right-5 hover:cursor-pointer">
                  <i>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="gray"
                        d="m12.1 18.55l-.1.1l-.11-.1C7.14 14.24 4 11.39 4 8.5C4 6.5 5.5 5 7.5 5c1.54 0 3.04 1 3.57 2.36h1.86C13.46 6 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5c0 2.89-3.14 5.74-7.9 10.05M16.5 3c-1.74 0-3.41.81-4.5 2.08C10.91 3.81 9.24 3 7.5 3C4.42 3 2 5.41 2 8.5c0 3.77 3.4 6.86 8.55 11.53L12 21.35l1.45-1.32C18.6 15.36 22 12.27 22 8.5C22 5.41 19.58 3 16.5 3Z"
                      />
                    </svg>
                  </i>
                </div>
                <div className="flex flex-col items-center jusity-center">
                  <img src={Pasta} alt="" className="h-[200px] w-[200px]" />
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
                <button className="border-[#435334] text-[#FFF] font-bold bg-[#FF785B] hover:bg-[#E8FBFF] hover:text-[#00213F] rounded-full p-3">
                  Add to Cart
                </button>
              </div>
            </div>
            <div className="border shadow-md ">
              <div className="relative p-10">
                <div className="absolute top-5 right-5 hover:cursor-pointer">
                  <i>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="gray"
                        d="m12.1 18.55l-.1.1l-.11-.1C7.14 14.24 4 11.39 4 8.5C4 6.5 5.5 5 7.5 5c1.54 0 3.04 1 3.57 2.36h1.86C13.46 6 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5c0 2.89-3.14 5.74-7.9 10.05M16.5 3c-1.74 0-3.41.81-4.5 2.08C10.91 3.81 9.24 3 7.5 3C4.42 3 2 5.41 2 8.5c0 3.77 3.4 6.86 8.55 11.53L12 21.35l1.45-1.32C18.6 15.36 22 12.27 22 8.5C22 5.41 19.58 3 16.5 3Z"
                      />
                    </svg>
                  </i>
                </div>
                <div className="flex flex-col items-center jusity-center">
                  <img
                    src={Meatballs}
                    alt=""
                    className="object-cover h-[200px] w-[200px]"
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
                <button className="border-[#435334] text-[#FFF] font-bold bg-[#FF785B] hover:bg-[#E8FBFF] hover:text-[#00213F] rounded-full p-3">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
          <div className="py-10">
            <button>Back to Top</button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
