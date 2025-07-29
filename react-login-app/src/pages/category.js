import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  useEffect(() => { fetchCategories(); }, []);
  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users/allcategories');
      setCategories(response.data);
    } catch (error) { console.error("Error fetching categories:", error); }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", image);
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/users/addcategory", formData, {
        headers: { "Content-Type": "multipart/form-data", "Authorization": `Bearer ${token}` },
      });
      setName(""); setImage(null); setShowForm(false); fetchCategories();
    } catch (error) { console.error("Error adding category:", error); }
  };

  return (
    <div className="category-page">
      <div className="category-header">
        <h1 className="category-heading">Categories</h1>
        <input
          className="category-search"
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="category-grid">
        {categories
          .filter((cat) => cat.name.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((cat, idx) => (
            <div key={cat._id} className={`category-card pastel-bg-${(idx % 6) + 1}`} onClick={() => navigate(`/products?category=${encodeURIComponent(cat.name)}`)}>
              <div className="category-card-img-wrap">
                <img
                  src={`http://localhost:5000/uploads/${cat.image || ''}`}
                  alt={cat.name}
                  className="category-card-img"
                  onError={e => { e.target.onerror = null; e.target.src = '/default-category.png'; }}
                />
              </div>
              <div className="category-card-title">{cat.name}</div>
            </div>
          ))}
      </div>
      {role === "admin" && (
        <button className="fab" onClick={() => setShowForm(true)} title="Add Category">
          <span className="fab-plus">+</span>
        </button>
      )}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Add Category</h2>
            <form onSubmit={handleAddCategory} encType="multipart/form-data" className="modal-form">
              <input
                type="text"
                placeholder="Enter Category Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="modal-input"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                required
                className="modal-input"
              />
              <div className="modal-btn-row">
                <button type="submit" className="modal-btn">Add</button>
                <button type="button" className="modal-btn cancel" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Category;
