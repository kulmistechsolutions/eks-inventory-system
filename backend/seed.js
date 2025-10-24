import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const seedUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding');

    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@eks.com' });
    if (adminExists) {
      console.log('⚠️  Admin user already exists. Skipping seed.');
      await mongoose.connection.close();
      return;
    }

    // Create Admin User
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@eks.com',
      password: 'admin123',
      role: 'admin',
      isActive: true
    });

    // Create Sales & Tech User 1
    const salesTech1 = await User.create({
      name: 'Ali Ahmed',
      email: 'ali@eks.com',
      password: 'ali123',
      role: 'sales_tech',
      isActive: true
    });

    // Create Sales & Tech User 2
    const salesTech2 = await User.create({
      name: 'Mohamed Hassan',
      email: 'mohamed@eks.com',
      password: 'mohamed123',
      role: 'sales_tech',
      isActive: true
    });

    console.log('✅ Users created successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 Admin User:');
    console.log('   Email: admin@eks.com');
    console.log('   Password: admin123');
    console.log('   Role: Admin (Full Access)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 Sales & Tech User 1:');
    console.log('   Email: ali@eks.com');
    console.log('   Password: ali123');
    console.log('   Role: Sales & Technical');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 Sales & Tech User 2:');
    console.log('   Email: mohamed@eks.com');
    console.log('   Password: mohamed123');
    console.log('   Role: Sales & Technical');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();

