import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { logProfileUpdate } from '../utils/activityLogger.js';

const router = express.Router();

// Get all users
router.get('/', protect, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('❌ Users fetch error:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Create new user
router.post('/', protect, async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'sales_tech',
      phone: phone || '',
      isActive: true
    });
    
    // Return user without password
    const userResponse = await User.findById(user._id).select('-password');
    res.status(201).json({
      success: true,
      data: userResponse
    });
  } catch (error) {
    console.error('❌ User creation error:', error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// Get user by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
});

// Update user
router.put('/:id', protect, async (req, res) => {
  try {
    const { name, email, role, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role, phone },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
});

// Update user profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body;
    const userId = req.user._id;
    
    const user = await User.findById(userId).select('+password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update basic info
    if (name) user.name = name;
    if (email) user.email = email;
    
    // Update password if provided
    if (currentPassword && newPassword) {
      if (!(await user.comparePassword(currentPassword))) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      user.password = newPassword;
    }
    
    await user.save();
    
    // Log profile update activity
    await logProfileUpdate(userId, user.email);
    
    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

// Delete user
router.delete('/:id', protect, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});

export default router;
