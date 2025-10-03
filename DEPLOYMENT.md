# Deployment Guide

This guide will help you deploy your Family Photo Sharing App to the web using free/low-cost services.

## Prerequisites

1. **MongoDB Atlas Account** (Free tier available)
2. **Cloudinary Account** (Free tier available)
3. **GitHub Account** (For code hosting)
4. **Vercel Account** (Free tier for frontend)
5. **Railway/Render Account** (Free tier for backend)

## Step 1: Prepare Your Code

### 1.1 Initialize Git Repository
```bash
cd family-photo-app
git init
git add .
git commit -m "Initial commit - Family Photo Sharing App"
```

### 1.2 Create GitHub Repository
1. Go to GitHub and create a new repository
2. Push your code:
```bash
git remote add origin https://github.com/yourusername/family-photo-app.git
git branch -M main
git push -u origin main
```

## Step 2: Set Up MongoDB Atlas

### 2.1 Create Database
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and new cluster
3. Create a database user with read/write permissions
4. Get your connection string (looks like: `mongodb+srv://...`)

### 2.2 Configure Network Access
1. In Atlas, go to Network Access
2. Add your IP address or use `0.0.0.0/0` for development (less secure)

## Step 3: Set Up Cloudinary

### 3.1 Get Credentials
1. Go to [Cloudinary](https://cloudinary.com/)
2. Create a free account
3. From your dashboard, note:
   - Cloud Name
   - API Key
   - API Secret

## Step 4: Deploy Backend (Choose One)

### Option A: Railway (Recommended)

1. **Connect Repository**
   - Go to [Railway](https://railway.app/)
   - Sign up and connect your GitHub account
   - Create new project and select your repository

2. **Set Environment Variables**
   ```
   NODE_ENV=production
   PORT=8080
   MONGODB_URI=your-mongodb-atlas-connection-string
   JWT_SECRET=your-super-secure-jwt-secret-at-least-32-chars
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   CLIENT_URL=https://your-frontend-url.vercel.app
   ```

3. **Deploy**
   - Railway will automatically build and deploy
   - Note your backend URL (e.g., `https://your-app.railway.app`)

### Option B: Render

1. **Connect Repository**
   - Go to [Render](https://render.com/)
   - Sign up and connect your GitHub account
   - Create new Web Service from your repository

2. **Configure Service**
   - Build Command: `npm install`
   - Start Command: `npm run server`
   - Set environment variables (same as above)

## Step 5: Deploy Frontend (Vercel)

### 5.1 Update API URL
1. Edit `client/.env.production`:
   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app/api
   ```

### 5.2 Deploy to Vercel
1. Go to [Vercel](https://vercel.com/)
2. Sign up and connect your GitHub account
3. Import your repository
4. Configure:
   - Framework Preset: Create React App
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `build`

5. **Set Environment Variables in Vercel:**
   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app/api
   ```

6. Deploy - Vercel will build and deploy automatically

## Step 6: Update CORS Configuration

After deployment, update your backend CORS configuration in `server/index.js`:

```javascript
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? [process.env.CLIENT_URL || 'https://your-frontend-url.vercel.app']
    : ['http://localhost:3000'],
  credentials: true
}));
```

## Step 7: Test Your Deployment

1. **Backend Health Check**
   - Visit: `https://your-backend-url.railway.app/api/health`
   - Should return JSON with status "OK"

2. **Frontend Access**
   - Visit: `https://your-frontend-url.vercel.app`
   - Test registration, login, and photo upload

3. **Database Connection**
   - Register a new user
   - Upload a photo
   - Verify data is saved in MongoDB Atlas

## Environment Variables Summary

### Backend Environment Variables
```
NODE_ENV=production
PORT=8080
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secure-secret
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CLIENT_URL=https://your-frontend-url.vercel.app
```

### Frontend Environment Variables
```
REACT_APP_API_URL=https://your-backend-url.railway.app/api
```

## Security Considerations

### Production Security Checklist
- [ ] Use strong JWT secret (32+ characters)
- [ ] Configure MongoDB Atlas IP whitelist properly
- [ ] Set up proper CORS origins
- [ ] Use HTTPS only (handled by deployment platforms)
- [ ] Don't commit environment variables to Git
- [ ] Use environment variables for all secrets

### Monitoring and Maintenance
- Monitor MongoDB Atlas usage (free tier has limits)
- Monitor Cloudinary usage (free tier has limits)
- Check Railway/Render logs for errors
- Set up uptime monitoring (optional)

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check frontend and backend URLs in environment variables
   - Verify CORS configuration in server/index.js

2. **Database Connection**
   - Verify MongoDB Atlas connection string
   - Check IP whitelist in Atlas
   - Ensure database user has proper permissions

3. **File Upload Issues**
   - Verify Cloudinary credentials
   - Check file size limits
   - Monitor Cloudinary usage quotas

4. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json
   - Check build logs for specific errors

### Logs and Debugging
- **Railway**: Check logs in Railway dashboard
- **Render**: Check logs in Render dashboard
- **Vercel**: Check function logs in Vercel dashboard
- **MongoDB**: Check connection logs in Atlas

## Scaling Considerations

### For Growing Families
- Monitor MongoDB storage usage
- Consider upgrading Cloudinary plan for more storage
- Implement image optimization for better performance
- Consider CDN for faster global access

### Performance Optimization
- Implement lazy loading for images
- Add image compression
- Use pagination for large photo collections
- Consider implementing caching strategies

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review deployment platform documentation
3. Check MongoDB Atlas and Cloudinary status pages
4. Review application logs for specific error messages

---

**Your family photo sharing app is now live and secure on the web!** 📸❤️