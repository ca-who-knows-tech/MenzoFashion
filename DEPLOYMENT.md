# Menzo Fashion - Complete Deployment Guide

## 🚀 Deployment Overview

Your site has been successfully deployed across multiple services:

### **Frontend (Vercel) ✅**
- **Status**: Deployed
- **URL**: https://menzo-fashion.vercel.app
- **Custom Domain**: menzofashion.in (Pending DNS configuration)

### **Backend (Railway)** - [Instructions Below]
- **Status**: Ready to deploy
- **Service**: Node.js with JSON Server

---

## 📋 Step-by-Step Deployment Instructions

### **PART 1: Configure Domain DNS (GoDaddy)**

1. **Go to GoDaddy Account**
   - Visit https://godaddy.com and sign in
   - Go to "My Products" > "Domains"
   - Click on your domain `menzofashion.in`

2. **Update DNS Records**
   - Click "Manage DNS"
   - Add the following **A record**:
     ```
     Host: @
     Type: A
     Points to: 76.76.21.21
     TTL: 3600
     ```
   
   - Wait 24-48 hours for DNS to propagate

3. **Verify in Vercel**
   - Visit https://vercel.com/dashboard
   - Go to menzo-fashion project
   - Check Domain settings
   - Wait for verification email

---

### **PART 2: Deploy Backend to Railway**

1. **Create Railway Account**
   ```bash
   # Visit: https://railway.app
   # Sign up with GitHub
   ```

2. **Deploy Backend**
   ```bash
   # Option A: Using Railway CLI
   npm install -g @railway/cli
   railway login
   cd backend
   railway init
   railway deploy
   
   # Option B: Using Railway Dashboard
   # - Visit https://railway.app/dashboard
   # - Click "New Project"
   # - Select "Deploy from GitHub"
   # - Choose your MenzoFashion repository
   # - Connect backend folder
   ```

3. **Get Backend URL**
   - After deployment, Railway will provide a URL
   - Example: `https://menzo-backend.railway.app`
   - Copy this URL

4. **Update Vercel Environment Variables**
   ```bash
   # Visit: https://vercel.com/dashboard
   # Select menzo-fashion project
   # Go to Settings > Environment Variables
   
   # Add:
   Key: VITE_API_BASE_URL
   Value: https://menzo-backend.railway.app
   
   # Save and trigger redeploy
   ```

---

### **PART 3: Quick Deploy Command (If Using Git)**

```bash
cd "/Users/abhishek/Desktop/Menzo Fashion"

# Make sure everything is committed
git add .
git commit -m "Deploy configuration updates"
git push origin main

# Frontend automatically redeploys on push
# For backend, use Railway CLI or dashboard
```

---

## 🔧 Environment Variables

### **Frontend (.env.production)**
```
VITE_API_BASE_URL=https://menzo-backend.railway.app
```

### **Backend (.env)**
```
PORT=5000
NODE_ENV=production
```

---

## 📱 Post-Deployment Checklist

- [ ] Domain DNS configured (A record added to GoDaddy)
- [ ] Backend deployed to Railway
- [ ] Environment variables updated in Vercel
- [ ] Site accessible at menzofashion.in
- [ ] API calls working from frontend
- [ ] Admin panel functional
- [ ] Products loading correctly
- [ ] Shopping cart working
- [ ] All pages responsive

---

## 🆘 Troubleshooting

### **Site shows 404**
- Wait for DNS propagation (up to 48 hours)
- Clear browser cache
- Try incognito mode

### **API calls failing**
- Check Vercel environment variables
- Verify Railway backend is running
- Check CORS settings in server

### **Slow performance**
- Check Railway plan limits
- Optimize database queries
- Enable caching headers

---

## 📞 Support

- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **GoDaddy Support**: https://www.godaddy.com/help

---

**Your site will be live at menzofashion.in once DNS propagates!** 🎉
