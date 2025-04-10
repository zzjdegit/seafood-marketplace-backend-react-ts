import express from 'express';
import Product from '../models/Product';
import mongoose from 'mongoose';

const router = express.Router();

// Get product statistics
router.get('/statistics', async (req, res) => {
  try {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalStock: { $sum: '$stock' },
          totalPrice: { $sum: '$price' },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          totalProducts: 1,
          totalStock: 1,
          averagePrice: { $round: [{ $divide: ['$totalPrice', '$count'] }, 2] }
        }
      }
    ]);

    res.json(stats[0] || { totalProducts: 0, totalStock: 0, averagePrice: 0 });
  } catch (error) {
    console.error('Error fetching product statistics:', error);
    res.status(500).json({ message: 'Error fetching product statistics' });
  }
});

// Search products
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ],
    }).limit(10);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error searching products', error });
  }
});

// Get all products with pagination and search
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      pageSize = 10, 
      search = '', 
      category = '', 
      price = '',
      stock = '',
      sortField = 'createdAt', 
      sortOrder = '1' 
    } = req.query;

    const skip = (Number(page) - 1) * Number(pageSize);

    // Build query conditions
    const query: any = {};
    
    // Add search condition if search text exists
    if (search && typeof search === 'string') {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
      
      if (mongoose.Types.ObjectId.isValid(search)) {
        query.$or.push({ _id: new mongoose.Types.ObjectId(search) });
      }
    }

    // Add category condition if category is specified
    if (category && typeof category === 'string' && category !== '') {
      const categories = category.split(',').filter(Boolean);
      if (categories.length > 0) {
        query.category = { $in: categories };
      }
    }

    // Add price range condition if specified
    if (price && typeof price === 'string') {
      const [min, max] = price.split('-').map(Number);
      if (!isNaN(min) && !isNaN(max)) {
        query.price = { $gte: min, $lt: max };
      }
    }

    // Add stock range condition if specified
    if (stock && typeof stock === 'string') {
      const [min, max] = stock.split('-').map(Number);
      if (!isNaN(min) && !isNaN(max)) {
        query.stock = { $gte: min, $lt: max };
      }
    }

    // Create sort object
    const sort: any = {};
    if (sortField && typeof sortField === 'string') {
      sort[sortField] = parseInt(sortOrder as string);
    }

    const [products, total] = await Promise.all([
      Product.find(query)
        .skip(skip)
        .limit(Number(pageSize))
        .sort(sort),
      Product.countDocuments(query),
    ]);

    res.json({
      data: products,
      total,
      page: Number(page),
      pageSize: Number(pageSize)
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products', error });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error });
  }
});

// Create new product
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Error creating product', error });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: 'Error updating product', error });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product', error });
  }
});

export default router; 