// Robotic_Co/frontend/src/pages/PaymentCancelledPage.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

function PaymentCancelledPage() {
  // Keep this useEffect to add the body class
  useEffect(() => {
    document.body.classList.add('payment-cancelled-body');
    return () => {
      document.body.classList.remove('payment-cancelled-body');
    };
  }, []);

  return (
    <div className="payment-cancelled-container">
      <h1>❌ Payment Cancelled!</h1> {/* Added emoji for consistency */}
      <p>You cancelled the transaction.</p>
      <p><Link to="/products">Go back to products</Link></p>
    </div>
  );
}

export default PaymentCancelledPage;