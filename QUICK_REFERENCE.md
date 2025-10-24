# ⚡ Quick Reference Guide

## 🚀 Start the Application

```bash
# Install all dependencies
npm run install-all

# Create users
cd backend && npm run seed

# Start both servers
npm run dev
```

**Frontend:** http://localhost:3000  
**Backend:** http://localhost:5000

---

## 👤 Login Credentials

### Admin
- **Email:** admin@eks.com
- **Password:** admin123
- **Access:** Everything

### Sales & Technical (10% Commission)
- **Email:** ali@eks.com
- **Password:** ali123
- **Commission:** 10% per completed repair

### Sales & Technical ($5 Commission)
- **Email:** mohamed@eks.com
- **Password:** mohamed123
- **Commission:** $5 per completed repair

---

## 📱 Module Access

| Module | Admin | Sales & Tech |
|--------|-------|--------------|
| Dashboard | ✅ | ✅ |
| Products | ✅ | ✅ |
| Sales | ✅ | ✅ |
| Repairs | ✅ | ✅ |
| Debts | ✅ | ✅ |
| Commissions | ✅ | ✅ (own) |
| Expenses | ✅ | ❌ |
| Users | ✅ | ❌ |
| Reports | ✅ | ❌ |

---

## 💰 Commission System

### How It Works

1. **Admin sets commission** in Users page
2. **User completes repair** in Repairs page
3. **System auto-calculates** commission
4. **Commission tracked** in Commissions page

### Commission Types

**Percentage:**
- Example: 10%
- Repair cost: $100
- Commission: $10

**Fixed:**
- Example: $5
- Repair cost: $100
- Commission: $5

---

## 💸 Debt System

### Create Debt
1. Go to **Debts** page
2. Click **Add Debt**
3. Fill customer info
4. Set amount and due date
5. Click **Create**

### Record Payment
1. Find debt
2. Click **Payment**
3. Enter amount
4. Click **Record Payment**

### Send Reminder
1. Find debt
2. Click **WhatsApp** or **SMS**
3. Edit message
4. Click **Send**

---

## 📊 Excel Export

All modules support Excel export:
- Sales Reports
- Repair Reports
- Expense Reports
- Inventory Reports
- **Debt Reports**
- **Commission Reports**

Click **Export** button to download!

---

## 🔧 Common Tasks

### Create Product
1. Go to **Products**
2. Click **Add Product**
3. Fill details
4. Click **Create**

### Make Sale
1. Go to **Sales**
2. Add products to cart
3. Click **Checkout**
4. Enter customer info
5. Click **Complete Sale**

### Create Repair
1. Go to **Repairs**
2. Click **New Repair**
3. Fill customer & device info
4. Click **Create**

### Record Payment (Repair)
1. Find repair
2. Click **Payment**
3. Enter amount
4. Click **Record Payment**

### Record Payment (Debt)
1. Go to **Debts**
2. Find debt
3. Click **Payment**
4. Enter amount
5. Click **Record Payment**

---

## 🎯 Key Features

### Auto-Calculations
- ✅ Commission on repair completion
- ✅ Debt balance on payment
- ✅ Sale profit on checkout
- ✅ Inventory on sale

### Smart Status
- ✅ Repair: Pending → In Progress → Completed
- ✅ Debt: UNPAID → PARTIAL → SETTLED
- ✅ Product: In Stock → Low Stock

### Reminders
- ✅ WhatsApp integration
- ✅ SMS integration
- ✅ Customizable templates

---

## 📈 Dashboard Metrics

### Admin Dashboard
- Total Products
- Today's Sales
- Active Repairs
- Today's Profit
- **Today's Commission Paid**
- Low Stock Alerts

### Sales & Tech Dashboard
- Total Products
- Today's Sales
- Active Repairs
- **My Commission Today**
- Low Stock Alerts

---

## 🆘 Quick Troubleshooting

### Can't Login?
```bash
cd backend
npm run seed
```

### Backend Not Running?
```bash
cd backend
npm run dev
```

### Frontend Not Running?
```bash
cd frontend
npm run dev
```

### MongoDB Error?
- Check `backend/.env`
- Verify `MONGODB_URI`
- Whitelist IP in Atlas

---

## 📚 Documentation Quick Links

- **Setup:** [SETUP.md](SETUP.md)
- **Quick Start:** [QUICKSTART.md](QUICKSTART.md)
- **Debts:** [DEBTS_MODULE.md](DEBTS_MODULE.md)
- **Commissions:** [COMMISSION_MODULE.md](COMMISSION_MODULE.md)
- **Troubleshooting:** [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

## 🎉 You're All Set!

Everything is ready to use!

**Start managing your business! 🚀**








