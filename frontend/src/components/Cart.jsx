// src/components/Cart.jsx
import React from 'react';
import { useCart } from '../context/cartContext';
import '../styles/Cart.css'; // Import the new CSS

const Cart = ({ isOpen, onClose }) => {
  const {
    cartItems,
    cartTotal,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    onCheckout,
    checkoutLoading,
  } = useCart();

  if (!isOpen) return null;

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button onClick={onClose} className="cart-close-btn">&times;</button>
        </div>

        {cartItems.length === 0 ? (
          <p className="cart-empty">Your cart is currently empty.</p>
        ) : (
          <div className="cart-content">
            <ul className="cart-items-list">
              {cartItems.map(item => (
                <li key={item.id} className="cart-item">
                  <div className="cart-item-details">
                    <strong>{item.name}</strong>
                    <div className="cart-quantity-controls">
                      <button
                        className="qty-btn"
                        onClick={() => decreaseQuantity(item.id)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="qty-display">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => increaseQuantity(item.id)}
                      >
                        +
                      </button>
                      <span className="qty-price">&times; &nbsp;₹{item.price}</span>
                    </div>
                  </div>
                  <div className="cart-item-actions">
                    <div className="cart-item-price">₹{item.price * item.quantity}</div>
                    <button onClick={() => removeFromCart(item.id)} className="cart-remove-btn">Remove</button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="cart-footer">
              <div className="cart-total">
                <span>Total:</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className="cart-actions">
                <button onClick={clearCart} className="cart-clear-btn">Clear Cart</button>
                <button
                  onClick={onCheckout}
                  disabled={checkoutLoading}
                  className="cart-checkout-btn"
                >
                  {checkoutLoading ? 'Processing...' : 'Checkout'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
