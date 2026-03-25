// seedProducts.js - Run once to insert products into MongoDB
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const Product = require('./models/Product');

// Product data from frontend JSON (mapped to Product schema)
const products = [
  {
    title: "Explorer Rover",
    description: "For rough terrain and GPS navigation.",
    price: 12000,
    image: "/images/image_be2a7d.jpg",
    category: "Autonomous Robots"
  },
  {
    title: "Mini Delivery Bot",
    description: "Indoor autonomous robot with object detection.",
    price: 4000,
    image: "/images/image_b439ba.jpg",
    category: "Autonomous Robots"
  },
  {
    title: "Line Follower Kit",
    description: "DIY educational robot kit. Perfect for beginners in electronics and robotics. Easy to assemble, with IR sensors and Arduino control system support.",
    price: 30000,
    image: "/images/image_b3bd73.jpg",
    category: "Educational Kits"
  },
  {
    title: "Line Follower Kit (Advanced)",
    description: "DIY educational robot kit. Perfect for beginners in electronics and robotics. Easy to assemble, with IR sensors and Arduino control system support.",
    price: 344000,
    image: "/images/image_b3bd73.jpg",
    category: "Educational Kits"
  },
  {
    title: "Mini Delivery Bot (Pro)",
    description: "Indoor autonomous robot with object detection.",
    price: 45000,
    image: "/images/image_b439ba.jpg",
    category: "Autonomous Robots"
  },
  {
    title: "Explorer Rover (Pro)",
    description: "For rough terrain and GPS navigation.",
    price: 45000,
    image: "/images/image_be2a7d.jpg",
    category: "Autonomous Robots"
  },
  {
    title: "Industrial Robotic Arm",
    description: "High-precision arm for manufacturing and assembly.",
    price: 250000,
    image: "https://placehold.co/400x300/E3F2FD/1A237E?text=Industrial+Arm",
    category: "Industrial Robots"
  },
  {
    title: "AI Vision Module",
    description: "Advanced AI module for object recognition and tracking.",
    price: 15000,
    image: "https://placehold.co/400x300/FCE4EC/C2185B?text=AI+Vision+Module",
    category: "AI Modules"
  }
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Clear existing products to avoid duplicates
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert all products
    const inserted = await Product.insertMany(products);
    console.log(`✅ Successfully inserted ${inserted.length} products into MongoDB!`);

    inserted.forEach(p => console.log(` - [${p.category}] ${p.title} — ₹${p.price}`));

  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seed();
