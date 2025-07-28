import React, { useState } from "react";
import "../checkout.css";
import { useCart } from "../components/CartContext";

const dividerStyle = {
  width: '100%',
  height: 1,
  background: 'var(--color-border)',
  margin: '18px 0',
  opacity: 0.5,
};

const Checkout = ({ onClose }) => {
  const { cartItems, removeFromCart } = useCart();
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [orderPlaced, setOrderPlaced] = useState(false);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const estimatedDelivery = (() => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date.toDateString();
  })();

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    setTimeout(() => {
      setOrderPlaced(false);
      if (onClose) onClose();
    }, 1800);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(30,40,60,0.18)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
    }}>
      <div className="checkout-container" style={{
        position: 'relative',
        minWidth: 340,
        maxWidth: 480,
        width: '100%',
        background: 'var(--color-surface)',
        borderRadius: 18,
        boxShadow: '0 8px 32px rgba(26,35,126,0.16)',
        padding: '32px 28px 24px 28px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        fontFamily: 'inherit',
      }}>
        {onClose && (
          <button
            onClick={onClose}
            style={{position: 'absolute', top: 16, right: 18, fontSize: 24, background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontWeight: 700, zIndex: 2}}
            aria-label="Close"
          >
            &times;
          </button>
        )}
        <h2 style={{textAlign: 'center', color: 'var(--color-primary)', marginBottom: 18, fontWeight: 800, fontSize: 28, letterSpacing: 1}}>Checkout</h2>

        {/* Order Summary at the top */}
        <div className="section" style={{marginBottom: 0}}>
          <h3 style={{fontSize: 19, fontWeight: 700, marginBottom: 10, color: 'var(--color-text)'}}>Order Summary</h3>
          <ul style={{marginBottom: 0, padding: 0, listStyle: 'none'}}>
            {cartItems.length === 0 ? (
              <li style={{color: '#d32f2f'}}>No items in cart.</li>
            ) : (
              cartItems.map((item) => (
                <li key={item._id} style={{marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '8px 0'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: 10, flex: 1}}>
                    <div style={{width: 38, height: 38, borderRadius: 8, background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1.5px solid var(--color-border)'}}>
                      {item.image && <img src={`http://localhost:5000/uploads/${item.image}`} alt={item.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />}
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                      <span style={{fontWeight: 700, fontSize: 15, color: 'var(--color-text)'}}>{item.name}</span>
                      <span style={{fontSize: 13, color: 'var(--color-text-secondary)'}}>x {item.quantity}</span>
                    </div>
                  </div>
                  <span style={{fontWeight: 700, fontSize: 16, color: 'var(--color-text)'}}>₹{item.price * item.quantity}</span>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    style={{
                      background: 'rgba(25, 118, 210, 0.10)',
                      border: 'none',
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'background 0.2s, box-shadow 0.2s',
                      boxShadow: '0 2px 8px rgba(25,118,210,0.10)',
                      marginLeft: 8,
                    }}
                    title="Remove from cart"
                    onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(135deg, #1976d2 60%, #64b5f6 100%)'}
                    onMouseOut={e => e.currentTarget.style.background = 'rgba(25, 118, 210, 0.10)'}
                  >
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth="2">
                      <line x1="6" y1="6" x2="18" y2="18" />
                      <line x1="6" y1="18" x2="18" y2="6" />
                    </svg>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
        <div style={dividerStyle} />
        {/* Shipping Address */}
        <div className="section" style={{marginBottom: 0}}>
          <h3 style={{fontSize: 17, fontWeight: 700, marginBottom: 8, color: 'var(--color-text)'}}>Shipping Address</h3>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter full shipping address"
            style={{
              resize: 'vertical',
              border: '1.5px solid var(--color-border)',
              borderRadius: 10,
              minHeight: 60,
              fontSize: 15,
              padding: 10,
              background: 'var(--color-bg)',
              color: 'var(--color-text)',
              marginBottom: 0,
            }}
          />
        </div>
        <div style={dividerStyle} />
        {/* Payment Method */}
        <div className="section" style={{marginBottom: 0}}>
          <h3 style={{fontSize: 17, fontWeight: 700, marginBottom: 8, color: 'var(--color-text)'}}>Payment Method</h3>
          <div style={{display: 'flex', gap: 18, marginBottom: 8}}>
            {["card", "upi", "cod"].map((method) => (
              <label key={method} style={{fontWeight: 500, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text)'}}>
                <input
                  type="radio"
                  name="payment"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={() => setPaymentMethod(method)}
                  style={{marginRight: 7, accentColor: 'var(--color-primary)'}}
                />
                {method.toUpperCase()}
              </label>
            ))}
          </div>
        </div>
        <div style={dividerStyle} />
        {/* Total and Place Order */}
        <div className="section" style={{marginBottom: 0}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700, fontSize: 18, color: 'var(--color-primary)', marginBottom: 8}}>
            <span style={{color: 'var(--color-text)'}}>Total:</span>
            <span style={{color: 'var(--color-text)'}}>₹{total}</span>
          </div>
          <div style={{marginBottom: 10}}>
            <h4 style={{margin: 0, fontSize: 15, color: 'var(--color-text-secondary)'}}>Estimated Delivery</h4>
            <p style={{margin: 0, color: 'var(--color-text-secondary)', fontSize: 15}}>{estimatedDelivery}</p>
          </div>
          <button
            className="place-order-btn"
            onClick={handlePlaceOrder}
            disabled={cartItems.length === 0 || !address.trim() || orderPlaced}
            style={{marginTop: 10, opacity: orderPlaced ? 0.7 : 1, fontWeight: 700, fontSize: 17, borderRadius: 10, boxShadow: '0 2px 8px rgba(40,167,69,0.10)'}}
          >
            {orderPlaced ? 'Order Placed!' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
