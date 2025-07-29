import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-col">
          <h4>Get to Know Us</h4>
          <Link to="/aboutus">About Us</Link>
          <a href="#">Careers</a>
          <a href="#">Press Releases</a>
        </div>
        <div className="footer-col">
          <h4>Connect with Us</h4>
          <a href="https://www.facebook.com/profile.php?id=100024267704371">Facebook</a>
          <a href="https://x.com/chiraga42101423">Twitter</a>
          <a href="https://www.instagram.com/chirag.agarwal.13/">Instagram</a>
        </div>
        <div className="footer-col">
          <h4>Make Money with Us</h4>
          <a href="#">Sell on Inventory</a>
          <a href="#">Advertise Your Products</a>
          <a href="#">Become an Affiliate</a>
        </div>
        <div className="footer-col">
          <h4>Let Us Help You</h4>
          <Link to="/products">Your Orders</Link>
          <a href="#">Shipping Rates</a>
          <Link to="/aboutus">Help</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-logo"><Link to="/adpage">🛒 SHOPFLOW</Link></div>
        <div className="footer-copy">&copy; {new Date().getFullYear()} All rights reserved.</div>
      </div>
    </footer>
  );
};

export default Footer;
