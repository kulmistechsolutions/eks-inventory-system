Here’s a **complete Product Requirements Document (PRD)** in **English** for your **Inventory and Mobile Repair Management System**, ready to be used with **Cursor** or any project management tool 👇

---

## 📘 Product Requirements Document (PRD)

### 🧩 Project Title

**EKS Electronic Inventory & Mobile Repair Management System**

---

### 🧭 Overview

This system manages the operations of an electronics and mobile shop that sells products (e.g., phones, accessories, gadgets) and provides repair services.
It will support **multiple users**, including:

* **Admin**: Full access, can manage users, view reports, and monitor all activities.
* **Sales Staff**: Handles product sales only (limited visibility).
* **Technicians**: Manages repair jobs only (limited visibility).

The system will be **responsive**, optimized for **desktop and mobile**, and built using:

* **React + TypeScript** (frontend)
* **Tailwind CSS** (styling)
* **Node.js + Express.js** (backend)
* **MongoDB or MySQL** (database)

---

### ⚙️ Core Modules

#### 1. **Authentication & User Management**

* Admin can create and manage users (Salesperson, Technician).
* Secure login system (JWT authentication).
* Role-based access control:

  * Admin: Full access.
  * Sales: Access to product sales only.
  * Technician: Access to repair jobs only.

---

#### 2. **Inventory Management**

* Add new products (name, category, price, quantity, supplier, and date).
* View, update, or delete existing products.
* Track stock quantity and value.
* Auto-alert when stock is low.
* Generate reports:

  * Total stock value.
  * Most/least sold items.

---

#### 3. **Sales Management**

* Add items to cart and generate sales.
* Each sale must record:

  * Product name, quantity, and price.
  * Total amount and profit margin.
* Deduct sold quantity from inventory automatically.
* Generate **daily, weekly, and monthly sales reports**.
* **Profit/Loss tracking**: Compare sales and expenses.
* Export sales report to **Excel (.xlsx)**.

---

#### 4. **Mobile Repair Management**

* Record customer repair requests:

  * Customer name, phone number.
  * Device model/type.
  * Problem/issue description.
  * Estimated repair cost.
  * Amount paid (partial or full).
  * Remaining balance.
  * Repair status: `Pending`, `In Progress`, `Completed`, `Waiting for Payment`.
  * Delivery time (e.g., in hours or days).
* Update status and payment as work progresses.
* Mark repair as **Complete** when fully paid.
* Track **waiting repairs** and **completed repairs**.

---

#### 5. **Expenses Management**

* Record daily/weekly expenses (e.g., equipment, tools, materials).
* Each expense includes: name, description, amount, and date.
* Admin can generate an **Expense Report** to analyze profit vs loss.

---

#### 6. **Dashboard (Admin View)**

* Key metrics at a glance:

  * 📦 Total Products in Stock
  * 💰 Total Sales Today
  * 🔧 Total Repairs in Progress
  * 💵 Total Revenue & Profit
  * 🕒 Pending Payments (Repair Jobs)
  * 📊 Graphs for sales and repair statistics
* Export all reports to Excel.

---

### 📱 Responsiveness

* Fully responsive for both **mobile** and **desktop**.
* Use **Tailwind CSS grid/flex utilities**.
* Adaptive dashboards and forms.

---

### 🔒 Permissions Summary

| Role        | Sales | Repairs | Reports | Users | Expenses |
| ----------- | ----- | ------- | ------- | ----- | -------- |
| Admin       | ✅     | ✅       | ✅       | ✅     | ✅        |
| Salesperson | ✅     | ❌       | ❌       | ❌     | ❌        |
| Technician  | ❌     | ✅       | ❌       | ❌     | ❌        |

---

### 🧾 Reports & Export

* **Sales Report** → Date range, Excel download.
* **Repair Report** → Status, customer name, payment status.
* **Expense Report** → Date range, category.
* **Profit/Loss Report** → Sales – Expenses.
* All reports exportable to **Excel (.xlsx)**.

---

### 🧱 Technical Stack

| Layer            | Technology                      |
| ---------------- | ------------------------------- |
| Frontend         | React, TypeScript, Tailwind CSS |
| Backend          | Node.js, Express.js             |
| Database         | MongoDB ATLASS                 |
| Authentication   | JWT                             |
| File Export      | ExcelJS                         |
| State Management | React Query / Context API       |
| Deployment       | Vercel / Render / Railway       |

---

### 🧩 Additional Features

* Search and filter functionality (by product, customer, or repair status).
* Dark/light mode toggle (optional).
* Notification alerts for pending payments or repairs.
* Audit logs (optional, for Admin).

---

### 🚀 MVP Deliverables

1. User authentication and role management.
2. Product inventory with CRUD operations.
3. Sales and profit calculation.
4. Repair tracking system with partial payments.
5. Reports and Excel export.
6. Responsive dashboard UI.

---

Would you like me to **generate the full folder structure and boilerplate code** for this PRD (React + Node.js + TypeScript + Tailwind setup)?
I can include the **frontend & backend folders**, **API routes**, and **database schema design** next.
