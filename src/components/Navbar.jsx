import React from "react";
import { NavLink } from "react-router-dom";
import Logo from "../assets/logo/Chicken.png";
import "../index.css";

function Navbar() {

  return (
    <div className="">
      <header className="flex items-center justify-between py-8 max-w-6xl mx-auto">
        <div className="">
          <NavLink to="/" /* style={navName} */>
            {<img src={Logo} alt="" className="h-[30px] w-[100%]" />}
            {/* Fresh Bites */}
          </NavLink>
        </div>
        <div className="flex text-base font-semibold space-x-4">
          <NavLink
            to="/"
            style={({ isActive }) => ({
              color: isActive ? "#FFF" : "",
              background: isActive ? "#667B68" : "",
              borderRadius: isActive ? "100px" : "",
              paddingLeft: isActive ? "15px" : "15px",
              paddingRight: isActive ? "15px" : "15px",
              paddingTop: isActive ? "8px" : "8px",
              paddingBottom: isActive ? "8px" : "8px",
            })}
          >
            Home
          </NavLink>

          {/* <NavLink
            to="/About"
            style={({ isActive }) => ({
              color: isActive ? "#FFF" : "",
              background: isActive ? "#667B68" : "",
              borderRadius: isActive ? "100px" : "",
              paddingLeft: isActive ? "15px" : "15px",
              paddingRight: isActive ? "15px" : "15px",
              paddingTop: isActive ? "8px" : "8px",
              paddingBottom: isActive ? "8px" : "8px",
            })}
          >
            About
          </NavLink> */}

          <NavLink
            to="/Menu"
            style={({ isActive }) => ({
              color: isActive ? "#FFF" : "",
              background: isActive ? "#667B68" : "",
              borderRadius: isActive ? "100px" : "",
              paddingLeft: isActive ? "15px" : "15px",
              paddingRight: isActive ? "15px" : "15px",
              paddingTop: isActive ? "8px" : "8px",
              paddingBottom: isActive ? "8px" : "8px",
            })}
          >
            Menu
          </NavLink>

          <NavLink
            to="/Contact"
            style={({ isActive }) => ({
              color: isActive ? "#FFF" : "",
              background: isActive ? "#667B68" : "",
              borderRadius: isActive ? "100px" : "",
              paddingLeft: isActive ? "15px" : "15px",
              paddingRight: isActive ? "15px" : "15px",
              paddingTop: isActive ? "8px" : "8px",
              paddingBottom: isActive ? "8px" : "8px",
            })}
          >
            Contact
          </NavLink>

          <NavLink className="py-2 px-5 bg-[#667b68] rounded-full text-white">
            Order Online
          </NavLink>

          {/* <li>
              <NavLink to="/User" className="text-[#667b68]">
                <i>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="currentColor"
                      d="M332.64 64.58C313.18 43.57 286 32 256 32c-30.16 0-57.43 11.5-76.8 32.38c-19.58 21.11-29.12 49.8-26.88 80.78C156.76 206.28 203.27 256 256 256s99.16-49.71 103.67-110.82c2.27-30.7-7.33-59.33-27.03-80.6ZM432 480H80a31 31 0 0 1-24.2-11.13c-6.5-7.77-9.12-18.38-7.18-29.11C57.06 392.94 83.4 353.61 124.8 326c36.78-24.51 83.37-38 131.2-38s94.42 13.5 131.2 38c41.4 27.6 67.74 66.93 76.18 113.75c1.94 10.73-.68 21.34-7.18 29.11A31 31 0 0 1 432 480Z"
                    />
                  </svg>
                </i>
              </NavLink>
            </li> */}
        </div>
      </header>
    </div>
  );
}

export default Navbar;
