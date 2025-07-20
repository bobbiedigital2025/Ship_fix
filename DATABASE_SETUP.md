# 🚀 Ship_fix Supabase Database Setup Guide

This guide will help you set up a complete Supabase database for your Ship_fix support system with MCP Inky and Supa Brain AI integration.

## 🎯 What You'll Get

Your database will include:

- **👥 Customer Management** - Store and track customer information
- **🎫 Support Tickets** - Complete ticket lifecycle management
- **💬 Response Tracking** - Track all customer interactions
- **❓ FAQ System** - Knowledge base management
- **📧 Email Logging** - Track all email communications
- **📊 Analytics** - Customer interaction history
- **🤖 AI Integration** - MCP Inky and Supa Brain ready

## 🏁 Quick Setup

### 1. Run the Setup Script

```bash
./setup-supabase.sh
```

This script will:
- ✅ Verify your environment variables
- 🔗 Test your Supabase connection
- 📋 Guide you through schema installation

### 2. Apply Database Schema

1. 🌐 Go to your [Supabase Dashboard](https://supabase.com/dashboard/projects)
2. 📁 Select your project
3. 🔧 Navigate to **SQL Editor**
4. 📋 Copy the entire contents of `supabase-schema.sql`
5. ▶️ Paste and run the SQL script

### 3. Initialize with Sample Data

```bash
node scripts/init-database.js
```

This will:
- 👥 Create sample customers
- ❓ Add FAQ entries
- 🎫 Create a test support ticket
- 📊 Generate a status report

## 🔧 Configuration

### Environment Variables

Make sure your `.env` file contains:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# MCP Inky & Supa Brain Configuration
VITE_MCP_ENABLED=true
VITE_MCP_ENDPOINT=https://api.mcpinky.com
VITE_MCP_API_KEY=your_mcp_inky_api_key_here
VITE_SUPA_BRAIN_ENABLED=true
VITE_AI_RESPONSE_CONFIDENCE_THRESHOLD=0.7

# Email Service
RESEND_API_KEY=your_resend_api_key_here
VITE_SUPPORT_EMAIL=support@yourcompany.com

# Company Settings
VITE_COMPANY_NAME=Your Company Name
```

## 📊 Database Schema Overview

### Core Tables

1. **customers** - Customer profiles and contact information
2. **support_tickets** - Support request management
3. **support_responses** - Ticket conversation history
4. **support_faqs** - Knowledge base articles
5. **email_logs** - Email communication tracking
6. **contact_interactions** - Customer interaction history
7. **user_registrations** - Registration tracking

### Key Features

- 🔒 **Row Level Security (RLS)** enabled
- ⚡ **Automatic triggers** for customer creation
- 🕐 **Timestamp management** with auto-updates
- ✅ **Data validation** constraints
- 🔄 **Automatic counters** for tickets and interactions

## 🤖 AI Integration

### MCP Inky Features

- 🎯 **Smart Categorization** - Auto-categorize tickets
- 💬 **Response Generation** - AI-powered response suggestions
- 🧠 **Context Awareness** - Customer history analysis
- 📈 **Sentiment Analysis** - Detect customer mood

### Supa Brain Capabilities

- 🔍 **Ticket Analysis** - Deep content analysis
- 👤 **Customer Insights** - Behavioral patterns
- 📊 **Recommendations** - Priority and escalation suggestions
- 🎯 **FAQ Matching** - Relevant knowledge base articles

## 🛠️ Usage Examples

### Creating a Support Ticket

```typescript
import { SupabaseSupportService } from '@/lib/supabase-support-service';

const ticket = await SupabaseSupportService.createTicket({
  customerName: 'John Doe',
  customerEmail: 'john@acme.com',
  company: 'Acme Corp',
  category: 'technical',
  severity: 'medium',
  subject: 'API Integration Issue',
  description: 'Having trouble with authentication...'
});
```

### AI-Powered Response Generation

```typescript
import { MCPInkySupaBrainService } from '@/lib/mcp-supa-brain-service';

// Analyze ticket with Supa Brain
const analysis = await MCPInkySupaBrainService.analyzeTicket(ticket);

// Generate response with MCP Inky
const response = await MCPInkySupaBrainService.generateResponseSuggestion(ticket);
```

### Customer Registration

```typescript
const result = await SupabaseSupportService.registerUser({
  email: 'customer@example.com',
  name: 'Jane Customer',
  company: 'Customer Corp',
  registration_source: 'website'
});
```

## 🔍 Testing Your Setup

### 1. Database Connection Test

```bash
node scripts/init-database.js
```

Look for:
- ✅ Successful connection message
- ✅ All tables exist
- ✅ Sample data created

### 2. API Integration Test

```bash
npm run dev
```

Then visit:
- 📝 Support page to create tickets
- 📊 Dashboard to view analytics
- ❓ FAQ section for knowledge base

### 3. AI Features Test

1. Create a support ticket
2. Check for AI categorization
3. Look for response suggestions
4. Verify customer insights

## 🚨 Troubleshooting

### Common Issues

#### ❌ "Missing Supabase environment variables"
- Check your `.env` file exists
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- Restart your development server

#### ❌ "Database tables may not exist"
- Run the SQL schema in Supabase dashboard
- Check for syntax errors in the SQL
- Verify you have the correct permissions

#### ❌ "MCP Inky is disabled"
- Set `VITE_MCP_ENABLED=true` in `.env`
- Add your MCP API key
- Restart the application

#### ❌ "Connection failed"
- Check your Supabase project URL
- Verify your API keys are correct
- Check your internet connection

### Getting Help

1. 📧 Email: support@yourcompany.com
2. 📚 Check the `SUPPORT_SYSTEM_SUMMARY.md` file
3. 🐛 Create an issue in your repository

## 🎉 Success Indicators

Your setup is complete when you see:

- ✅ All database tables exist
- ✅ Sample data is inserted
- ✅ MCP Inky integration is working
- ✅ Support tickets can be created
- ✅ AI responses are generated
- ✅ Email notifications work

## 🔄 Next Steps

1. 🎨 Customize the UI themes
2. 📧 Configure email templates
3. 🔐 Set up user authentication
4. 📊 Configure analytics dashboards
5. 🚀 Deploy to production

---

**🎊 Congratulations!** Your Ship_fix support system with Supabase, MCP Inky, and Supa Brain is now ready to handle customer support like a pro!
