const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
require("dotenv").config(); // Load environment variables from .env file
require("dotenv").config();
console.log("SMTP_USER:", process.env.SMTP_USER);

require("./config/passport"); // Load Google OAuth config

const app = express();

//  Middleware
app.use(cors({
  origin: "http://localhost:3000", // frontend origin
  credentials: true // allow session cookie to be sent
}));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

//  Session setup (for Google login persistence)
app.use(session({
  secret: "your-secret-key", // should be in .env for production
  resave: false,
  saveUninitialized: true,
}));

//  Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

//  MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/userdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once("open", () => console.log("MongoDB connected"));

//  Routes
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes); // <-- Google Auth routes

//  Test route
app.get("/", (req, res) => res.send("API is running"));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
