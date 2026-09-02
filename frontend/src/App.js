import React from "react";
import { Routes, Route } from "react-router-dom";
import Menu from "./Pages/Menu";
import FoodDetails from "./Pages/FoodDetails";
import Cart from "./Pages/Cart";
import Contact from "./Pages/Contact";
import Order from "./Pages/Order";
import OrderConfirmation from "./Pages/OrderConfirmation";
import OrderTracking from "./Pages/OrderTracking";
import Orders from "./Pages/Orders";
import OrderDetails from "./Pages/OrderDetails";
import Profile from "./Pages/Profile";
import About from "./Pages/About";
import User from "./Pages/User";
import RegisterPage from "./Pages/RegisterPage";
import ForgotPasswordPage from "./Pages/ForgotPasswordPage";
import ResetPasswordPage from "./Pages/ResetPasswordPage";
import NotFound404 from "./Pages/NotFound404";
import AdminDashboard from "./Pages/admin/AdminDashboard";
import AdminOrders from "./Pages/admin/AdminOrders";
import AdminMenuManager from "./Pages/admin/AdminMenuManager";
import AdminCategories from "./Pages/admin/AdminCategories";
import AdminUsers from "./Pages/admin/AdminUsers";
import AdminSettings from "./Pages/admin/AdminSettings";
import AdminLogin from "./Pages/admin/AdminLogin";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import AdminLayout from "./components/admin/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";
import ScrollButton from "./components/ScrollButton";

export default function App() {
  return (
    <AuthProvider>
      <div>
        <Navbar />
        <ScrollButton />
        <main>
          <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/About" element={<About />}></Route>
          <Route path="/Menu" element={<Menu />}></Route>
          <Route path="/Menu/:slug" element={<FoodDetails />}></Route>
          <Route path="/Cart" element={<Cart />}></Route>
          <Route path="/Contact" element={<Contact />}></Route>
          <Route
            path="/Order"
            element={
              <ProtectedRoute>
                <Order />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/order-confirmation/:orderNumber"
            element={
              <ProtectedRoute>
                <OrderConfirmation />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/orders/:id/track"
            element={
              <ProtectedRoute>
                <OrderTracking />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <OrderDetails />
              </ProtectedRoute>
            }
          ></Route>
          <Route path="/User" element={<User />}></Route>
          <Route path="/Register" element={<RegisterPage />}></Route>
          <Route path="/ForgotPassword" element={<ForgotPasswordPage />}></Route>
          <Route path="/ResetPassword" element={<ResetPasswordPage />}></Route>
          <Route path="/admin/login" element={<AdminLogin />}></Route>
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />}></Route>
            <Route path="orders" element={<AdminOrders />}></Route>
            <Route path="menu" element={<AdminMenuManager />}></Route>
            <Route path="categories" element={<AdminCategories />}></Route>
            <Route path="users" element={<AdminUsers />}></Route>
            <Route path="settings" element={<AdminSettings />}></Route>
          </Route>
          <Route path="*" element={<NotFound404 />}></Route>
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}
