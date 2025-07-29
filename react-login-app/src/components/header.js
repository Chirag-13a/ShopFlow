import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "./CartContext";
import { useDarkMode } from "../context/DarkModeContext";

const navLinks = [
  { to: "/adpage", label: "HOME"},
  { to: "/home", label: "USERS", adminOnly: true },
  { to: "/products", label: "PRODUCTS" },
  { to: "/category", label: "CATEGORIES" },
  { to: "/brand", label: "BRANDS" },
  { to: "/aboutus", label: "ABOUT US" },

];

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const { darkMode, setDarkMode } = useDarkMode();
  const email = localStorage.getItem("email") || "Unknown";
  const role = localStorage.getItem("role");
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  return (
    <header className="modern-header">
      <div className="header-bar" />
      <div className="header-container">
        {/* Logo */}
        <div className="logo" onClick={() => navigate('/adpage')}>
          🛒 SHOPFLOW
        </div>
        {/* Navigation */}
        <nav className="nav-links">
          {navLinks.map(link => (
            (!link.adminOnly || role === "admin") && (
              <Link
                key={link.to}
                to={link.to}
                className={location.pathname === link.to ? 'active' : ''}
              >
                {link.label}
                {location.pathname === link.to && (
                  <span />
                )}
              </Link>
            )
          ))}
        </nav>
        {/* Actions: dark mode, cart, profile, logout */}
        <div className="header-actions">
          <div className="header-icons">
            {/* Dark Mode Toggle Button */}
            <button
              className="darkmode-toggle"
              aria-label="Toggle dark mode"
              onClick={() => setDarkMode((v) => !v)}
            >
              {darkMode ? (
                // Sun icon
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
              ) : (
                // Moon icon
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"/></svg>
              )}
            </button>
            {/* Cart Icon with Badge */}
            <div className="cart-icon-container" onClick={() => navigate('/cart')}>
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#ff9900" strokeWidth="2"><circle cx="9" cy="21" r="1.5"/><circle cx="19" cy="21" r="1.5"/><path d="M2.5 3h2l2.5 13h11l2.5-8H6.5"/></svg>
              <span>{cartCount}</span>
            </div>
            {/* Profile Icon */}
            <div className="profile-container" onClick={() => setShowDropdown(!showDropdown)}>
              <span className="profile-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="8.5" r="4.5" stroke="currentColor" strokeWidth="2"/>
                  <path d="M4 20c0-2.761 3.582-5 8-5s8 2.239 8 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </span>
              {showDropdown && (
                <div className="profile-dropdown">
                  <p style={{ margin: 0, fontSize: 13 }}>Logged in as:</p>
                  <strong style={{ fontSize: 14 }}>{email}</strong>
                </div>
              )}
            </div>
          </div>
          {/* Logout Button */}
          <button
            className="logout-btn desktop-only"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("role");
              localStorage.removeItem("name");
              localStorage.removeItem("email");
              navigate("/login");
            }}
          >
            Logout
          </button>
          {/* Hamburger for mobile */}
          <button
            className="hamburger"
            aria-label="Open navigation"
            onClick={() => setMobileNav((v) => !v)}
          >
            <span className="hamburger-bar" />
            <span className="hamburger-bar" />
            <span className="hamburger-bar" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
