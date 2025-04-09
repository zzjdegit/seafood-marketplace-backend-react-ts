import mongoose from 'mongoose';
import Product from '../models/Product';
import dotenv from 'dotenv';

dotenv.config();

const products = [
  {
    name: "Fresh Atlantic Salmon",
    description: "Premium fresh Atlantic salmon fillet, rich in omega-3",
    price: 25.99,
    stock: 50,
    category: "Fish",
    image: "https://example.com/salmon.jpg",
    unit: "kg"
  },
  {
    name: "Tiger Prawns",
    description: "Large tiger prawns, perfect for grilling or stir-frying",
    price: 32.99,
    stock: 100,
    category: "Shellfish",
    image: "https://example.com/prawns.jpg",
    unit: "kg"
  },
  {
    name: "Pacific Cod",
    description: "Wild-caught Pacific cod, great for fish and chips",
    price: 19.99,
    stock: 75,
    category: "Fish",
    image: "https://example.com/cod.jpg",
    unit: "kg"
  },
  {
    name: "Blue Mussels",
    description: "Fresh blue mussels, perfect for seafood pasta",
    price: 12.99,
    stock: 150,
    category: "Shellfish",
    image: "https://example.com/mussels.jpg",
    unit: "kg"
  },
  {
    name: "Yellowfin Tuna",
    description: "Sushi-grade yellowfin tuna steaks",
    price: 39.99,
    stock: 30,
    category: "Fish",
    image: "https://example.com/tuna.jpg",
    unit: "kg"
  },
  {
    name: "King Crab Legs",
    description: "Alaskan king crab legs, pre-cooked and ready to eat",
    price: 59.99,
    stock: 25,
    category: "Shellfish",
    image: "https://example.com/crab.jpg",
    unit: "kg"
  },
  {
    name: "Sea Bass",
    description: "Fresh Mediterranean sea bass, whole fish",
    price: 28.99,
    stock: 40,
    category: "Fish",
    image: "https://example.com/seabass.jpg",
    unit: "kg"
  },
  {
    name: "Oysters",
    description: "Fresh Pacific oysters, perfect for raw consumption",
    price: 24.99,
    stock: 200,
    category: "Shellfish",
    image: "https://example.com/oysters.jpg",
    unit: "dozen"
  },
  {
    name: "Rainbow Trout",
    description: "Farm-raised rainbow trout, cleaned and gutted",
    price: 18.99,
    stock: 60,
    category: "Fish",
    image: "https://example.com/trout.jpg",
    unit: "kg"
  },
  {
    name: "Lobster Tail",
    description: "Premium lobster tails, perfect for special occasions",
    price: 45.99,
    stock: 35,
    category: "Shellfish",
    image: "https://example.com/lobster.jpg",
    unit: "piece"
  }
];

async function seedProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/seafood-marketplace');
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert new products
    const insertedProducts = await Product.insertMany(products);
    console.log(`Successfully inserted ${insertedProducts.length} products`);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
}

seedProducts(); 