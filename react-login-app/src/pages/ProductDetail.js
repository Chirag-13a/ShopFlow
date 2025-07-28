import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../components/CartContext";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/users/product/${id}`)
      .then((res) => {
        setProduct(res.data);
        setMainImage(res.data.image);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="pd-loading">Loading...</div>;
  if (!product) return <div className="pd-error">Product not found.</div>;

  return (
    <div className="pd-container">
      {/* Left: Image Gallery */}
      <div className="pd-gallery">
        <div className="pd-main-img-wrap">
          <img
            className="pd-main-img"
            src={`http://localhost:5000/uploads/${mainImage}`}
            alt={product.name}
          />
        </div>
        {/* If you have multiple images, map thumbnails here */}
      </div>

      {/* Center: Product Info */}
      <div className="pd-info">
        <h1 className="pd-title">{product.name}</h1>
        <div className="pd-brand">Brand: {product.brand}</div>
        <div className="pd-category">Category: {product.category}</div>
        <div className="pd-rating">
          <span className="pd-stars">★★★★★</span>
          <span className="pd-rating-count">(100 ratings)</span>
        </div>
        <div className="pd-price">₹{product.price}</div>
        <div className="pd-desc">
          <h3>Description</h3>
          <p>{product.description || "No description available."}</p>
        </div>
      </div>

      {/* Right: Purchase Actions */}
      <div className="pd-actions">
        <div className="pd-price-box">₹{product.price}</div>
        <button
          className="pd-buy-btn"
          onClick={() => {
            addToCart(product);
            navigate("/cart");
          }}
        >
          Buy Now
        </button>
        <button
          className="pd-cart-btn"
          onClick={() => addToCart(product)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetail; 