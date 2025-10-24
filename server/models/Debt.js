import mongoose from 'mongoose';

const debtSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  whatsapp: {
    type: String,
    trim: true
  },
  amountOwed: {
    type: Number,
    required: [true, 'Amount owed is required'],
    min: 0
  },
  amountPaid: {
    type: Number,
    default: 0,
    min: 0
  },
  balance: {
    type: Number,
    default: 0
  },
  dueAt: {
    type: Date,
    required: [true, 'Due date is required']
  },
  status: {
    type: String,
    enum: ['UNPAID', 'PARTIAL', 'SETTLED'],
    default: 'UNPAID'
  },
  contextType: {
    type: String,
    enum: ['SALE', 'REPAIR', 'OTHER'],
    default: 'OTHER'
  },
  contextId: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastSharedAt: {
    type: Date
  },
  lastShareChannel: {
    type: String,
    enum: ['SMS', 'WHATSAPP']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-calculate balance and status
debtSchema.pre('save', function(next) {
  this.balance = Math.max(0, this.amountOwed - this.amountPaid);
  
  if (this.amountPaid === 0) {
    this.status = 'UNPAID';
  } else if (this.amountPaid >= this.amountOwed) {
    this.status = 'SETTLED';
  } else {
    this.status = 'PARTIAL';
  }
  
  this.updatedAt = Date.now();
  next();
});

// Indexes
debtSchema.index({ customerName: 1, phone: 1 });
debtSchema.index({ status: 1 });
debtSchema.index({ dueAt: 1 });
debtSchema.index({ createdBy: 1 });

export default mongoose.model('Debt', debtSchema);








