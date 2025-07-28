
import React, { useState } from "react";
import axios from "axios";

const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0,0,0,0.35)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalBoxStyle = {
  background: "var(--color-surface)",
  borderRadius: "16px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
  padding: "32px 28px 24px 28px",
  minWidth: 340,
  maxWidth: 380,
  width: "90%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  position: "relative",
};

const inputStyle = {
  width: "100%",
  padding: "12px 10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: 18,
  margin: "18px 0 8px 0",
  outline: "none",
  textAlign: "center",
  letterSpacing: 4,
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "none",
  background: "var(--color-primary)",
  color: "var(--color-surface)",
  fontWeight: 600,
  fontSize: 16,
  marginTop: 10,
  cursor: "pointer",
  transition: "background 0.2s",
};

const closeBtnStyle = {
  ...buttonStyle,
  background: "var(--color-bg)",
  color: "var(--color-text)",
  marginTop: 8,
  border: "1px solid var(--color-border)",
};

const errorStyle = {
  color: "var(--color-danger)",
  background: "var(--color-surface)",
  borderRadius: 6,
  padding: "6px 10px",
  margin: "8px 0 0 0",
  fontSize: 15,
  width: "100%",
  textAlign: "center",
};

const OtpModal = ({ email, onClose, onVerified }) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleVerify = async () => {
    try {
      await axios.post("http://localhost:5000/api/users/verify-otp", {
        email,
        otp,
      });
      onVerified();
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalBoxStyle}>
        <h2 style={{marginBottom: 6, fontWeight: 700, fontSize: 24, color: '#222'}}>Enter OTP</h2>
        <p style={{margin: 0, color: '#555', fontSize: 15, textAlign: 'center'}}>OTP sent to <strong>{email}</strong></p>
        <input
          type="text"
          value={otp}
          maxLength="6"
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter 6-digit OTP"
          style={inputStyle}
        />
        {error && <div style={errorStyle}>{error}</div>}
        <button style={buttonStyle} onClick={handleVerify}>Verify</button>
        <button style={closeBtnStyle} onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default OtpModal;
