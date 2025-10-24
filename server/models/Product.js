import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  cost: {
    type: Number,
    required: [true, 'Cost is required'],
    min: 0
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: 0,
    default: 0
  },
  minStock: {
    type: Number,
    default: 5,
    min: 0
  },
  supplier: {
    type: String,
    trim: true
  },
  sku: {
    type: String,
    unique: true,
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

// Auto-generate SKU if not provided
productSchema.pre('save', function(next) {
  if (!this.sku) {
    this.sku = `EKS-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Product', productSchema);


