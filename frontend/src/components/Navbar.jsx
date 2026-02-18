import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "../assets/logo/Chicken.png";
import "../index.css";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { useShop } from "../context/ShopContext";

function Navbar() {
  const [clicked, setClicked] = useState();
  const { favoritesCount, cartCount } = useShop();

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
        <NavLink
          to="/Menu?view=favorites"
          onClick={scrollUp}
          className="text-[#435334] hover:text-[#FF785B] sm:hidden lg:inline-block"
        >
          <FavoriteBorderIcon />
          <span className="absolute bg-[#FF785B] border font-bold rounded-full px-[9px] -mx-2 -my-2 text-[#FFF] text-[11px]">
            {favoritesCount}
          </span>
        </NavLink>
        <NavLink
          to="/Menu?view=cart"
          onClick={scrollUp}
          className="text-[#435334] hover:text-[#FF785B] sm:hidden lg:inline-block"
        >
          <ShoppingCartOutlinedIcon />
          <span className="absolute bg-[#FF785B] border font-bold rounded-full px-[9px] -mx-2 -my-2 text-[#FFF] text-[11px]">
            {cartCount}
          </span>
        </NavLink>
        <NavLink
          to="/User"
          onClick={scrollUp}
          className="text-[#435334] hover:text-[#FF785B] sm:hidden lg:inline-block"
        >
          <PersonOutlineOutlinedIcon />
        </NavLink>
      </>
    );
  };

  return (
    <div className="sticky top-0 z-50 backdrop-blur-lg bg-[#FFF]/80">
      <nav>
        <div className="flex items-center justify-between py-6 max-w-7xl mx-auto px-5">
          <div>
            <NavLink to="/" onClick={scrollUp}>
              <img
                src={Logo}
                alt=""
                className="h-[30px] w-full sm:hidden md:block "
              />
              {clicked ? "" : ""}
            </NavLink>
          </div>
          <div className="flex items-center justify-center text-base space-x-8 sm:hidden lg:block">
            <NavLinks />
          </div>
          <div className="flex sm:blocok lg:hidden">
            <motion.button
              type="button"
              onClick={showNav}
              whileTap={{ scale: 0.92 }}
              className="rounded-lg p-1"
              aria-label="Toggle menu"
            >
              <motion.div
                animate={nav ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                className="mb-1 h-[2px] w-6 bg-[#1f2937]"
              />
              <motion.div
                animate={nav ? { opacity: 0 } : { opacity: 1 }}
                className="mb-1 h-[2px] w-6 bg-[#1f2937]"
              />
              <motion.div
                animate={nav ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                className="h-[2px] w-6 bg-[#1f2937]"
              />
            </motion.button>
          </div>
        </div>
        <AnimatePresence>
          {nav && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute h-[100vh] w-[100vw] backdrop-blur-sm bg-white/30"
            >
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="absolute right-0 h-[100vh] w-[65vw] bg-[#f1f1f1]/90 p-5 max-sm:block lg:hidden"
              >
                <div className="flex flex-col space-y-4" onClick={showNav}>
                  <NavLinks />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
}

export default Navbar;
