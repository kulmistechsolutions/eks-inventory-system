import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['login', 'logout', 'create', 'update', 'delete', 'sale', 'repair', 'profile'],
    required: true
  },
  entityType: {
    type: String,
    enum: ['user', 'product', 'sale', 'repair', 'expense', 'debt', 'profile'],
    required: true
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient querying
activitySchema.index({ userId: 1, createdAt: -1 });
activitySchema.index({ createdAt: -1 });

export default mongoose.model('Activity', activitySchema);
