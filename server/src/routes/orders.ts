import express from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import mongoose from 'mongoose';

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
    console.error('Error fetching order statistics:', error);
    res.status(500).json({ message: 'Error fetching order statistics' });
  }
});

// Get all orders with pagination, search, and sorting
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      search = '',
      status = '',
      sortField = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query: any = {};
    
    // Add search filter
    if (search) {
      query.$or = [
        { 'product.name': { $regex: search, $options: 'i' } },
        { status: { $regex: search, $options: 'i' } }
      ];
    }

    // Add status filter
    if (status) {
      query.status = status;
    }

    // Create sort object
    const sort: any = {};
    sort[sortField as string] = sortOrder === 'desc' ? -1 : 1;

    const skip = (Number(page) - 1) * Number(pageSize);
    
    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort(sort)
        .skip(skip)
        .limit(Number(pageSize))
        .populate('product'),
      Order.countDocuments(query)
    ]);

    res.json({
      data: orders,
      total,
      page: Number(page),
      pageSize: Number(pageSize)
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
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
    console.error('Error creating order:', error);
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
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Error fetching order' });
  }
});

// Update order
router.patch('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).populate('product');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
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
    console.error('Error deleting order:', error);
    res.status(400).json({ message: 'Error deleting order' });
  }
});

export default router; 