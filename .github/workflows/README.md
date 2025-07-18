# 🚀 GitHub Workflows & Optimization

This directory contains automated workflows to optimize, test, and deploy the Ship_fix application.

## 📋 Available Workflows

### 🏗️ `build-optimize.yml`
**Triggered on:** Push to main/develop, Pull Requests
- ✅ Multi-node version testing (18.x, 20.x)
- 🔍 Code linting and type checking
- 📦 Optimized production builds
- 📊 Bundle size analysis
- 🧪 Preview server testing
- 🔥 Lighthouse performance audits

### 🔒 `security-deps.yml`
**Triggered on:** Weekly schedule, Manual dispatch
- 🛡️ Security vulnerability scanning
- 📊 License compliance checking
- 🔄 Automated dependency updates
- 📝 Auto-generated update PRs

### 🚀 `deploy-optimize.yml`
**Triggered on:** Push to main, Tags, Manual dispatch
- 🗜️ Asset compression (gzip + brotli)
- 🖼️ Image optimization
- 📊 Build reports generation
- 🌐 Preview deployments (Netlify)
- 🚀 Production deployments

### 📈 `performance-monitor.yml`
**Triggered on:** Daily schedule, Push to main
- 🔥 Daily Lighthouse audits
- 📊 Bundle size monitoring
- ⚠️ Size limit enforcement
- 💬 PR size reports

### 🔍 `code-quality.yml`
**Triggered on:** Push, Pull Requests
- 🎯 TypeScript compliance
- 📊 Code complexity analysis
- 🔍 Dependency auditing
- 🧹 Dead code detection
- 🔄 Circular dependency checks

## 🎯 Performance Targets

| Metric | Target | Action |
|--------|--------|--------|
| **Performance Score** | ≥ 80 | Warning |
| **Accessibility** | ≥ 90 | Error |
| **Best Practices** | ≥ 85 | Warning |
| **SEO** | ≥ 80 | Warning |
| **JS Bundle Size** | ≤ 500KB | Error |
| **CSS Bundle Size** | ≤ 100KB | Error |
| **First Contentful Paint** | ≤ 2s | Warning |
| **Largest Contentful Paint** | ≤ 3s | Warning |

## 🔧 Setup Required

### Secrets Configuration
Add these secrets to your GitHub repository:

```bash
NETLIFY_AUTH_TOKEN    # For preview deployments
NETLIFY_SITE_ID       # Your Netlify site ID
LHCI_GITHUB_APP_TOKEN # For Lighthouse CI comments
```

### Optional Enhancements
- **Vercel/AWS/Azure**: Add production deployment steps
- **Slack/Discord**: Add notification webhooks
- **Sentry**: Add error monitoring integration
- **CodeClimate**: Add code quality reporting

## 📊 Bundle Optimization Features

### Code Splitting Strategy
- 🎯 Route-based lazy loading
- 📦 Vendor chunk separation
- 🔄 Dynamic imports for heavy components

### Asset Optimization
- 🗜️ Terser minification with console removal
- 📊 Manual chunk configuration
- ⚡ Optimized dependency loading
- 🎨 CSS code splitting

### Performance Monitoring
- 📈 Automated bundle size tracking
- 🔥 Regular Lighthouse audits
- ⚠️ Size limit enforcement
- 📊 Performance regression detection

## 🚀 Running Locally

```bash
# Full optimization build
npm run optimize

# Analyze bundle composition
npm run build:analyze

# Check current sizes
npm run size-check

# Type checking only
npm run type-check
```

## 📈 Continuous Improvement

The workflows automatically:
- ✅ Monitor performance regressions
- 🔄 Update dependencies securely
- 📊 Track bundle size changes
- 🛡️ Scan for security issues
- 🔍 Maintain code quality standards

All reports are uploaded as artifacts and available for 30 days for historical analysis.
