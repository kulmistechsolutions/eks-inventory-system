#!/bin/bash

# EKS Inventory System Deployment Script
echo "🚀 Starting EKS Inventory System Deployment..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
fi

# Add all files to git
echo "📝 Adding files to Git..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Deploy EKS Inventory System - Updated structure"

# Check if remote origin exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "⚠️  No remote origin found. Please add your GitHub repository URL:"
    echo "   git remote add origin https://github.com/yourusername/eks-inventory-system.git"
    echo "   Then run: git push -u origin main"
else
    echo "🔄 Pushing to GitHub..."
    git push origin main
fi

echo "✅ Deployment preparation complete!"
echo ""
echo "📋 Next steps:"
echo "1. Go to https://vercel.com and connect your GitHub repository"
echo "2. Deploy your backend to Railway or Render"
echo "3. Set up MongoDB Atlas database"
echo "4. Configure environment variables"
echo ""
echo "📖 See DEPLOYMENT_GUIDE.md for detailed instructions"
