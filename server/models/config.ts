import mongoose, { Schema, Document } from 'mongoose';

export interface IConfig extends Document {
  name: string;
  status: 'normal' | 'warning' | 'error' | 'other';
  marchBaseline: number;
  marchWarning: string;
  aprilBaseline: number;
  aprilWarning: string;
  totalDelivery: number;
  deliveryRate: number;
  upgradeRate: number;
  upgradeDeliveryStatus: string;
  deliveryStatus: 'delivered' | 'delivering' | 'undelivered' | 'other';
  lastDeliveryTime: Date;
  effectiveTime: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ConfigSchema: Schema = new Schema({
  name: { type: String, required: true },
  status: {
    type: String,
    enum: ['normal', 'warning', 'error', 'other'],
    default: 'normal'
  },
  marchBaseline: { type: Number, required: true },
  marchWarning: { type: String },
  aprilBaseline: { type: Number, required: true },
  aprilWarning: { type: String },
  totalDelivery: { type: Number, default: 0 },
  deliveryRate: { type: Number, default: 0 },
  upgradeRate: { type: Number, default: 0 },
  upgradeDeliveryStatus: { type: String },
  deliveryStatus: {
    type: String,
    enum: ['delivered', 'delivering', 'undelivered', 'other'],
    default: 'undelivered'
  },
  lastDeliveryTime: { type: Date },
  effectiveTime: { type: Date },
}, {
  timestamps: true
});

export const ConfigModel = mongoose.model<IConfig>('Config', ConfigSchema); 