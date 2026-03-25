// frontend/src/components/Services.jsx (Revised Content)
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

function Services() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const services = [
    {
      id: 1,
      image: "/images/service1.jpg", // Ensure these paths are correct
      title: "Bespoke Robotic Solutions",
      description: "Crafting bespoke robotic systems, from concept to deployment, engineered to perfectly integrate with your unique operational demands and strategic goals.",
    },
    {
      id: 2,
      image: "/images/service2.jpeg",
      title: "Seamless Integration Services",
      description: "Seamlessly incorporating our advanced robotic solutions into your existing infrastructure, ensuring minimal disruption and maximum operational synergy and ROI.",
    },
    {
      id: 3,
      image: "/images/service3.jpeg",
      title: "Proactive Maintenance & Support",
      description: "Comprehensive, proactive after-sales support and preventative maintenance programs designed to ensure the peak performance, longevity, and uptime of your robotic investments.",
    },
    {
      id: 4,
      image: "/images/service4.jpeg",
      title: "Expert Robotics Consulting",
      description: "Leverage our deep industry expertise with strategic consulting services covering robotics adoption roadmaps, technology assessment, and future-proofing your automation strategy.",
    },
  ];

  return (
    <section id="services-section" className="services-section">
      <h2 data-aos="fade-down">Empowering Your Success with Dedicated Robotic Services</h2>
      {/* NEW INTRODUCTORY PARAGRAPH */}
      <p className="services-intro-paragraph" data-aos="fade-up" data-aos-delay="200">
        At Robotic Co., we understand that investing in advanced automation is a significant step.
        That's why our commitment extends beyond delivering cutting-edge products.
        We provide a full spectrum of expert services, ensuring you maximize your robotic investment,
        achieve seamless integration, and maintain peak performance throughout its lifecycle.
        Our dedicated support empowers your journey into a smarter, more efficient future.
      </p>
      {/* END NEW INTRODUCTORY PARAGRAPH */}

      <div className="services-grid">
        {services.map((service) => (
          <div key={service.id} className="service-card" data-aos="fade-up" data-aos-delay="300">
            <img src={service.image} alt={`Icon for ${service.title}`} loading="lazy" />
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Services;