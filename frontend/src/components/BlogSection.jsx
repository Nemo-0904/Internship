// frontend/src/components/BlogSection.jsx (Revised Content)
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from 'react-router-dom';

function BlogSection() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const blogs = [
    {
      id: 1,
      image: "/images/blog1.jpg", // Ensure you have relevant images
      title: "Case Study: Automating Warehouse Logistics for GlobalCorp",
      description: "Discover how Robotic Co.'s bespoke Autonomous Mobile Robots (AMRs) revolutionized GlobalCorp's supply chain, achieving a 40% increase in operational efficiency and reducing human error.",
      link: "#", // Link to the full case study page
    },
    {
      id: 2,
      image: "/images/blog2.jpeg",
      title: "Breakthrough: Unlocking Advanced Dexterity with Our New Gripper Technology",
      description: "Dive deep into the R&D behind Robotic Co.'s latest robotic gripper. Learn how our patented design enables unprecedented precision and adaptability for delicate material handling.",
      link: "#",
    },
    {
      id: 3,
      image: "/images/blog3.jpeg",
      title: "Cracking the Quadrupedal Navigation Code: Our Solution for Extreme Terrains",
      description: "Explore the technical challenges of developing a quadrupedal robot capable of navigating complex, unpredictable environments, and how Robotic Co. engineered a groundbreaking solution.",
      link: "#",
    },
    {
      id: 4,
      image: "/images/blog4.jpg",
      title: "Innovation Spotlight: Our Role in the Next-Gen Medical Robotics Project",
      description: "Learn about Robotic Co.'s crucial contributions to a collaborative project developing AI-powered surgical assistants, pushing the boundaries of precision and safety in healthcare.",
      link: "#",
    },
    {
      id: 5,
      image: "/images/blog5.jpg",
      title: "Expert Insight: The Future of Human-Robot Collaboration in Industry 5.0",
      description: "Drawing from our vast experience in industrial deployments, we share our vision on how collaborative robots (cobots) are evolving to work seamlessly alongside humans, enhancing productivity and safety.",
      link: "#",
    },
    {
      id: 6,
      image: "/images/blog6.jpg",
      title: "From Concept to Commercialization: The Journey of Our Educational Bot Series",
      description: "A behind-the-scenes look at how Robotic Co. transforms innovative educational robotics concepts into robust, user-friendly products inspiring the next generation of STEM enthusiasts.",
      link: "#",
    },
  ];

  return (
    <section id="blog-section" className="blog-section">
      <h2>From Our Labs: Insights, Innovations & The Future of Robotics</h2>
      <div className="blog-grid">
        {blogs.map((blog) => (
          <div key={blog.id} className="blog-card" data-aos="fade-up">
            <img src={blog.image} alt={`Thumbnail for ${blog.title}`} loading="lazy" />
            <h3>{blog.title}</h3>
            <p>{blog.description}</p>
            {/* Using <a> for now, but <Link> to="/blog-post-detail/${blog.id}" would be ideal */}
            <a href={blog.link} className="read-more">Read More</a>
          </div>
        ))}
      </div>
    </section>
  );
}

export default BlogSection;