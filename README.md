# 📱 EKS Electronic Inventory & Mobile Repair Management System

A comprehensive, production-ready full-stack application for managing electronics inventory and mobile repair operations with a beautiful, modern UI.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)

## ✨ Features

### 🔐 Authentication & Security
- **JWT-based authentication** with secure token management
- **Role-based access control** (Admin, Sales, Technician)
- **Protected routes** with automatic redirects
- **Session management** with persistent login

### 📦 Inventory Management
- Add, edit, and delete products
- Real-time stock tracking
- Automatic low stock alerts
- SKU generation
- Supplier management
- Product categorization
- Cost and profit tracking

### 🛒 Sales Management
- Quick cart-based checkout system
- Multiple payment methods (Cash, Card, Mobile)
- Automatic inventory deduction
- Sales history and analytics
- Customer information capture
- Profit calculation per sale

### 🔧 Repair Management
- Track repair jobs from start to finish
- Partial payment support
- Status updates (Pending, In Progress, Completed, Waiting Payment)
- Customer device information
- IMEI tracking
- Delivery time estimates
- Repair notes and history

### 💰 Debts & Loans Management
- Track customer debts and loans
- Record partial payments anytime
- Auto-calculate remaining balance
- Smart status tracking (UNPAID → PARTIAL → SETTLED)
- Link debts to sales or repairs
- Send payment reminders via SMS/WhatsApp
- Customizable message templates
- Overdue alerts and countdown timers
- Export debts and payments to Excel

### 💵 Commission Management
- Two-role system (Admin, Sales & Technical)
- Commission tracking for repair jobs only
- Percentage or fixed commission types
- Auto-calculate commission on repair completion
- Daily commission summaries
- User-specific commission reports
- Export commission data to Excel
- Real-time commission tracking

### 💰 Expense Management
- Record business expenses
- Categorize expenses (Equipment, Tools, Materials, etc.)
- Track total costs
- Payment method tracking
- Expense history

### 📊 Reports & Analytics
- **Sales Reports** - Daily, weekly, monthly
- **Repair Reports** - Status and payment tracking
- **Expense Reports** - Categorized spending
- **Inventory Reports** - Stock levels and values
- **Profit/Loss Reports** - Revenue vs expenses
- **Debt Reports** - Customer debts and payments
- **Excel Export** - Download all reports

### 🎨 User Interface
- **Modern & Clean Design** - Beautiful Tailwind CSS styling
- **Fully Responsive** - Works on mobile, tablet, and desktop
- **Interactive Dashboard** - Real-time charts and statistics
- **Smooth Animations** - Polished user experience
- **Toast Notifications** - Real-time feedback
- **Search & Filters** - Easy data navigation

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **React Query** - Server state management
- **Recharts** - Beautiful charts
- **Lucide React** - Modern icons
- **Vite** - Lightning-fast build tool

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **ExcelJS** - Excel file generation

## 📦 Installation

### Quick Start (5 minutes)

```bash
# 1. Install all dependencies
npm run install-all

# 2. Configure MongoDB (see SETUP.md)

# 3. Start development servers
npm run dev
```

Visit http://localhost:3000

**For detailed setup instructions, see [SETUP.md](SETUP.md)**

## 🔧 Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/eks-inventory
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

## 👥 User Roles & Permissions

| Feature | Admin | Sales & Technical |
|---------|-------|-------------------|
| Dashboard | ✅ | ✅ |
| Products | ✅ | ✅ |
| Sales | ✅ | ✅ |
| Repairs | ✅ | ✅ |
| Debts | ✅ | ✅ |
| Commissions | ✅ | ✅ (own only) |
| Expenses | ✅ | ❌ |
| Users | ✅ | ❌ |
| Reports | ✅ | ❌ |

## 📱 Screenshots

### Dashboard
- Real-time statistics and metrics
- Interactive charts and graphs
- Recent activity feed
- Low stock alerts

### Products
- Grid view with product cards
- Search and filter functionality
- Quick edit and delete actions
- Stock level indicators

### Sales
- Cart-based checkout
- Product selection interface
- Customer information form
- Sales history table

### Repairs
- Repair job tracking
- Status management
- Payment recording
- Customer device details

## 🚀 Deployment

Deploy to production in minutes:

- **Frontend**: Vercel (recommended)
- **Backend**: Railway or Render
- **Database**: MongoDB Atlas (already configured)

### Quick Deploy to Vercel + GitHub

1. **Prepare for deployment:**
   ```bash
   # Make deployment script executable (Linux/Mac)
   chmod +x deploy.sh
   
   # Run deployment script
   ./deploy.sh
   ```

2. **Deploy to Vercel:**
   - Go to [Vercel.com](https://vercel.com)
   - Connect your GitHub repository
   - Deploy with zero configuration

3. **Deploy Backend:**
   - Use [Railway.app](https://railway.app) or [Render.com](https://render.com)
   - Connect your GitHub repository
   - Set environment variables

**See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed step-by-step instructions**

## 📚 Documentation

- **[SETUP.md](SETUP.md)** - Detailed setup instructions
- **[QUICKSTART.md](QUICKSTART.md)** - 5-minute quick start
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deployment guides
- **[DEBTS_MODULE.md](DEBTS_MODULE.md)** - Debts & Loans module documentation
- **[DEBTS_QUICK_START.md](DEBTS_QUICK_START.md)** - Quick start for Debts module
- **[COMMISSION_MODULE.md](COMMISSION_MODULE.md)** - Commission module documentation
- **[Product Requirements Document.md](Product%20Requirements%20Document.md)** - Complete PRD

## 🎯 Key Features in Detail

### Real-time Dashboard
- Total products in stock
- Today's sales and revenue
- Active repairs count
- Profit tracking
- Commission summaries
- Interactive charts
- Recent activity feed

### Smart Inventory
- Automatic SKU generation
- Low stock alerts
- Quantity tracking
- Cost and price management
- Supplier information

### Sales System
- Add products to cart
- Quantity adjustment
- Multiple payment methods
- Automatic inventory update
- Sales history
- Profit calculation

### Repair Tracking
- Customer information
- Device details and IMEI
- Problem description
- Estimated costs
- Partial payments
- Status workflow

### Comprehensive Reports
- Filter by date range
- Multiple report types
- Excel export
- Profit/Loss analysis
- Commission reports
- Category breakdowns

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- Role-based authorization
- CORS configuration
- Input validation

## 🎨 UI/UX Highlights

- **Responsive Design** - Mobile-first approach
- **Modern Aesthetics** - Clean, professional look
- **Smooth Animations** - Polished interactions
- **Intuitive Navigation** - Easy to use
- **Real-time Feedback** - Toast notifications
- **Loading States** - Better UX during operations

## 📈 Performance

- Fast page loads with Vite
- Optimized React components
- Efficient API calls with React Query
- MongoDB indexing
- Lazy loading ready

## 🤝 Contributing

This is a complete, production-ready system. Feel free to:
- Fork and customize
- Add new features
- Improve UI/UX
- Enhance security
- Optimize performance

## 📝 License

MIT License - Feel free to use and modify as needed!

## 🆘 Support

Having issues? Check:
1. [QUICKSTART.md](QUICKSTART.md) - Quick setup guide
2. [SETUP.md](SETUP.md) - Detailed instructions
3. Console logs for errors
4. MongoDB Atlas connection
5. Environment variables

## 🎉 What's Included

✅ Complete backend API with all CRUD operations
✅ Full frontend with all pages and components
✅ Authentication and authorization
✅ Database models and schemas
✅ Excel report generation
✅ Responsive design
✅ TypeScript for type safety
✅ Modern UI with Tailwind CSS
✅ Comprehensive documentation

## 🌟 Perfect For

- Electronics shops
- Mobile repair stores
- Inventory management
- Small to medium businesses
- Learning full-stack development

---

**Built with ❤️ using React, Node.js, and MongoDB**

**Start managing your inventory and repairs like a pro! 🚀**

