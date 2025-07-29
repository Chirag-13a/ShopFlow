// middleware/auth.js
const jwt = require("jsonwebtoken"); // Import the jsonwebtoken library

const authMiddleware = (req, res, next) => { //ye middleware hai jo har request se pehle chalega, it also checks the request is vlid or not 
  console.log("Auth middleware called"); // Debug: Log when middleware is called
  const authHeader = req.headers.authorization;  // It tries to get the token from the Authorization header in the request.
  console.log("Auth header:", authHeader); // Debug: Log the auth header

  //  No token found
  if (!authHeader || !authHeader.startsWith("Bearer ")) {  // this check for the header ir there or not 
    console.log("No valid auth header found"); // Debug: Log when no valid header
    return res.status(401).json({ message: "Access denied. No token provided." }); // if there no header ,then user didnt send a token
  }

  const token = authHeader.split(" ")[1];
  console.log("Token extracted:", token ? "Token exists" : "No token"); // Debug: Log token extraction

  try {
    const decoded = jwt.verify(token, "CHIRAG@13"); // THIS TRIES TO VERFIY THE TOKEN USING THE SECRET KEY
    console.log("Token verified successfully, user:", decoded); // Debug: Log successful verification
    req.user = decoded; // IF THE TOKEN IS VALID, IT DECODES THE TOKEN AND ATTACHES THE USER DATA TO THE REQUEST OBJECT
    next(); //  Continue to route handler
  } catch (err) {
    console.log("Token verification failed:", err.message); // Debug: Log verification failure
    res.status(401).json({ message: "Invalid or expired token" }); // IF THE TOKEN IS INVALID OR EXPIRED, IT RETURNS AN ERROR RESPONSE
  }
};

module.exports = authMiddleware;
