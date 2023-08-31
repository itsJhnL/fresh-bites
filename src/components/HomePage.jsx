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
import pasta2 from "../assets/images/pasta2.png";
import Pasta from "../assets/images/pasta.png";
import Pizza3 from "../assets/images/pizza3.png";
import Burger2 from "../assets/images/burger2.png";
import Order from "../assets/svg/Order.png";
import OnTheWay from "../assets/svg/OnTheWay.png";
import Delivered from "../assets/svg/Delivered.png";
import Pic from "../assets/pic.jpg";

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
      <div className="bg-[#CEDEBD] py-16">
        {/* Best Selling Dishes */}
        <div className="text-center pb-10">
          <h1 className="text-lg text-[#435334] font-semibold">SPECIALTIES</h1>
          <p className="text-2xl font-bold">Our Best Selling</p>
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
              <button className="border border-[#435334] text-[#435334] hover:bg-[#435334] hover:text-[#FFF] p-2">
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
              <button className="border border-[#435334] text-[#435334] hover:bg-[#435334] hover:text-[#FFF] p-2">
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
              <button className="border border-[#435334] text-[#435334] hover:bg-[#435334] hover:text-[#FFF] p-2">
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
              <button className="border border-[#435334] text-[#435334] hover:bg-[#435334] hover:text-[#FFF] p-2">
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
              <button className="border border-[#435334] text-[#435334] hover:bg-[#435334] hover:text-[#FFF] p-2">
                ORDER NOW
              </button>
            </div>
            <div className="flex flex-col items-center justify-center bg-[#FAF1E4] p-10 space-y-5">
              <img src={Pizza} alt="" className="h-[200px] w-[200px]" />
              <span className="text-center">
                <p className="text-[#435334] text-base font-bold">
                  &#8369; 160
                </p>
                <h1 className="text-lg font-bold"> Chicken NOKNOK</h1>
              </span>
              <button className="border border-[#435334] text-[#435334] hover:bg-[#435334] hover:text-[#FFF] p-2">
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
              <button className="border border-[#435334] text-[#435334] hover:bg-[#435334] hover:text-[#FFF] p-2">
                ORDER NOW
              </button>
            </div>
            <div className="flex flex-col items-center justify-center bg-[#FAF1E4] p-10 space-y-5">
              <img src={Burger2} alt="" className="h-[200px] w-[200px]" />
              <span className="text-center">
                <p className="text-[#435334] text-base font-bold">
                  &#8369; 160
                </p>
                <h1 className="text-lg font-bold"> Chicken NOKNOK</h1>
              </span>
              <button className="border border-[#435334] text-[#435334] hover:bg-[#435334] hover:text-[#FFF] p-2">
                ORDER NOW
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#F1f1f1]">
        {/* What we serve */}
        <div className="text-center pt-10">
          <h1 className="text-lg text-[#435334] font-semibold">
            WHAT WE SERVE
          </h1>
          <p className="text-2xl font-bold">
            Your Favorite Food <br /> Delivery Partner
          </p>
        </div>
        <div className="flex items-center justify-between text-center text-lg font-bold max-w-6xl mx-auto py-16">
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
      <div className="bg-[#FFF]">
        {/* About Us */}
        <div className="text-center pt-10">
          <h1 className="text-lg text-[#435334] font-semibold">ABOUT US</h1>
          <p className="text-2xl font-bold">Why Choose Us?</p>
        </div>
        <div className="flex items-center justify-center">
          <div className="flex text-justify max-w-6xl mx-auto space-x-10">
            <div>
              <img
                src={pasta2}
                alt=""
                className="object-contain h-96 w-screen"
              />
            </div>
            <div className="space-y-5 pt-10">
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
      <div className="bg-[#f1f1f1]">
        {/* Reviews */}
        <div className="text-center pt-10">
          <h1 className="text-lg text-[#435334] font-semibold">REVIEWS</h1>
          <p className="text-2xl font-bold">What They Say?</p>
        </div>
        <div className="flex items-center justify-center max-w-6xl mx-auto py-10">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#FFF] p-10 rounded-xl">
              <span className="float-right">
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
              <div className="flex items-center justify-between py-5">
                <div className="drop-shadow-md">
                  <img
                    src={Pic}
                    alt=""
                    className="object-fit h-[100px] w-[100px] rounded-full"
                  />
                </div>
                <span>
                  <h1 className="text-lg">John Leo Bruno</h1>
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
            <div className="bg-[#FFF] p-10 rounded-xl">
              <span className="float-right">
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
              <div className="flex items-center justify-between py-5">
                <div className="drop-shadow-md">
                  <img
                    src={Pic}
                    alt=""
                    className="object-fit h-[100px] w-[100px] rounded-full"
                  />
                </div>
                <span>
                  <h1 className="text-lg">John Leo Bruno</h1>
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
            <div className="bg-[#FFF] p-10 rounded-xl">
              <span className="float-right">
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
              <div className="flex items-center justify-between py-5">
                <div className="drop-shadow-md">
                  <img
                    src={Pic}
                    alt=""
                    className="object-fit h-[100px] w-[100px] rounded-full"
                  />
                </div>
                <span>
                  <h1 className="text-lg">John Leo Bruno</h1>
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
            <div className="bg-[#FFF] p-10 rounded-xl">
              <span className="float-right">
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
              <div className="flex items-center justify-between py-5">
                <div className="drop-shadow-md">
                  <img
                    src={Pic}
                    alt=""
                    className="object-fit h-[100px] w-[100px] rounded-full"
                  />
                </div>
                <span>
                  <h1 className="text-lg">John Leo Bruno</h1>
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
            <div className="bg-[#FFF] p-10 rounded-xl">
              <span className="float-right">
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
              <div className="flex items-center justify-between py-5">
                <div className="drop-shadow-md">
                  <img
                    src={Pic}
                    alt=""
                    className="object-fit h-[100px] w-[100px] rounded-full"
                  />
                </div>
                <span>
                  <h1 className="text-lg">John Leo Bruno</h1>
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
    </div>
  );
}

export default HomePage;
