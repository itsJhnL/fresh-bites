import React, { useState, useEffect } from "react";
import "../index.css";
import { NavLink } from "react-router-dom";
import Footer from "./Footer";
import Chicken from "../assets/images/menu/chicken1.png";
import Pizza from "../assets/images/menu/pizza1.png";
import Chicken1 from "../assets/images/menu/chicken2.png";
import Pizza2 from "../assets/images/menu/pizza2.png";
import pasta2 from "../assets/images/menu/pasta2.png";
import pasta from "../assets/images/pasta.png";
import Order from "../assets/svg/Order.png";
import OnTheWay from "../assets/svg/OnTheWay.png";
import Delivered from "../assets/svg/Delivered.png";
import Person1 from "../assets/images/reviews/Person1.jpg";
import Person2 from "../assets/images/reviews/Person2.jpg";
import Person3 from "../assets/images/reviews/Person3.jpg";
import Person4 from "../assets/images/reviews/Person4.jpg";
import Person5 from "../assets/images/reviews/Person5.jpg";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";

function HomePage() {
  //useState for Specified Position
  const [clicked, setClicked] = useState();

  // This logic allow users to scroll up at the top of the page.
  const scrollUp = () => {
    window.scrollTo({
      top: 0, // position start from top 0.
      behavior: "auto", // auto scroll to top page, no animation.
    });
    setClicked(true);
  };

  return (
    <>
      <div className="overflow-hidden lg:m-5">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#CEDEBD] lg:rounded-[7em]">
            <div className="sm:flex-col md:flex-row flex items-center justify-between sm:p-10 md:px-16">
              <div className="sm:text-center md:text-left ">
                <h1 className="Pacifico font-normal text-[#00213F] sm:text-4xl md:text-7xl">
                  Fresh Food.
                </h1>
                <p className="pt-5 text-[#00213F] sm:text-sm md:text-xl font-semibold">
                  Indulge in the extraordinary with our Unforgettable Chicken
                  Bite
                </p>
                <p className="pt-5 text-[#00213F] text-lg font-semibold">
                  Open everyday from 8-12 pm
                </p>
                <button className="pt-8">
                  <NavLink
                    to="/Menu"
                    onClick={scrollUp}
                    className="p-3 px-5 bg-[#ff785b] hover:bg-[#E8FBFF] hover:text-[#00213F] text-white rounded-full"
                  >
                    {clicked ? "Scrolling..." : "Get Started"}
                  </NavLink>
                </button>
              </div>
              <div className="sm:pt-10 md:p-0">
                <img
                  src={Chicken}
                  alt=""
                  className="object-contain sm:h-64 md:h-96"
                />
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
                <i className="text-gray-500 hover:text-[#FF785B]">
                  <FavoriteBorderIcon />
                </i>
              </div>
              <div className="relative flex flex-col items-center jusity-center">
                <img
                  src={Chicken1}
                  alt=""
                  className="object-contain h-56 w-56 "
                />
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
                <button className="border-[#435334] text-[#FFF] bg-[#FF785B] hover:bg-[#E8FBFF] hover:text-[#00213F] p-3">
                  Order Now
                </button>
              </div>
            </div>
            <div className="relative shadow-md p-10">
              <div className="absolute top-5 right-5 hover:cursor-pointer">
                <i className="text-gray-500 hover:text-[#FF785B]">
                  <FavoriteBorderIcon />
                </i>
              </div>
              <div className="relative flex flex-col items-center justify-center">
                <img src={Pizza2} alt="" className="object-contain h-56 w-56" />
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
                <button className="border-[#435334] text-[#FFF] bg-[#FF785B] hover:bg-[#E8FBFF] hover:text-[#00213F] p-3">
                  Order Now
                </button>
              </div>
            </div>
            <div className="relative shadow-md p-10">
              <div className="absolute top-5 right-5 hover:cursor-pointer">
                <i className="text-gray-500 hover:text-[#FF785B]">
                  <FavoriteBorderIcon />
                </i>
              </div>
              <div className="relative flex flex-col items-center justify-center">
                <img src={Pizza} alt="" className="object-contain h-56 w-56" />
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
                <button className="border-[#435334] text-[#FFF] bg-[#FF785B] hover:bg-[#E8FBFF] hover:text-[#00213F] p-3">
                  Order Now
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
            <img src={Order} alt="" className="h-[300px] w-[300px] p-11" />
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
        <div className="flex items-center justify-center ">
          <div className="flex sm:flex-col lg:flex-row max-w-6xl px-10">
            <div>
              <img
                src={pasta}
                alt=""
                className="object-contain h-96 w-screen"
              />
            </div>
            <div className="space-y-5 py-20">
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
              <button className="bg-[#FFF] text-[#FF785B] hover:bg-[#E8FBFF] font-medium p-2 px-6 rounded-full">
                <NavLink to="/Menu" onClick={scrollUp}>
                  {clicked ? "Scrolling..." : "Make Order"}
                </NavLink>
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
          <div className="flex items-center sm:flex-col lg:flex-row max-w-6xl mx-auto">
            <div>
              <img
                src={pasta2}
                alt=""
                className="object-contain h-96 w-screen"
              />
            </div>
            <div className="space-y-5 px-10">
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
            <div className="shadow relative p-6 rounded-xl">
              <span className="absolute right-4 text-gray-500">
                <FormatQuoteIcon />
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
                  <p className="text-[#435334]">UI/UX Designer</p>
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
            <div className="shadow relative bg-[#FFF] p-6 rounded-xl">
              <span className="absolute right-4 text-gray-500">
                <FormatQuoteIcon />
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
            <div className="shadow relative bg-[#FFF] p-6 rounded-xl">
              <span className="absolute right-4 text-gray-500">
                <FormatQuoteIcon />
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
            <div className="shadow relative bg-[#FFF] p-6 rounded-xl sm:block lg:hidden">
              <span className="absolute right-4 text-gray-500">
                <FormatQuoteIcon />
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
            <div className="shadow relative bg-[#FFF] p-6 rounded-xl sm:block lg:hidden">
              <span className="absolute right-4 text-gray-500">
                <FormatQuoteIcon />
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
            <div className="shadow relative bg-[#FFF] p-6 rounded-xl lg:col-start-2 md:col-end-4">
              <span className="absolute right-4 text-gray-500">
                <FormatQuoteIcon />
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
            <div className="shadow relative bg-[#FFF] p-6 rounded-xl col-start-4 col-end-6">
              <span className="absolute right-4 text-gray-500">
                <FormatQuoteIcon />
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
