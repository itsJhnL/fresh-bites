import React from "react";
import { NavLink } from "react-router-dom";
import Logo from "../assets/logo/Chicken.png";
import "../index.css";

function Navbar() {
  return (
    <div className="sticky top-0 backdrop-blur-lg bg-[#FAF1E4]/80">
      <nav>
        <div className="flex items-center justify-between py-5 max-w-6xl mx-auto">
          <div className="">
            <NavLink to="/">
              {<img src={Logo} alt="" className="h-[30px] w-[100%]" />}
            </NavLink>
          </div>
          <div className="flex text-base space-x-4">
            <NavLink
              to="/"
              style={({ isActive }) => ({
                color: isActive ? "#435334" : "#000",
                borderRadius: isActive ? "5px" : "",
                paddingLeft: isActive ? "15px" : "15px",
                paddingRight: isActive ? "15px" : "15px",
                paddingTop: isActive ? "8px" : "8px",
                paddingBottom: isActive ? "8px" : "8px",
                fontWeight: isActive ? "bold" : "",
              })}
            >
              Home
            </NavLink>
            <NavLink
              to="/Menu"
              style={({ isActive }) => ({
                color: isActive ? "#435334" : "#000",
                borderRadius: isActive ? "5px" : "",
                paddingLeft: isActive ? "15px" : "15px",
                paddingRight: isActive ? "15px" : "15px",
                paddingTop: isActive ? "8px" : "8px",
                paddingBottom: isActive ? "8px" : "8px",
                fontWeight: isActive ? "bold" : "",
              })}
            >
              Menu
            </NavLink>
            <NavLink
              to="/Contact"
              style={({ isActive }) => ({
                color: isActive ? "#435334" : "#000",
                borderRadius: isActive ? "5px" : "",
                paddingLeft: isActive ? "15px" : "15px",
                paddingRight: isActive ? "15px" : "15px",
                paddingTop: isActive ? "8px" : "8px",
                paddingBottom: isActive ? "8px" : "8px",
                fontWeight: isActive ? "bold" : "",
                borderBottom: isActive ? "" : "",
              })}
            >
              Contact
            </NavLink>
            <NavLink className="p-2 bg-[#435334] rounded-md text-white">
              Order Online
            </NavLink>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
