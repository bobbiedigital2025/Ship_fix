# Automated Supply Chain Visibility and Optimization Platform

A comprehensive supply chain management platform built with React, TypeScript, and Vite, leveraging Model Context Protocol (MCP) for dynamic data exchange and system integration.

## 🚀 Features

### Core Modules
- **Dashboard**: Real-time supply chain visibility with customizable widgets
- **Configuration Center**: No-code/low-code interface for system customization
- **MCP Integration**: Dynamic tool discovery and invocation using Model Context Protocol
- **Supplier Management**: Complete supplier onboarding and performance tracking
- **Shipper/Logistics**: Carrier management and route optimization
- **Inventory Management**: Multi-location inventory tracking and automation
- **Alert System**: Customizable notifications and escalation workflows
- **Automation Engine**: IFTTT-style rule builder for supply chain automation

### MCP-Powered Architecture
- Dynamic tool discovery and invocation
- Contextual data exchange between modules
- Simplified third-party integrations
- Reduced API overhead and costs
- Scalable, context-aware data retrieval

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: Radix UI, Tailwind CSS, shadcn/ui
- **State Management**: React Query, Context API
- **Routing**: React Router DOM
- **Backend**: Supabase (Database, Edge Functions, Authentication)
- **Protocol**: Model Context Protocol (MCP) for data exchange
- **Styling**: Tailwind CSS with custom theme support

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd automated-supply-chain-platform
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create .env file with your Supabase credentials
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── configuration/     # Configuration module components
│   ├── dashboard/         # Dashboard widgets and panels
│   ├── layout/           # Header, sidebar, and layout components
│   ├── mcp/              # MCP integration components
│   └── ui/               # Reusable UI components (shadcn/ui)
├── contexts/             # React contexts for state management
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries and configurations
├── pages/                # Main page components
└── main.tsx              # Application entry point
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 🌟 Key Features

### Configuration Center
- **Supplier Management**: Add suppliers, set performance metrics, create preferred supplier rules
- **Shipper Configuration**: Manage carriers, set rate cards, configure route preferences
- **Inventory Setup**: Define warehouses, link products to suppliers, set reorder points
- **Alert Customization**: Create custom triggers, set notification channels, define escalation paths
- **Dashboard Personalization**: Drag-and-drop widget arrangement, custom KPI selection
- **Automation Rules**: Visual rule builder with conditional logic and automated actions

### MCP Integration
- **Server Management**: Connect to MCP servers with real-time status monitoring
- **Tool Discovery**: Automatically discover available tools and capabilities
- **Resource Access**: Secure access to contextual data and resources
- **Dynamic Invocation**: Execute tools and functions without traditional API calls

### Security & Authentication
- Supabase-powered authentication
- Role-based access control
- Secure MCP tool and resource access
- Data encryption and compliance

## 🚀 Deployment

The application is configured for deployment on Vercel, Netlify, or any static hosting service:

1. Build the application:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting service

3. Configure environment variables in your hosting platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🏢 About Bobbie Digital

Built with Bobbie Digital's 'easy digital' philosophy, focusing on:
- Cost-effective solutions
- User-friendly interfaces
- Scalable architecture
- Minimal technical complexity
- Maximum business value

---

**Built with ❤️ by Bobbie Digital**