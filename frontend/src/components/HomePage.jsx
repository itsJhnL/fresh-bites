import { useState } from "react";
import "../index.css";
import { NavLink } from "react-router-dom";
import Footer from "./Footer.jsx";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import {
  hero,
  specialties,
  services,
  discount,
  about,
  reviews,
} from "../data/data.js";

function HomePage() {
  //useState for Specified Position
  const [clicked, setClicked] = useState(false);

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
      {hero.map((data) => {
        return (
          <div key={data.id}>
            <div className="mx-auto z-0">
              <div className="flex content-center justify-center">
                <div className="blur-xl absolute max-w-full max-h-full">
                  <img
                    src={data.backgroundImage}
                    alt="Hero background"
                    className="z-0"
                  />
                </div>
              </div>
            </div>
            <div className="relative z-10 overflow-hidden" key={data.id}>
              <div className="mx-auto">
                <div className="flex items-center justify-center">
                  <div className="max-w-7xl sm:flex-col md:flex-row flex items-center justify-between m-5">
                    <div className="sm:text-center md:text-left">
                      <h1 className="font-bold text-[#00213F] sm:text-3xl md:text-6xl lg:text-7xl">
                        {data.title}
                      </h1>
                      <p className="pt-2 text-[#00213F] sm:text-sm md:text-lg font-medium">
                        {data.subtitle}
                      </p>
                      {/* <p className="pt-5 text-[#00213F] sm:text-sm md:text-xl font-semibold">
                        {data.paragraph}
                      </p> */}
                      <p className="pt-2 text-[#00213F] text-lg font-semibold">
                        {data.time}
                      </p>
                      <div className="flex gap-5">
                        <button className="relative pt-5 z-10">
                          <NavLink
                            to="/Menu"
                            onClick={scrollUp}
                            className="p-3 px-5 border-2 bg-[#667B68] hover:bg-white text-white hover:text-[#667B68] rounded-full"
                          >
                            {clicked ? "Scrolling..." : "Food Menu"}
                          </NavLink>
                        </button>
                        <button className="relative pt-5 z-10">
                          <NavLink
                            to="/Contact"
                            onClick={scrollUp}
                            className="p-3 px-5 hover:border-2[#667B68] border-2 bg-white hover:bg-[#667B68] text-[#667B68] hover:text-white rounded-full"
                          >
                            {clicked ? "Scrolling..." : "Book a Table"}
                          </NavLink>
                        </button>
                      </div>
                    </div>
                    <div className="sm:pt-10 md:p-0">
                      <img
                        src={data.imageURL}
                        alt={data.title}
                        className="object-cover min-h-64 sm:h-64 md:h-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <div className="py-14">
        {/* Special Dish */}
        <div className="text-center pb-10">
          <h1 className="text-lg text-[#435334] font-semibold">SPECIALTIES</h1>
          <p className="text-2xl font-bold">Our Special Dish</p>
        </div>
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="grid gap-4 h-full sm:grid-cols-2 max-sm:w-full sm:m-5 md:grid-cols-3 lg:grid-cols-4">
            {specialties.map((data) => {
              return (
                <div key={data.id} className="relative shadow-xl p-7">
                  <div className="flex justify-end hover:cursor-pointer">
                    <i className="text-gray-500 hover:text-[#FF785B]">
                      <FavoriteBorderIcon />
                    </i>
                  </div>
                  <div className="relative flex flex-col items-center jusity-center">
                    <img
                      src={data.imageURL}
                      alt={data.subtitle}
                      className="object-contain h-48 w-48"
                    />
                    <span className="text-center space-y-2 pt-5">
                      <h1 className="text-lg text-[#00213F] font-bold">
                        {data.subtitle}
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

        <div className="flex sm:flex-col lg:flex-row items-center justify-evenly text-center text-lg font-bold max-w-6xl mx-auto py-14">
          {services.map((data) => {
            return (
              <div key={data.id}>
                <img
                  src={data.imageURL}
                  alt={data.subtitle}
                  className="h-[300px] w-[300px] p-11"
                />
                <p>{data.subtitle}</p>
              </div>
            );
          })}
        </div>
      </div>
      <div className="bg-[#FF785B] py-24 mt-14">
        {/* Book Now */}
        <div className="flex items-center justify-center ">
          <div className="flex sm:flex-col lg:flex-row max-w-6xl px-10">
            {discount.map((data) => {
              return (
                <div key={data.id} className="contents">
                  <div>
                    <img
                      src={data.imageURL}
                      alt={data.title}
                      className="object-contain h-96 w-screen"
                    />
                  </div>
                  <div className="space-y-5 py-20">
                    <h1 className="text-white  text-3xl font-bold">
                      {data.title}
                    </h1>
                    <p className="text-[#f1f1f1] text-lg">{data.paragraph}</p>
                    <button className="bg-[#FFF] text-[#FF785B] hover:bg-[#E8FBFF] font-medium p-2 px-6 rounded-full">
                      <NavLink to="/Menu" onClick={scrollUp}>
                        {clicked ? "Scrolling..." : "Make Order"}
                      </NavLink>
                    </button>
                  </div>
                </div>
              );
            })}
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
          {about.map((data) => {
            return (
              <div
                key={data.id}
                className="flex items-center sm:flex-col lg:flex-row max-w-6xl mx-auto"
              >
                <div>
                  <img
                    src={data.imageURL}
                    alt={data.title}
                    className="object-contain h-96 w-screen"
                  />
                </div>
                <div className="space-y-5 px-10">
                  <h1 className="text-3xl font-bold">{data.title}</h1>
                  <p className="text-xl">{data.paragraph}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-[#FFF] space-y-4">
        {/* Reviews */}
        <div className="text-center pt-10">
          <h1 className="text-lg text-[#435334] font-semibold">REVIEWS</h1>
          <p className="text-2xl font-bold">What Our Customer Says?</p>
        </div>
        <div className="max-w-6xl mx-auto pt-10">
          <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 m-5">
            {reviews.map((data) => {
              return (
                <div key={data.id} className="shadow relative p-6 rounded-xl">
                  <span className="absolute right-4 text-gray-500">
                    <FormatQuoteIcon />
                  </span>
                  <div className="flex items-center justify-between py-5 space-x-5 sm:flex-col lg:flex-row sm:flex-col lg:flex-row">
                    <div className="border bg-[#CEDEBD] rounded-full p-2">
                      <div className="border bg-[#FFF] rounded-full p-2">
                        <img
                          src={data.imageURL}
                          alt={data.name}
                          className="object-cover object-top h-[100px] w-[100px] rounded-full"
                        />
                      </div>
                    </div>
                    <span>
                      <h1 className="text-lg text-[#00213F] font-bold">
                        {data.name}
                      </h1>
                      <p className="text-[#435334]">{data.subtitle}</p>
                    </span>
                  </div>
                  <div className="text-justify text-gray-700">
                    <p>{data.paragraph}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default HomePage;
