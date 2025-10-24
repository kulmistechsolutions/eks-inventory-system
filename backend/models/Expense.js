import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  expenseNumber: {
    type: String,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Expense name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['equipment', 'tools', 'materials', 'rent', 'utilities', 'salaries', 'marketing', 'other'],
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: 0
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'bank_transfer', 'mobile', 'evc_plus', 'e_dahab', 'jeeb', 'bank'],
    default: 'cash'
  },
  receipt: {
    type: String,
    trim: true
  },
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-generate expense number
expenseSchema.pre('save', async function(next) {
  if (!this.expenseNumber) {
    const count = await mongoose.model('Expense').countDocuments();
    this.expenseNumber = `EXP-${Date.now()}-${count + 1}`;
  }
  next();
});

export default mongoose.model('Expense', expenseSchema);

