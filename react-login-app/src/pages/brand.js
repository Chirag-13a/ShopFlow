import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Brand = () => {
  const [brands, setBrands] = useState([]);
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  useEffect(() => { fetchBrands(); }, []);
  const fetchBrands = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users/allbrands');
      setBrands(response.data);
    } catch (error) { console.error("Error fetching brands:", error); }
  };

  const handleAddBrands = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", image);
    try {
      const token = localStorage.getItem("token");
      await axios.post('http://localhost:5000/api/users/addbrand', formData, {
        headers: { "Content-Type": "multipart/form-data", "Authorization": `Bearer ${token}` },
      });
      setName(''); setImage(null); setShowForm(false); fetchBrands();
    } catch (error) { console.error("Error adding brand:", error); }
  };

  return (
    <div className="brand-page">
      <div className="brand-header">
        <h1 className="brand-heading">Brands</h1>
        <input
          className="brand-search"
          type="text"
          placeholder="Search brands..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="brand-grid">
        {brands
          .filter((cat) => cat.name.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((cat, idx) => (
            <div key={cat._id} className={`brand-card pastel-bg-${(idx % 6) + 1}`} onClick={() => navigate(`/products?brand=${encodeURIComponent(cat.name)}`)}>
              <div className="brand-card-img-wrap">
                <img
                  src={`http://localhost:5000/uploads/${cat.image || ''}`}
                  alt={cat.name}
                  className="brand-card-img"
                  onError={e => { e.target.onerror = null; e.target.src = '/default-brand.png'; }}
                />
              </div>
              <div className="brand-card-title">{cat.name}</div>
            </div>
          ))}
      </div>
      {role === "admin" && (
        <button className="fab" onClick={() => setShowForm(true)} title="Add Brand">
          <span className="fab-plus">+</span>
        </button>
      )}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Add Brand</h2>
            <form onSubmit={handleAddBrands} encType="multipart/form-data" className="modal-form">
              <input
                type="text"
                placeholder="Enter Brand Name"
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

export default Brand;
