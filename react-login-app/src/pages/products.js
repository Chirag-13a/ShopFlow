import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCart } from "../components/CartContext";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from 'react-toastify';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [file, setFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    brand: "",
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");

  useEffect(() => {
    axios.get("http://localhost:5000/api/users/allcategories").then(res => setCategories(res.data)).catch(console.error);
    axios.get("http://localhost:5000/api/users/allbrands").then(res => setBrands(res.data)).catch(console.error);
    axios.get("http://localhost:5000/api/users/allproducts").then(res => setProducts(res.data)).catch(console.error);
  }, []);

  // Set brand filter from query param on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const brand = params.get('brand');
    const category = params.get('category');
    if (brand) setBrandFilter(brand);
    if (category) setCategoryFilter(category);
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    // Client-side validation
    if (!formData.name || !formData.category || !formData.price || !formData.brand || !file) {
      toast.error("Please fill all fields and select an image.");
      return;
    }
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("brand", formData.brand);
    formDataToSend.append("image", file);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/users/addproduct", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" ,
          "Authorization": `Bearer ${token}`,
        },
      });
      setProducts([res.data, ...products]);
      setFormData({ name: "", category: "", price: "", brand: "" });
      setFile(null);
      setShowForm(false);
      toast.success("Product added successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Error adding product");
    }
  };

 const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this product?")) return;

  try {
    const token = localStorage.getItem("token"); // Get the token

    await axios.delete(`http://localhost:5000/api/users/product/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // fRequired for verifyToken
      },
    });

    setProducts(products.filter((p) => p._id !== id));
  } catch (error) {
    console.error("Failed to delete product:", error.response?.data || error.message);
    toast.error("Failed to delete product");
  }
};


 const { addToCart, cartItems } = useCart(); // make sure addToCart is included!

const handleAddToCart = (product) => {
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
    return;
  }
  addToCart(product);
};


  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? product.category.toLowerCase() === categoryFilter.toLowerCase() : true;
    const matchesBrand = brandFilter ? product.brand.toLowerCase() === brandFilter.toLowerCase() : true;
    const matchesPrice = (() => {
      if (!priceFilter) return true;
      const price = Number(product.price);
      if (priceFilter === "0-1000") return price >= 0 && price <= 1000;
      if (priceFilter === "1000-1500") return price > 1000 && price <= 1500;
      if (priceFilter === "1500-2000") return price > 1500 && price <= 2000;
      if (priceFilter === "2000-5000") return price > 2000 && price <= 5000;
      if (priceFilter === "5000-10000") return price > 5000 && price <= 10000;
      if (priceFilter === "10000-30000") return price > 10000 && price <= 30000;
      if (priceFilter === "30000+") return price > 30000;
      return true;
    })();
    return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
  });

  return (
    <div style={{ background: "var(--color-bg)", minHeight: "100vh", color: "#0a7ff5", fontFamily: "'Inter', Arial, sans-serif" }}>
      <h1 className="product-heading">Products</h1>

      <div className="filter-bar">
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c._id} value={c.name}>{c.name}</option>)}
        </select>

        <select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)}>
          <option value="">All Brands</option>
          {brands.map((b) => <option key={b._id} value={b.name}>{b.name}</option>)}
        </select>

        <select value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)}>
          <option value="">All Prices</option>
          <option value="0-1000">₹0 - ₹1000</option>
          <option value="1000-1500">₹1000 - ₹1500</option>
          <option value="1500-2000">₹1500 - ₹2000</option>
          <option value="2000-5000">₹2000 - ₹5000</option>
          <option value="5000-3000">₹5000 - ₹10000</option>
          <option value="10000-30000">₹10000 - ₹30000</option>
          <option value="30000+">₹30000+</option>
        </select>

        <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

        {role === "admin" && (
          <button onClick={() => setShowForm(true)}>Add Product</button>
        )}
        <button onClick={() => {
          setCategoryFilter("");
          setBrandFilter("");
          setPriceFilter("");
          setSearchTerm("");
        }}>Reset</button>
      </div>

      {showForm && role === "admin" && (
        <form className="add-form" onSubmit={handleAddProduct}>
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Product Name" required />
          <select name="category" value={formData.category} onChange={handleChange} required>
            <option value="">Select Category</option>
            {categories.map((c) => <option key={c._id} value={c.name}>{c.name}</option>)}
          </select>
          <select name="brand" value={formData.brand} onChange={handleChange} required>
            <option value="">Select Brand</option>
            {brands.map((b) => <option key={b._id} value={b.name}>{b.name}</option>)}
          </select>
          <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price" required />
          <input type="file" onChange={handleFileChange} required />
          <button type="submit">Submit</button>
          <button type="button" onClick={() => setShowForm(false)} style={{ background: "#e53935", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 24px", fontWeight: 600, fontSize: "16px", cursor: "pointer" }}>Cancel</button>
        </form>
      )}


      <div className="product-grid" style={{ background: "var(--color-surface)", borderRadius: "12px", padding: "24px 0", boxShadow: "0 2px 8px rgba(26,35,126,0.06)" }}>
        {filteredProducts.map((product) => (
          <div key={product._id} className="square-card">
            <img src={`http://localhost:5000/uploads/${product.image}`} alt={product.name} className="square-img" />
            <div className="square-info">
              <h4>{product.name}</h4>
              <div className="product-meta">{product.brand}</div>
              <div className="product-meta">{product.category}</div>
              <div className="product-meta price">₹{product.price}</div>
              <div className="product-meta rating">★★★★★ <span style={{color:'var(--color-text-secondary)', fontSize:13}}>(100)</span></div>
              <div className="button-row">
                <button className="square-btn view" onClick={() => { setSelectedProduct(product); setShowViewModal(true); }}>View</button>
                {role === "admin" && (
                  <button className="square-btn delete" onClick={() => handleDelete(product._id)}>Delete</button>
                )}
              </div>
              <button className="square-btn add" style={{ marginTop: "10px" }} onClick={() => handleAddToCart(product)}>Add to Cart 🛒</button>
            </div>
          </div>
        ))}
      </div>
      {showViewModal && selectedProduct && (
  <div className="modal-overlay" style={{ background: "rgba(26,35,126,0.95)", zIndex: 2000 }}>
    <div className="pd-container" style={{ position: 'relative', maxWidth: 900, width: '95vw', margin: '40px auto', background: 'var(--color-surface)', borderRadius: '18px' }}>
      {/* Close button */}
      <button
        onClick={() => setShowViewModal(false)}
        style={{ position: 'absolute', top: 18, right: 18, fontSize: 28, background: 'none', border: 'none', color: 'var(--color-text-secondary)', fontWeight: 700, cursor: 'pointer', zIndex: 2 }}
        aria-label="Close"
      >
        ×
      </button>
      {/* Left: Image Gallery */}
      <div className="pd-gallery">
        <div className="pd-main-img-wrap">
          <img
            className="pd-main-img"
            src={`http://localhost:5000/uploads/${selectedProduct.image}`}
            alt={selectedProduct.name}
          />
        </div>
      </div>
      {/* Center: Product Info */}
      <div className="pd-info">
        <h1 className="pd-title" style={{ color: 'var(--color-text)' }}>{selectedProduct.name}</h1>
        <div className="pd-brand" style={{ color: 'var(--color-text-secondary)' }}>Brand: {selectedProduct.brand}</div>
        <div className="pd-category" style={{ color: 'var(--color-text-secondary)' }}>Category: {selectedProduct.category}</div>
        <div className="pd-rating">
          <span className="pd-stars" style={{ color: 'var(--color-accent)' }}>★★★★★</span>
          <span className="pd-rating-count" style={{ color: 'var(--color-text-secondary)' }}>(100 ratings)</span>
        </div>
        <div className="pd-price" style={{ color: '#b12704' }}>₹{selectedProduct.price}</div>
        <div className="pd-desc" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
          <h3>Description</h3>
          <p>{selectedProduct.description || "No description available."}</p>
        </div>
      </div>
      {/* Right: Purchase Actions */}
      <div className="pd-actions" style={{ background: 'var(--color-surface)', borderRadius: '12px', boxShadow: '0 2px 8px rgba(26,35,126,0.06)', padding: '28px 18px' }}>
        <div className="pd-price-box" style={{ color: '#b12704' }}>₹{selectedProduct.price}</div>
        <button className="pd-buy-btn" style={{ background: 'var(--color-accent)', color: 'var(--color-text)' }}>Buy Now</button>
        <button className="pd-cart-btn" style={{ background: 'var(--color-primary)', color: 'var(--color-surface)' }}>Add to Cart</button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default Products;
