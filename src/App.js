import React from "react";
import { Routes, Route } from "react-router-dom";
import Menu from "./Pages/Menu";
import Contact from "./Pages/Contact";
import Order from "./Pages/Order";
import About from "./Pages/About";
import User from "./Pages/User";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";

export default function App() {
  return (
    <div className="">
      <Navbar />
      {/* <HomePage /> */}
      <Routes>
        <Route exact path="/" element={<HomePage />}></Route>
        <Route exact path="/About" element={<About />}></Route>
        <Route exact path="/Menu" element={<Menu />}></Route>
        <Route exact path="/Contact" element={<Contact />}></Route>
        <Route exact path="/Order" element={<Order />}></Route>
        <Route exact path="/User" element={<User />}></Route>
      </Routes>
    </div>
  );
}
