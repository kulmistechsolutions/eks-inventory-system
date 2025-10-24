# 🚀 Deployment Guide - EKS Inventory System

## Overview
This guide will help you deploy the EKS Inventory System to Vercel (frontend) and connect it to GitHub.

## Architecture
- **Frontend**: React + Vite deployed on Vercel
- **Backend**: Node.js + Express (needs separate hosting - Railway/Render recommended)
- **Database**: MongoDB Atlas (cloud)

## Prerequisites
1. GitHub account
2. Vercel account
3. MongoDB Atlas account
4. Railway or Render account (for backend)

## Step 1: Prepare Your Project

### 1.1 Clean up the project
```bash
# Remove unnecessary files
rm -rf node_modules
rm -rf backend/node_modules
rm -rf frontend/node_modules
```

### 1.2 Environment Variables Setup
Create environment files for different environments:

**Frontend (.env.production)**
```env
VITE_API_URL=https://your-backend-url.com/api
```

**Backend (.env)**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/eks_inventory
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
```

## Step 2: GitHub Setup

### 2.1 Create GitHub Repository
1. Go to GitHub.com and create a new repository
2. Name it: `eks-inventory-system`
3. Make it public or private (your choice)
4. Don't initialize with README (we already have one)

### 2.2 Push to GitHub
```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: EKS Inventory System"

# Add remote origin
git remote add origin https://github.com/yourusername/eks-inventory-system.git

# Push to GitHub
git push -u origin main
```

## Step 3: Deploy Frontend to Vercel

### 3.1 Connect GitHub to Vercel
1. Go to [Vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "New Project"
4. Import your `eks-inventory-system` repository
5. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3.2 Environment Variables in Vercel
In your Vercel project settings, add:
- `VITE_API_URL`: Your backend URL (will be set after backend deployment)

### 3.3 Deploy
Click "Deploy" and wait for the deployment to complete.

## Step 4: Deploy Backend

### Option A: Railway (Recommended)
1. Go to [Railway.app](https://railway.app)
2. Sign in with GitHub
3. Create new project from GitHub repo
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm run dev` or `node server.js`

### Option B: Render
1. Go to [Render.com](https://render.com)
2. Create new Web Service
3. Connect your GitHub repo
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm run dev`

## Step 5: Database Setup

### 5.1 MongoDB Atlas
1. Create a free MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update your backend environment variables

### 5.2 Seed Initial Data
After deployment, you may need to seed initial data:
```bash
# Access your deployed backend and run
node seed.js
```

## Step 6: Final Configuration

### 6.1 Update Frontend API URL
Once your backend is deployed, update the `VITE_API_URL` environment variable in Vercel with your actual backend URL.

### 6.2 Test Deployment
1. Visit your Vercel frontend URL
2. Test login functionality
3. Verify all features work correctly

## URLs After Deployment
- **Frontend**: `https://your-project-name.vercel.app`
- **Backend**: `https://your-backend-name.railway.app` or `https://your-backend-name.onrender.com`

## Troubleshooting

### Common Issues
1. **CORS Errors**: Make sure your backend allows your frontend domain
2. **Environment Variables**: Double-check all environment variables are set correctly
3. **Build Errors**: Check the build logs in Vercel/Railway for specific errors

### Support
If you encounter issues, check:
1. Build logs in your deployment platform
2. Browser console for frontend errors
3. Backend logs for API errors

## Next Steps
1. Set up custom domain (optional)
2. Configure monitoring and logging
3. Set up automated backups
4. Configure SSL certificates (usually automatic)

---

**Note**: This is a full-stack application that requires both frontend and backend deployment. The frontend will be deployed on Vercel, while the backend needs a separate hosting solution like Railway or Render.
