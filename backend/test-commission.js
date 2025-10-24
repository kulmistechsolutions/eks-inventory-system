import mongoose from 'mongoose';
import CommissionRecord from './models/CommissionRecord.js';
import User from './models/User.js';
import Repair from './models/Repair.js';

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/eks_inventory')
  .then(() => {
    console.log('✅ Connected to MongoDB');
    
    // Find a sales_tech user
    return User.findOne({ role: 'sales_tech' });
  })
  .then(async (user) => {
    if (!user) {
      console.log('❌ No sales_tech user found');
      process.exit(1);
    }
    
    console.log('👤 Found user:', user.name, user.email);
    
    // Find a completed repair
    const repair = await Repair.findOne({ 
      status: 'completed', 
      completedBy: user._id 
    });
    
    if (!repair) {
      console.log('❌ No completed repair found for this user');
      process.exit(1);
    }
    
    console.log('🔧 Found repair:', repair.repairNumber, '- $' + repair.repairCost);
    
    // Check if commission record already exists
    const existingCommission = await CommissionRecord.findOne({
      userId: user._id,
      jobId: repair._id
    });
    
    if (existingCommission) {
      console.log('✅ Commission record already exists:', existingCommission);
    } else {
      // Create a test commission record
      const commissionAmount = user.commissionType === 'PERCENTAGE' 
        ? repair.repairCost * (user.commissionValue / 100)
        : user.commissionValue;
        
      const commissionRecord = new CommissionRecord({
        userId: user._id,
        jobId: repair._id,
        commissionAmount: commissionAmount,
        amountPaid: 0,
        remainingBalance: commissionAmount
      });
      
      await commissionRecord.save();
      console.log('✅ Created commission record:', commissionRecord);
    }
    
    // List all commission records for this user
    const allCommissions = await CommissionRecord.find({ userId: user._id })
      .populate('jobId', 'repairNumber customerName repairCost');
    
    console.log('📊 All commission records for user:');
    allCommissions.forEach(record => {
      console.log(`- Job: ${record.jobId?.repairNumber}, Amount: $${record.commissionAmount}, Status: ${record.status}`);
    });
    
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });

