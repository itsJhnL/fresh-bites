import React, { useState } from "react";
import "../index.css";
import { NavLink } from "react-router-dom";
import Footer from "./Footer";
import Chicken from "../assets/images/menu/chicken1.png";
import Pizza from "../assets/images/menu/pizza1.png";
import Chicken1 from "../assets/images/menu/chicken2.png";
import Chicken2 from "../assets/images/menu/chicken3.png";
import Chicken5 from "../assets/images/menu/chicken5.png";
import Pizza2 from "../assets/images/menu/pizza2.png";
import pasta2 from "../assets/images/menu/pasta2.png";
import Pasta from "../assets/images/menu/pasta.png";
import Pizza3 from "../assets/images/menu/pizza3.png";
import Burger2 from "../assets/images/menu/burger2.png";
import Meatballs from "../assets/images/menu/meatballs.png";
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
      <div className="bg-[#FAF1E4] py-24 drop-shadow">
        <div className="flex sm:flex-col lg:flex-row items-center justify-between max-w-6xl mx-auto p-5 ">
          <div>
            <span className="Pacifico text-[#435334] font-normal sm:text-2xl md:text-5xl">
              Welcome to
            </span>
            <h1 className="Pacifico font-normal sm:text-5xl md:text-8xl">
              Fresh Bites
            </h1>
            <p className="pt-5 text-xl ">
              Indulge in the extraordinary with our Unforgettable Chicken Bite.
            </p>
            <p className="text-justify max-w-xl pt-4">
              Immerse your taste buds in a symphony of flavors that lingers long
              after your last bite. Crafted to perfection, each tender piece of
              succulent chicken is infused with a harmonious blend of exquisite
              spices and seasonings. A remarkable burst of taste that's simply
              unforgettable.
            </p>
            <button className="pt-7">
              <NavLink
                to="/Menu"
                onClick={scrollUp}
                className="p-2 px-5 bg-[#435334] text-white"
              >
                {clicked ? "Scrolling..." : "Show More"}
              </NavLink>
            </button>
          </div>
          <div className="object-cover rounded-full mb-5">
            <img src={Chicken} alt="" className="w-96" />
          </div>
        </div>
      </div>
      <div className="bg-[#CEDEBD] py-16">
        {/* Best Selling Dishes */}
        <div className="text-center pb-10">
          <h1 className="text-lg text-[#435334] font-semibold">SPECIALTIES</h1>
          <p className="text-2xl font-bold">Our Best Selling</p>
        </div>
        <div className="flex items-center justify-center max-w-6xl mx-auto">
          <div className="grid grid-cols-3 gap-4 h-full sm:grid-cols-1 sm:w-full sm:m-5 sm:grid-cols-2 sm:m-5 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-[#FAF1E4] p-10">
              <div className="flex flex-col items-center jusity-center">
                <img src={Chicken1} alt="" className="h-[200px] w-[200px] " />
                <span className="text-center space-y-2 pt-5">
                  <p className="text-[#435334] text-base font-bold">
                    &#8369; 399
                  </p>
                  <h1 className="text-lg font-bold">
                    {" "}
                    Roasted Chicken with Carrots
                  </h1>
                </span>
              </div>
              <div className="text-center pt-10">
                <button className="border border-[#435334] text-[#FFF] bg-[#435334] hover:bg-[#9EB384] hover:text-[#435334] p-2">
                  ORDER NOW
                </button>
              </div>
            </div>
            <div className="bg-[#FAF1E4] p-10">
              <div className="flex flex-col items-center justify-center">
                <img src={Pizza3} alt="" className="h-[200px] w-[200px]" />
                <span className="text-center space-y-2 pt-5">
                  <p className="text-[#435334] text-base font-bold">
                    &#8369; 999
                  </p>
                  <h1 className="text-lg font-bold">
                    {" "}
                    Chocolate and Strawberry Pizza
                  </h1>
                </span>
              </div>
              <div className="text-center pt-10">
                <button className="border border-[#435334] text-[#FFF] bg-[#435334] hover:bg-[#9EB384] hover:text-[#435334] p-2">
                  ORDER NOW
                </button>
              </div>
            </div>
            <div className="bg-[#FAF1E4] p-10">
              <div className="flex flex-col items-center justify-center">
                <img src={Chicken5} alt="" className="h-[200px] w-[200px]" />
                <span className="text-center space-y-2 pt-5">
                  <p className="text-[#435334] text-base font-bold">
                    &#8369; 99
                  </p>
                  <h1 className="text-lg font-bold"> Roasted Chicken Leg</h1>
                </span>
              </div>
              <div className="text-center pt-10">
                <button className="border border-[#435334] text-[#FFF] bg-[#435334] hover:bg-[#9EB384] hover:text-[#435334] p-2">
                  ORDER NOW
                </button>
              </div>
            </div>
            <div className="bg-[#FAF1E4] p-10">
              <div className="flex flex-col items-center justify-center">
                <img src={Chicken2} alt="" className="h-[200px] w-[200px]" />
                <span className="text-center space-y-2 pt-5">
                  <p className="text-[#435334] text-base font-bold">
                    &#8369; 160
                  </p>
                  <h1 className="text-lg font-bold"> Chicken NOKNOK</h1>
                </span>
              </div>
              <div className="text-center pt-10">
                <button className="border border-[#435334] text-[#FFF] bg-[#435334] hover:bg-[#9EB384] hover:text-[#435334] p-2">
                  ORDER NOW
                </button>
              </div>
            </div>
            <div className="bg-[#FAF1E4] p-10">
              <div className="flex flex-col items-center justify-center">
                <img src={Pizza2} alt="" className="h-[200px] w-[200px]" />
                <span className="text-center space-y-2 pt-5">
                  <p className="text-[#435334] text-base font-bold">
                    &#8369; 399
                  </p>
                  <h1 className="text-lg font-bold"> Margherita Pizza </h1>
                </span>
              </div>
              <div className="text-center pt-10">
                <button className="border border-[#435334] text-[#FFF] bg-[#435334] hover:bg-[#9EB384] hover:text-[#435334] p-2">
                  ORDER NOW
                </button>
              </div>
            </div>
            <div className="bg-[#FAF1E4] p-10">
              <div className="flex flex-col items-center justify-center">
                <img src={Pizza} alt="" className="h-[200px] w-[200px]" />
                <span className="text-center space-y-2 pt-5">
                  <p className="text-[#435334] text-base font-bold">
                    &#8369; 499
                  </p>
                  <h1 className="text-lg font-bold"> Pizza Bites</h1>
                </span>
              </div>
              <div className="text-center pt-10">
                <button className="border border-[#435334] text-[#FFF] bg-[#435334] hover:bg-[#9EB384] hover:text-[#435334] p-2">
                  ORDER NOW
                </button>
              </div>
            </div>
            <div className="bg-[#FAF1E4] p-10">
              <div className="flex flex-col items-center justify-center">
                <img src={Pasta} alt="" className="h-[200px] w-[200px]" />
                <span className="text-center space-y-2 pt-5">
                  <p className="text-[#435334] text-base font-bold">
                    &#8369; 199
                  </p>
                  <h1 className="text-lg font-bold"> Spaghetti Bolognese </h1>
                </span>
              </div>
              <div className="text-center pt-10">
                <button className="border border-[#435334] text-[#FFF] bg-[#435334] hover:bg-[#9EB384] hover:text-[#435334] p-2">
                  ORDER NOW
                </button>
              </div>
            </div>
            <div className="bg-[#FAF1E4] p-10">
              <div className="flex flex-col items-center justify-center">
                <img src={Burger2} alt="" className="h-[200px] w-[200px]" />
                <span className="text-center space-y-2 pt-5">
                  <p className="text-[#435334] text-base font-bold">
                    &#8369; 289
                  </p>
                  <h1 className="text-lg font-bold"> Burger Bite King</h1>
                </span>
              </div>
              <div className="text-center pt-10">
                <button className="border border-[#435334] text-[#FFF] bg-[#435334] hover:bg-[#9EB384] hover:text-[#435334] p-2">
                  ORDER NOW
                </button>
              </div>
            </div>
            <div className="bg-[#FAF1E4] p-10">
              <div className="flex flex-col items-center justify-center">
                <img
                  src={Meatballs}
                  alt=""
                  className="object-cover h-[200px] w-[200px]"
                />
                <span className="text-center space-y-2 pt-5">
                  <p className="text-[#435334] text-base font-bold">
                    &#8369; 150
                  </p>
                  <h1 className="text-lg font-bold"> Meatballs Pasta</h1>
                </span>
              </div>
              <div className="text-center pt-10">
                <button className="border border-[#435334] text-[#FFF] bg-[#435334] hover:bg-[#9EB384] hover:text-[#435334] p-2">
                  ORDER NOW
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#f1f1f1]">
        {/* What we serve */}
        <div className="text-center pt-10">
          <h1 className="text-lg text-[#435334] font-semibold">
            WHAT WE SERVE
          </h1>
          <p className="text-2xl font-bold">
            Your Favorite Food <br /> Delivery Partner
          </p>
        </div>
        <div className="flex sm:flex-col lg:flex-row items-center justify-between text-center text-lg font-bold max-w-6xl mx-auto py-16">
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
      <div className="bg-[#FFF] my-14">
        {/* About Us */}
        <div className="text-center pt-10">
          <h1 className="text-lg text-[#435334] font-semibold">ABOUT US</h1>
          <p className="text-2xl font-bold">Why Choose Us?</p>
        </div>
        <div className="flex items-center justify-center">
          <div className="flex sm:flex-col lg:flex-row max-w-6xl mx-auto space-x-10">
            <div>
              <img
                src={pasta2}
                alt=""
                className="object-contain h-96 w-screen"
              />
            </div>
            <div className="space-y-5 p-10">
              <h1 className="text-3xl">Top Food Picks Across the Country</h1>
              <p className="text-lg">
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
      <div className="bg-[#f1f1f1] space-y-4">
        {/* Reviews */}
        <div className="text-center pt-10">
          <h1 className="text-lg text-[#435334] font-semibold">REVIEWS</h1>
          <p className="text-2xl font-bold">What Do Our Customer Say?</p>
        </div>
        <div className="flex items-center justify-center max-w-6xl mx-auto pt-10">
          <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 m-5">
            <div className="relative bg-[#FFF] p-6 rounded-xl">
              <span className="absolute right-4">
                <i>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill="#435334"
                      d="M5.315 3.401c-1.61 0-2.916 1.343-2.916 3c0 1.656 1.306 3 2.916 3c2.915 0 .972 5.799-2.916 5.799v1.4c6.939.001 9.658-13.199 2.916-13.199zm8.4 0c-1.609 0-2.915 1.343-2.915 3c0 1.656 1.306 3 2.915 3c2.916 0 .973 5.799-2.915 5.799v1.4c6.938.001 9.657-13.199 2.915-13.199z"
                    />
                  </svg>
                </i>
              </span>
              <div className="flex items-center justify-between py-5 space-x-5 sm:flex-col lg:flex-row sm:flex-col lg:flex-row">
                <div className="border bg-[#9EB384] rounded-full p-2">
                  <div className="border bg-[#CEDEBD] rounded-full p-2">
                    <img
                      src={Person1}
                      alt=""
                      className="object-cover object-top h-[100px] w-[100px] rounded-full"
                    />
                  </div>
                </div>
                <span>
                  <h1 className="text-lg">Emily Thompson</h1>
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
            <div className="relative bg-[#FFF] p-6 rounded-xl">
              <span className="absolute right-4">
                <i>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill="#435334"
                      d="M5.315 3.401c-1.61 0-2.916 1.343-2.916 3c0 1.656 1.306 3 2.916 3c2.915 0 .972 5.799-2.916 5.799v1.4c6.939.001 9.658-13.199 2.916-13.199zm8.4 0c-1.609 0-2.915 1.343-2.915 3c0 1.656 1.306 3 2.915 3c2.916 0 .973 5.799-2.915 5.799v1.4c6.938.001 9.657-13.199 2.915-13.199z"
                    />
                  </svg>
                </i>
              </span>
              <div className="flex items-center justify-between py-5 space-x-5 sm:flex-col lg:flex-row">
                <div className="border bg-[#9EB384] rounded-full p-2">
                  <div className="border bg-[#CEDEBD] rounded-full p-2">
                    <img
                      src={Person2}
                      alt=""
                      className="object-cover object-top h-[100px] w-[100px] rounded-full"
                    />
                  </div>
                </div>
                <span>
                  <h1 className="text-lg">David Scathieber </h1>
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
            <div className="relative bg-[#FFF] p-6 rounded-xl">
              <span className="absolute right-4">
                <i>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill="#435334"
                      d="M5.315 3.401c-1.61 0-2.916 1.343-2.916 3c0 1.656 1.306 3 2.916 3c2.915 0 .972 5.799-2.916 5.799v1.4c6.939.001 9.658-13.199 2.916-13.199zm8.4 0c-1.609 0-2.915 1.343-2.915 3c0 1.656 1.306 3 2.915 3c2.916 0 .973 5.799-2.915 5.799v1.4c6.938.001 9.657-13.199 2.915-13.199z"
                    />
                  </svg>
                </i>
              </span>
              <div className="flex items-center justify-between py-5 space-x-5 sm:flex-col lg:flex-row">
                <div className="border bg-[#9EB384] rounded-full p-2">
                  <div className="border bg-[#CEDEBD] rounded-full p-2">
                    <img
                      src={Person3}
                      alt=""
                      className="object-cover object-top h-[100px] w-[100px] rounded-full"
                    />
                  </div>
                </div>
                <span>
                  <h1 className="text-lg">William Anderson</h1>
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
            <div className="relative bg-[#FFF] p-6 rounded-xl sm:block lg:hidden">
              <span className="absolute right-4">
                <i>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill="#435334"
                      d="M5.315 3.401c-1.61 0-2.916 1.343-2.916 3c0 1.656 1.306 3 2.916 3c2.915 0 .972 5.799-2.916 5.799v1.4c6.939.001 9.658-13.199 2.916-13.199zm8.4 0c-1.609 0-2.915 1.343-2.915 3c0 1.656 1.306 3 2.915 3c2.916 0 .973 5.799-2.915 5.799v1.4c6.938.001 9.657-13.199 2.915-13.199z"
                    />
                  </svg>
                </i>
              </span>
              <div className="flex items-center justify-between py-5 space-x-5 sm:flex-col lg:flex-row">
                <div className="border bg-[#9EB384] rounded-full p-2">
                  <div className="border bg-[#CEDEBD] rounded-full p-2">
                    <img
                      src={Person4}
                      alt=""
                      className="object-cover object-top h-[100px] w-[100px] rounded-full"
                    />
                  </div>
                </div>
                <span>
                  <h1 className="text-lg">Sophia Rodriguez</h1>
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
            <div className="relative bg-[#FFF] p-6 rounded-xl sm:block lg:hidden">
              <span className="absolute right-4">
                <i>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill="#435334"
                      d="M5.315 3.401c-1.61 0-2.916 1.343-2.916 3c0 1.656 1.306 3 2.916 3c2.915 0 .972 5.799-2.916 5.799v1.4c6.939.001 9.658-13.199 2.916-13.199zm8.4 0c-1.609 0-2.915 1.343-2.915 3c0 1.656 1.306 3 2.915 3c2.916 0 .973 5.799-2.915 5.799v1.4c6.938.001 9.657-13.199 2.915-13.199z"
                    />
                  </svg>
                </i>
              </span>
              <div className="flex items-center justify-between py-5 space-x-5 sm:flex-col lg:flex-row">
                <div className="border bg-[#9EB384] rounded-full p-2">
                  <div className="border bg-[#CEDEBD] rounded-full p-2">
                    <img
                      src={Person5}
                      alt=""
                      className="object-cover object-top h-[100px] w-[100px] rounded-full"
                    />
                  </div>
                </div>
                <span>
                  <h1 className="text-lg">Michael Anderson</h1>
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
            <div className="relative bg-[#FFF] p-6 rounded-xl lg:col-start-2 md:col-end-4">
              <span className="absolute right-4">
                <i>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill="#435334"
                      d="M5.315 3.401c-1.61 0-2.916 1.343-2.916 3c0 1.656 1.306 3 2.916 3c2.915 0 .972 5.799-2.916 5.799v1.4c6.939.001 9.658-13.199 2.916-13.199zm8.4 0c-1.609 0-2.915 1.343-2.915 3c0 1.656 1.306 3 2.915 3c2.916 0 .973 5.799-2.915 5.799v1.4c6.938.001 9.657-13.199 2.915-13.199z"
                    />
                  </svg>
                </i>
              </span>
              <div className="flex items-center justify-between py-5 space-x-5 sm:flex-col lg:flex-row">
                <div className="border bg-[#9EB384] rounded-full p-2">
                  <div className="border bg-[#CEDEBD] rounded-full p-2">
                    <img
                      src={Person4}
                      alt=""
                      className="object-cover object-top h-[100px] w-[100px] rounded-full"
                    />
                  </div>
                </div>
                <span>
                  <h1 className="text-lg">Sophia Rodriguez</h1>
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
            <div className="relative bg-[#FFF] p-6 rounded-xl col-start-4 col-end-6">
              <span className="absolute right-4">
                <i>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill="#435334"
                      d="M5.315 3.401c-1.61 0-2.916 1.343-2.916 3c0 1.656 1.306 3 2.916 3c2.915 0 .972 5.799-2.916 5.799v1.4c6.939.001 9.658-13.199 2.916-13.199zm8.4 0c-1.609 0-2.915 1.343-2.915 3c0 1.656 1.306 3 2.915 3c2.916 0 .973 5.799-2.915 5.799v1.4c6.938.001 9.657-13.199 2.915-13.199z"
                    />
                  </svg>
                </i>
              </span>
              <div className="flex items-center justify-between py-5 space-x-5 sm:flex-col lg:flex-row">
                <div className="border bg-[#9EB384] rounded-full p-2">
                  <div className="border bg-[#CEDEBD] rounded-full p-2">
                    <img
                      src={Person5}
                      alt=""
                      className="object-cover object-top h-[100px] w-[100px] rounded-full"
                    />
                  </div>
                </div>
                <span>
                  <h1 className="text-lg">Michael Anderson</h1>
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
