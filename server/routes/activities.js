import express from 'express';
import Activity from '../models/Activity.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/activities
// @desc    Get recent activities for the current user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const activities = await Activity.find({ userId: req.user._id })
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    res.json({
      success: true,
      data: activities,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: await Activity.countDocuments({ userId: req.user._id })
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/activities/all
// @desc    Get all recent activities (admin only)
// @access  Private/Admin
router.get('/all', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const { limit = 20, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const activities = await Activity.find()
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    res.json({
      success: true,
      data: activities,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: await Activity.countDocuments()
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/activities
// @desc    Create a new activity log
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { action, description, type, entityType, entityId, metadata } = req.body;

    const activity = new Activity({
      userId: req.user._id,
      action,
      description,
      type,
      entityType,
      entityId,
      metadata
    });

    await activity.save();

    res.status(201).json({
      success: true,
      data: activity
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
