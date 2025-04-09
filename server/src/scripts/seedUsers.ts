import mongoose from 'mongoose';
import User from '../models/User';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const users = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
    password: "password123",
    role: "user",
    address: "123 Main St, Boston, MA 02108",
    phone: "617-555-0101"
  },
  {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    password: "password123",
    role: "user",
    address: "456 Park Ave, New York, NY 10022",
    phone: "212-555-0102"
  },
  {
    name: "Admin User",
    email: "admin@seafood.com",
    password: "admin123",
    role: "admin",
    address: "789 Ocean Dr, Miami, FL 33139",
    phone: "305-555-0103"
  },
  {
    name: "Seafood Lover",
    email: "seafood.lover@example.com",
    password: "password123",
    role: "user",
    address: "321 Beach Rd, San Diego, CA 92109",
    phone: "619-555-0104"
  },
  {
    name: "Fish Market",
    email: "market@example.com",
    password: "password123",
    role: "user",
    address: "567 Harbor Blvd, Seattle, WA 98101",
    phone: "206-555-0105"
  },
  {
    name: "Chef Gordon",
    email: "chef.gordon@example.com",
    password: "password123",
    role: "user",
    address: "890 Restaurant Row, Chicago, IL 60601",
    phone: "312-555-0106"
  },
  {
    name: "Mary Wilson",
    email: "mary.wilson@example.com",
    password: "password123",
    role: "user",
    address: "432 Pine St, Portland, OR 97201",
    phone: "503-555-0107"
  },
  {
    name: "Fresh Catch",
    email: "fresh.catch@example.com",
    password: "password123",
    role: "user",
    address: "765 Dock St, Baltimore, MD 21230",
    phone: "410-555-0108"
  },
  {
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    password: "password123",
    role: "user",
    address: "543 Market St, San Francisco, CA 94105",
    phone: "415-555-0109"
  },
  {
    name: "Mike Brown",
    email: "mike.brown@example.com",
    password: "password123",
    role: "user",
    address: "876 State St, New Orleans, LA 70130",
    phone: "504-555-0110"
  },
  {
    name: "Seafood Wholesale",
    email: "wholesale@example.com",
    password: "password123",
    role: "user",
    address: "234 Commerce St, Houston, TX 77002",
    phone: "713-555-0111"
  },
  {
    name: "Lisa Garcia",
    email: "lisa.garcia@example.com",
    password: "password123",
    role: "user",
    address: "654 Bay St, Tampa, FL 33602",
    phone: "813-555-0112"
  },
  {
    name: "Ocean Delights",
    email: "ocean.delights@example.com",
    password: "password123",
    role: "user",
    address: "987 Coastal Hwy, Charleston, SC 29401",
    phone: "843-555-0113"
  },
  {
    name: "David Kim",
    email: "david.kim@example.com",
    password: "password123",
    role: "user",
    address: "345 Pearl St, Brooklyn, NY 11201",
    phone: "718-555-0114"
  },
  {
    name: "Fresh Fish Daily",
    email: "fresh.fish@example.com",
    password: "password123",
    role: "user",
    address: "789 Wharf St, Boston, MA 02110",
    phone: "617-555-0115"
  },
  {
    name: "Emma White",
    email: "emma.white@example.com",
    password: "password123",
    role: "user",
    address: "432 River Rd, Austin, TX 78701",
    phone: "512-555-0116"
  },
  {
    name: "Coastal Market",
    email: "coastal.market@example.com",
    password: "password123",
    role: "user",
    address: "654 Shore Dr, Virginia Beach, VA 23451",
    phone: "757-555-0117"
  },
  {
    name: "Tom Wilson",
    email: "tom.wilson@example.com",
    password: "password123",
    role: "user",
    address: "876 Lake St, Chicago, IL 60601",
    phone: "312-555-0118"
  },
  {
    name: "Pacific Seafood",
    email: "pacific.seafood@example.com",
    password: "password123",
    role: "user",
    address: "123 Ocean Ave, Los Angeles, CA 90012",
    phone: "213-555-0119"
  },
  {
    name: "Anna Martinez",
    email: "anna.martinez@example.com",
    password: "password123",
    role: "user",
    address: "567 Gulf Blvd, St. Petersburg, FL 33701",
    phone: "727-555-0120"
  }
];

async function seedUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/seafood-marketplace');
    console.log('Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Hash passwords and insert users
    const usersWithHashedPasswords = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10)
      }))
    );

    const insertedUsers = await User.insertMany(usersWithHashedPasswords);
    console.log(`Successfully inserted ${insertedUsers.length} users`);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
}

seedUsers(); 