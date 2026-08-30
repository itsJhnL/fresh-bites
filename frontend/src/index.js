import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { ShopProvider } from "./context/ShopContext";
// import Maintenance from "./Pages/maintenance";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <CartProvider>
      <ShopProvider>
        <App />
      </ShopProvider>
    </CartProvider>
    {/* <Maintenance /> */}
  </BrowserRouter>
);
