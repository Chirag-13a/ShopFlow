const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const multer = require("multer");
const verifyAdmin = require("../middleware/verifyAdmin");
const sendEmail = require("../utils/sendEmail");

const {
  registerUser,
  loginUser,
  getAllUsers,
  deleteUser,
  updateUser,
  addproduct,
  getAllProducts,
  deleteProduct,
  getAllCategories,
  addCategory,
  getAllBrands,
  addBrand,
  googleSignup,
  googleLogin,
  verifyOtp,
  getProductById
} = require("../controllers/userController");


router.get("/test-email", async (req, res) => {
  try {
    await sendEmail(process.env.SENDER_EMAIL, "Test Email", "This is a test from Chirag's app.");
    console.log("Test email sent successfully");
    res.send(" Test email sent");
  } catch (err) {
    console.error(" Email sending failed:", err.message);
    res.status(500).send(" Email sending failed");
  }
});



//  Setup Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

//  Auth Routes
router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/google-signup", googleSignup);
router.post("/google-login", googleLogin);
router.post("/verify-otp", verifyOtp);


//  User Routes
router.get("/", verifyToken, getAllUsers);
router.delete("/:id", verifyToken, deleteUser);
router.put("/:id", verifyToken, updateUser);

//  Product Routes
router.get("/allproducts", getAllProducts);
router.get("/product/:id", getProductById);
router.post("/addproduct", verifyToken,verifyAdmin,upload.single("image"), addproduct);
router.delete("/product/:id",verifyToken,verifyAdmin, deleteProduct);

//  Category Routes
router.get("/allcategories", getAllCategories);
router.post("/addcategory",verifyToken,verifyAdmin, upload.single("image"), addCategory);

//  Brands Routes
router.get("/allbrands", getAllBrands);
router.post("/addbrand",verifyToken,verifyAdmin, upload.single("image"), addBrand);

module.exports = router;
