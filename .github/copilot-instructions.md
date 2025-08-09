# Ship_fix Supply Chain Automation Platform

Ship_fix is a React + TypeScript + Vite web application with Supabase backend that provides comprehensive supply chain automation, customer support system, and tariff analysis powered by AI/MCP technology. It includes advanced features like real-time support tickets, customer management, analytics dashboards, and automated email services.

**Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Bootstrap and Build Process
**CRITICAL: NEVER CANCEL builds or long-running commands. Set timeouts of 60+ minutes for builds and 30+ minutes for tests.**

- **Install dependencies:**
  ```bash
  npm install
  ```
  Takes ~40 seconds. **NEVER CANCEL** - Set timeout to 5+ minutes.

- **Build the application:**
  ```bash
  npm run build
  ```
  Takes ~9 seconds normally. **NEVER CANCEL** - Set timeout to 10+ minutes for safety.

- **Development build:**
  ```bash
  npm run build:dev
  ```
  Alternative development mode build. **NEVER CANCEL** - Set timeout to 10+ minutes.

- **Start development server:**
  ```bash
  npm run dev
  ```
  Starts on port 8080 (or 8081 if 8080 is busy). Ready in ~180ms. Access at http://localhost:8080

### Code Quality and Validation

- **Lint the code:**
  ```bash
  npm run lint
  ```
  Takes ~3 seconds. **WARNING:** Currently has 89 linting issues (63 errors, 26 warnings) - mostly TypeScript `any` types and React Hook dependencies. Run anyway to check for new issues.

- **Preview production build:**
  ```bash
  npm run preview
  ```
  Serves the built application for testing production behavior.

### Database Operations

- **Test database connection:**
  ```bash
  npm run db:test
  ```
  **KNOWN ISSUE:** Currently fails with module resolution error - script tries to import `.js` extension but actual file is `.ts`. Database testing must be done manually via setup scripts.

- **Initialize database:**
  ```bash
  npm run db:init
  ```
  Runs the comprehensive database initialization script with sample data.

- **Setup Supabase database:**
  ```bash
  npm run db:setup
  # OR manually:
  ./setup-supabase.sh
  ```
  **REQUIRES:** `.env` file with valid Supabase credentials. Creates .env from .env.example if needed.

### Shell Scripts and Automation

- **Enterprise test suite (comprehensive validation):**
  ```bash
  ./enterprise-test-suite.sh
  ```
  Takes 5+ minutes. **NEVER CANCEL** - Set timeout to 30+ minutes. Runs full compilation, build, database, component, security, and automation tests.

- **Database schema deployment:**
  ```bash
  ./deploy-tariff-schema.sh
  ```
  Deploys the tariff automation database schema.

- **Test automation systems:**
  ```bash
  ./test-tariff-automation.sh
  ./test-supply-chain-automation.sh
  ```
  Test specific automation components.

- **Create placeholder icons:**
  ```bash
  ./create_placeholder_icons.sh
  ```
  Generates placeholder SVG icons for the application.

## Validation Scenarios

**MANUAL VALIDATION REQUIREMENT:** After building and running the application, you MUST test actual functionality by running through complete user scenarios.

### Core User Workflows to Test

1. **Dashboard Navigation:**
   - Start dev server: `npm run dev`
   - Navigate to http://localhost:8080
   - Verify main dashboard loads with supply chain metrics
   - Test navigation between Dashboard, Configuration, Support Center, Tracking, Inventory, Orders
   - Verify responsive design and theme switching

2. **Support System Validation:**
   - Navigate to Support Center
   - Switch between Customer Support and Admin Dashboard tabs
   - Verify support ticket display with sample data (3 tickets)
   - Test filtering and status management
   - Verify real-time updates and notification system

3. **AI Assistant Testing:**
   - Test AI chat interface on main dashboard
   - Click setup buttons (🚀 Set Up My Platform, 💡 Learn About Features, etc.)
   - **KNOWN ISSUE:** Some AI setup functions have JavaScript errors - document these but continue testing

4. **Database Integration:**
   - Verify Supabase connection using provided test scripts
   - Test customer data loading and support ticket management
   - Validate email service integration (Resend API)

## Project Structure

```
Ship_fix/
├── src/
│   ├── components/          # React components (UI, support, auth, etc.)
│   ├── lib/                 # Core services (Supabase, email, MCP integration)
│   ├── pages/               # Main application pages
│   ├── api/                 # API integration services
│   └── types/               # TypeScript type definitions
├── public/                  # Static assets
├── supabase/               # Database schemas and configurations
├── scripts/                # Database initialization scripts
├── *.sql                   # Database schema files
├── *.sh                    # Shell automation scripts
└── package.json            # Project configuration and scripts
```

## Key Technology Stack

- **Frontend:** React 18 + TypeScript + Vite 5.4.19
- **UI Components:** shadcn/ui with Radix UI primitives
- **Styling:** Tailwind CSS with PostCSS
- **Backend:** Supabase (PostgreSQL + Auth + Real-time)
- **AI Integration:** MCP (Model Context Protocol) with Supa Brain
- **Email Service:** Resend API
- **Build Tool:** Vite with React SWC plugin
- **Deployment:** Vercel-ready with vercel.json configuration

## Environment Configuration

**CRITICAL:** Application requires proper environment setup:

1. **Copy environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Required environment variables:**
   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` - Supabase anonymous API key
   - `SUPABASE_SERVICE_ROLE_KEY` - Service role key for admin operations
   - `RESEND_API_KEY` - Email service API key
   - `VITE_MCP_ENABLED` - Enable MCP AI features
   - Company and branding configuration variables

## Database Schema

**CRITICAL:** Database must be properly configured before application will work:

1. **Main schema file:** `supabase-schema.sql` (35KB) - Complete database setup
2. **Alternative schemas:** 
   - `fix-database.sql` - Minimal working schema
   - `complete-support-system.sql` - Full support system
   - `supabase-schema-basic.sql` - Basic functionality

3. **Key tables:**
   - `customers` - Customer management
   - `support_tickets` - Support ticket system
   - `support_responses` - Ticket conversations
   - `support_faqs` - Knowledge base
   - `email_logs` - Email tracking
   - `contact_interactions` - Analytics

## Known Issues and Workarounds

1. **Linting Issues:** 89 total issues (63 errors, 26 warnings) - mostly TypeScript `any` types. Application builds and runs despite linting failures.

2. **Database Test Script:** `npm run db:test` fails due to module resolution error. Use manual testing via setup scripts instead.

3. **AI Assistant Errors:** Some JavaScript reference errors in AI setup functions. Core functionality works but some advanced features may need debugging.

4. **Service Worker:** PWA service worker registration may fail in development - this is normal for local development.

## Build Timing Expectations

- **npm install:** ~40 seconds
- **npm run build:** ~9 seconds (production optimized)
- **npm run dev startup:** ~180ms
- **npm run lint:** ~3 seconds
- **Enterprise test suite:** 5+ minutes comprehensive testing
- **Database setup:** Variable depending on schema size and network

**CRITICAL:** Always set timeouts of 60+ minutes for builds and 30+ minutes for tests. Build processes can be unpredictable and may take longer in different environments.

## Deployment

**Vercel Deployment:**
- Build command: `npm run build`
- Output directory: `dist`
- Environment variables must be configured in Vercel dashboard
- Automatic deployments on git push

**Manual Deployment:**
- Run `npm run build` to create `dist/` folder
- Deploy `dist/` contents to any static hosting provider
- Ensure environment variables are properly configured

## Common Commands Summary

```bash
# Development workflow
npm install                      # Install dependencies (~40s)
npm run dev                     # Start dev server (port 8080)
npm run build                   # Production build (~9s)
npm run lint                    # Code quality check (~3s, has known issues)
npm run preview                 # Preview production build

# Database operations  
./setup-supabase.sh            # Setup database with environment check
npm run db:init                # Initialize with sample data
npm run db:setup               # Alternative database setup

# Testing and validation
./enterprise-test-suite.sh     # Comprehensive test suite (5+ min)
./test-tariff-automation.sh    # Test tariff systems
./test-supply-chain-automation.sh # Test supply chain features

# Utility scripts
./create_placeholder_icons.sh  # Generate placeholder icons
./deploy-tariff-schema.sh      # Deploy tariff database schema
./verify-restoration.sh        # Verify system restoration
```

**Remember:** Always build and exercise your changes manually through the web interface to ensure they work correctly. Take screenshots of UI changes to document the impact.