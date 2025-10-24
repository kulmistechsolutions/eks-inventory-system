# 🚀 Deployment Guide

## Deployment Options

### Option 1: Vercel (Frontend) + Railway/Render (Backend)

#### Backend Deployment (Railway)

1. **Create Railway Account**
   - Go to [Railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy Backend**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your backend folder
   - Add environment variables:
     ```
     PORT=5000
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_secret_key
     JWT_EXPIRE=7d
     ```
   - Railway will auto-deploy

3. **Get Backend URL**
   - Railway provides a public URL
   - Example: `https://your-app.railway.app`

#### Frontend Deployment (Vercel)

1. **Create Vercel Account**
   - Go to [Vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Deploy Frontend**
   - Click "New Project"
   - Import your GitHub repository
   - Set root directory to `frontend`
   - Configure build settings:
     - Framework: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Add environment variable:
     ```
     VITE_API_URL=https://your-backend-url.railway.app/api
     ```
   - Deploy!

### Option 2: Render (Both Frontend & Backend)

#### Backend on Render

1. Go to [Render.com](https://render.com)
2. Create a new "Web Service"
3. Connect your GitHub repo
4. Set:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add environment variables
6. Deploy

#### Frontend on Render

1. Create a new "Static Site"
2. Connect your GitHub repo
3. Set:
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Publish Directory: `dist`
4. Add environment variables
5. Deploy

### Option 3: Netlify (Frontend) + Heroku (Backend)

#### Backend on Heroku

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Set environment variables:
   ```bash
   heroku config:set MONGODB_URI=your_connection_string
   heroku config:set JWT_SECRET=your_secret
   heroku config:set JWT_EXPIRE=7d
   ```
5. Deploy: `git push heroku main`

#### Frontend on Netlify

1. Go to [Netlify.com](https://netlify.com)
2. Click "Add new site"
3. Deploy with GitHub
4. Set build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Add environment variable:
   ```
   VITE_API_URL=https://your-backend.herokuapp.com/api
   ```

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-url.com/api
```

## MongoDB Atlas Configuration

1. **Whitelist IP Addresses**
   - Go to Network Access
   - Add `0.0.0.0/0` to allow all IPs (for production)
   - Or add specific IPs for security

2. **Database User**
   - Create a database user with read/write permissions
   - Use strong password

3. **Connection String**
   - Get from Atlas dashboard
   - Replace `<password>` with actual password
   - Replace `<dbname>` with your database name

## Post-Deployment Checklist

- [ ] Backend is running and accessible
- [ ] Frontend can connect to backend
- [ ] MongoDB connection is working
- [ ] Environment variables are set correctly
- [ ] CORS is configured properly
- [ ] Create admin user
- [ ] Test all features
- [ ] Set up custom domain (optional)
- [ ] Enable HTTPS (automatic on most platforms)

## Custom Domain Setup

### Vercel
1. Go to project settings
2. Click "Domains"
3. Add your domain
4. Follow DNS configuration instructions

### Railway/Render
1. Go to project settings
2. Add custom domain
3. Configure DNS records

## Monitoring

- Check application logs regularly
- Monitor MongoDB Atlas usage
- Set up error tracking (Sentry, LogRocket)
- Monitor API response times

## Backup Strategy

1. **MongoDB Atlas**
   - Enable automated backups
   - Set retention period
   - Test restore process

2. **Code**
   - Use Git for version control
   - Keep backups of environment variables

## Security Best Practices

1. Use strong JWT secrets
2. Enable MongoDB authentication
3. Use HTTPS (automatic on most platforms)
4. Keep dependencies updated
5. Use environment variables for secrets
6. Implement rate limiting
7. Regular security audits

## Performance Optimization

1. Enable MongoDB indexes
2. Use CDN for static assets
3. Implement caching
4. Optimize images
5. Minimize bundle size
6. Use lazy loading

## Troubleshooting

### Backend Issues
- Check logs in deployment platform
- Verify environment variables
- Test MongoDB connection
- Check CORS configuration

### Frontend Issues
- Check browser console
- Verify API URL
- Check network requests
- Clear browser cache

### Database Issues
- Check Atlas connection
- Verify IP whitelist
- Check user permissions
- Monitor database usage

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)

---

**Good luck with deployment! 🚀**








