# 🚀 Production Deployment Guide

## 🔐 Admin Access Configuration

### **Admin Login Credentials**
1. **Edit `.env.production`** and change:
   ```bash
   VITE_ADMIN_EMAIL=admin@yourcompany.com
   VITE_ADMIN_PASSWORD=your-secure-password-here
   ```

2. **Company Settings**:
   ```bash
   VITE_COMPANY_NAME=Your Company Name
   VITE_SUPPORT_EMAIL=support@yourcompany.com
   ```

### **Admin vs Customer Access**

#### **👨‍💼 Admin Features (admin@yourcompany.com)**:
- ✅ Full Dashboard with analytics
- ✅ Configuration Center (6 tabs)
- ✅ MCP Integration Dashboard  
- ✅ Support Center management
- ✅ User management (future)
- ✅ All navigation options

#### **👤 Customer Features (any other email)**:
- ✅ Basic Dashboard
- ✅ **Configuration Center** (3 tabs):
  - ✅ Suppliers - Add/edit their suppliers
  - ✅ Shippers - Configure shipping partners  
  - ✅ Inventory - Manage their products
- ✅ Support Center (submit tickets)
- ✅ Order Tracking
- ✅ Profile management
- ❌ **NO** MCP admin features
- ❌ **NO** Platform alerts/automation
- ❌ **NO** Analytics or admin tools

## 🛡️ Security Features

### **Role-Based Access Control**
- Admin routes are protected with `RoleGuard`
- Customers see 404 if they try to access admin pages
- Navigation menu automatically hides admin options from customers

### **Environment-Based Configuration**
- Development: Auto-authentication for testing
- Production: Requires real credentials
- Admin credentials set via environment variables

## 🚀 Deployment Steps

### **1. Build for Production**
```bash
npm run build
```

### **2. Deploy Options**

#### **Option A: Netlify (Recommended)**
1. Drag & drop the `dist` folder to Netlify
2. Set environment variables in Netlify dashboard
3. Configure custom domain

#### **Option B: Vercel**
1. Connect GitHub repository
2. Set environment variables in Vercel dashboard
3. Auto-deploy on push

#### **Option C: Traditional Hosting**
1. Upload `dist` folder contents to web server
2. Configure web server for SPA routing
3. Set up HTTPS certificate

### **3. Set Environment Variables**
In your hosting platform, add these environment variables:
```bash
VITE_ADMIN_EMAIL=admin@yourcompany.com
VITE_ADMIN_PASSWORD=your-secure-password
VITE_COMPANY_NAME=Your Company Name
VITE_SUPPORT_EMAIL=support@yourcompany.com
```

## 📋 Production Checklist

- [ ] Changed default admin credentials
- [ ] Set company name and support email
- [ ] Tested admin login works
- [ ] Verified customers cannot access admin features
- [ ] Configured MCP servers (if using real MCP)
- [ ] Set up custom domain
- [ ] Enabled HTTPS
- [ ] Tested all customer features
- [ ] Tested support ticket submission

## 🎯 What Customers Will See

1. **Login Page**: Clean login form (no demo credentials shown)
2. **Dashboard**: Basic tracking and order information
3. **Support Center**: Full ticket submission and FAQ
4. **Profile**: Account management
5. **Navigation**: Only customer-appropriate options

## 🔧 Admin Access

1. **Login URL**: `https://yoursite.com/`
2. **Admin Email**: `admin@yourcompany.com` (or whatever you set)
3. **Admin Password**: Your secure password
4. **Admin Features**: Full access to all platform features

## 🆘 Support

If customers need help:
- They use the Support Center to submit tickets
- All admin features are hidden from them
- They only see customer-appropriate navigation and features

**Your platform is now ready for commercial deployment with proper admin/customer separation!** 🚀
