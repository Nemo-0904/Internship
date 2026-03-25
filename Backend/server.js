// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// 1. Load .env BEFORE anything else
dotenv.config({ path: path.join(__dirname, '.env') });

// 2. Now import modules that depend on env
const chatbotRoutes = require('./routes/chatbot');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/order');
const paymentRoutes = require('./routes/payment');
const contactRoutes = require('./routes/contact');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json()); // Body parser for JSON
app.use(express.urlencoded({ extended: false })); // Body parser for URL-encoded data (if needed)

const allowedOrigins = [process.env.CLIENT_URL, "http://localhost:5173", "http://localhost:5174", "http://localhost:5175"];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const isLocalhost = origin.startsWith('http://localhost:');
    if (allowedOrigins.indexOf(origin) !== -1 || isLocalhost) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  credentials: true,
}));

// API Routes
// app.use('/api/checkout', checkoutRoutes); // <--- CRITICAL: REMOVE OR COMMENT OUT THIS LINE
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/contact', contactRoutes);

// Health Check Route

app.get('/api', (req, res) => {
  res.status(200).json({ message: 'Robotic Co API is running' });
});

// Serve frontend (React/Vite) in production
if (process.env.NODE_ENV === 'production') {
  const __dirnamePath = path.resolve();
  app.use(express.static(path.join(__dirnamePath, 'frontend/dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirnamePath, 'frontend', 'dist', 'index.html'))
  );
}

// Error handler (optional - best placed at the very end of your middleware stack)
app.use((error, req, res, next) => {
  console.error('Global Error Handler:', error.stack);
  res.status(error.statusCode || 500).json({
    message: error.message || 'An unexpected server error occurred',
    // Only expose error details in development mode for security
    error: process.env.NODE_ENV === 'development' ? error : {},
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

