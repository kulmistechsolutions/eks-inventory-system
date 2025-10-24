# 💰 Debts & Loans Module - Complete Documentation

## 📋 Overview

The Debts & Loans module allows you to track customer debts, record partial payments, and send payment reminders via SMS/WhatsApp. Fully integrated with the existing EKS Inventory & Repair Management System.

---

## ✨ Features

### Core Features
- ✅ Create and manage customer debts
- ✅ Record partial payments anytime
- ✅ Auto-calculate remaining balance
- ✅ Auto-update debt status (UNPAID → PARTIAL → SETTLED)
- ✅ Link debts to Sales or Repairs
- ✅ Send payment reminders via SMS/WhatsApp
- ✅ Delete settled debts (with permissions)
- ✅ Export debts and payments to Excel

### Advanced Features
- ✅ Smart filtering (All, Due Today, Overdue, Partial, Settled)
- ✅ Search by customer name or phone
- ✅ Editable message templates
- ✅ Variable substitution in messages
- ✅ Overdue alerts and countdown timers
- ✅ Payment ledger tracking
- ✅ Role-based permissions

---

## 🎯 User Stories Implemented

### ✅ Create Debt
- Customer Name (required)
- Phone Number (required)
- WhatsApp Number (optional)
- Amount Owed (required, decimal)
- Due Date (required: date/time)
- Notes (optional)
- Linked Context (SALE, REPAIR, OTHER) with reference ID

### ✅ Record Partial Payments
- Add payment of any amount, anytime
- Remaining balance updates instantly
- Status automatically changes based on payment

### ✅ Mark as Settled & Delete
- When balance = 0, status becomes SETTLED
- Can delete settled debts (with confirmation)
- Permission-based deletion (Admin always, others if creator)

### ✅ Share via SMS/WhatsApp
- SMS: Opens native SMS app with prefilled message
- WhatsApp: Opens WhatsApp with prefilled message
- Editable message templates
- Variable substitution (customer name, amount, due date, etc.)
- Tracks last shared date and channel

### ✅ View Lists
- All Debts
- Due Today
- Overdue
- Partially Paid
- Settled

### ✅ Filter & Search
- By name
- By phone
- By status
- By date range
- By creator
- By linked context

### ✅ Export to Excel
- Debts sheet with all details
- Payments ledger sheet
- Auto-formatted with filters

---

## 🔐 Roles & Permissions

### Admin
- ✅ Full CRUD on all debts
- ✅ Export debts
- ✅ Configure messaging
- ✅ Delete any settled debt
- ✅ View all debts

### Sales
- ✅ Create/update debts
- ✅ Add payments
- ✅ Share via SMS/WhatsApp
- ✅ View own created debts
- ❌ Cannot change global config
- ❌ Cannot delete debts created by others

### Technician
- ✅ Create/update debts (tied to repairs)
- ✅ Add payments
- ✅ Share via SMS/WhatsApp
- ✅ View own created debts
- ❌ Cannot delete settled debts
- ❌ Cannot change config

---

## 📊 Data Models

### Debt Schema
```javascript
{
  customerName: String (required),
  phone: String (required),
  whatsapp: String (optional),
  amountOwed: Number (required, min: 0),
  amountPaid: Number (default: 0, min: 0),
  balance: Number (auto-calculated),
  dueAt: Date (required),
  status: Enum ['UNPAID', 'PARTIAL', 'SETTLED'] (auto-calculated),
  contextType: Enum ['SALE', 'REPAIR', 'OTHER'],
  contextId: String (optional),
  notes: String (optional),
  createdBy: ObjectId (required),
  lastSharedAt: Date (optional),
  lastShareChannel: Enum ['SMS', 'WHATSAPP'] (optional),
  createdAt: Date,
  updatedAt: Date
}
```

### Payment Schema
```javascript
{
  debtId: ObjectId (required, FK to Debt),
  amount: Number (required, min: 0.01),
  method: Enum ['CASH', 'MOBILE_MONEY', 'CARD', 'OTHER'],
  note: String (optional),
  createdBy: ObjectId (required),
  createdAt: Date
}
```

### MessageConfig Schema
```javascript
{
  smsEnabled: Boolean (default: false),
  whatsappEnabled: Boolean (default: true),
  smsSenderId: String (optional),
  whatsappBusinessNumber: String (optional),
  shopName: String (default: 'EKS Electronic Shop'),
  defaultTemplate: String (editable),
  footer: String (default: 'Thank you!'),
  currency: String (default: '$'),
  updatedAt: Date
}
```

---

## 🔌 API Endpoints

### Debt Management
- `POST /api/debts` - Create debt
- `GET /api/debts` - List debts (with filters)
- `GET /api/debts/:id` - Get single debt with payments
- `PATCH /api/debts/:id` - Update debt
- `DELETE /api/debts/:id` - Delete debt (only if settled)

### Payment Management
- `POST /api/debts/:id/payments` - Add payment
- `DELETE /api/payments/:id` - Remove payment

### Sharing
- `POST /api/debts/:id/share/sms` - Send SMS
- `POST /api/debts/:id/share/whatsapp` - Send WhatsApp

### Export & Config
- `GET /api/debts/export.xlsx` - Export to Excel (Admin only)
- `GET /api/debts/config/messages` - Get message config
- `PATCH /api/debts/config/messages` - Update message config (Admin only)

---

## 📱 UI/UX Features

### Debts List
- **Tabs:** All, Due Today, Overdue, Partial, Settled
- **Search:** By customer name or phone
- **Cards:** Customer info, amounts, due date, status
- **Actions:** Payment, WhatsApp, SMS, Edit, Delete
- **Visual Indicators:** Color-coded status badges, overdue warnings

### Create/Edit Form
- Clean, intuitive form
- All required fields marked with *
- Context type selector
- Date/time picker for due date
- Notes field for additional info

### Payment Modal
- Shows current amounts
- Payment amount input
- Payment method selector
- Optional note field
- Real-time balance update

### Share Modal
- Channel selector (SMS/WhatsApp)
- Editable message with preview
- Variable substitution
- Live preview
- Send button

### Export
- One-click Excel export
- Two sheets: Debts & Payments
- Auto-formatted
- Date range filtering

---

## 🎨 Message Templates

### Default Template
```
Hello {{customerName}}, you owe {{currency}}{{balance}} for {{contextLabel}} at {{shopName}}.
Due: {{dueDate}}. Please pay to settle. {{footer}}
```

### Available Variables
- `{{customerName}}` - Customer's name
- `{{amountOwed}}` - Total amount owed
- `{{amountPaid}}` - Amount paid so far
- `{{balance}}` - Remaining balance
- `{{dueDate}}` - Due date (formatted)
- `{{shopName}}` - Shop name from config
- `{{contextLabel}}` - e.g., "repair #123" or "sale #456"
- `{{currency}}` - Currency symbol from config
- `{{footer}}` - Footer text from config

---

## 🔧 Status Logic

### On Create
- If `amountPaid == 0` → Status = **UNPAID**
- If `0 < amountPaid < amountOwed` → Status = **PARTIAL**
- If `amountPaid >= amountOwed` → Status = **SETTLED**

### After Payment
- Recalculate `amountPaid`
- Recalculate `balance = amountOwed - amountPaid`
- Update status based on new values

### Delete Rules
- Only if `status == SETTLED`
- Admin can always delete
- Others can only delete if they created it

---

## 📊 Excel Export

### Sheet 1: Debts
Columns:
- ID, Customer Name, Phone, WhatsApp
- Amount Owed, Amount Paid, Balance
- Due Date, Status, Context Type, Context ID
- Created By, Created At

### Sheet 2: Payments
Columns:
- ID, Debt ID, Customer, Amount
- Method, Note, Created By, Created At

Features:
- Auto-filters enabled
- Currency formatting
- Date formatting
- Header styling

---

## 🚀 Getting Started

### 1. Backend Setup

The debts module is already integrated! Just restart your backend:

```bash
cd backend
npm run dev
```

### 2. Frontend Setup

The debts page is already added to navigation! Just restart your frontend:

```bash
cd frontend
npm run dev
```

### 3. Access the Module

1. Login to the system
2. Click **Debts** in the sidebar
3. Start creating debts!

---

## 💡 Usage Examples

### Example 1: Create Debt for Sale

1. Click **Add Debt**
2. Fill in:
   - Customer Name: "Ahmed Hassan"
   - Phone: "+252612345678"
   - Amount Owed: 150.00
   - Due Date: Tomorrow 5:00 PM
   - Context Type: Sale
   - Context ID: SALE-123
3. Click **Create**

### Example 2: Record Partial Payment

1. Find the debt
2. Click **Payment**
3. Enter:
   - Amount: 50.00
   - Method: Mobile Money
   - Note: "Partial payment"
4. Click **Record Payment**

### Example 3: Send WhatsApp Reminder

1. Find the debt
2. Click **WhatsApp**
3. Edit the message if needed
4. Click **Send WhatsApp**
5. WhatsApp opens with prefilled message

### Example 4: Export Debts

1. Click **Export** button
2. Excel file downloads automatically
3. Open to view all debts and payments

---

## 🔒 Security Features

- JWT authentication required
- Role-based access control
- Permission checks on all operations
- Validation on all inputs
- Safe deletion (only settled debts)
- Audit trail (created by, timestamps)

---

## 📈 Future Enhancements

Possible additions:
- [ ] Recurring debt templates
- [ ] Automated payment reminders (cron jobs)
- [ ] Payment plan schedules
- [ ] Interest calculation
- [ ] Debt aging reports
- [ ] Customer payment history
- [ ] Bulk operations
- [ ] PDF receipts
- [ ] SMS/WhatsApp provider integration (Twilio, etc.)
- [ ] Multi-currency support
- [ ] Debt consolidation

---

## 🐛 Troubleshooting

### Issue: Cannot create debt
**Solution:** Check all required fields are filled

### Issue: Payment not updating balance
**Solution:** Refresh the page or check backend logs

### Issue: Cannot delete debt
**Solution:** Ensure debt status is SETTLED and you have permissions

### Issue: WhatsApp/SMS not working
**Solution:** Check message config and ensure phone number is valid

### Issue: Export not downloading
**Solution:** Check browser settings and ensure backend is running

---

## 📚 Related Documentation

- [SETUP.md](SETUP.md) - System setup guide
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - General troubleshooting
- [README.md](README.md) - Main documentation

---

## 🎉 Success!

Your Debts & Loans module is fully integrated and ready to use!

**Start tracking customer debts today! 💰**








