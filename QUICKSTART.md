# ⚡ Quick Start Guide

Get your EKS Inventory & Repair Management System up and running in 5 minutes!

## 🎯 Prerequisites

- Node.js (v16+) installed
- MongoDB Atlas account (free)

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
npm run install-all
```

### 2. Configure MongoDB

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Edit `backend/.env`:
   ```env
   MONGODB_URI=your_mongodb_connection_string_here
   JWT_SECRET=your_secret_key_here
   ```

### 3. Start the App

```bash
npm run dev
```

This starts:
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

### 4. Create Admin User

Open your browser and go to http://localhost:3000

**First, you need to create an admin user via API:**

Using curl or Postman:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin",
    "email": "admin@eks.com",
    "password": "admin123",
    "role": "admin"
  }'
```

**Note:** The register endpoint requires authentication, so you'll need to:
1. Use MongoDB Compass to manually create the first admin user, OR
2. Temporarily comment out the `protect` and `authorize` middleware in `backend/routes/auth.js`

### 5. Login

- Email: `admin@eks.com`
- Password: `admin123`

## 📱 Features Overview

### Dashboard
- Real-time statistics
- Sales and profit charts
- Recent activity feed
- Low stock alerts

### Products
- Add/edit/delete products
- Track inventory
- Low stock warnings
- Search and filter

### Sales
- Quick checkout
- Cart management
- Multiple payment methods
- Sales history

### Repairs
- Track repair jobs
- Partial payments
- Status updates
- Customer management

### Expenses
- Record business expenses
- Categorize expenses
- Track total costs

### Reports
- Sales reports
- Repair reports
- Expense reports
- Inventory reports
- Excel export

### Users
- Create users (Admin only)
- Role management
- User permissions

## 👥 User Roles

| Role | Access |
|------|--------|
| **Admin** | Full access to all modules |
| **Sales** | Products & Sales only |
| **Technician** | Repairs only |

## 🎨 UI Features

✅ Modern and clean design
✅ Responsive (mobile, tablet, desktop)
✅ Dark mode ready
✅ Smooth animations
✅ Real-time updates
✅ Toast notifications

## 🔧 Troubleshooting

### Can't connect to MongoDB?
- Check your connection string in `.env`
- Whitelist your IP in MongoDB Atlas
- Verify username and password

### Port already in use?
- Change `PORT` in `backend/.env`
- Update `VITE_API_URL` in `frontend/.env`

### CORS errors?
- Backend CORS is already configured
- Make sure backend is running on port 5000
- Check API URL in frontend `.env`

## 📚 Next Steps

1. **Add Sample Data**
   - Create products
   - Make some sales
   - Add repair jobs

2. **Customize**
   - Update colors in `tailwind.config.js`
   - Modify dashboard metrics
   - Add your logo

3. **Deploy**
   - See `DEPLOYMENT.md` for deployment guides
   - Deploy to Vercel, Railway, or Render

## 🆘 Need Help?

- Check `SETUP.md` for detailed setup
- Review `DEPLOYMENT.md` for deployment
- Check console logs for errors
- Verify all environment variables

## 🎉 You're All Set!

Start managing your inventory and repairs like a pro!

---

**Pro Tip:** Create test users for each role to see how permissions work!

```bash
# Sales user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Sales User","email":"sales@eks.com","password":"sales123","role":"sales"}'

# Technician user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Tech User","email":"tech@eks.com","password":"tech123","role":"technician"}'
```

Happy coding! 🚀








