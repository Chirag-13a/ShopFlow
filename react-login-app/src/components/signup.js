import React, { useState } from "react"; // react ke hooks ko import kar rahe hain
import axios from "axios"; //axios ek libarary hai jo HTTP requests ko handle karne ke liye use hoti hai
import { useNavigate } from "react-router-dom"; // ye jab submit button par click karte hain to redirect karta hai home page par uske liya use ata hain
import { GoogleLogin } from "@react-oauth/google"; // google sign in component import kar rahe hain
import { jwtDecode } from "jwt-decode"; // jwt token ko decode karne ke liye use hota hai
import OtpModal from "../components/OtpModels";
const Signup = () => {
  const navigate = useNavigate(); // ye ek hook hai jo humein navigation ke liye function deta hai

  const [formData, setFormData] = useState({   // useState hook ka use kar rahe hain data ko store karne ke liye
    username: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {  // matlab ye data ko input field se le raha hai aur formData ko update kar raha hai
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("http://localhost:5000/api/users/signup", {
      name: formData.username,
      email: formData.email,
      password: formData.password
    });

    console.log("Signup success:", res.data);

    //  Show OTP modal after signup
    setUserEmailForOtp(res.data.email);
    setShowOtpModal(true);

  } catch (err) {
    console.error("Signup failed:", err.response?.data || err.message);
  }
};



const [showOtpModal, setShowOtpModal] = useState(false);
const [userEmailForOtp, setUserEmailForOtp] = useState("");

const handleGoogleSignup = async (credentialResponse) => {
  try {
    const decoded = jwtDecode(credentialResponse.credential);

    const res = await axios.post("http://localhost:5000/api/users/google-signup", {
      name: decoded.name,
      email: decoded.email,
      picture: decoded.picture
    });

    //  If OTP was sent, show OTP modal
    if (res.data.message.includes("OTP")) {
      setUserEmailForOtp(res.data.email);
      setShowOtpModal(true);
      return; // wait for OTP verification first
    }

    //  If token received directly (already verified)
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("name", res.data.user.name);
      localStorage.setItem("email", res.data.user.email);
      localStorage.setItem("role", res.data.user.role);

      navigate("/home", { state: { navigation_intent: true } });
    }
  } catch (err) {
    console.error("Google Signup Failed:", err.response?.data || err.message);
  }
};



 return (
  <div style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "var(--color-bg)"
  }}>
    <form onSubmit={handleSubmit} style={{
      backgroundColor: "var(--color-surface)",
      padding: "30px",
      borderRadius: "10px",
      boxShadow: "0 0 10px rgba(26,35,126,0.08)",
      width: "350px"
    }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px", color: "var(--color-primary)" }}>Signup</h1>

      <div style={{ marginBottom: "15px" }}>
        <label htmlFor="username" style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "var(--color-text)" }}>Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          required
          onChange={handleChange}
          value={formData.username}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            border: "1.5px solid var(--color-border)",
            background: "var(--color-bg)",
            color: "var(--color-text)"
          }}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label htmlFor="email" style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "var(--color-text)" }}>Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          onChange={handleChange}
          value={formData.email}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            border: "1.5px solid var(--color-border)",
            background: "var(--color-bg)",
            color: "var(--color-text)"
          }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="password" style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "var(--color-text)" }}>Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          required
          onChange={handleChange}
          value={formData.password}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            border: "1.5px solid var(--color-border)",
            background: "var(--color-bg)",
            color: "var(--color-text)"
          }}
        />
      </div>

      <button type="submit" style={{
        width: "100%",
        padding: "12px",
        backgroundColor: "var(--color-primary)",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        fontWeight: "bold",
        cursor: "pointer"
      }}>
        Signup
      </button>

      {/* Google Sign-In button */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <GoogleLogin
          onSuccess={handleGoogleSignup}
          onError={() => {
            console.log("Google Signup Failed");
          }}
        />
      </div>

      <p style={{ marginTop: "15px", textAlign: "center" }}>
        Already have an account?{" "}
        <span
          onClick={() => navigate("/login", { state: { navigation_intent: true } })}
          style={{ color: "var(--color-accent)", textDecoration: "none", cursor: "pointer" }}
        >
          Login
        </span>
      </p>
    </form>
    {showOtpModal && (
  <OtpModal
    email={userEmailForOtp}
    onClose={() => setShowOtpModal(false)}
    onVerified={() => {
      setShowOtpModal(false);
      navigate("/login");
    }}
  />
)}

  </div>
);
};

export default Signup;
