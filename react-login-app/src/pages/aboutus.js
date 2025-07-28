import React, { useEffect, useState } from "react";


const About = () => {
  // Removed local darkMode state and useEffect
  return (
    <div className="about-container">
      <div className="about-hero">
        <h1>About Us</h1>
        <p>Your one-stop destination for quality and value.</p>
      </div>

      <div className="about-welcome">
        <h2>Welcome to <span>INVENTORY</span></h2>
        <p>
          At <strong>INVENTORY</strong>, we believe shopping should be easy, enjoyable, and secure. 
          Whether you're looking for the latest trends, daily essentials, or exclusive finds, our mission 
          is to bring you a carefully curated selection of products that match your lifestyle and budget.
        </p>
      </div>

      <div className="about-grid">
        <div className="about-card">
          <h3>Who We Are</h3>
          <p>
            We are a team of passionate individuals committed to redefining online shopping. 
            What started as a small idea has now grown into a trusted platform loved by customers across the country.
          </p>
        </div>

        <div className="about-card">
          <h3>What We Offer</h3>
          <ul>
            <li>✅ A wide range of products across multiple categories</li>
            <li>✅ Trusted brands and verified sellers</li>
            <li>✅ Fast shipping and easy returns</li>
            <li>✅ Secure payments and 24/7 support</li>
          </ul>
        </div>

        <div className="about-card">
          <h3>Our Mission</h3>
          <p>
            To provide every customer with a trustworthy, user-friendly, and satisfying online shopping experience.
          </p>
        </div>

        <div className="about-card">
          <h3>Why Choose Us?</h3>
          <ul>
            <li>💡 Customer-first approach</li>
            <li>🔒 Secure shopping environment</li>
            <li>🚚 Fast and reliable delivery</li>
            <li>📞 24/7 dedicated customer support</li>
          </ul>
        </div>
      </div>

      <div className="about-footer">
        <p>
          Thank you for choosing <strong>INVENTORY</strong>. 
          Stay connected and explore more amazing products with us!
        </p>
      </div>
    </div>
  );
};

export default About;
