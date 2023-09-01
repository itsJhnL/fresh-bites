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

  return (
    <div className="shadow sticky top-0 backdrop-blur-lg bg-[#FAF1E4]/80">
      <nav>
        <div className="flex items-center justify-between py-5 max-w-6xl mx-auto">
          <div className="">
            <NavLink to="/" onClick={scrollUp}>
              {<img src={Logo} alt="" className="h-[30px] w-full" />}
              {clicked ? "" : ""}
            </NavLink>
          </div>
          <div className="flex items-center justify-center text-base space-x-10">
            <NavLink
              to="/"
              onClick={scrollUp}
              style={({ isActive }) => ({
                color: isActive ? "#435334" : "#000",
                fontWeight: isActive ? "bold" : "",
                borderBottom: isActive ? "solid 3px" : "",
              })}
            >
              {clicked ? "Home" : "Home"}
            </NavLink>
            <NavLink
              to="/Menu"
              onClick={scrollUp}
              style={({ isActive }) => ({
                color: isActive ? "#435334" : "#000",
                fontWeight: isActive ? "bold" : "",
                borderBottom: isActive ? "solid 3px" : "",
              })}
            >
              {clicked ? "Menu" : "Menu"}
            </NavLink>
            <NavLink
              to="/Contact"
              onClick={scrollUp}
              style={({ isActive }) => ({
                color: isActive ? "#435334" : "#000",
                fontWeight: isActive ? "bold" : "",
                borderBottom: isActive ? "solid 3px" : "",
              })}
            >
              {clicked ? "Contact" : "Contact"}
            </NavLink>
            <NavLink to="" className="text-[#435334]">
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
            </NavLink>
            {/* <NavLink>
              <i></i>
            </NavLink> */}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
