# 🚀 Ship_fix Support System

A modern, full-stack customer support system built with React, TypeScript, Supabase, and AI integration.

## ✨ Features

- 📋 **Customer Management** - Complete customer database with contact information and interaction history
- 🎫 **Support Tickets** - Full ticket lifecycle management with automated workflows
- 💬 **Real-time Responses** - Live chat and email integration for instant customer support
- 📚 **Knowledge Base** - FAQ system with searchable articles and self-service options
- 🤖 **AI Integration** - MCP Inky and Supa Brain AI for intelligent support automation
- 📊 **Analytics Dashboard** - Customer insights and support metrics
- 📧 **Email Service** - Automated email notifications and templates
- 🔐 **Authentication** - Secure admin portal with role-based access

## 🏗️ Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **AI Integration**: MCP (Model Context Protocol) with Supa Brain
- **Email**: Resend API integration
- **Deployment**: Vercel-ready

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Ship_fix
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update your `.env` file with:
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   
   # Email Service
   RESEND_API_KEY=your_resend_api_key_here
   
   # Company Settings
   VITE_COMPANY_NAME=Your Company Name
   VITE_SUPPORT_EMAIL=support@yourcompany.com
   ```

4. **Database Setup**
   
   Run the schema in your Supabase SQL Editor:
   ```bash
   # Use the working schema file
   # Copy contents of fix-database.sql into Supabase SQL Editor
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📁 Project Structure

```
Ship_fix/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── auth/           # Authentication components
│   │   ├── dashboard/      # Dashboard widgets
│   │   ├── support/        # Support system components
│   │   └── ui/             # shadcn/ui components
│   ├── lib/                # Utility libraries
│   │   ├── supabase.ts     # Supabase client
│   │   ├── support-service.ts # Support system logic
│   │   └── email-service.ts # Email integration
│   ├── pages/              # Main application pages
│   │   ├── Index.tsx       # Homepage
│   │   ├── Support.tsx     # Support portal
│   │   └── Documentation.tsx # This documentation
│   └── types/              # TypeScript type definitions
├── public/                 # Static assets
├── supabase/              # Database schemas and migrations
└── docs/                  # Additional documentation
```

## 🎯 Key Components

### Customer Management
- Customer registration and profile management
- Contact information and communication preferences
- Interaction history and activity tracking
- Tier-based customer segmentation

### Support System
- Multi-channel ticket creation (email, web form, API)
- Automated ticket routing and assignment
- Response templates and canned replies
- Internal notes and collaboration tools
- SLA tracking and escalation workflows

### AI Integration
- **MCP Inky**: Intelligent routing and categorization
- **Supa Brain**: Automated response suggestions
- Natural language processing for ticket analysis
- Sentiment analysis and priority scoring

## 🔧 Configuration

### MCP Setup
MCP (Model Context Protocol) servers are configured in `src/.vscode/mcp.json`:

```json
{
  "servers": [
    {
      "name": "Supa Brain AI",
      "command": "npx",
      "args": ["-y", "@mcpinky/supa-brain-server@latest", "--project-ref=your-project-id"]
    },
    {
      "name": "Supabase MCP",
      "command": "npx", 
      "args": ["-y", "@supabase/mcp-server-supabase@latest", "--project-ref=your-project-id"]
    }
  ]
}
```

### Email Configuration
Configure email templates and automation in `src/lib/email-service.ts`:

- Welcome emails for new customers
- Ticket confirmation and updates
- Escalation notifications
- Customer satisfaction surveys

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - automatic builds on git push

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting provider

## 📊 Database Schema

The system uses the following main tables:

- **customers** - Customer profiles and contact information
- **support_tickets** - Support request tracking
- **support_responses** - Ticket conversation threads  
- **support_faqs** - Knowledge base articles
- **email_logs** - Email delivery tracking
- **contact_interactions** - Customer activity analytics

## 🔐 Security

- All API routes protected with Supabase Auth
- Row Level Security (RLS) enabled on sensitive tables
- Environment variables for all sensitive configuration
- CORS properly configured for production domains

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📚 Documentation

- [Database Setup Guide](./DATABASE_SETUP.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Troubleshooting](./SCHEMA_TROUBLESHOOTING.md)
- [API Reference](./src/api/README.md)
- [Support System Summary](./SUPPORT_SYSTEM_SUMMARY.md)

## 🐛 Troubleshooting

### Common Issues

**Database Connection Errors**
- Verify Supabase URL and API keys
- Check firewall settings
- Ensure database schema is properly deployed

**Email Service Issues**
- Verify Resend API key
- Check email templates and sender domains
- Monitor email delivery logs

**MCP Integration Problems**
- Ensure MCP servers are properly configured
- Check API keys and project references
- Review MCP server logs

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🙏 Acknowledgments

- [Supabase](https://supabase.io) for the backend infrastructure
- [shadcn/ui](https://ui.shadcn.com) for the component library
- [MCP Inky](https://mcpinky.com) for AI integration
- [Resend](https://resend.com) for email services

---

**Built with ❤️ for better customer support experiences**
