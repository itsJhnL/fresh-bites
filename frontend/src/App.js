import React from "react";
import { Routes, Route } from "react-router-dom";
import Menu from "./Pages/Menu";
import Contact from "./Pages/Contact";
import Order from "./Pages/Order";
import About from "./Pages/About";
import User from "./Pages/User";
import NotFound404 from "./Pages/NotFound404";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import "./App.css";
import ScrollButton from "./components/ScrollButton";

// import styled from "styled-components";
//Node version 22 fixed

export default function App() {
  return (
    <div>
      <Navbar />
      <ScrollButton />
      {/* <HomePage /> */}
      <Routes>
        <Route exact path="/" element={<HomePage />}></Route>
        <Route exact path="/About" element={<About />}></Route>
        <Route exact path="/Menu" element={<Menu />}></Route>
        <Route exact path="/Contact" element={<Contact />}></Route>
        <Route exact path="/Order" element={<Order />}></Route>
        <Route exact path="/User" element={<User />}></Route>
        <Route path="*" element={<NotFound404 />}></Route>
      </Routes>
    </div>
  );
}
