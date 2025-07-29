# 📦 Inventory Management System

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

### Frontend:
- React (with Hooks & Context API)
- Axios for API calls
- React Router DOM
- CSS Modules or external stylesheets

### Backend:
- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT) for Authentication
- Nodemailer for Email OTP

### Deployment:
- Frontend: **Vercel**
- Backend: **Render** / **Railway** / **Local**

---

## 📁 Folder Structure

inventory-management/
├── backend/
│ ├── config/ # DB & email configs
│ ├── controllers/ # Route logic
│ ├── middleware/ # Auth middlewares
│ ├── models/ # Mongoose schemas
│ ├── routes/ # API endpoints
│ └── server.js # Entry point
│
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── App.js
│ │ └── index.js
│ └── package.json
│
├── README.md
└── .env (not included in repo)


---

🔗 API Endpoints
Auth Routes
POST /api/signup – Register with OTP

POST /api/login – Login with JWT

POST /api/verify-otp – Verify Email OTP

Product Routes
GET /api/products – List all products

POST /api/products – Add product (Admin only)

PUT /api/products/:id – Update product

DELETE /api/products/:id – Delete product

Category & Brand Routes
GET /api/categories

POST /api/categories

GET /api/brands

POST /api/brands



🧠 Learning Goals
Hands-on experience with full-stack CRUD operations

User authentication using JWT and protected routes

Working with file uploads and real-time UI updates

Designing a production-ready React dashboard



🙌 Credits
Built with ❤️ by Chirag Agarwal
Project developed as part of internship learning and personal practice.




