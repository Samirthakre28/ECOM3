const mongoose = require('mongoose');
const Product = require('./backend/models/Product');
require('dotenv').config({ path: './backend/.env' });

const seedProducts = [
  {
    title: "Vintage Wool Trench Coat", brand: "Thrifted", price: 85.00, size: "L", condition: "Excellent", category: "Outerwear", image: "images/hero_image.png", badge: "New Arrival", description: "A beautiful vintage wool trench coat.", stock_status: "In Stock"
  },
  {
    title: "Retro Anorak Jacket", brand: "Vintage", price: 599.00, size: "One Size", condition: "Good", category: "Unisex", image: "images/hero_image.png", badge: "New Arrival", description: "Unique vintage piece.", stock_status: "In Stock"
  },
  {
    title: "Classic Checkered Button-Down Shirt", brand: "Vintage", price: 299.00, size: "M", condition: "Good", category: "Men", image: "images/checkered_shirt.jpg", badge: "Vintage", description: "Classic button-down.", stock_status: "In Stock"
  },
  {
    title: "High-Waisted Corduroy Pants", brand: "Vintage", price: 399.00, size: "28", condition: "Good", category: "Women", image: "images/cargo_pants.png", badge: "Trending", description: "Corduroy pants.", stock_status: "In Stock"
  },
  {
    title: "Chunky Platform Loafers", brand: "Vintage", price: 499.00, size: "8", condition: "Good", category: "Accessories", image: "images/chunky_loafers.png", badge: "Rare Find", description: "Chunky loafers.", stock_status: "In Stock"
  },
  {
    title: "Pastel Knit Cardigan", brand: "Vintage", price: 349.00, size: "S", condition: "Good", category: "Women", image: "images/pastel_cardigan.png", badge: "New Arrival", description: "Pastel cardigan.", stock_status: "In Stock"
  },
  {
    title: "Oversized Flannel Shirt", brand: "Vintage", price: 299.00, size: "L", condition: "Good", category: "Unisex", image: "images/jacket.jpg", badge: "New Arrival", description: "Oversized flannel.", stock_status: "In Stock"
  },
  {
    title: "Graphic Band Tee", brand: "Vintage", price: 199.00, size: "M", condition: "Good", category: "Men", image: "images/graphic_tee.png", badge: "Trending", description: "Band tee.", stock_status: "In Stock"
  }
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected for seeding.');
        await Product.deleteMany();
        await Product.insertMany(seedProducts);
        console.log('Seeded products.');
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

seed();
