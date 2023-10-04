import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Logo from "../assets/logo/Chicken.png";
import "../index.css";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';

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
        <span className="text-gray-700 sm:hidden lg:inline-block">|</span>
        <NavLink to="" className="text-[#435334] hover:text-[#FF785B] sm:hidden lg:inline-block">
          <FavoriteBorderIcon />
          <span className="absolute bg-[#FF785B] border font-bold rounded-full px-[8px] -mx-2 -my-2 text-[#FFF] text-[11px]">2</span>
        </NavLink>
        <NavLink to="" className="text-[#435334] hover:text-[#FF785B] sm:hidden lg:inline-block">
          <ShoppingCartOutlinedIcon />
          <span className="absolute bg-[#FF785B] border font-bold rounded-full px-[8px] -mx-2 -my-2 text-[#FFF] text-[11px]">2</span>
        </NavLink>
        <NavLink to="" className="text-[#435334] hover:text-[#FF785B] sm:hidden lg:inline-block">
          <PersonOutlineOutlinedIcon />
        </NavLink>
      </>
    );
  };

  return (
    <div className="sticky top-0 z-50 backdrop-blur-lg bg-[#FFF]/80">
      <nav>
        <div className="flex items-center justify-between py-8 max-w-7xl mx-auto px-5">
          <div>
            <NavLink to="/" onClick={scrollUp}>
              <img src={Logo} alt="" className="h-[30px] w-full" />
              {clicked ? "" : ""}
            </NavLink>
          </div>
          {/* <div className="flex space-x-8 sm:block lg:hidden">
            <NavLink to="" className="text-[#435334] sm:inline-block lg:hidden">
              <FavoriteIcon />
            </NavLink>
            <NavLink to="" className="text-[#435334] sm:inline-block lg:hidden">
              <ShoppingCartIcon />
            </NavLink>
            <NavLink to="" className="text-[#435334] sm:inline-block lg:hidden">
              <PersonIcon />
            </NavLink>
          </div> */}
          <div className="flex items-center justify-center text-base space-x-8 sm:hidden lg:block">
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
              <div className="flex absolute right-0 p-5 h-[100vh] w-[50vw] bg-[#f1f1f1]/70 max-sm:block lg:hidden">
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
