import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Logo from "../assets/logo/Chicken.png";
import "../index.css";

function Navbar() {
  const [clicked, setClicked] = useState();

  const scrollUp = () => {
    window.scrollTo({
      top: 0,
      behavior: "auto",
    });
    setClicked(true);
  };

  const [nav, setNav] = useState();

  const showNav = () => {
    setNav(!nav);
  };

  const NavLinks = () => {
    return (
      <>
        <NavLink
          to="/"
          onClick={scrollUp}
          style={({ isActive }) => ({
            color: isActive ? "#435334" : "#00213F",
            fontWeight: isActive ? "bold" : "bold",
            borderBottom: isActive ? "solid 3px" : "",
          })}
        >
          {clicked ? "Home" : "Home"}
        </NavLink>
        <NavLink
          to="/Menu"
          onClick={scrollUp}
          style={({ isActive }) => ({
            color: isActive ? "#435334" : "#00213F",
            fontWeight: isActive ? "bold" : "bold",
            borderBottom: isActive ? "solid 3px" : "",
          })}
        >
          {clicked ? "Menu" : "Menu"}
        </NavLink>
        <NavLink
          to="/Contact"
          onClick={scrollUp}
          style={({ isActive }) => ({
            color: isActive ? "#435334" : "#00213F",
            fontWeight: isActive ? "bold" : "bold",
            borderBottom: isActive ? "solid 3px" : "",
          })}
        >
          {clicked ? "Contact" : "Contact"}
        </NavLink>
        {/*  <NavLink to="" className="text-[#435334]">
          <i>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M12 12q-1.65 0-2.825-1.175T8 8q0-1.65 1.175-2.825T12 4q1.65 0 2.825 1.175T16 8q0 1.65-1.175 2.825T12 12Zm-8 8v-2.8q0-.85.438-1.563T5.6 14.55q1.55-.775 3.15-1.163T12 13q1.65 0 3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2V20H4Z"
              />
            </svg>
          </i>
        </NavLink> */}
      </>
    );
  };

  return (
    <div className="sticky top-0 z-50 backdrop-blur-lg bg-[#FFF]/80">
      <nav>
        <div className="flex items-center justify-between py-8 max-w-7xl mx-auto px-5">
          <div className="">
            <NavLink to="/" onClick={scrollUp}>
              <img src={Logo} alt="" className="h-[30px] w-full" />
              {clicked ? "" : ""}
            </NavLink>
          </div>
          <div className="flex items-center justify-center text-base space-x-10 sm:hidden lg:block">
            <NavLinks />
          </div>
          <div className="flex sm:blocok lg:hidden">
            <button onClick={showNav}>
              <i>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              </i>
            </button>
          </div>
        </div>
        {nav && (
          <>
            <div className="absolute h-[100vh] w-[100vw] backdrop-blur-sm bg-white/30">
              <div className="flex absolute right-0 p-5 h-[100vh] w-[25vw] bg-[#f1f1f1]/70 max-sm:block lg:hidden">
                <button className="flex flex-col space-y-4" onClick={showNav}>
                  {nav ? <NavLinks /> : ""}
                </button>
              </div>
            </div>
          </>
        )}
      </nav>
    </div>
  );
}

export default Navbar;
