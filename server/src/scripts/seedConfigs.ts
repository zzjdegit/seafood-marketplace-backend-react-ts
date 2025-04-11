import mongoose from 'mongoose';
import { ConfigModel } from '../models/config';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/seafood-marketplace';

const generateRandomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const generateConfigData = () => {
  const statuses = ['normal', 'warning', 'error'];
  const deliveryStatuses = ['delivered', 'delivering', 'undelivered'];
  const upgradeStatuses = ['upgraded', 'not_upgraded'];
  
  const names = [
    '海鲜配送配置',
    '冷链运输配置',
    '仓储管理配置',
    '温度监控配置',
    '质量检测配置',
    '包装标准配置',
    '配送路线配置',
    '库存预警配置',
    '供应商管理配置',
    '客户服务配置'
  ];

  return {
    name: names[Math.floor(Math.random() * names.length)] + `_${Math.floor(Math.random() * 1000)}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    deliveryStatus: deliveryStatuses[Math.floor(Math.random() * deliveryStatuses.length)],
    upgradeDeliveryStatus: upgradeStatuses[Math.floor(Math.random() * upgradeStatuses.length)],
    totalDelivery: Math.floor(Math.random() * 100),
    deliveryRate: Math.random() * 100,
    upgradeRate: Math.random() * 100,
    lastDeliveryTime: generateRandomDate(new Date(2024, 0, 1), new Date()),
    createdAt: generateRandomDate(new Date(2024, 0, 1), new Date()),
    updatedAt: new Date()
  };
};

const seedConfigs = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await ConfigModel.deleteMany({});
    console.log('Cleared existing config data');

    // Generate and insert new data
    const configs = Array.from({ length: 20 }, generateConfigData);
    await ConfigModel.insertMany(configs);
    console.log('Successfully seeded 20 config records');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding config data:', error);
    process.exit(1);
  }
};

seedConfigs(); 