import mongoose from 'mongoose';

const configSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['normal', 'warning', 'error'],
    default: 'normal'
  },
  deliveryStatus: {
    type: String,
    enum: ['delivered', 'delivering', 'undelivered'],
    default: 'undelivered'
  },
  upgradeDeliveryStatus: {
    type: String,
    enum: ['upgraded', 'not_upgraded'],
    default: 'not_upgraded'
  },
  totalDelivery: {
    type: Number,
    default: 0
  },
  deliveryRate: {
    type: Number,
    default: 0
  },
  upgradeRate: {
    type: Number,
    default: 0
  },
  lastDeliveryTime: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export const ConfigModel = mongoose.model('Config', configSchema); 