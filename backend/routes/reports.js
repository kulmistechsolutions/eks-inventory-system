import express from 'express';
import ExcelJS from 'exceljs';
import Sale from '../models/Sale.js';
import Repair from '../models/Repair.js';
import Expense from '../models/Expense.js';
import Product from '../models/Product.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/reports/sales
// @desc    Get sales report data (JSON)
// @access  Private/Admin, Sales & Tech
router.get('/sales', protect, async (req, res) => {
  try {
    const { period, startDate, endDate } = req.query;
    let query = {};

    // Handle period-based queries
    if (period === 'month') {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      query.createdAt = { $gte: startOfMonth, $lte: endOfMonth };
    } else if (period === 'week') {
      const now = new Date();
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
      query.createdAt = { $gte: startOfWeek, $lte: endOfWeek };
    } else if (period === 'year') {
      const now = new Date();
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const endOfYear = new Date(now.getFullYear(), 11, 31);
      query.createdAt = { $gte: startOfYear, $lte: endOfYear };
    }

    // Handle custom date range
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const sales = await Sale.find(query)
      .populate('soldBy', 'name email')
      .sort({ createdAt: -1 });

    const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
    const totalProfit = sales.reduce((sum, s) => sum + s.totalProfit, 0);
    const totalSales = sales.length;

    res.json({
      success: true,
      data: {
        sales,
        summary: {
          totalRevenue,
          totalProfit,
          totalSales
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/reports/sales/export
// @desc    Generate sales report (Excel)
// @access  Private/Admin, Sales & Tech
router.get('/sales/export', protect, async (req, res) => {
  try {
    console.log('Sales export request received');
    const { startDate, endDate } = req.query;
    let query = {};

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    console.log('Query:', query);
    const sales = await Sale.find(query)
      .populate('soldBy', 'name email')
      .sort({ createdAt: -1 });
    
    console.log('Sales found:', sales.length);

    // If no sales data, return empty Excel file
    if (sales.length === 0) {
      console.log('No sales data found, creating empty report');
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sales Report');

    // Define columns
    worksheet.columns = [
      { header: 'Sale Number', key: 'saleNumber', width: 20 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Customer', key: 'customerName', width: 20 },
      { header: 'Items', key: 'items', width: 30 },
      { header: 'Subtotal', key: 'subtotal', width: 12 },
      { header: 'Tax', key: 'tax', width: 10 },
      { header: 'Discount', key: 'discount', width: 10 },
      { header: 'Total', key: 'total', width: 12 },
      { header: 'Profit', key: 'profit', width: 12 },
      { header: 'Sold By', key: 'soldBy', width: 20 }
    ];

    // Style header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' }
    };
    worksheet.getRow(1).font = { color: { argb: 'FFFFFFFF' }, bold: true };

    // Add data
    sales.forEach(sale => {
      const itemsList = sale.items.map(i => `${i.productName} (${i.quantity})`).join(', ');
      worksheet.addRow({
        saleNumber: sale.saleNumber,
        date: sale.createdAt.toLocaleDateString(),
        customerName: sale.customerName || 'Walk-in',
        items: itemsList,
        subtotal: sale.subtotal,
        tax: sale.tax,
        discount: sale.discount,
        total: sale.total,
        profit: sale.totalProfit,
        soldBy: sale.soldBy?.name || 'Unknown User'
      });
    });

    // Add summary row
    const totalRow = sales.length + 2;
    worksheet.addRow({});
    worksheet.addRow({
      saleNumber: 'TOTAL',
      total: sales.reduce((sum, s) => sum + s.total, 0),
      profit: sales.reduce((sum, s) => sum + s.totalProfit, 0)
    });
    worksheet.getRow(totalRow + 1).font = { bold: true };

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=sales-report-${Date.now()}.xlsx`);
    
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Sales export error:', error);
    res.status(500).json({ message: error.message, stack: error.stack });
  }
});

// @route   GET /api/reports/repairs
// @desc    Get repair report data (JSON)
// @access  Private/Admin, Sales & Tech
router.get('/repairs', protect, async (req, res) => {
  try {
    const { period, startDate, endDate, status } = req.query;
    let query = {};

    // Handle period-based queries
    if (period === 'month') {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      query.createdAt = { $gte: startOfMonth, $lte: endOfMonth };
    } else if (period === 'week') {
      const now = new Date();
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
      query.createdAt = { $gte: startOfWeek, $lte: endOfWeek };
    } else if (period === 'year') {
      const now = new Date();
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const endOfYear = new Date(now.getFullYear(), 11, 31);
      query.createdAt = { $gte: startOfYear, $lte: endOfYear };
    }

    // Handle custom date range
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    if (status) {
      query.status = status;
    }

    const repairs = await Repair.find(query)
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    const totalRevenue = repairs.reduce((sum, r) => sum + r.estimatedCost, 0);
    const totalPaid = repairs.reduce((sum, r) => sum + r.amountPaid, 0);
    const totalBalance = repairs.reduce((sum, r) => sum + r.remainingBalance, 0);

    res.json({
      success: true,
      data: {
        repairs,
        summary: {
          totalRevenue,
          totalPaid,
          totalBalance,
          totalRepairs: repairs.length
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/reports/repairs/export
// @desc    Generate repair report (Excel)
// @access  Private/Admin, Sales & Tech
router.get('/repairs/export', protect, async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;
    let query = {};

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    if (status) {
      query.status = status;
    }

    const repairs = await Repair.find(query)
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Repair Report');

    worksheet.columns = [
      { header: 'Repair Number', key: 'repairNumber', width: 20 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Customer Name', key: 'customerName', width: 20 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Device', key: 'device', width: 25 },
      { header: 'Problem', key: 'problem', width: 30 },
      { header: 'Estimated Cost', key: 'estimated', width: 15 },
      { header: 'Paid', key: 'paid', width: 12 },
      { header: 'Balance', key: 'balance', width: 12 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Assigned To', key: 'assignedTo', width: 20 }
    ];

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' }
    };
    worksheet.getRow(1).font = { color: { argb: 'FFFFFFFF' }, bold: true };

    repairs.forEach(repair => {
      worksheet.addRow({
        repairNumber: repair.repairNumber,
        date: repair.createdAt.toLocaleDateString(),
        customerName: repair.customerName,
        phone: repair.customerPhone,
        device: `${repair.deviceType} - ${repair.deviceModel}`,
        problem: repair.problem,
        estimated: repair.estimatedCost,
        paid: repair.amountPaid,
        balance: repair.remainingBalance,
        status: repair.status,
        assignedTo: repair.assignedTo?.name || 'Unassigned'
      });
    });

    const totalRow = repairs.length + 2;
    worksheet.addRow({});
    worksheet.addRow({
      repairNumber: 'TOTAL',
      estimated: repairs.reduce((sum, r) => sum + r.estimatedCost, 0),
      paid: repairs.reduce((sum, r) => sum + r.amountPaid, 0),
      balance: repairs.reduce((sum, r) => sum + r.remainingBalance, 0)
    });
    worksheet.getRow(totalRow + 1).font = { bold: true };

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=repair-report-${Date.now()}.xlsx`);
    
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/reports/expenses
// @desc    Get expense report data (JSON)
// @access  Private/Admin, Sales & Tech
router.get('/expenses', protect, async (req, res) => {
  try {
    const { period, startDate, endDate } = req.query;
    let query = {};

    // Handle period-based queries
    if (period === 'month') {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      query.createdAt = { $gte: startOfMonth, $lte: endOfMonth };
    } else if (period === 'week') {
      const now = new Date();
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
      query.createdAt = { $gte: startOfWeek, $lte: endOfWeek };
    } else if (period === 'year') {
      const now = new Date();
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const endOfYear = new Date(now.getFullYear(), 11, 31);
      query.createdAt = { $gte: startOfYear, $lte: endOfYear };
    }

    // Handle custom date range
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const expenses = await Expense.find(query)
      .populate('recordedBy', 'name email')
      .sort({ createdAt: -1 });

    const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalExpenses = expenses.length;

    res.json({
      success: true,
      data: {
        expenses,
        summary: {
          totalAmount,
          totalExpenses
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/reports/expenses/export
// @desc    Generate expense report (Excel)
// @access  Private/Admin, Sales & Tech
router.get('/expenses/export', protect, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = {};

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const expenses = await Expense.find(query)
      .populate('recordedBy', 'name email')
      .sort({ createdAt: -1 });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Expense Report');

    worksheet.columns = [
      { header: 'Expense Number', key: 'expenseNumber', width: 20 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Category', key: 'category', width: 15 },
      { header: 'Description', key: 'description', width: 30 },
      { header: 'Amount', key: 'amount', width: 12 },
      { header: 'Payment Method', key: 'paymentMethod', width: 15 },
      { header: 'Recorded By', key: 'recordedBy', width: 20 }
    ];

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' }
    };
    worksheet.getRow(1).font = { color: { argb: 'FFFFFFFF' }, bold: true };

    expenses.forEach(expense => {
      worksheet.addRow({
        expenseNumber: expense.expenseNumber,
        date: expense.createdAt.toLocaleDateString(),
        name: expense.name,
        category: expense.category,
        description: expense.description,
        amount: expense.amount,
        paymentMethod: expense.paymentMethod,
        recordedBy: expense.recordedBy?.name || 'Unknown User'
      });
    });

    const totalRow = expenses.length + 2;
    worksheet.addRow({});
    worksheet.addRow({
      expenseNumber: 'TOTAL',
      amount: expenses.reduce((sum, e) => sum + e.amount, 0)
    });
    worksheet.getRow(totalRow + 1).font = { bold: true };

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=expense-report-${Date.now()}.xlsx`);
    
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/reports/inventory
// @desc    Generate inventory report
// @access  Private/Admin, Sales & Tech
router.get('/inventory', protect, async (req, res) => {
  try {
    const products = await Product.find().sort({ name: 1 });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Inventory Report');

    worksheet.columns = [
      { header: 'SKU', key: 'sku', width: 20 },
      { header: 'Product Name', key: 'name', width: 30 },
      { header: 'Category', key: 'category', width: 15 },
      { header: 'Cost', key: 'cost', width: 12 },
      { header: 'Price', key: 'price', width: 12 },
      { header: 'Quantity', key: 'quantity', width: 12 },
      { header: 'Stock Value', key: 'stockValue', width: 15 },
      { header: 'Status', key: 'status', width: 15 }
    ];

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' }
    };
    worksheet.getRow(1).font = { color: { argb: 'FFFFFFFF' }, bold: true };

    products.forEach(product => {
      const stockValue = product.price * product.quantity;
      const status = product.quantity <= product.minStock ? 'Low Stock' : 'In Stock';
      
      worksheet.addRow({
        sku: product.sku,
        name: product.name,
        category: product.category,
        cost: product.cost,
        price: product.price,
        quantity: product.quantity,
        stockValue: stockValue,
        status: status
      });
    });

    const totalRow = products.length + 2;
    worksheet.addRow({});
    worksheet.addRow({
      sku: 'TOTAL',
      stockValue: products.reduce((sum, p) => sum + (p.price * p.quantity), 0)
    });
    worksheet.getRow(totalRow + 1).font = { bold: true };

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=inventory-report-${Date.now()}.xlsx`);
    
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/reports/profit-loss
// @desc    Generate profit/loss report
// @access  Private/Admin, Sales & Tech
router.get('/profit-loss', protect, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = {};

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const sales = await Sale.find(query);
    const expenses = await Expense.find(query);

    const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
    const totalProfit = sales.reduce((sum, s) => sum + s.totalProfit, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const netProfit = totalProfit - totalExpenses;

    res.json({
      success: true,
      data: {
        period: { startDate, endDate },
        revenue: {
          total: totalRevenue,
          sales: sales.length
        },
        profit: {
          gross: totalProfit,
          expenses: totalExpenses,
          net: netProfit
        },
        expenses: {
          total: totalExpenses,
          count: expenses.length
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/reports/profit-loss/download
// @desc    Download profit/loss report (Excel)
// @access  Private/Admin, Sales & Tech
router.get('/profit-loss/download', protect, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = {};

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const sales = await Sale.find(query);
    const expenses = await Expense.find(query);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Profit & Loss Report');

    // Add headers
    worksheet.columns = [
      { header: 'Period', key: 'period', width: 20 },
      { header: 'Revenue', key: 'revenue', width: 15 },
      { header: 'Expenses', key: 'expenses', width: 15 },
      { header: 'Net Profit', key: 'netProfit', width: 15 }
    ];

    const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const netProfit = totalRevenue - totalExpenses;

    worksheet.addRow({
      period: startDate && endDate ? `${startDate} to ${endDate}` : 'All Time',
      revenue: totalRevenue,
      expenses: totalExpenses,
      netProfit: netProfit
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=profit-loss-report-${Date.now()}.xlsx`);
    
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/reports/inventory/download
// @desc    Download inventory report (Excel)
// @access  Private/Admin, Sales & Tech
router.get('/inventory/download', protect, async (req, res) => {
  try {
    const products = await Product.find().sort({ name: 1 });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Inventory Report');

    worksheet.columns = [
      { header: 'SKU', key: 'sku', width: 20 },
      { header: 'Product Name', key: 'name', width: 30 },
      { header: 'Category', key: 'category', width: 15 },
      { header: 'Cost', key: 'cost', width: 12 },
      { header: 'Price', key: 'price', width: 12 },
      { header: 'Quantity', key: 'quantity', width: 12 },
      { header: 'Stock Value', key: 'stockValue', width: 15 },
      { header: 'Status', key: 'status', width: 15 }
    ];

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' }
    };
    worksheet.getRow(1).font = { color: { argb: 'FFFFFFFF' }, bold: true };

    products.forEach(product => {
      const stockValue = product.price * product.quantity;
      const status = product.quantity <= product.minStock ? 'Low Stock' : 'In Stock';
      
      worksheet.addRow({
        sku: product.sku,
        name: product.name,
        category: product.category,
        cost: product.cost,
        price: product.price,
        quantity: product.quantity,
        stockValue: stockValue,
        status: status
      });
    });

    const totalRow = products.length + 2;
    worksheet.addRow({});
    worksheet.addRow({
      sku: 'TOTAL',
      stockValue: products.reduce((sum, p) => sum + (p.price * p.quantity), 0)
    });
    worksheet.getRow(totalRow + 1).font = { bold: true };

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=inventory-report-${Date.now()}.xlsx`);
    
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

