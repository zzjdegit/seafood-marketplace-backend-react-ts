import express from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { SortOrder } from 'mongoose';

const router = express.Router();

// Get order statistics
router.get('/statistics', async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          completedOrders: {
            $sum: {
              $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
            }
          },
          totalRevenue: {
            $sum: '$totalPrice'
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalOrders: 1,
          completedOrders: 1,
          totalRevenue: { $round: ['$totalRevenue', 2] }
        }
      }
    ]);

    res.json(stats[0] || { totalOrders: 0, completedOrders: 0, totalRevenue: 0 });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order statistics' });
  }
});

// Get all orders with pagination, search, and sorting
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      search = '',
      status = '',
      sortField = 'createdAt',
      sortOrder = '1'
    } = req.query;

    const query: any = {};
    
    // Add search condition if provided
    if (search && typeof search === 'string') {
      query.$or = [
        { status: { $regex: search, $options: 'i' } }
      ];

      // If search term looks like an ObjectId, add it to the search
      if (mongoose.Types.ObjectId.isValid(search)) {
        query.$or.push({ _id: new mongoose.Types.ObjectId(search) });
      }
    }

    // Add status filter if provided
    if (status) {
      // Handle both single status and multiple statuses
      const statuses = Array.isArray(status) ? status : (typeof status === 'string' ? status.split(',') : []);
      query.status = { $in: statuses };
    }

    // Create sort object
    const sort: any = {};
    if (sortField) {
      sort[sortField as string] = parseInt(sortOrder as string);
    }
    
    const orders = await Order.find(query)
      .populate('product')
      .sort(sort)
      .skip((Number(page) - 1) * Number(pageSize))
      .limit(Number(pageSize));

    const total = await Order.countDocuments(query);

    res.json({
      data: orders,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Create new order
router.post('/', async (req, res) => {
  try {
    const { productId, quantity, status } = req.body;

    // Validate product existence and calculate total price
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const totalPrice = product.price * quantity;

    const order = new Order({
      product: productId,
      quantity,
      totalPrice,
      status: status || 'pending'
    });

    await order.save();
    await order.populate('product');
    res.status(201).json(order);
  } catch (error: any) {
    res.status(400).json({ message: 'Error creating order', error: error.message });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    const order = await Order.findById(id).populate('product');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order' });
  }
});

// Update order
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(400).json({ message: 'Error updating order' });
  }
});

// Delete order
router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: 'Error deleting order' });
  }
});

export default router; 