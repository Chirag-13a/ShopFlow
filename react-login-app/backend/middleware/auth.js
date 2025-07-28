// middleware/auth.js
const jwt = require("jsonwebtoken"); // Import the jsonwebtoken library

const authMiddleware = (req, res, next) => { //ye middleware hai jo har request se pehle chalega, it also checks the request is vlid or not 
  const authHeader = req.headers.authorization;  // It tries to get the token from the Authorization header in the request.

  //  No token found
  if (!authHeader || !authHeader.startsWith("Bearer ")) {  // this check for the header ir there or not 
    return res.status(401).json({ message: "Access denied. No token provided." }); // if there no header ,then user didnt send a token
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "CHIRAG@13"); // THIS TRIES TO VERFIY THE TOKEN USING THE SECRET KEY
    req.user = decoded; // IF THE TOKEN IS VALID, IT DECODES THE TOKEN AND ATTACHES THE USER DATA TO THE REQUEST OBJECT
    next(); //  Continue to route handler
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" }); // IF THE TOKEN IS INVALID OR EXPIRED, IT RETURNS AN ERROR RESPONSE
  }
};

module.exports = authMiddleware;
