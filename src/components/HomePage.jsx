import React, { useState } from "react";
import "../index.css";
import { NavLink } from "react-router-dom";
import Footer from "./Footer";
import Chicken from "../assets/images/menu/chicken1.png";
import Pizza from "../assets/images/menu/pizza1.png";
import Chicken1 from "../assets/images/menu/chicken2.png";
import Pizza2 from "../assets/images/menu/pizza2.png";
import pasta2 from "../assets/images/menu/pasta2.png";
import Order from "../assets/svg/Order.png";
import OnTheWay from "../assets/svg/OnTheWay.png";
import Delivered from "../assets/svg/Delivered.png";
import Person1 from "../assets/images/reviews/Person1.jpg";
import Person2 from "../assets/images/reviews/Person2.jpg";
import Person3 from "../assets/images/reviews/Person3.jpg";
import Person4 from "../assets/images/reviews/Person4.jpg";
import Person5 from "../assets/images/reviews/Person5.jpg";

function HomePage() {
  //useState for Specified Position
  const [clicked, setClicked] = useState();

  const scrollUp = () => {
    window.scrollTo({
      top: 0, // position start from top 0.
      behavior: "auto", // auto scroll to top page, no animation.
    });
    setClicked(true);
  };

  return (
    <>
      <div className="overflow-hidden pb-24">
        <div className="max-w-7xl mx-auto py-24 px-5">
          <div className="bg-[#CEDEBD] py-24 rounded-[100px] grow">
            <div className="relative flex items-center justify-between max-w-6xl mx-auto p-5">
              <div className="md:max-w-sm lg:max-w-3xl">
                <h1 className="Pacifico font-normal text-[#00213F] sm:text-4xl md:text-5xl lg:text-7xl">
                  Fresh Food
                </h1>
                <p className="pt-5 text-[#00213F] text-xl font-semibold">
                  Indulge in the extraordinary with our Unforgettable Chicken
                  Bite
                </p>
                <button className="pt-8">
                  <NavLink
                    to="/Menu"
                    onClick={scrollUp}
                    className="p-3 px-5 bg-[#ff785b] text-white rounded-full"
                  >
                    {clicked ? "Scrolling..." : "Discover Menu"}
                  </NavLink>
                </button>
              </div>
              {/* NOT RESPONSIVE YET, BE RIGHT BACK. ALMOST 2hrs fixing it. */}
              <div className="absolute -right-44 flex items-center justify-center">
                <img src={Chicken} alt="" className="object-contain w-[40em]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-14">
        {/* Special Dish */}
        <div className="text-center pb-10">
          <h1 className="text-lg text-[#435334] font-semibold">SPECIALTIES</h1>
          <p className="text-2xl font-bold">Our Special Dish</p>
        </div>
        <div className="flex items-center justify-center max-w-7xl mx-auto">
          <div className="grid gap-4 h-full sm:grid-cols-1 max-sm:w-full sm:m-5 md:grid-cols-2 lg:grid-cols-3">
            <div className="relative shadow-md p-10">
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
              <div className="relative flex flex-col items-center jusity-center">
                <img src={Chicken1} alt="" className="h-[200px] w-[200px] " />
                <div className="absolute left-2 top-0">
                  <div className="bg-white rounded-full p-2">
                    <p className="bg-[#CEDEBD] rounded-full p-4 text-base text-[#00213F] font-bold">
                      &#36;49
                    </p>
                  </div>
                </div>
                <span className="text-center space-y-2 pt-5">
                  <h1 className="text-lg text-[#00213F] font-bold">
                    {" "}
                    Roasted Chicken with Carrots
                  </h1>
                </span>
              </div>
              <div className="text-center pt-10">
                <button className="border-[#435334] text-[#FFF] font-bold bg-[#FF785B] hover:bg-[#E8FBFF] hover:text-[#00213F] rounded-full p-3">
                  Add to Basket
                </button>
              </div>
            </div>
            <div className="relative shadow-md p-10">
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
              <div className="relative flex flex-col items-center justify-center">
                <img src={Pizza2} alt="" className="h-[200px] w-[200px]" />
                <div className="absolute left-2 top-0">
                  <div className="bg-white rounded-full p-2">
                    <p className="bg-[#CEDEBD] rounded-full p-4 text-base text-[#00213F] font-bold">
                      &#36;24
                    </p>
                  </div>
                </div>
                <span className="text-center space-y-2 pt-5">
                  <h1 className="text-lg text-[#00213F] font-bold">
                    {" "}
                    Margherita Pizza{" "}
                  </h1>
                </span>
              </div>
              <div className="text-center pt-10">
                <button className="border-[#435334] text-[#FFF] font-bold bg-[#FF785B] hover:bg-[#E8FBFF] hover:text-[#00213F] rounded-full p-3">
                  Add to Basket
                </button>
              </div>
            </div>
            <div className="relative shadow-md p-10">
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
              <div className="relative flex flex-col items-center justify-center">
                <img src={Pizza} alt="" className="h-[200px] w-[200px]" />
                <div className="absolute left-2 top-0">
                  <div className="bg-white rounded-full p-2">
                    <p className="bg-[#CEDEBD] rounded-full p-4 text-base text-[#00213F] font-bold">
                      &#36;29
                    </p>
                  </div>
                </div>
                <span className="text-center space-y-2 pt-5">
                  <h1 className="text-lg text-[#00213F] font-bold">
                    {" "}
                    Pizza Bites
                  </h1>
                </span>
              </div>
              <div className="text-center pt-10">
                <button className="border-[#435334] text-[#FFF] font-bold bg-[#FF785B] hover:bg-[#E8FBFF] hover:text-[#00213F] rounded-full p-3">
                  Add to Basket
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#FFF]">
        {/* What we serve */}
        <div className="text-center pt-10">
          <h1 className="text-lg text-[#435334] font-semibold">
            WHAT WE SERVE
          </h1>
          <p className="text-2xl font-bold">
            Your Favorite Food <br /> Delivery Partner
          </p>
        </div>
        <div className="flex sm:flex-col lg:flex-row items-center justify-evenly text-center text-lg font-bold max-w-6xl mx-auto py-16">
          <div>
            <img src={Order} alt="" className="h-[300px] w-[300px]" />
            <p>Easy To Order</p>
          </div>
          <div>
            <img src={OnTheWay} alt="" className="h-[300px] w-[300px]" />
            <p>Fastest Delivery</p>
          </div>
          <div>
            <img src={Delivered} alt="" className="h-[300px] w-[300px]" />
            <p>Best Quality</p>
          </div>
        </div>
      </div>
      <div className="bg-[#FF785B] py-24 mt-14">
        {/* Book Now */}
        {/* <div className="text-center pt-10">
          <h1 className="text-lg text-[#435334] font-semibold">ABOUT US</h1>
          <p className="text-2xl font-bold">Why Choose Us?</p>
        </div> */}
        <div className="flex items-center justify-center pt-10">
          <div className="flex sm:flex-col lg:flex-row max-w-6xl mx-auto space-x-10">
            <div>
              <img
                src={pasta2}
                alt=""
                className="object-contain h-96 w-screen"
              />
            </div>
            <div className="space-y-5 p-10">
              <h1 className="text-white  text-3xl font-bold">
                Make order now and get 10% discount!
              </h1>
              <p className="text-[#f1f1f1] text-lg">
                Discover the best dishes from across the country, each
                representing the unique flavors and culinary heritage of our
                nation. From comforting classics to exquisite specialties, these
                top food picks showcase the delicious diversity of our local
                cuisine.
              </p>
              <button className="bg-[#FFF] text-[#FF785B] font-medium p-2 px-6 rounded-full">
                Make Order
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#FFF] py-24 mt-14">
        {/* About Us */}
        <div className="text-center pt-10">
          <h1 className="text-lg text-[#435334] font-semibold">ABOUT US</h1>
          <p className="text-2xl font-bold">Why Choose Us?</p>
        </div>
        <div className="flex items-center justify-center pt-10">
          <div className="flex sm:flex-col lg:flex-row max-w-6xl mx-auto space-x-10">
            <div>
              <img
                src={pasta2}
                alt=""
                className="object-contain h-96 w-screen"
              />
            </div>
            <div className="space-y-5 p-10">
              <h1 className="text-3xl font-bold">
                Top Food Picks Across the Country
              </h1>
              <p className="text-xl">
                Discover the best dishes from across the country, each
                representing the unique flavors and culinary heritage of our
                nation. From comforting classics to exquisite specialties, these
                top food picks showcase the delicious diversity of our local
                cuisine.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#FFF] space-y-4">
        {/* Reviews */}
        <div className="text-center pt-10">
          <h1 className="text-lg text-[#435334] font-semibold">REVIEWS</h1>
          <p className="text-2xl font-bold">What Our Customer Says?</p>
        </div>
        <div className="flex items-center justify-center max-w-6xl mx-auto pt-10">
          <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 m-5">
            <div className="shadow relative hover:bg-[#E8FBFF] p-6 rounded-xl">
              <span className="absolute right-4">
                <i>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill="#CEDEBD"
                      d="M5.315 3.401c-1.61 0-2.916 1.343-2.916 3c0 1.656 1.306 3 2.916 3c2.915 0 .972 5.799-2.916 5.799v1.4c6.939.001 9.658-13.199 2.916-13.199zm8.4 0c-1.609 0-2.915 1.343-2.915 3c0 1.656 1.306 3 2.915 3c2.916 0 .973 5.799-2.915 5.799v1.4c6.938.001 9.657-13.199 2.915-13.199z"
                    />
                  </svg>
                </i>
              </span>
              <div className="flex items-center justify-between py-5 space-x-5 sm:flex-col lg:flex-row sm:flex-col lg:flex-row">
                <div className="border bg-[#CEDEBD] rounded-full p-2">
                  <div className="border bg-[#FFF] rounded-full p-2">
                    <img
                      src={Person1}
                      alt=""
                      className="object-cover object-top h-[100px] w-[100px] rounded-full"
                    />
                  </div>
                </div>
                <span>
                  <h1 className="text-lg text-[#00213F] font-bold">
                    Emily Thompson
                  </h1>
                  <p className="text-[#435334]">Desinger</p>
                </span>
              </div>
              <div className="text-justify text-gray-700">
                <p>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Dolorem cupiditate doloremque est labore molestiae esse natus
                  repellat mollitia repellendus hic?
                </p>
              </div>
            </div>
            <div className="shadow relative hover:bg-[#E8FBFF] bg-[#FFF] p-6 rounded-xl">
              <span className="absolute right-4">
                <i>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill="#CEDEBD"
                      d="M5.315 3.401c-1.61 0-2.916 1.343-2.916 3c0 1.656 1.306 3 2.916 3c2.915 0 .972 5.799-2.916 5.799v1.4c6.939.001 9.658-13.199 2.916-13.199zm8.4 0c-1.609 0-2.915 1.343-2.915 3c0 1.656 1.306 3 2.915 3c2.916 0 .973 5.799-2.915 5.799v1.4c6.938.001 9.657-13.199 2.915-13.199z"
                    />
                  </svg>
                </i>
              </span>
              <div className="flex items-center justify-between py-5 space-x-5 sm:flex-col lg:flex-row">
                <div className="border bg-[#CEDEBD] rounded-full p-2">
                  <div className="border bg-[#FFF] rounded-full p-2">
                    <img
                      src={Person2}
                      alt=""
                      className="object-cover object-top h-[100px] w-[100px] rounded-full"
                    />
                  </div>
                </div>
                <span>
                  <h1 className="text-lg text-[#00213F] font-bold">
                    David Scathieber{" "}
                  </h1>
                  <p className="text-[#435334]">Cloud Architect</p>
                </span>
              </div>
              <div className="text-justify text-gray-700">
                <p>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Dolorem cupiditate doloremque est labore molestiae esse natus
                  repellat mollitia repellendus hic?
                </p>
              </div>
            </div>
            <div className="shadow relative hover:bg-[#E8FBFF] bg-[#FFF] p-6 rounded-xl">
              <span className="absolute right-4">
                <i>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill="#CEDEBD"
                      d="M5.315 3.401c-1.61 0-2.916 1.343-2.916 3c0 1.656 1.306 3 2.916 3c2.915 0 .972 5.799-2.916 5.799v1.4c6.939.001 9.658-13.199 2.916-13.199zm8.4 0c-1.609 0-2.915 1.343-2.915 3c0 1.656 1.306 3 2.915 3c2.916 0 .973 5.799-2.915 5.799v1.4c6.938.001 9.657-13.199 2.915-13.199z"
                    />
                  </svg>
                </i>
              </span>
              <div className="flex items-center justify-between py-5 space-x-5 sm:flex-col lg:flex-row">
                <div className="border bg-[#CEDEBD] rounded-full p-2">
                  <div className="border bg-[#FFF] rounded-full p-2">
                    <img
                      src={Person3}
                      alt=""
                      className="object-cover object-top h-[100px] w-[100px] rounded-full"
                    />
                  </div>
                </div>
                <span>
                  <h1 className="text-lg text-[#00213F] font-bold">
                    William Anderson
                  </h1>
                  <p className="text-[#435334]">Web Developer</p>
                </span>
              </div>
              <div className="text-justify text-gray-700">
                <p>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Dolorem cupiditate doloremque est labore molestiae esse natus
                  repellat mollitia repellendus hic?
                </p>
              </div>
            </div>
            <div className="shadow relative hover:bg-[#E8FBFF] bg-[#FFF] p-6 rounded-xl sm:block lg:hidden">
              <span className="absolute right-4">
                <i>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill="#CEDEBD"
                      d="M5.315 3.401c-1.61 0-2.916 1.343-2.916 3c0 1.656 1.306 3 2.916 3c2.915 0 .972 5.799-2.916 5.799v1.4c6.939.001 9.658-13.199 2.916-13.199zm8.4 0c-1.609 0-2.915 1.343-2.915 3c0 1.656 1.306 3 2.915 3c2.916 0 .973 5.799-2.915 5.799v1.4c6.938.001 9.657-13.199 2.915-13.199z"
                    />
                  </svg>
                </i>
              </span>
              <div className="flex items-center justify-between py-5 space-x-5 sm:flex-col lg:flex-row">
                <div className="border bg-[#CEDEBD] rounded-full p-2">
                  <div className="border bg-[#FFF] rounded-full p-2">
                    <img
                      src={Person4}
                      alt=""
                      className="object-cover object-top h-[100px] w-[100px] rounded-full"
                    />
                  </div>
                </div>
                <span>
                  <h1 className="text-lg text-[#00213F] font-bold">
                    Sophia Rodriguez
                  </h1>
                  <p className="text-[#435334]">IT Consultant</p>
                </span>
              </div>
              <div className="text-justify text-gray-700">
                <p>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Dolorem cupiditate doloremque est labore molestiae esse natus
                  repellat mollitia repellendus hic?
                </p>
              </div>
            </div>
            <div className="shadow relative hover:bg-[#E8FBFF] bg-[#FFF] p-6 rounded-xl sm:block lg:hidden">
              <span className="absolute right-4">
                <i>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill="#CEDEBD"
                      d="M5.315 3.401c-1.61 0-2.916 1.343-2.916 3c0 1.656 1.306 3 2.916 3c2.915 0 .972 5.799-2.916 5.799v1.4c6.939.001 9.658-13.199 2.916-13.199zm8.4 0c-1.609 0-2.915 1.343-2.915 3c0 1.656 1.306 3 2.915 3c2.916 0 .973 5.799-2.915 5.799v1.4c6.938.001 9.657-13.199 2.915-13.199z"
                    />
                  </svg>
                </i>
              </span>
              <div className="flex items-center justify-between py-5 space-x-5 sm:flex-col lg:flex-row">
                <div className="border bg-[#CEDEBD] rounded-full p-2">
                  <div className="border bg-[#FFF] rounded-full p-2">
                    <img
                      src={Person5}
                      alt=""
                      className="object-cover object-top h-[100px] w-[100px] rounded-full"
                    />
                  </div>
                </div>
                <span>
                  <h1 className="text-lg text-[#00213F] font-bold">
                    Michael Anderson
                  </h1>
                  <p className="text-[#435334]">Software Engineer</p>
                </span>
              </div>
              <div className="text-justify text-gray-700">
                <p>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Dolorem cupiditate doloremque est labore molestiae esse natus
                  repellat mollitia repellendus hic?
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center max-w-6xl mx-auto pb-10 sm:hidden md:hidden lg:block">
          <div className="grid lg:grid-cols-6 md:grid-cols-2 sm:grid-cols-1 gap-4">
            <div className="shadow relative hover:bg-[#E8FBFF] bg-[#FFF] p-6 rounded-xl lg:col-start-2 md:col-end-4">
              <span className="absolute right-4">
                <i>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill="#CEDEBD"
                      d="M5.315 3.401c-1.61 0-2.916 1.343-2.916 3c0 1.656 1.306 3 2.916 3c2.915 0 .972 5.799-2.916 5.799v1.4c6.939.001 9.658-13.199 2.916-13.199zm8.4 0c-1.609 0-2.915 1.343-2.915 3c0 1.656 1.306 3 2.915 3c2.916 0 .973 5.799-2.915 5.799v1.4c6.938.001 9.657-13.199 2.915-13.199z"
                    />
                  </svg>
                </i>
              </span>
              <div className="flex items-center justify-between py-5 space-x-5 sm:flex-col lg:flex-row">
                <div className="border bg-[#CEDEBD] rounded-full p-2">
                  <div className="border bg-[#FFF] rounded-full p-2">
                    <img
                      src={Person4}
                      alt=""
                      className="object-cover object-top h-[100px] w-[100px] rounded-full"
                    />
                  </div>
                </div>
                <span>
                  <h1 className="text-lg text-[#00213F] font-bold">
                    Sophia Rodriguez
                  </h1>
                  <p className="text-[#435334]">IT Consultant</p>
                </span>
              </div>
              <div className="text-justify text-gray-700">
                <p>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Dolorem cupiditate doloremque est labore molestiae esse natus
                  repellat mollitia repellendus hic?
                </p>
              </div>
            </div>
            <div className="shadow relative hover:bg-[#E8FBFF] bg-[#FFF] p-6 rounded-xl col-start-4 col-end-6">
              <span className="absolute right-4">
                <i>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill="#CEDEBD"
                      d="M5.315 3.401c-1.61 0-2.916 1.343-2.916 3c0 1.656 1.306 3 2.916 3c2.915 0 .972 5.799-2.916 5.799v1.4c6.939.001 9.658-13.199 2.916-13.199zm8.4 0c-1.609 0-2.915 1.343-2.915 3c0 1.656 1.306 3 2.915 3c2.916 0 .973 5.799-2.915 5.799v1.4c6.938.001 9.657-13.199 2.915-13.199z"
                    />
                  </svg>
                </i>
              </span>
              <div className="flex items-center justify-between py-5 space-x-5 sm:flex-col lg:flex-row">
                <div className="border bg-[#CEDEBD] rounded-full p-2">
                  <div className="border bg-[#FFF] rounded-full p-2">
                    <img
                      src={Person5}
                      alt=""
                      className="object-cover object-top h-[100px] w-[100px] rounded-full"
                    />
                  </div>
                </div>
                <span>
                  <h1 className="text-lg text-[#00213F] font-bold">
                    Michael Anderson
                  </h1>
                  <p className="text-[#435334]">Software Engineer</p>
                </span>
              </div>
              <div className="text-justify text-gray-700">
                <p>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Dolorem cupiditate doloremque est labore molestiae esse natus
                  repellat mollitia repellendus hic?
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default HomePage;
