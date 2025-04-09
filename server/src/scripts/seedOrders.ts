import mongoose from 'mongoose';
import Order from '../models/Order';
import Product from '../models/Product';
import dotenv from 'dotenv';

dotenv.config();

const orderStatuses = ['pending', 'processing', 'completed', 'cancelled'] as const;

async function seedOrders() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/seafood-marketplace');
    console.log('Connected to MongoDB');

    // Get all products
    const products = await Product.find();
    if (products.length === 0) {
      throw new Error('No products found in database');
    }

    // Clear existing orders
    await Order.deleteMany({});
    console.log('Cleared existing orders');

    // Generate 20 random orders
    const orders = [];
    const currentDate = new Date();

    for (let i = 0; i < 20; i++) {
      // Randomly select a product
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      
      // Generate random quantity between 1 and 10
      const quantity = Math.floor(Math.random() * 10) + 1;
      
      // Calculate total price
      const totalPrice = randomProduct.price * quantity;
      
      // Randomly select a status
      const status = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
      
      // Create order with a date within the last 30 days
      const randomDays = Math.floor(Math.random() * 30);
      const orderDate = new Date(currentDate);
      orderDate.setDate(orderDate.getDate() - randomDays);

      orders.push({
        product: randomProduct._id,
        quantity,
        totalPrice,
        status,
        createdAt: orderDate,
        updatedAt: orderDate
      });
    }

    // Insert orders
    const insertedOrders = await Order.insertMany(orders);
    console.log(`Successfully inserted ${insertedOrders.length} orders`);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding orders:', error);
    process.exit(1);
  }
}

seedOrders(); 