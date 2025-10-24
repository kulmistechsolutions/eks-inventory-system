import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  debtId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Debt',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Payment amount is required'],
    min: 0.01
  },
  method: {
    type: String,
    enum: ['CASH', 'MOBILE_MONEY', 'CARD', 'EVC_PLUS', 'E_DAHAB', 'JEEB', 'BANK'],
    default: 'CASH'
  },
  note: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes
paymentSchema.index({ debtId: 1 });
paymentSchema.index({ createdAt: -1 });

export default mongoose.model('Payment', paymentSchema);





