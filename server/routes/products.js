import express from 'express';
import Product from '../models/Product.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { category, search, lowStock } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      // Escape special regex characters
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { name: { $regex: escapedSearch, $options: 'i' } },
        { sku: { $regex: escapedSearch, $options: 'i' } }
      ];
    }

    if (lowStock === 'true') {
      query.quantity = { $lte: query.minStock || 5 };
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/products
// @desc    Create product
// @access  Private/Admin, Sales & Tech
router.post('/', protect, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private/Admin, Sales & Tech
router.put('/:id', protect, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Private/Admin, Sales & Tech
router.delete('/:id', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await product.deleteOne();
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/products/stats/summary
// @desc    Get product statistics
// @access  Private/Admin, Sales & Tech
router.get('/stats/summary', protect, async (req, res) => {
  try {
    const products = await Product.find();
    const totalProducts = products.length;
    const totalStockValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    const lowStockItems = products.filter(p => p.quantity <= p.minStock).length;
    const categories = [...new Set(products.map(p => p.category))];

    res.json({
      success: true,
      data: {
        totalProducts,
        totalStockValue,
        lowStockItems,
        categories
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

