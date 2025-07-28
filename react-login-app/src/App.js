import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/login";
import Signup from "./components/signup";
import Home from "./pages/home";
import Products from "./pages/products";
import Category from "./pages/category";
import Brand from "./pages/brand";
import Cart from "./pages/cart";
import { AuthProvider } from "./context/AuthContext";
import Checkout from "./pages/checkout";
import About from "./pages/aboutus";
import AdPage from "./pages/adpage";  
import ProductDetail from "./pages/ProductDetail";
import BannerCarousel from "./components/BannerCarousel";
import ScrollToTopButton from "./components/scroll";

import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import Layout from "./components/layout";



import "./product.css";
import "./components/header.css";
import "./components/fotter.css"; 
import "./checkout.css";
import "./aboutus.css";
import "./adpage.css";
import "./components/chat.css";
import "./components/BannerCarousel.css";
import "./components/scroll.css";

function App() {
  const token = localStorage.getItem("token");

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes (No Header) */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />
          <Route
            path="/"
            element={<Navigate to={token ? "/home" : "/login"} replace />}
          />

          {/* Private Routes with Header (inside Layout) */}
          <Route
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route path="/home" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/category" element={<Category />} />
            <Route path="/brand" element={<Brand />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/aboutus" element={<About />} />
            <Route path="/adpage" element={<AdPage/>}/>
          </Route>

          {/* Fallback route */}
          <Route
            path="*"
            element={<Navigate to={token ? "/home" : "/login"} replace />}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}


export default App;
