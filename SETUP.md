# 🚀 EKS Inventory & Repair Management System - Setup Guide

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (free tier works)

## Step 1: Install Dependencies

Run the following command in the root directory:

```bash
npm run install-all
```

This will install dependencies for:
- Root project
- Backend (Node.js + Express)
- Frontend (React + TypeScript + Vite)

## Step 2: MongoDB Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
5. Replace `<password>` with your actual password

## Step 3: Backend Configuration

1. Navigate to the backend folder:
```bash
cd backend
```

2. Create a `.env` file:
```bash
# Copy the example file
cp .env.example .env
```

3. Edit `.env` with your MongoDB connection string:
```env
PORT=5000
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/eks-inventory?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRE=7d
```

## Step 4: Frontend Configuration

1. Navigate to the frontend folder:
```bash
cd ../frontend
```

2. Create a `.env` file:
```bash
# Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

## Step 5: Start the Application

Go back to the root directory and run:

```bash
npm run dev
```

This will start both:
- Backend server on `http://localhost:5000`
- Frontend development server on `http://localhost:3000`

## Step 6: Create Initial Users

The easiest way to create admin and other users is using the seed script:

```bash
# Navigate to backend folder
cd backend

# Run the seed script
npm run seed
```

This will automatically create 3 users:
- **Admin:** admin@eks.com / admin123 (Full Access)
- **Sales:** sales@eks.com / sales123 (Products & Sales Only)
- **Technician:** tech@eks.com / tech123 (Repairs Only)

**See [CREATE_USERS.md](CREATE_USERS.md) for detailed instructions and alternative methods.**

## Default Login Credentials

After running the seed script, you can login with:

- **Email:** admin@eks.com
- **Password:** admin123

## Creating Additional Users

Once logged in as admin, you can create additional users:

1. Go to **Users** page
2. Click **Add User**
3. Fill in the details and select the role:
   - **Admin:** Full access to all modules
   - **Sales:** Access to products and sales only
   - **Technician:** Access to repairs only

## Troubleshooting

### MongoDB Connection Issues

- Make sure your IP address is whitelisted in MongoDB Atlas
- Check that your connection string is correct
- Verify your username and password

### Port Already in Use

If port 5000 or 3000 is already in use:

1. Backend: Change `PORT` in `backend/.env`
2. Frontend: Update `VITE_API_URL` in `frontend/.env` to match

### CORS Issues

CORS is already configured in the backend. If you still face issues, check:
- Backend is running on port 5000
- Frontend is running on port 3000
- API URL in frontend `.env` is correct

## Project Structure

```
shop bos/
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth & error handling
│   ├── server.js        # Main server file
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context
│   │   ├── utils/       # Utilities
│   │   └── types/       # TypeScript types
│   ├── index.html
│   └── package.json
├── Product Requirements Document.md
├── README.md
└── package.json
```

## Features

✅ **Authentication & User Management**
- Secure JWT-based authentication
- Role-based access control (Admin, Sales, Technician)

✅ **Inventory Management**
- Add, edit, delete products
- Track stock levels
- Low stock alerts
- SKU generation

✅ **Sales Management**
- Quick cart-based checkout
- Multiple payment methods
- Automatic inventory deduction
- Sales history

✅ **Repair Management**
- Track repair jobs
- Partial payments support
- Status updates
- Customer information

✅ **Expense Management**
- Record business expenses
- Categorize expenses
- Track total costs

✅ **Reports & Analytics**
- Sales reports
- Repair reports
- Expense reports
- Inventory reports
- Profit/Loss analysis
- Excel export for all reports

✅ **Responsive Design**
- Mobile-friendly interface
- Desktop optimized
- Modern UI with Tailwind CSS

## Support

For issues or questions, please check:
1. This setup guide
2. The README.md file
3. Console logs for errors

## License

MIT License - Feel free to use and modify as needed!

---

**Happy coding! 🎉**

