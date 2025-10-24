import express from 'express';
import Sale from '../models/Sale.js';
import Product from '../models/Product.js';
import { protect } from '../middleware/auth.js';
import { logSale } from '../utils/activityLogger.js';

const router = express.Router();

// @route   GET /api/sales
// @desc    Get all sales
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = {};

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const sales = await Sale.find(query)
      .populate('soldBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: sales.length,
      data: sales
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/sales/:id
// @desc    Get single sale
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate('soldBy', 'name email')
      .populate('items.product', 'name sku');
    
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    
    res.json({
      success: true,
      data: sale
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/sales
// @desc    Create sale
// @access  Private/Admin, Sales & Tech
router.post('/', protect, async (req, res) => {
  try {
    const { items, customerName, customerPhone, paymentMethod, tax, discount } = req.body;

    let subtotal = 0;
    let totalProfit = 0;

    // Process items and update inventory
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Available: ${product.quantity}` 
        });
      }

      // Calculate subtotals
      const itemSubtotal = item.price * item.quantity;
      const itemProfit = (item.price - product.cost) * item.quantity;
      
      subtotal += itemSubtotal;
      totalProfit += itemProfit;

      // Update product quantity
      product.quantity -= item.quantity;
      await product.save();

      // Update item with product details
      item.product = item.productId;
      item.productName = product.name;
      item.cost = product.cost;
      item.subtotal = itemSubtotal;
      item.profit = itemProfit;
    }

    const total = subtotal + (tax || 0) - (discount || 0);

    const sale = await Sale.create({
      items,
      customerName,
      customerPhone,
      subtotal,
      tax: tax || 0,
      discount: discount || 0,
      total,
      totalProfit,
      paymentMethod: paymentMethod || 'cash',
      soldBy: req.user.id
    });

    const populatedSale = await Sale.findById(sale._id)
      .populate('soldBy', 'name email');

    // Log sale activity
    await logSale(req.user.id, sale._id, sale.total, sale.customerName);

    res.status(201).json({
      success: true,
      data: populatedSale
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/sales/stats/summary
// @desc    Get sales statistics
// @access  Private/Admin, Sales & Tech
router.get('/stats/summary', protect, async (req, res) => {
  try {
    const { period = 'today' } = req.query;
    
    let startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    if (period === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === 'month') {
      startDate.setMonth(startDate.getMonth() - 1);
    }

    const sales = await Sale.find({
      createdAt: { $gte: startDate }
    });

    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
    const totalProfit = sales.reduce((sum, s) => sum + s.totalProfit, 0);

    res.json({
      success: true,
      data: {
        totalSales,
        totalRevenue,
        totalProfit,
        period
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

