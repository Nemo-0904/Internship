import React from "react";
import Hero from "../components/Hero";
import About from "../components/About";
import BlogSection from "../components/BlogSection";
import Services from "../components/Services";
import Footer from "../components/Footer";


function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />
      
      <About />
      <BlogSection />
      <Services />
      <Footer />
    </div>
  );
}

export default HomePage;
