import React, { useState, useEffect } from 'react'; // React hooks ko import kara hian
import axios from 'axios'; // axios HTTP requests ke liye use hota hai
import { useNavigate, useLocation } from 'react-router-dom'; // navigate use hota hai redirect ke liye
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
  const navigate = useNavigate(); // navigation ke liye function milta hai
  const location = useLocation(); // location state ko access karne ke liye
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });



  // Navigation intent logic: Only allow navigation if intent flag is set in location.state
  useEffect(() => {
    if (location.state && location.state.navigation_intent) {
      // Allow navigation
    } else {
      // Block navigation and go back
      navigate(-1); // Previous page
    }
  }, [navigate, location]);

  // input field me value change hone par formData update hota hai
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // form submit hone par backend se login karne ka try karte hain
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/users/login', {
        email: formData.email,
        password: formData.password
      });

      const token = res.data.token;
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role); 
      localStorage.setItem("name", res.data.user.name); 
      localStorage.setItem("email", res.data.user.email); // Store email for header

      console.log(" Login success:", res.data);
      navigate("/home", { state: { navigation_intent: true } }); // Redirect to home with intent

    } catch (err) {
      console.error(" Login failed:", err.response?.data || err.message);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={boxStyle}>
        <h2 style={headingStyle}>Login</h2>
        <form onSubmit={handleSubmit}>
          <div style={inputGroup}>
            <label htmlFor="email" style={labelStyle}>Email:</label>
            <input
              type="text"
              id="email"
              name="email"
              required
              onChange={handleChange}
              value={formData.email}
              style={inputStyle}
            />
          </div>

          <div style={inputGroup}>
            <label htmlFor="password" style={labelStyle}>Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              onChange={handleChange}
              value={formData.password}
              style={inputStyle}
            />
          </div>

          {/* Google Login Button */}
          <div style={{ margin: "20px 0", textAlign: "center" }}>
            <GoogleLogin
              text="continue_with"
              onSuccess={async (credentialResponse) => {
                const decoded = jwtDecode(credentialResponse.credential);
                try {
                  const res = await axios.post('http://localhost:5000/api/users/google-login', {
                    email: decoded.email,
                    name: decoded.name,
                    picture: decoded.picture,
                  });
                  localStorage.setItem("token", res.data.token);
                  localStorage.setItem("role", res.data.user.role);
                  localStorage.setItem("name", res.data.user.name);
                  localStorage.setItem("email", res.data.user.email);
                  navigate("/adpage", { state: { navigation_intent: true } });
                } catch (err) {
                }
              }}
              onError={() => {
              }}
            />
          </div>

          <button type="submit" style={buttonStyle}>Login</button>

          <p style={{ marginTop: "15px", textAlign: "center" }}>
            Don't have an account?{" "}
            <span onClick={() => navigate("/signup", { state: { navigation_intent: true } })} style={{ color: "#007bff", textDecoration: "none", cursor: "pointer" }}>
              Signup
            </span>
          </p>
        </form>
      </div>
     

    </div>
  );
};

export default Login;

//  Styling objects
const containerStyle = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "var(--color-bg)"
};

const boxStyle = {
  backgroundColor: "var(--color-surface)",
  padding: "40px",
  borderRadius: "10px",
  boxShadow: "0 4px 20px rgba(26,35,126,0.10)",
  width: "100%",
  maxWidth: "400px"
};

const headingStyle = {
  textAlign: "center",
  marginBottom: "25px",
  color: "var(--color-primary)"
};

const inputGroup = {
  marginBottom: "20px"
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontWeight: "bold",
  color: "var(--color-text)"
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  fontSize: "16px",
  borderRadius: "8px",
  border: "1.5px solid var(--color-border)",
  outline: "none",
  background: "var(--color-bg)",
  color: "var(--color-text)"
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  fontSize: "16px",
  backgroundColor: "var(--color-primary)",
  color: "var(--color-surface)",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: 600,
  transition: "0.3s"
};
