# 🔧 Fix Login Issue - Step by Step

## Follow These Steps in Order

### Step 1: Make Sure Backend is Running ✅

Open a terminal and run:

```bash
cd backend
npm run dev
```

**You should see:**
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
```

**If you see errors:**
- Check `backend/.env` file exists
- Verify `MONGODB_URI` is correct

---

### Step 2: Create Users ✅

In the **same terminal** (backend should be running), open a **NEW terminal** and run:

```bash
cd backend
npm run seed
```

**You should see:**
```
✅ Users created successfully!
👤 Admin User: admin@eks.com / admin123
```

---

### Step 3: Test the Connection ✅

Open a **NEW terminal** and run:

```bash
npm run test-connection
```

**You should see:**
```
✅ Backend is running
✅ Login successful!
```

**If you see errors:**
- Go back to Step 1 and 2

---

### Step 4: Start Frontend ✅

Open a **NEW terminal** and run:

```bash
cd frontend
npm run dev
```

**You should see:**
```
VITE ready in XXX ms
➜  Local:   http://localhost:3000/
```

---

### Step 5: Login ✅

1. Open your browser
2. Go to: **http://localhost:3000**
3. Enter credentials:
   - **Email:** `admin@eks.com`
   - **Password:** `admin123`
4. Click **Sign In**

**You should be logged in!**

---

## Quick Fix (If Still Not Working)

### Option 1: Restart Everything

```bash
# Stop all terminals (Ctrl+C)

# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend (NEW terminal)
cd frontend
npm run dev

# Open browser: http://localhost:3000
```

---

### Option 2: Clean Install

```bash
# Stop all terminals (Ctrl+C)

# Backend
cd backend
rm -rf node_modules
npm install
npm run seed
npm run dev

# Frontend (NEW terminal)
cd frontend
rm -rf node_modules
npm install
npm run dev

# Open browser: http://localhost:3000
```

---

## Check These Things

### ✅ Backend Running?
Open: http://localhost:5000/api/health

Should show:
```json
{"status":"OK","message":"Server is running"}
```

### ✅ Users Created?
Run: `cd backend && npm run seed`

Should show:
```
✅ Users created successfully!
```

### ✅ Frontend Running?
Open: http://localhost:3000

Should show the login page

### ✅ Browser Console?
Press F12 → Console tab

Should NOT show any red errors

---

## Common Problems

### Problem: "Network Error"
**Solution:** Backend is not running. Start it with `cd backend && npm run dev`

### Problem: "Invalid credentials"
**Solution:** Users not created. Run `cd backend && npm run seed`

### Problem: Login button does nothing
**Solution:** 
1. Check browser console (F12) for errors
2. Make sure backend is running
3. Check Network tab to see if request is sent

### Problem: Blank page
**Solution:** 
1. Check frontend is running: `cd frontend && npm run dev`
2. Check browser console for errors
3. Try hard refresh: Ctrl+Shift+R

---

## Still Not Working?

Run this command and share the output:

```bash
npm run test-connection
```

This will tell us exactly what's wrong!

---

## Success! 🎉

If login works, you should see:
- Dashboard with statistics
- Sidebar with menu items
- Your name in the top right

---

**Need more help? Run `npm run test-connection` and share the results!**








