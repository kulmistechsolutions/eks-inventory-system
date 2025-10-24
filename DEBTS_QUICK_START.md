# 💰 Debts Module - Quick Start

## ✅ What's New?

A complete **Debts & Loans Management** module has been added to your system!

---

## 🚀 Quick Setup (30 Seconds)

### 1. Restart Backend
```bash
cd backend
npm run dev
```

### 2. Restart Frontend
```bash
cd frontend
npm run dev
```

### 3. Access the Module
1. Login to your system
2. Click **"Debts"** in the sidebar
3. Start using!

---

## 🎯 What Can You Do?

### Create Debt
- Track customer debts
- Set due dates
- Link to sales or repairs

### Record Payments
- Add partial payments anytime
- Auto-update balance
- Track payment history

### Send Reminders
- WhatsApp reminders
- SMS reminders
- Customizable messages

### Manage Debts
- Filter by status (All, Due Today, Overdue, Partial, Settled)
- Search by name or phone
- Edit or delete settled debts

### Export
- Export all debts to Excel
- Export payment ledger
- One-click download

---

## 👥 Who Can Use It?

- **Admin:** Full access to everything
- **Sales:** Create debts, add payments, send reminders
- **Technician:** Create debts for repairs, add payments

---

## 📱 Key Features

✅ **Smart Status Tracking**
- UNPAID → PARTIAL → SETTLED
- Auto-updates based on payments

✅ **Payment Tracking**
- Record any amount, anytime
- Track payment method
- View payment history

✅ **Reminders**
- WhatsApp integration
- SMS integration
- Custom message templates

✅ **Filters & Search**
- Due Today
- Overdue
- Partially Paid
- Settled
- Search by name/phone

✅ **Excel Export**
- All debts
- All payments
- Auto-formatted

---

## 💡 Quick Examples

### Example 1: Create a Debt
1. Click **"Add Debt"**
2. Enter customer name and phone
3. Set amount and due date
4. Click **"Create"**

### Example 2: Record a Payment
1. Find the debt
2. Click **"Payment"**
3. Enter amount and method
4. Click **"Record Payment"**

### Example 3: Send Reminder
1. Find the debt
2. Click **"WhatsApp"** or **"SMS"**
3. Edit message if needed
4. Click **"Send"**

---

## 📊 Status Colors

- 🔴 **UNPAID** - Red badge
- 🟡 **PARTIAL** - Yellow badge
- 🟢 **SETTLED** - Green badge

---

## 🔔 Overdue Alerts

Debts that are overdue show:
- Red due date
- "(Overdue!)" label
- Appear in "Overdue" tab

---

## 📤 Export to Excel

Click **"Export"** button to download:
- Sheet 1: All debts with details
- Sheet 2: All payments ledger

---

## 🎨 Message Templates

Default message:
```
Hello {{customerName}}, you owe ${{balance}} for {{contextLabel}} at EKS Shop.
Due: {{dueDate}}. Please pay to settle. Thank you!
```

You can edit messages before sending!

---

## 🔐 Permissions

### Admin
- ✅ Everything
- ✅ Delete any settled debt
- ✅ Configure messaging

### Sales
- ✅ Create/edit debts
- ✅ Add payments
- ✅ Send reminders
- ❌ Delete others' debts

### Technician
- ✅ Create/edit debts
- ✅ Add payments
- ✅ Send reminders
- ❌ Delete debts

---

## 📚 Full Documentation

For complete details, see:
- **[DEBTS_MODULE.md](DEBTS_MODULE.md)** - Complete documentation
- **[README.md](README.md)** - Main system docs

---

## 🆘 Need Help?

### Common Issues

**Can't see Debts menu?**
- Make sure you restarted frontend
- Check you're logged in

**Can't create debt?**
- Check all required fields
- Verify backend is running

**Payment not updating?**
- Refresh the page
- Check backend logs

**Export not working?**
- Check browser settings
- Verify backend is running

---

## 🎉 You're Ready!

Start tracking customer debts now!

**Go to: http://localhost:3000/debts**

---

**Happy debt tracking! 💰**








