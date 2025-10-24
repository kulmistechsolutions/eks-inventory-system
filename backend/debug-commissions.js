import mongoose from 'mongoose';
import CommissionRecord from './models/CommissionRecord.js';
import User from './models/User.js';
import Repair from './models/Repair.js';

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/eks_inventory')
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    
    // Check all users
    const users = await User.find();
    console.log('\n👥 All Users:');
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`);
      if (user.role === 'sales_tech') {
        console.log(`  Commission: ${user.commissionType} - ${user.commissionValue}`);
      }
    });
    
    // Check all commission records
    const commissions = await CommissionRecord.find().populate('userId', 'name email').populate('jobId', 'repairNumber customerName');
    console.log('\n💰 Commission Records:');
    if (commissions.length === 0) {
      console.log('❌ No commission records found');
    } else {
      commissions.forEach(commission => {
        console.log(`- ${commission.userId?.name}: $${commission.commissionAmount} (${commission.status}) - Job: ${commission.jobId?.repairNumber}`);
      });
    }
    
    // Check completed repairs
    const completedRepairs = await Repair.find({ status: 'completed' }).populate('completedBy', 'name email');
    console.log('\n🔧 Completed Repairs:');
    if (completedRepairs.length === 0) {
      console.log('❌ No completed repairs found');
    } else {
      completedRepairs.forEach(repair => {
        console.log(`- ${repair.repairNumber}: $${repair.repairCost} - Completed by: ${repair.completedBy?.name}`);
      });
    }
    
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });

