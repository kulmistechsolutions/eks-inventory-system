# 🔧 Troubleshooting Guide

## Login Not Working? Follow These Steps

### ✅ Step 1: Check Backend is Running

Open a terminal and check if backend is running:

```bash
# Should show the backend server running
cd backend
npm run dev
```

You should see:
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
```

**If you see errors:**
- Check your `backend/.env` file exists
- Verify `MONGODB_URI` is correct
- Make sure MongoDB Atlas is accessible

---

### ✅ Step 2: Check Users Are Created

```bash
# Run the seed script to create users
cd backend
npm run seed
```

You should see:
```
✅ Users created successfully!
👤 Admin User: admin@eks.com / admin123
```

**If you see "Admin user already exists":**
- Users are already created, you can proceed

---

### ✅ Step 3: Check Frontend is Running

Open another terminal:

```bash
# Frontend should be running on port 3000
cd frontend
npm run dev
```

You should see:
```
VITE ready in XXX ms
➜  Local:   http://localhost:3000/
```

---

### ✅ Step 4: Test Backend API

Open your browser and go to:
```
http://localhost:5000/api/health
```

You should see:
```json
{"status":"OK","message":"Server is running"}
```

**If this doesn't work:**
- Backend is not running
- Check backend terminal for errors

---

### ✅ Step 5: Check Browser Console

1. Open http://localhost:3000
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Try to login
5. Check for any errors

**Common errors:**

❌ `Network Error` or `Failed to fetch`
- Backend is not running
- Check backend terminal

❌ `401 Unauthorized`
- Wrong email or password
- Users not created (run `npm run seed`)

❌ `CORS error`
- Backend CORS is configured, but check if backend is running

---

### ✅ Step 6: Check Network Tab

1. Open Developer Tools (F12)
2. Go to **Network** tab
3. Try to login
4. Look for the login request to `/api/auth/login`
5. Check the response

**Good response:**
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": { "name": "Admin User", ... }
}
```

**Bad response:**
```json
{
  "message": "Invalid credentials"
}
```

---

### ✅ Step 7: Verify Environment Variables

Check `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Check `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
```

---

## Common Issues & Solutions

### Issue 1: "Network Error" on Login

**Cause:** Backend is not running

**Solution:**
```bash
cd backend
npm run dev
```

---

### Issue 2: "Invalid credentials"

**Cause:** Wrong email/password or users not created

**Solution:**
```bash
cd backend
npm run seed
```

Then login with:
- Email: `admin@eks.com`
- Password: `admin123`

---

### Issue 3: Backend starts but MongoDB connection fails

**Cause:** Wrong MongoDB URI or IP not whitelisted

**Solution:**
1. Check `backend/.env` - verify `MONGODB_URI`
2. Go to MongoDB Atlas → Network Access
3. Add your IP address (or `0.0.0.0/0` for all IPs)

---

### Issue 4: Frontend shows blank page

**Cause:** Frontend build error or port conflict

**Solution:**
```bash
cd frontend
npm install
npm run dev
```

---

### Issue 5: "Cannot GET /" on backend

**Cause:** Backend is running but showing wrong page

**Solution:** This is normal! Backend API is at `/api/*`
- Health check: http://localhost:5000/api/health
- Login: http://localhost:5000/api/auth/login

---

### Issue 6: Login button does nothing

**Cause:** JavaScript error or API not responding

**Solution:**
1. Open browser console (F12)
2. Check for errors
3. Check Network tab for failed requests
4. Verify backend is running

---

## Quick Diagnostic Commands

Run these commands to check everything:

```bash
# 1. Check if backend is running
curl http://localhost:5000/api/health

# 2. Test login directly
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@eks.com","password":"admin123"}'

# 3. Check if users exist in database
# (Use MongoDB Compass or Atlas UI)
```

---

## Still Not Working?

### Full Reset (Nuclear Option)

```bash
# 1. Stop all servers (Ctrl+C)

# 2. Clean install
cd backend
rm -rf node_modules
npm install

cd ../frontend
rm -rf node_modules
npm install

# 3. Create users
cd ../backend
npm run seed

# 4. Start backend
npm run dev

# 5. In another terminal, start frontend
cd ../frontend
npm run dev

# 6. Open http://localhost:3000
# Login with: admin@eks.com / admin123
```

---

## Getting Help

If nothing works:

1. **Check backend terminal** - What errors do you see?
2. **Check browser console** - Any JavaScript errors?
3. **Check Network tab** - Is the login request being sent?
4. **Verify MongoDB** - Can you connect to Atlas?

---

## Success Checklist

Before reporting an issue, verify:

- [ ] Backend is running on port 5000
- [ ] Frontend is running on port 3000
- [ ] MongoDB connection is successful
- [ ] Users are created (`npm run seed`)
- [ ] `backend/.env` has correct `MONGODB_URI`
- [ ] `frontend/.env` has `VITE_API_URL=http://localhost:5000/api`
- [ ] No errors in backend terminal
- [ ] No errors in browser console
- [ ] Network tab shows login request

---

**Need more help? Check the console logs and share any error messages!**








