# Railway Deployment Guide

## Step-by-Step Deployment Instructions

### Prerequisites
- GitHub account with your repository
- Railway account (free tier available at railway.app)
- MongoDB Atlas account (free tier available)
- Environment variables ready

---

## Part 1: MongoDB Atlas Setup

1. **Create MongoDB Database**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create an account and login
   - Create a new cluster (free tier available)
   - Click "Connect"
   - Choose "Drivers" option
   - Copy the connection string
   - Replace `<username>`, `<password>`, and `<cluster>` with your credentials
   - Example: `mongodb+srv://user:pass@cluster0.mongodb.net/team-task-manager?retryWrites=true&w=majority`

---

## Part 2: GitHub Repository Setup

1. **Initialize Git Repository**
   ```bash
   cd Team\ Task\ Manager
   git init
   git add .
   git commit -m "Initial commit: Team Task Manager MERN app"
   ```

2. **Create GitHub Repository**
   - Go to [GitHub](https://github.com)
   - Click "New repository"
   - Name it `team-task-manager`
   - Don't initialize with README (we already have one)
   - Create repository

3. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/team-task-manager.git
   git branch -M main
   git push -u origin main
   ```

---

## Part 3: Backend Deployment on Railway

### Step 1: Create Backend Service on Railway

1. Go to [Railway.app](https://railway.app)
2. Click "New Project"
3. Choose "Deploy from GitHub repo"
4. Connect your GitHub account if not already connected
5. Select `team-task-manager` repository
6. Railway will detect the backend folder structure

### Step 2: Configure Build and Start Commands

1. Go to project settings
2. Set the root directory to `/backend`
3. Build command: `npm install`
4. Start command: `npm start`

### Step 3: Add Environment Variables

1. Go to "Variables" tab in Railway
2. Add the following variables:
   ```
   MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.mongodb.net/team-task-manager?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   PORT=5000
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-railway-url.railway.app
   ```

### Step 4: Deploy

1. Click "Deploy" button
2. Railway will automatically build and deploy
3. You'll get a public URL like: `https://team-task-manager-production-xxxx.railway.app`
4. Save this URL for frontend configuration

---

## Part 4: Frontend Deployment on Railway

### Step 1: Create Frontend Service on Railway

1. Go back to your Railway project
2. Click "New Service"
3. Choose "GitHub repo"
4. Select `team-task-manager` again
5. This time, set root directory to `/frontend`

### Step 2: Configure Build and Start Commands

1. Root directory: `/frontend`
2. Build command: `npm run build`
3. Start command: `npx serve -s dist` (or Railway's default)
4. Framework: Static

### Step 3: Add Environment Variables

1. Go to "Variables" tab for frontend service
2. Add:
   ```
   VITE_API_URL=https://your-backend-railway-url.railway.app
   ```
   (Use the backend URL from Part 3, Step 4)

### Step 4: Configure Port

1. Add PORT variable: `3000` or let Railway auto-assign
2. Add a domain via "Domain" tab if you want custom domain

### Step 5: Deploy

1. Railway will auto-deploy
2. Get your frontend URL

---

## Part 5: Update Backend FRONTEND_URL

1. Go back to backend service
2. Update `FRONTEND_URL` variable with your deployed frontend URL
3. Save changes (auto-redeploy)

---

## Part 6: Testing Live Application

1. Visit your frontend URL
2. Create an account
3. Create a project
4. Create tasks
5. Test all features

---

## Troubleshooting

### Backend Connection Issues
```bash
# Check MongoDB connection
# Verify MONGO_URI is correct
# Make sure IP is whitelisted in MongoDB Atlas
```

### Frontend API Errors
```bash
# Check VITE_API_URL points to correct backend
# Check browser console for CORS errors
# Verify backend FRONTEND_URL matches frontend URL
```

### Deploy Failures
- Check Railway logs for error messages
- Verify environment variables are set
- Ensure package.json scripts are correct
- Check for dependency conflicts

---

## Environment Variables Checklist

**Backend (.env)**
- [ ] MONGO_URI
- [ ] JWT_SECRET
- [ ] PORT
- [ ] NODE_ENV
- [ ] FRONTEND_URL

**Frontend (.env)**
- [ ] VITE_API_URL

---

## Post-Deployment

1. **Monitor logs**
   - Check Railway logs for errors
   - Monitor application health

2. **Security**
   - Change default JWT_SECRET
   - Enable MongoDB IP whitelist
   - Use strong password
   - Enable HTTPS (Railway does this automatically)

3. **Performance**
   - Monitor database queries
   - Set up error tracking (optional)
   - Add caching if needed

4. **Backup**
   - Set up MongoDB backups
   - Regular code commits

---

## Live URLs

Once deployed, you'll have:
- **Backend API**: `https://your-backend-railway-url.railway.app`
- **Frontend App**: `https://your-frontend-railway-url.railway.app`

All routes will work as documented in the README.

---

## Additional Resources

- [Railway Documentation](https://docs.railway.app)
- [MongoDB Atlas Documentation](https://docs.mongodb.com/atlas)
- [Express.js Guide](https://expressjs.com)
- [React Documentation](https://react.dev)
