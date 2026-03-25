// test_connections.js
const mongoose = require('mongoose');
const fs = require('fs');
const Product = require('./models/Product'); // To see if Product.find() fails

const uri1 = 'mongodb+srv://robotic_user:QZk9VUPJvbUPlMCL@cluster0.hhqx6ye.mongodb.net/robotic_co?retryWrites=true&w=majority&authSource=admin';

let logContent = '';
function log(msg) {
    console.log(msg);
    logContent += msg + '\n';
}

async function run() {
    log(`\nTesting Model Query with Active URI...`);
    try {
        const conn = await mongoose.connect(uri1, { serverSelectionTimeoutMS: 5000 });
        log(`✅ Connected! Host: ${conn.connection.host}`);
        
        log(` -> Running Product.find() query...`);
        const products = await Product.find();
        log(`✅ Query Succeeded! Found ${products.length} products.`);
        
        await mongoose.disconnect();
    } catch (err) {
        log(`❌ Failed: ${err.message}`);
        try { await mongoose.disconnect(); } catch(e) {}
    }
    fs.writeFileSync('test_mongo_output.txt', logContent);
    process.exit(0);
}

run();
