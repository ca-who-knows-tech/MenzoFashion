const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Product = require('./models/Product');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB (using MongoDB Atlas or local)
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/menzo-fashion')
.then(() => {
  console.log('MongoDB connected');
  // Seed some data if empty
  seedData();
})
.catch(err => console.log(err));

// Seed function
const seedData = async () => {
  const count = await Product.countDocuments();
  if (count === 0) {
    const products = [
      { name: 'T-Shirt 1', price: 29.99, category: 'tshirts', sizes: ['S', 'M', 'L'], colors: ['Black', 'White'], image: '/placeholder.jpg', description: 'Comfortable cotton t-shirt' },
      { name: 'Shirt 1', price: 49.99, category: 'shirts', sizes: ['M', 'L', 'XL'], colors: ['Blue', 'Gray'], image: '/placeholder.jpg', description: 'Stylish formal shirt' },
      { name: 'Pants 1', price: 59.99, category: 'pants', sizes: ['M', 'L'], colors: ['Black'], image: '/placeholder.jpg', description: 'Classic fit pants' },
      // Add more as needed
    ];
    await Product.insertMany(products);
    console.log('Sample products added');
  }
};

// Routes
app.use('/api/products', require('./routes/products'));

app.get('/', (req, res) => {
  res.send('Menzo Fashion API');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});