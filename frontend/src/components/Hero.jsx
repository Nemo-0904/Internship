// frontend/src/components/Hero.jsx (Revised Content)
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

function Hero() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <section className="hero" data-aos="fade-up">
      <div className="hero-content">
        {/* REVISED HEADLINE: Focus on Vision + Innovation */}
        <h1 className="hero-title">Pioneering the Future of Robotics for a Smarter World</h1>
        {/* REVISED TAGLINE: Connects vision to tangible solutions (products) */}
        <h2 className="hero-tagline">Innovating next-generation automation & offering unparalleled robotic solutions for every need.</h2>
        {/* REVISED DESCRIPTION: Balances company mission with product availability */}
        <p className="hero-description">
          At **Robotic Coop.**, we design, develop, and deliver cutting-edge robotics that
          redefine efficiency, safety, and human potential. Explore our expertly
          engineered systems designed to empower industries, educate minds, and
          enhance everyday living.
        </p>
        {/* CTA 1: Primary call to explore products (e-commerce focus) */}
        <Link to="/products" className="cta-btn">Explore Our Solutions</Link>
        {/* CTA 2 (Optional): Secondary call to learn more about the company (company focus) */}
        {/* <Link to="/about" className="cta-btn cta-btn-secondary">Learn About Our Vision</Link> */}
      </div>
    </section>
  );
}

export default Hero;