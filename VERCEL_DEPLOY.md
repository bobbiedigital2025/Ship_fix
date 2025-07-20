# 🚀 Vercel Deployment Guide

## 📋 **Step-by-Step Vercel Deployment:**

### **1. Push to GitHub First:**
```bash
# If you don't have a GitHub repo yet:
git remote add origin https://github.com/yourusername/your-repo-name.git
git branch -M main
git push -u origin main
```

### **2. Deploy to Vercel:**
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **"New Project"**
4. Select your GitHub repository
5. Vercel will auto-detect it's a Vite app ✅

### **3. Configure Environment Variables:**
In Vercel dashboard, go to **Settings** → **Environment Variables** and add:

```
VITE_ADMIN_EMAIL = admin@yourcompany.com
VITE_ADMIN_PASSWORD = your-secure-admin-password-123
VITE_COMPANY_NAME = Your Company Name
VITE_SUPPORT_EMAIL = support@yourcompany.com
```

### **4. Deploy Settings (Auto-detected):**
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## 🎯 **After Deployment:**

### **Admin Login:**
- URL: `https://your-app.vercel.app`
- Email: `admin@yourcompany.com` (or whatever you set)
- Password: Your secure password

### **Customer Access:**
- Customers can register with any email
- They get access to Configuration (Suppliers, Shippers, Inventory)
- No admin features visible to them

## 🔄 **Auto-Deploy:**
- Every push to main branch = automatic deployment
- Environment variables stay secure in Vercel
- Zero downtime deployments

## ✅ **Ready for Production!**
Your MCP-enabled Supply Chain Platform will be live with:
- Role-based access control
- Customer configuration capabilities  
- Professional admin portal
- Secure authentication system

## 🆘 **Need Help?**
- Vercel provides detailed logs for any issues
- Your app is pre-configured for Vercel deployment
- Environment variables are secured in Vercel dashboard
