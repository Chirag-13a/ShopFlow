# ShopFlow

A full-featured inventory management web application built using the MERN stack (MongoDB, Express, React, Node.js). The system allows users to manage products, categories, stock levels, and provides an admin dashboard with full CRUD functionality and authentication.

## 🚀 Features

### ✅ User Features
- 🔐 User Signup & Login with JWT Authentication
- 📧 Email-based OTP Verification for Sign Up
- 🏠 Dashboard with categorized product listings
- 🔎 Real-time product search by name or category
- 📦 View product details including stock status and image

### ✅ Admin Features
- ➕ Add/Edit/Delete Products with image upload
- 📂 Add/Edit/Delete Categories & Brands
- 🗃️ Manage Inventory: Update stock and details
- 📊 Dashboard with product count, stock levels, and alerts

### 💡 Extra Functionalities
- 📸 Product Image Upload via File Input
- 🔁 Live UI updates without page refresh
- ⚙️ Protected Admin Routes using middleware
- 🧼 Clean and responsive UI with React

---

## 🛠️ Tech Stack

### Frontend
- React (with Hooks & Context API)
- Axios for API calls
- React Router DOM
- CSS Modules / External Stylesheets

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT)
- Nodemailer for OTP Verification

### Deployment
- Frontend: **Vercel**
- Backend: **Render / Railway / Local**

---

## 📁 Folder Structure

inventory-management/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── App.js
│   └── package.json
│
├── README.md
└── .env

---

## 🔗 API Endpoints

### Auth Routes
- POST /api/signup – Register with OTP
- POST /api/login – Login with JWT
- POST /api/verify-otp – Verify Email OTP

### Product Routes
- GET /api/products – List all products
- POST /api/products – Add Product
- PUT /api/products/:id – Update Product
- DELETE /api/products/:id – Delete Product

### Category / Brand Routes
- GET /api/categories
- POST /api/categories
- GET /api/brands
- POST /api/brands

---

## 🧠 Learning Goals
- Full-stack CRUD Operations
- JWT Authentication & Protected Routes
- File Upload Handling
- Real-Time UI Updates
- Production-Ready Dashboard Design

---

## 🙌 Credits
Built with ❤️ by **Chirag Agarwal**  
Project developed for internship learning and personal practice.