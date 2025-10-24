import express from 'express';
import Repair from '../models/Repair.js';
import User from '../models/User.js';
import { protect, authorize } from '../middleware/auth.js';
import { logRepair } from '../utils/activityLogger.js';

const router = express.Router();

// @route   GET /api/repairs
// @desc    Get all repairs with visibility rules
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { status, search, user } = req.query;
    let query = {};

    // Visibility rules based on user role and status
    if (req.user.role !== 'admin') {
      query.$or = [
        { status: 'waiting' },
        { status: 'processing', assignedTo: req.user.id },
        { status: 'completed', completedBy: req.user.id }
      ];
    }

    if (status) {
      query.status = status;
    }

    if (search) {
      // Escape special regex characters
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$and = [
        query,
        {
          $or: [
            { repairNumber: { $regex: escapedSearch, $options: 'i' } },
            { customerName: { $regex: escapedSearch, $options: 'i' } },
            { customerPhone: { $regex: escapedSearch, $options: 'i' } },
            { mobileModel: { $regex: escapedSearch, $options: 'i' } }
          ]
        }
      ];
    }

    const repairs = await Repair.find(query)
      .populate('addedBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('completedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: repairs.length,
      data: repairs
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/repairs/:id
// @desc    Get single repair
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const repair = await Repair.findById(req.params.id)
      .populate('assignedTo', 'name email');
    
    if (!repair) {
      return res.status(404).json({ message: 'Repair not found' });
    }
    
    res.json({
      success: true,
      data: repair
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/repairs
// @desc    Create repair
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    console.log('🔧 POST /api/repairs - Request body:', req.body);
    console.log('🔧 POST /api/repairs - User from auth:', req.user);
    console.log('🔧 POST /api/repairs - User ID:', req.user?.id);
    console.log('🔧 POST /api/repairs - AssignedTo from body:', req.body.assignedTo);
    
    if (!req.user || !req.user.id) {
      console.error('❌ POST /api/repairs - No user found in request');
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const repairData = {
      ...req.body,
      addedBy: req.user.id,
      assignedTo: req.body.assignedTo || req.user.id
    };
    
    console.log('🔧 POST /api/repairs - Final repair data:', repairData);
    console.log('🔧 POST /api/repairs - About to create repair...');
    
    // If created as completed, set completedBy
    if (repairData.status === 'completed') {
      repairData.completedBy = req.user.id;
      repairData.completedAt = new Date();
    }
    
    console.log('🔧 POST /api/repairs - Creating repair with data:', repairData);
    const repair = await Repair.create(repairData);
    console.log('✅ POST /api/repairs - Repair created successfully:', repair._id);
    console.log('✅ POST /api/repairs - Repair details:', {
      id: repair._id,
      repairNumber: repair.repairNumber,
      status: repair.status,
      customerName: repair.customerName
    });
    
    console.log('🔧 POST /api/repairs - Populating repair data...');
    const populatedRepair = await Repair.findById(repair._id)
      .populate('addedBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('completedBy', 'name email');

    // Log repair activity
    await logRepair(req.user.id, repair._id, repair.repairNumber, repair.status, repair.customerName);

    res.status(201).json({
      success: true,
      data: populatedRepair
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/repairs/:id
// @desc    Update repair
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    console.log('🔧 PUT /api/repairs/:id called for repair:', req.params.id);
    console.log('🔧 Request body:', req.body);
    console.log('🔧 User making request:', req.user.id, req.user.role);
    console.log('🔧 Route handler triggered at:', new Date().toISOString());
    
    const repair = await Repair.findById(req.params.id);
    
    if (!repair) {
      return res.status(404).json({ message: 'Repair not found' });
    }

    // Check if status is being changed to completed (BEFORE updating)
    const isBeingCompleted = req.body.status === 'completed' && repair.status !== 'completed';
    
    console.log('🔧 Repair status change check:', {
      currentStatus: repair.status,
      newStatus: req.body.status,
      isBeingCompleted: isBeingCompleted,
      repairId: repair._id,
      repairNumber: repair.repairNumber,
      completedBy: repair.completedBy,
      userRole: req.user.role
    });
    
    // Update repair
    Object.assign(repair, req.body);
    
    // If being completed, set completedBy and completedAt
    if (isBeingCompleted) {
        console.log('🔧 Setting repair as completed by user:', req.user.id);
        console.log('🔧 Repair completion logic triggered!');
        repair.completedBy = req.user.id;
        repair.completedAt = new Date();
        console.log('🔧 Repair completedBy set to:', repair.completedBy);
        console.log('🔧 Repair completion date:', repair.completedAt);
        console.log('🔧 Today is:', new Date());
    } else {
        console.log('🔧 Repair is NOT being completed, skipping commission logic');
    }
    
    await repair.save();
    console.log('🔧 Repair saved successfully:', {
      repairId: repair._id,
      status: repair.status,
      completedBy: repair.completedBy,
      completedAt: repair.completedAt
    });

    // If being completed, create commission record
    if (isBeingCompleted && repair.completedBy) {
      console.log('🔧 Repair being completed, checking for commission...');
      console.log('🔧 Commission creation conditions:', {
        isBeingCompleted,
        hasCompletedBy: !!repair.completedBy,
        completedBy: repair.completedBy
      });
      console.log('🔧 Repair details:', {
        repairId: repair._id,
        repairNumber: repair.repairNumber,
        repairCost: repair.repairCost,
        completedBy: repair.completedBy
      });
      
    } else {
      console.log('❌ Repair not being completed or no completedBy user');
      console.log('❌ Debug info:', {
        isBeingCompleted,
        hasCompletedBy: !!repair.completedBy,
        status: req.body.status,
        currentStatus: repair.status
      });
    }

    console.log('🔧 Sending response for repair:', repair._id);
    const populatedRepair = await Repair.findById(repair._id)
      .populate('addedBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('completedBy', 'name email');

    res.json({
      success: true,
      data: populatedRepair
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/repairs/:id/payment
// @desc    Add payment to repair
// @access  Private
router.post('/:id/payment', protect, async (req, res) => {
  try {
    const { amount } = req.body;
    const repair = await Repair.findById(req.params.id);
    
    if (!repair) {
      return res.status(404).json({ message: 'Repair not found' });
    }

    const wasCompleted = repair.status === 'completed';
    repair.amountPaid += amount;
    
    // Auto-update status if fully paid
    if (repair.amountPaid >= repair.repairCost && repair.status !== 'completed') {
      repair.status = 'completed';
      repair.completedAt = new Date();
      repair.completedBy = req.user.id;
    }

    await repair.save();


    const populatedRepair = await Repair.findById(repair._id)
      .populate('addedBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('completedBy', 'name email');

    res.json({
      success: true,
      data: populatedRepair
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/repairs/:id/upload-proof
// @desc    Upload completion proof image
// @access  Private
router.post('/:id/upload-proof', protect, async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const repair = await Repair.findById(req.params.id);
    
    if (!repair) {
      return res.status(404).json({ message: 'Repair not found' });
    }

    repair.completionProofImage = imageUrl;
    await repair.save();

    const populatedRepair = await Repair.findById(repair._id)
      .populate('addedBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('completedBy', 'name email');

    res.json({
      success: true,
      data: populatedRepair
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/repairs/stats/summary
// @desc    Get repair statistics
// @access  Private
router.get('/stats/summary', protect, async (req, res) => {
  try {
    const repairs = await Repair.find();
    
    const stats = {
      total: repairs.length,
      waiting: repairs.filter(r => r.status === 'waiting').length,
      processing: repairs.filter(r => r.status === 'processing').length,
      completed: repairs.filter(r => r.status === 'completed').length,
      totalRevenue: repairs.reduce((sum, r) => sum + r.amountPaid, 0),
      pendingPayments: repairs.reduce((sum, r) => sum + r.remainingBalance, 0)
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

