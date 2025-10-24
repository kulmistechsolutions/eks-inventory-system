import mongoose from 'mongoose';

const messageConfigSchema = new mongoose.Schema({
  smsEnabled: {
    type: Boolean,
    default: false
  },
  whatsappEnabled: {
    type: Boolean,
    default: true
  },
  smsSenderId: {
    type: String,
    trim: true
  },
  whatsappBusinessNumber: {
    type: String,
    trim: true
  },
  shopName: {
    type: String,
    default: 'EKS Electronic Shop',
    trim: true
  },
  defaultTemplate: {
    type: String,
    default: 'Hello {{customerName}}, you owe {{currency}}{{balance}} for {{contextLabel}} at {{shopName}}. Due: {{dueDate}}. Please pay to settle. {{footer}}'
  },
  footer: {
    type: String,
    default: 'Thank you!'
  },
  currency: {
    type: String,
    default: '$'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure only one config document
messageConfigSchema.index({ _id: 1 }, { unique: true });

export default mongoose.model('MessageConfig', messageConfigSchema);








