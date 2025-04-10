import express from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const router = express.Router();

// Get user statistics
router.get('/statistics', async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          adminUsers: {
            $sum: {
              $cond: [{ $eq: ['$role', 'admin'] }, 1, 0]
            }
          },
          regularUsers: {
            $sum: {
              $cond: [{ $eq: ['$role', 'user'] }, 1, 0]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalUsers: 1,
          adminUsers: 1,
          regularUsers: 1
        }
      }
    ]);

    res.json(stats[0] || { totalUsers: 0, adminUsers: 0, regularUsers: 0 });
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    res.status(500).json({ message: 'Error fetching user statistics' });
  }
});

// Get all users with pagination, search, and sorting
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      search = '',
      role = '',
      sortField = 'createdAt',
      sortOrder = '1'
    } = req.query;

    const query: any = {};
    
    // Add search filter
    if (search && typeof search === 'string') {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];

      // If search term looks like an ObjectId, add it to the search
      if (mongoose.Types.ObjectId.isValid(search)) {
        query.$or.push({ _id: new mongoose.Types.ObjectId(search) });
      }
    }

    // Add role filter
    if (role) {
      const roles = Array.isArray(role) ? role : (typeof role === 'string' ? role.split(',') : []);
      query.role = { $in: roles };
    }

    // Create sort object
    const sort: any = {};
    if (sortField) {
      sort[sortField as string] = parseInt(sortOrder as string);
    }

    const skip = (Number(page) - 1) * Number(pageSize);
    
    const [users, total] = await Promise.all([
      User.find(query)
        .sort(sort)
        .skip(skip)
        .limit(Number(pageSize))
        .select('-password'), // Exclude password field
      User.countDocuments(query)
    ]);

    res.json({
      data: users,
      total
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Create new user
router.post('/', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: role || 'user'
    });

    await user.save();
    res.status(201).json(user); // Password will be excluded due to toJSON transform
  } catch (error: any) {
    console.error('Error creating user:', error);
    res.status(400).json({ message: 'Error creating user', error: error.message });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// Update user
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password, role } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const updateData: any = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    
    // If password is being updated, hash it
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const user = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(400).json({ message: 'Error updating user' });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findByIdAndDelete(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(400).json({ message: 'Error deleting user' });
  }
});

export default router; 