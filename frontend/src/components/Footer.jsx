// frontend/src/components/Footer.jsx (Revised Content)
import React from "react";
import { Link } from 'react-router-dom'; 

function Footer() {
  const currentYear = new Date().getFullYear(); 

  return (
    <footer id="contact" className="main-footer"> {/* Changed class to main-footer */}
      <div className="footer-container"> {/* New container for column layout */}

        {/* Column 1: About Us / Company Info */}
        <div className="footer-column footer-about">
          <h3>Robotic Co.</h3>
          <p>
            Pioneering advanced robotic solutions for a smarter, more automated future.
            We deliver cutting-edge technology designed to empower industries,
            educate minds, and enhance everyday living.
          </p>
          {/* You could add a logo here if you have one: <img src="/images/logo.png" alt="Robotic Co. Logo" className="footer-logo" /> */}
        </div>

        {/* Column 2: Quick Links */}
        <div className="footer-column footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/services">Services</Link></li>
              <li><Link to="/3d-printing-hub">3D Printing Hub</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/blog">Blog</Link></li>
           
          </ul>
        </div>

        {/* Column 3: Contact Info & Socials */}
        <div className="footer-column footer-contact-info">
          <h3>Get In Touch</h3> {/* Changed heading */}
          <p><i className="fas fa-map-marker-alt"></i> D9/802, Sapthagiri Building, Lokdhara Phase-3, Kalyan - 421306, Maharashtra, India</p>
          <p><i className="fas fa-phone"></i> +1 (555) 123-4567</p>
          <p><i className="fas fa-envelope"></i> <a href="mailto:info@roboticco.com">piyushshinde@techligence.net.</a></p>

          <div className="social-buttons">
            <a href="mailto:support@Roboticco.com" target="_blank" rel="noopener noreferrer" className="social-btn email">
              <i className="fas fa-envelope"></i>
            </a>
            <a href="https://linkedin.com/company/Roboticco" target="_blank" rel="noopener noreferrer" className="social-btn linkedin">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="https://github.com/Roboticco" target="_blank" rel="noopener noreferrer" className="social-btn github">
              <i className="fab fa-github"></i>
            </a>
            <a href="https://instagram.com/Roboticco" target="_blank" rel="noopener noreferrer" className="social-btn insta">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>

      </div>

      {/* Footer Bottom (Copyright) */}
      <div className="footer-bottom">
        <p className="footer-copy">&copy; {currentYear}  All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;