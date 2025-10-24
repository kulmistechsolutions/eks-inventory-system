# 👥 Create Initial Users

## Quick Setup - Create Admin and Users

### Option 1: Using Seed Script (Recommended) ⚡

This will automatically create 3 users (Admin, Sales, Technician):

```bash
# 1. Navigate to backend folder
cd backend

# 2. Make sure your .env file is configured with MongoDB URI
# (Check backend/.env exists and has MONGODB_URI)

# 3. Run the seed script
npm run seed
```

**This will create:**
- ✅ **Admin User** - admin@eks.com / admin123
- ✅ **Sales User** - sales@eks.com / sales123  
- ✅ **Technician User** - tech@eks.com / tech123

---

### Option 2: Manual Creation via API

If you want to create custom users:

#### Step 1: Create Admin First

You need to temporarily allow registration without authentication.

**Edit `backend/routes/auth.js`** - Comment out the auth middleware temporarily:

```javascript
// Change this line:
router.post('/register', protect, authorize('admin'), async (req, res) => {

// To this (temporarily):
router.post('/register', async (req, res) => {
```

#### Step 2: Create Users via API

```bash
# Start the backend
cd backend
npm run dev

# In another terminal, create admin user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@eks.com",
    "password": "admin123",
    "role": "admin"
  }'

# Create sales user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sales Person",
    "email": "sales@eks.com",
    "password": "sales123",
    "role": "sales"
  }'

# Create technician user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Technician",
    "email": "tech@eks.com",
    "password": "tech123",
    "role": "technician"
  }'
```

#### Step 3: Restore Authentication

**Edit `backend/routes/auth.js`** - Uncomment the auth middleware:

```javascript
// Change back to:
router.post('/register', protect, authorize('admin'), async (req, res) => {
```

---

### Option 3: Using MongoDB Compass (Advanced)

1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect to your MongoDB Atlas cluster
3. Navigate to the `eks-inventory` database
4. Go to the `users` collection
5. Click "Add Data" → "Insert Document"
6. Add this document:

```json
{
  "name": "Admin User",
  "email": "admin@eks.com",
  "password": "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyY7T5f8P5jC",
  "role": "admin",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Note:** The password hash above is for "admin123". For other passwords, you'll need to use a bcrypt generator.

---

## Default Login Credentials

After running the seed script, you can login with:

### 👤 Admin User (Full Access)
- **Email:** admin@eks.com
- **Password:** admin123
- **Access:** All modules (Dashboard, Products, Sales, Repairs, Expenses, Users, Reports)

### 👤 Sales User (Sales & Products Only)
- **Email:** sales@eks.com
- **Password:** sales123
- **Access:** Dashboard, Products, Sales

### 👤 Technician User (Repairs Only)
- **Email:** tech@eks.com
- **Password:** tech123
- **Access:** Dashboard, Repairs

---

## Creating Additional Users

Once logged in as **Admin**, you can create more users:

1. Go to **Users** page in the dashboard
2. Click **Add User** button
3. Fill in the details:
   - Name
   - Email
   - Password
   - Role (Admin, Sales, or Technician)
4. Click **Create**

---

## Troubleshooting

### "Admin user already exists"
- The seed script detected existing users
- You can either delete existing users or use them to login

### "Cannot connect to MongoDB"
- Check your `backend/.env` file
- Verify `MONGODB_URI` is correct
- Make sure your IP is whitelisted in MongoDB Atlas

### "Authentication failed"
- Make sure you're using the correct email and password
- Check if the user exists in the database
- Verify the backend is running

---

## Security Note

⚠️ **Important:** Change the default passwords after first login!

For production:
1. Use strong, unique passwords
2. Enable two-factor authentication
3. Regularly audit user accounts
4. Use environment variables for sensitive data

---

## Need Help?

If you encounter any issues:
1. Check the console logs
2. Verify MongoDB connection
3. Ensure backend is running
4. Check environment variables

**Happy coding! 🚀**








