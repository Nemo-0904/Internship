// frontend/src/components/About.jsx (Revised Content)
import React, { useEffect } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';

const aboutImage = "/images/About-us.jpg"; // Your image path

function About() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <>
      <section className="about-us-section" id="about">
        <div className="about-container">
          <div className="about-text" data-aos="fade-right">
            <h2>About Robotic Co.: Driving Innovation in Automation</h2>
            {/* REVISED PARAGRAPH 1: Company's core identity, mission, and broad impact */}
            <p>
              At **Robotic Co.**, we are not just a provider of advanced technology;
              we are **innovators and visionaries** shaping the next generation of automation.
              Born from a passion for solving complex challenges, our mission is to
              design, engineer, and deliver intelligent robotic solutions that push
              the boundaries of efficiency, safety, and human capability across diverse
              sectors – from heavy industry to groundbreaking research and smart living.
            </p>
            {/* REVISED PARAGRAPH 2: Focus on expertise, quality, and commitment */}
            <p>
              Our dedicated team of world-class engineers, AI specialists, and
              researchers are at the forefront of robotic development, ensuring every
              system we craft embodies precision, reliability, and intuitive design.
              We are committed to fostering progress through robotics, providing
              solutions that don't just meet today's needs but empower a smarter,
              more productive tomorrow. When you choose Robotic Co., you're investing
              in a future built on innovation and trust.
            </p>
            {/* Optional: Mission/Vision/Values could be re-added here for deeper company branding */}
            <div className="about-mission-vision">
              <div className="mission-block">
                <h3 className="mission-vision-heading">Our Mission</h3>
                <p className="mission-vision-paragraph">To engineer transformative robotic solutions that empower human potential, optimize operations, and create a sustainable, intelligent future.</p>
              </div>
              <div className="vision-block">
                <h3 className="mission-vision-heading">Our Vision</h3>
                <p className="vision-vision-paragraph">To be the global benchmark for robotics innovation and accessibility, seamlessly integrating advanced automation into every facet of life and industry.</p>
              </div>
            </div>
          </div>
          <div className="about-image" data-aos="fade-left">
            <img src={aboutImage} alt="Robotic Co. Innovation" loading="lazy" />
          </div>
        </div>
        {/* Optional: A "Why Choose Us" or "Our Process" section could follow here */}
      </section>
    </>
  );
}

export default About;