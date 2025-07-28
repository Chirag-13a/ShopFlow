import React, { useState } from "react";
import { useCart } from "../components/CartContext";
import { useNavigate } from "react-router-dom";
import Checkout from "./checkout";

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const navigate = useNavigate();

  return (
    <div className="cart-page">
      <h2 className="cart-heading">Your Cart 🛒</h2>
      {cartItems.length === 0 ? (
        <p className="cart-empty">No items in the cart.</p>
      ) : (
        <>
          <ul className="cart-list">
            {cartItems.map((item, index) => (
              <li key={index} className="cart-item">
                <div className="cart-info">
                  <img
                    src={`http://localhost:5000/uploads/${item.image}`}
                    alt={item.name}
                    className="cart-img"
                  />
                  <div>
                    <strong>{item.name}</strong>
                    <p>₹{item.price} each</p>
                  </div>
                </div>
                <div className="cart-controls">
                  <button
                    className="cart-btn"
                    onClick={() => updateQuantity(item._id, Math.max(item.quantity - 1, 1))}
                  >–</button>
                  <span className="cart-qty">{item.quantity}</span>
                  <button
                    className="cart-btn"
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  >+</button>
                </div>
                <div className="cart-remove">
                  <button
                    className="cart-remove-btn"
                    onClick={() => removeFromCart(item._id)}
                    title="Remove from cart"
                  >
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#e53935" strokeWidth="2">
                      <path d="M3 6h18" />
                      <path d="M9 6v12a2 2 0 002 2h2a2 2 0 002-2V6m-6 0V4a2 2 0 012-2h2a2 2 0 012 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <h3 className="cart-total">Total: ₹{totalPrice}</h3>
          <button 
            className="cart-checkout-btn"
            onClick={() => setShowCheckout(true)}
          >
            Proceed to Checkout
          </button>
          <button
            className="cart-continue-btn"
            onClick={() => navigate("/products")}
          >
            Continue Shopping 
          </button>
          {showCheckout && (
            <div className="cart-modal-overlay">
              <div className="cart-modal-box">
                <Checkout onClose={() => setShowCheckout(false)} />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Cart;
