import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/cartContext.jsx';

function Navbar({ onShowCartClick }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const location = useLocation();

  // ✅ Get cart items from context
  const { cartItems } = useCart();
  const cartItemCount = cartItems.length;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      try {
        const userString = localStorage.getItem('user');
        let user = null;

        if (userString && userString !== "undefined") {
          user = JSON.parse(userString);
        }

        if (user && user.name) {
          setUserName(user.name);
        } else if (user && user.email) {
          setUserName(user.email);
        } else {
          setUserName('User');
        }
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        setUserName('User');
      }
    } else {
      setIsLoggedIn(false);
      setUserName('');
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserName('');
    window.location.reload();
  };

  return (
    <header>
      <nav className="navbar">
        <div className="logo">Robotic Co</div>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/products">Products</Link></li>
          <li><Link to="/#blog-section">Blogs</Link></li>
          <li><Link to="/#services-section">Services</Link></li>
          <li><Link to="/robot-lab">3D Robot Lab</Link></li>
          <li><Link to="/3d-printing-hub">3D Printing Hub</Link></li>
          <li><Link to="/contact">Contact</Link></li>


          <li>
            <a href="#" id="show-cart" onClick={(e) => { e.preventDefault(); onShowCartClick(); }}>
              Cart<span id="cart-count">({cartItemCount})</span>
            </a>
          </li>

          {isLoggedIn ? (
            <>
              <li><span className="welcome-user">Welcome, {userName}!</span></li>
              <li><button onClick={handleLogout} className="btn logout" aria-label="Logout" >Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login" className="btn login">Login</Link></li>
              <li><Link to="/signup" className="btn signup">Sign Up</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;