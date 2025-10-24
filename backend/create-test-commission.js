import mongoose from 'mongoose';
import CommissionRecord from './models/CommissionRecord.js';
import User from './models/User.js';
import Repair from './models/Repair.js';

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/eks_inventory')
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    
    // Find a sales_tech user
    const user = await User.findOne({ role: 'sales_tech' });
    if (!user) {
      console.log('❌ No sales_tech user found');
      process.exit(1);
    }
    
    console.log('👤 Found user:', user.name, user.email);
    console.log('💰 Commission settings:', user.commissionType, user.commissionValue);
    
    // Create a test repair
    const testRepair = new Repair({
      repairNumber: 'TEST-001',
      customerName: 'Test Customer',
      customerPhone: '123456789',
      mobileBrand: 'Samsung',
      mobileModel: 'Galaxy S21',
      issueDescription: 'Screen replacement',
      repairCost: 100,
      amountPaid: 0,
      remainingBalance: 100,
      status: 'completed',
      completedBy: user._id,
      addedBy: user._id,
      completedAt: new Date()
    });
    
    await testRepair.save();
    console.log('🔧 Created test repair:', testRepair.repairNumber);
    
    // Calculate commission
    let commissionAmount = 0;
    if (user.commissionType === 'PERCENTAGE') {
      commissionAmount = testRepair.repairCost * (user.commissionValue / 100);
    } else if (user.commissionType === 'FIXED') {
      commissionAmount = user.commissionValue;
    }
    
    console.log('💰 Commission amount:', commissionAmount);
    
    // Create commission record
    const commissionRecord = new CommissionRecord({
      userId: user._id,
      jobId: testRepair._id,
      commissionAmount: commissionAmount,
      amountPaid: 0,
      remainingBalance: commissionAmount
    });
    
    await commissionRecord.save();
    console.log('🎉 Created commission record:', commissionRecord._id);
    console.log('📊 Commission amount:', commissionRecord.commissionAmount);
    
    // Verify the commission was created
    const allCommissions = await CommissionRecord.find({ userId: user._id });
    console.log('✅ Total commissions for user:', allCommissions.length);
    
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });

