import React from 'react';
import ContactForm from '../components/ContactForm';
import '../styles/ContactPage.css';

const ContactPage = () => {
  return (
    <div className="contact-container">
      <h1>Contact Us</h1>
      <p>We’d love to hear from you! Please fill out the form below.</p>
      <ContactForm />
    </div>
  );
};

export default ContactPage;
