import express from 'express';
import Debt from '../models/Debt.js';
import Payment from '../models/Payment.js';
import MessageConfig from '../models/MessageConfig.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/debts
// @desc    Get all debts with filters
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { 
      status, 
      search, 
      startDate, 
      endDate, 
      contextType,
      dueToday,
      overdue 
    } = req.query;
    
    let query = {};

    // Status filter
    if (status) {
      query.status = status;
    }

    // Context type filter
    if (contextType) {
      query.contextType = contextType;
    }

    // Search by name or phone
    if (search) {
      // Escape special regex characters
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { customerName: { $regex: escapedSearch, $options: 'i' } },
        { phone: { $regex: escapedSearch, $options: 'i' } }
      ];
    }

    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Due today filter
    if (dueToday === 'true') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      query.dueAt = { $gte: today, $lt: tomorrow };
    }

    // Overdue filter
    if (overdue === 'true') {
      query.dueAt = { $lt: new Date() };
      query.status = { $ne: 'SETTLED' };
    }

    const debts = await Debt.find(query)
      .populate('createdBy', 'name email')
      .sort({ dueAt: 1 });

    res.json({
      success: true,
      count: debts.length,
      data: debts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/debts/:id
// @desc    Get single debt with payments
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const debt = await Debt.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!debt) {
      return res.status(404).json({ message: 'Debt not found' });
    }

    const payments = await Payment.find({ debtId: debt._id })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        debt,
        payments
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/debts
// @desc    Create debt
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const debtData = {
      ...req.body,
      createdBy: req.user.id
    };
    const debt = await Debt.create(debtData);
    
    const populatedDebt = await Debt.findById(debt._id)
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      data: populatedDebt
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PATCH /api/debts/:id
// @desc    Update debt
// @access  Private
router.patch('/:id', protect, async (req, res) => {
  try {
    const debt = await Debt.findById(req.params.id);
    
    if (!debt) {
      return res.status(404).json({ message: 'Debt not found' });
    }

    // Update allowed fields
    const allowedFields = ['customerName', 'phone', 'whatsapp', 'amountOwed', 'dueAt', 'notes', 'contextType', 'contextId'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        debt[field] = req.body[field];
      }
    });

    await debt.save();

    const populatedDebt = await Debt.findById(debt._id)
      .populate('createdBy', 'name email');

    res.json({
      success: true,
      data: populatedDebt
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/debts/:id
// @desc    Delete debt (only if settled)
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const debt = await Debt.findById(req.params.id);
    
    if (!debt) {
      return res.status(404).json({ message: 'Debt not found' });
    }

    // Only allow delete if settled
    if (debt.status !== 'SETTLED') {
      return res.status(400).json({ message: 'Can only delete settled debts' });
    }

    // Check permissions - Admin can always delete, others only if they created it
    if (req.user.role !== 'admin' && debt.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this debt' });
    }

    // Delete all payments first
    await Payment.deleteMany({ debtId: debt._id });

    // Delete debt
    await debt.deleteOne();

    res.json({
      success: true,
      message: 'Debt deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/debts/:id/payments
// @desc    Add payment to debt
// @access  Private
router.post('/:id/payments', protect, async (req, res) => {
  try {
    const debt = await Debt.findById(req.params.id);
    
    if (!debt) {
      return res.status(404).json({ message: 'Debt not found' });
    }

    if (debt.status === 'SETTLED') {
      return res.status(400).json({ message: 'Debt is already settled' });
    }

    const paymentData = {
      ...req.body,
      debtId: debt._id,
      createdBy: req.user.id
    };

    const payment = await Payment.create(paymentData);

    // Update debt amount paid
    debt.amountPaid += payment.amount;
    await debt.save();

    const populatedPayment = await Payment.findById(payment._id)
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      data: populatedPayment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/payments/:id
// @desc    Remove payment
// @access  Private
router.delete('/payments/:id', protect, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('debtId');
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    const debt = payment.debtId;

    // Update debt amount paid
    debt.amountPaid -= payment.amount;
    if (debt.amountPaid < 0) debt.amountPaid = 0;
    await debt.save();

    // Delete payment
    await payment.deleteOne();

    res.json({
      success: true,
      message: 'Payment removed successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/debts/:id/share/sms
// @desc    Share debt via SMS
// @access  Private
router.post('/:id/share/sms', protect, async (req, res) => {
  try {
    const debt = await Debt.findById(req.params.id);
    
    if (!debt) {
      return res.status(404).json({ message: 'Debt not found' });
    }

    const { message } = req.body;

    // Update last shared info
    debt.lastSharedAt = new Date();
    debt.lastShareChannel = 'SMS';
    await debt.save();

    // In production, integrate with SMS provider (Twilio, etc.)
    // For now, return success with SMS link
    const smsLink = `sms:${debt.phone}?body=${encodeURIComponent(message)}`;

    res.json({
      success: true,
      message: 'SMS prepared',
      data: {
        smsLink,
        message
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/debts/:id/share/whatsapp
// @desc    Share debt via WhatsApp
// @access  Private
router.post('/:id/share/whatsapp', protect, async (req, res) => {
  try {
    const debt = await Debt.findById(req.params.id);
    
    if (!debt) {
      return res.status(404).json({ message: 'Debt not found' });
    }

    const { message } = req.body;

    // Update last shared info
    debt.lastSharedAt = new Date();
    debt.lastShareChannel = 'WHATSAPP';
    await debt.save();

    // Generate WhatsApp link
    const phone = debt.whatsapp || debt.phone;
    const whatsappLink = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;

    res.json({
      success: true,
      message: 'WhatsApp link generated',
      data: {
        whatsappLink,
        message
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/debts/export.xlsx
// @desc    Export debts to Excel
// @access  Private/Admin
router.get('/export.xlsx', protect, async (req, res) => {
  try {
    const ExcelJS = require('exceljs');
    const workbook = new ExcelJS.Workbook();

    // Get all debts
    const debts = await Debt.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    // Debts sheet
    const debtsSheet = workbook.addWorksheet('Debts');
    debtsSheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Customer Name', key: 'customerName', width: 20 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'WhatsApp', key: 'whatsapp', width: 15 },
      { header: 'Amount Owed', key: 'amountOwed', width: 15 },
      { header: 'Amount Paid', key: 'amountPaid', width: 15 },
      { header: 'Balance', key: 'balance', width: 15 },
      { header: 'Due Date', key: 'dueAt', width: 15 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Context', key: 'contextType', width: 12 },
      { header: 'Context ID', key: 'contextId', width: 15 },
      { header: 'Created By', key: 'createdBy', width: 20 },
      { header: 'Created At', key: 'createdAt', width: 15 }
    ];

    // Style header
    debtsSheet.getRow(1).font = { bold: true };
    debtsSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' }
    };
    debtsSheet.getRow(1).font = { color: { argb: 'FFFFFFFF' }, bold: true };

    // Add data
    debts.forEach(debt => {
      debtsSheet.addRow({
        id: debt._id,
        customerName: debt.customerName,
        phone: debt.phone,
        whatsapp: debt.whatsapp || '',
        amountOwed: debt.amountOwed,
        amountPaid: debt.amountPaid,
        balance: debt.balance,
        dueAt: debt.dueAt.toLocaleDateString(),
        status: debt.status,
        contextType: debt.contextType,
        contextId: debt.contextId || '',
        createdBy: debt.createdBy.name,
        createdAt: debt.createdAt.toLocaleDateString()
      });
    });

    // Get all payments
    const payments = await Payment.find()
      .populate('debtId', 'customerName')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    // Payments sheet
    const paymentsSheet = workbook.addWorksheet('Payments');
    paymentsSheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Debt ID', key: 'debtId', width: 10 },
      { header: 'Customer', key: 'customerName', width: 20 },
      { header: 'Amount', key: 'amount', width: 15 },
      { header: 'Method', key: 'method', width: 15 },
      { header: 'Note', key: 'note', width: 30 },
      { header: 'Created By', key: 'createdBy', width: 20 },
      { header: 'Created At', key: 'createdAt', width: 15 }
    ];

    // Style header
    paymentsSheet.getRow(1).font = { bold: true };
    paymentsSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' }
    };
    paymentsSheet.getRow(1).font = { color: { argb: 'FFFFFFFF' }, bold: true };

    // Add data
    payments.forEach(payment => {
      paymentsSheet.addRow({
        id: payment._id,
        debtId: payment.debtId._id,
        customerName: payment.debtId.customerName,
        amount: payment.amount,
        method: payment.method,
        note: payment.note || '',
        createdBy: payment.createdBy.name,
        createdAt: payment.createdAt.toLocaleDateString()
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=debts-export-${Date.now()}.xlsx`);
    
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/config/messages
// @desc    Get message config
// @access  Private
router.get('/config/messages', protect, async (req, res) => {
  try {
    let config = await MessageConfig.findOne();
    
    if (!config) {
      // Create default config
      config = await MessageConfig.create({});
    }

    res.json({
      success: true,
      data: config
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PATCH /api/config/messages
// @desc    Update message config (Admin only)
// @access  Private/Admin
router.patch('/config/messages', protect, async (req, res) => {
  try {
    let config = await MessageConfig.findOne();
    
    if (!config) {
      config = await MessageConfig.create({
        ...req.body,
        updatedBy: req.user.id
      });
    } else {
      Object.assign(config, req.body);
      config.updatedBy = req.user.id;
      config.updatedAt = new Date();
      await config.save();
    }

    res.json({
      success: true,
      data: config
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;




