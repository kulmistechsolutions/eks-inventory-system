import mongoose from 'mongoose';

const repairSchema = new mongoose.Schema({
  repairNumber: {
    type: String,
    unique: true
  },
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  customerPhone: {
    type: String,
    required: [true, 'Customer phone is required'],
    trim: true
  },
  customerEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  mobileBrand: {
    type: String,
    required: [true, 'Mobile brand is required'],
    trim: true
  },
  mobileModel: {
    type: String,
    required: [true, 'Mobile model is required'],
    trim: true
  },
  imei: {
    type: String,
    trim: true
  },
  issueDescription: {
    type: String,
    required: [true, 'Issue description is required'],
    trim: true
  },
  repairCost: {
    type: Number,
    required: [true, 'Repair cost is required'],
    min: 0
  },
  amountPaid: {
    type: Number,
    default: 0,
    min: 0
  },
  remainingBalance: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['waiting', 'processing', 'completed'],
    default: 'waiting'
  },
  deliveryTime: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  completedAt: {
    type: Date
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  completedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  completionProofImage: {
    type: String,
    trim: true
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

// Auto-calculate remaining balance
repairSchema.pre('save', function(next) {
  this.remainingBalance = Math.max(0, this.repairCost - this.amountPaid);
  this.updatedAt = Date.now();
  next();
});

// Auto-generate repair number
repairSchema.pre('save', async function(next) {
  if (!this.repairNumber) {
    const count = await mongoose.model('Repair').countDocuments();
    this.repairNumber = `REP-${Date.now()}-${count + 1}`;
  }
  next();
});

export default mongoose.model('Repair', repairSchema);

