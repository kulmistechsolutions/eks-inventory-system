# ⚡ Quick Start - Get Running in 2 Minutes!

## 🚀 Super Quick Setup

### 1️⃣ Install Dependencies

```bash
npm run install-all
```

### 2️⃣ Configure MongoDB

Edit `backend/.env` and add your MongoDB connection string:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/eks-inventory
JWT_SECRET=your_secret_key_here
```

### 3️⃣ Create Users

```bash
cd backend
npm run seed
```

This creates:
- ✅ Admin: admin@eks.com / admin123
- ✅ Sales: sales@eks.com / sales123
- ✅ Technician: tech@eks.com / tech123

### 4️⃣ Start the App

```bash
# Go back to root folder
cd ..

# Start both frontend and backend
npm run dev
```

### 5️⃣ Login

Open http://localhost:3000 and login with:
- **Email:** admin@eks.com
- **Password:** admin123

---

## 🎉 You're Done!

Your EKS Inventory & Repair Management System is now running!

---

## 📚 Need More Details?

- **Full Setup Guide:** See [SETUP.md](SETUP.md)
- **User Creation:** See [CREATE_USERS.md](CREATE_USERS.md)
- **Deployment:** See [DEPLOYMENT.md](DEPLOYMENT.md)

---

## 🆘 Troubleshooting

### MongoDB Connection Error?
- Check your `backend/.env` file
- Verify your MongoDB URI is correct
- Make sure your IP is whitelisted in MongoDB Atlas

### Port Already in Use?
- Change `PORT` in `backend/.env`
- Update `VITE_API_URL` in `frontend/.env`

### Can't Login?
- Make sure you ran `npm run seed` in the backend folder
- Check that the backend is running on port 5000

---

**Happy coding! 🚀**








