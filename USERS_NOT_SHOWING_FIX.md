# 🔧 Users Not Showing - Troubleshooting Guide

## ❓ What's Happening?

If you're on the **Users** page and users are not showing, here's how to fix it:

---

## ✅ Quick Fixes

### **Fix 1: Check Backend is Running**

**Stop the backend** (press `Ctrl+C`), then restart:

```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
```

### **Fix 2: Refresh Browser**

Press `F5` or `Ctrl+R` to refresh the page.

### **Fix 3: Check Browser Console**

1. Press `F12` to open Developer Tools
2. Click **Console** tab
3. Look for errors like:
   ```
   ❌ Failed to fetch
   ❌ Network error
   ❌ 401 Unauthorized
   ```

---

## 🧪 Test the API

### **Check if Users API is Working:**

1. **Open browser** and go to:
   ```
   http://localhost:5000/api/users
   ```

2. **You should see:**
   - If working: JSON data with users
   - If not working: Error message

3. **If you see an error:**
   - Backend is not running
   - Or you need to login first

---

## 📋 Common Issues

### **Issue 1: Backend Not Running**

**Symptoms:**
- Users page is blank
- Loading spinner keeps spinning
- Error in browser console

**Solution:**
```bash
cd backend
npm run dev
```

### **Issue 2: Not Logged In**

**Symptoms:**
- Users page shows error
- Redirected to login page
- 401 Unauthorized error

**Solution:**
1. Login first
2. Then go to Users page

### **Issue 3: No Users in Database**

**Symptoms:**
- Users page loads but shows empty
- No user cards displayed

**Solution:**
1. **Run seed script** to create default users:
   ```bash
   cd backend
   npm run seed
   ```

2. **Or create users manually:**
   - Click "Add User" button
   - Fill in the form
   - Click "Create"

### **Issue 4: Frontend Not Running**

**Symptoms:**
- Page doesn't load at all
- Blank white screen

**Solution:**
```bash
cd frontend
npm run dev
```

---

## 🎯 Step-by-Step Fix

### **Step 1: Check Backend**

```bash
cd backend
npm run dev
```

**Wait for:**
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
```

### **Step 2: Check Frontend**

```bash
cd frontend
npm run dev
```

**Wait for:**
```
VITE ready in XXX ms
➜  Local:   http://localhost:3000/
```

### **Step 3: Login**

1. Go to `http://localhost:3000`
2. Login with:
   - Email: admin@eks.com
   - Password: admin123

### **Step 4: Go to Users Page**

1. Click **Users** in the sidebar
2. Should see user cards

---

## 🔍 What Should You See?

### **On Users Page:**

You should see cards like:

```
┌─────────────────────────────┐
│ [M]  MAXMED ABDI            │
│      engabdi@gmail.com      │
│                             │
│ Status: Active              │
│ Commission: 0%              │
│                             │
│ [Edit] [Delete]             │
└─────────────────────────────┘
```

---

## 🆘 Still Not Working?

### **Check These:**

1. ✅ Backend is running (port 5000)
2. ✅ Frontend is running (port 3000)
3. ✅ MongoDB is connected
4. ✅ You are logged in
5. ✅ No errors in browser console (F12)
6. ✅ No errors in backend terminal

### **Try This:**

1. **Stop both servers** (Ctrl+C)
2. **Restart backend:**
   ```bash
   cd backend
   npm run dev
   ```
3. **Restart frontend:**
   ```bash
   cd frontend
   npm run dev
   ```
4. **Refresh browser** (F5)
5. **Login again**
6. **Go to Users page**

---

## 📞 Need More Help?

### **Check Backend Logs:**

Look for errors in the backend terminal:
```
❌ Error: Cannot connect to MongoDB
❌ Error: Users route not found
❌ Error: Unauthorized
```

### **Check Browser Console:**

Press `F12` and look for:
```
❌ Failed to load resource
❌ Network request failed
❌ 404 Not Found
❌ 401 Unauthorized
```

---

## 🎉 Success Indicators

You'll know it's working when:

✅ Users page loads
✅ User cards are displayed
✅ You can see user names, emails, roles
✅ Commission settings are shown
✅ Edit and Delete buttons are visible

---

**Try restarting both backend and frontend, then refresh the browser!** 🚀








