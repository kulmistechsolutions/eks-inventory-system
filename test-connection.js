// Quick test script to verify backend and database connection
const http = require('http');

const API_URL = 'http://localhost:5000/api';

async function testConnection() {
  console.log('🔍 Testing EKS Inventory System Connection...\n');

  // Test 1: Health Check
  console.log('1️⃣ Testing backend health...');
  try {
    const response = await fetch(`${API_URL}/health`);
    const data = await response.json();
    console.log('✅ Backend is running:', data);
  } catch (error) {
    console.log('❌ Backend is NOT running!');
    console.log('   Make sure to run: cd backend && npm run dev\n');
    return;
  }

  // Test 2: Login Test
  console.log('\n2️⃣ Testing login with admin credentials...');
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@eks.com',
        password: 'admin123'
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Login successful!');
      console.log('   User:', data.user.name);
      console.log('   Role:', data.user.role);
      console.log('   Token:', data.token.substring(0, 20) + '...');
    } else {
      console.log('❌ Login failed - Invalid credentials');
      console.log('   Run: cd backend && npm run seed\n');
    }
  } catch (error) {
    console.log('❌ Login error:', error.message);
  }

  console.log('\n✅ All tests completed!\n');
}

testConnection();

