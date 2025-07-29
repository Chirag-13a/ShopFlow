const User = require("../models/User");
const Product = require("../models/Product"); 
const jwt = require("jsonwebtoken");
const Category = require("../models/Category");
const Brand = require("../models/BrandS");
const sendEmail = require("../utils/sendEmail"); 


exports.getAllUsers = async (req, res) => {  // ye user page pe users ko show karna ka kam ate hai
  try {
    console.log("Received request to fetch all users...");
    console.log("User making request:", req.user); // Debug: Log the authenticated user
    console.log("Request headers:", req.headers); // Debug: Log request headers

    const users = await User.find();

    console.log(`Total users found: ${users.length}`);
    console.log("Users data:", users); // Debug: Log the actual users data
    res.json(users);

  } catch (err) {
    console.error(" Error fetching users:", err.message);
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
};

exports.googleSignup = async (req, res) => {   // ye api google ke through signup karna ke kam ate hai
  const { name, email, picture } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      //  Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString(); // this use to gentrate 6 digit otp and tostring use string me convert karte hai numbers ko
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min

      user = new User({
        name,
        email,
        password: null,
        role: "user",
        picture: picture || "",
        otp,
        otpExpires,
        verified: false
      });

      await user.save();

      // Send OTP via Email
      await sendEmail(
        email,
        "Google Signup OTP",
        `Hello ${name},\n\nYour OTP is: ${otp}\nIt will expire in 10 minutes.\n\n– Team E-commerce`
      );

      return res.status(201).json({
        message: "OTP sent to your email",
        email,
      });
    }

    //  If already exists, but unverified — resend OTP
    if (!user.verified) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      user.otp = otp;
      user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();

      await sendEmail(
        email,
        "Google Signup OTP (Resent)",
        `Hello ${user.name},\n\nYour OTP is: ${otp}\nIt will expire in 10 minutes.\n\n– Team E-commerce`
      );

      return res.status(200).json({
        message: "OTP resent to your email",
        email,
      });
    }

    //  If verified, login directly
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ token, user });

  } catch (err) {
    console.error("Google signup error:", err);
    res.status(500).json({ error: "Server error during Google signup." });
  }
};

exports.addCategory = async (req, res) => {  // category add karna ke kam ate hai 
  const { name } = req.body;
  let image = "";

  if (req.file) image = req.file.filename;

  const exists = await Category.findOne({ name });
  if (exists) return res.status(400).json({ message: "Category already exists" });

  const category = new Category({ name, image });
  await category.save();
  res.status(201).json(category);
};

exports.getAllCategories = async (req, res) => {  //  category show karna ke kam ate hai
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};

exports.addBrand = async (req, res) => {  // brand add karna ke kam ate hia
  const { name } = req.body;
  let image = "";

  if (req.file) image = req.file.filename;

  const exists = await Brand.findOne({ name });
  if (exists) return res.status(400).json({ message: "Brand already exists" });

  const brand = new Brand({ name, image });
  await brand.save();
  res.status(201).json(brand);
};

exports.getAllBrands = async (req, res) => {  //brands ko show karna ke kam ate hai 
  try {
    const brands = await Brand.find();
    res.json(brands);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch brands" });
  }
};


exports.addproduct = async (req, res) => {  // product add karna ke use ate hai
  const { name, category, price, brand } = req.body;
  let image = "";
  if (req.file) {
    image = req.file.filename; // Save the uploaded filename
  }
  const exists = await Product.findOne({ name });
  if (exists) return res.status(400).json({ message: "Product already exists" });

  const product = new Product({ name, category, price, brand, image });
  await product.save();
  res.status(201).json(product);
}
exports.registerUser = async (req, res) => {   // use to register new user 
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
 
    //  Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    //  Create new user with OTP fields
    const newUser = new User({
      name,
      email,
      password,
      otp,
      otpExpires,
      verified: false,
    });

    await newUser.save();

    //  Send OTP email
    await sendEmail(
      email,
      "  Email Verification",
      `Hello ${name},\n\nYour OTP is: ${otp}\nIt will expire in 10 minutes.\n\n– Team E-commerce`
    );

    res.status(201).json({
      message: "User registered, OTP sent to email.",
      email, // pass email to frontend to verify later
    });
  } catch (error) {
    console.error(" Error in registerUser:", error.message);
    
    res.status(500).json({ message: "Server error" });
  }
};
exports.verifyOtp = async (req, res) => {  // database me jo otp genrate hota hai us verify karna ke use ate hai
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: "User not found" });

  if (!user.otp || user.otp !== otp || user.otpExpires < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.verified = true;
  user.otp = null;
  user.otpExpires = null;
  await user.save();

  res.status(200).json({ message: "OTP verified successfully" });
};


exports.loginUser = async (req, res) => {   // user login karna ke use ate hai
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.password !== password) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role, 
    },
    "CHIRAG@13",
    
  );

  res.json({
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role, 
    },
  });
};


// Google Login for existing users only
exports.googleLogin = async (req, res) => {  // google ke through login karna ke kam ate hain
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "This email is not registered. Please sign up first." });
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    // Send login email
    try {
      await sendEmail(
        email,
        " Google Login Notification",
        `Hello ${user.name || "User"},\n\nYou have just logged in to your account using Google.\n\nIf this wasn't you, please secure your account.\n\n— Team E-commerce`
      );
    } catch (emailErr) {
      console.error(" Failed to send Google login email:", emailErr.message);
    }
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: "Server error during Google login." });
  }
};


// Delete a product
exports.deleteProduct = async (req, res) => {  //product delete  karna ke ka ate hain
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted", id: req.params.id });
  } catch (err) {
    console.error(" Error deleting product:", err.message);
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};


exports.deleteUser = async (req, res) => {  // user delete karna ke kam ate hain
  try {
    console.log("🗑 Deleting user with ID:", req.params.id);

    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      console.log(" No user found with this ID:", req.params.id);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User deleted successfully:", deletedUser);
    res.json({ message: "User deleted", id: req.params.id });

  } catch (err) {
    console.error("Error deleting user:", err.message);
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};


exports.updateUser = async (req, res) => {  // user ek details edit karna ke kam ate hai
  try {
    console.log("Updating", req.params.id);
    // Check if the new email already exists for another user
    const existingUser = await User.findOne({ email: req.body.email, _id: { $ne: req.params.id } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name, email: req.body.email },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};

exports.getAllProducts = async (req, res) => {  // products show krna ke kam ate hai
  try { 
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products", error: err.message });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch product", error: err.message });
  }
};


