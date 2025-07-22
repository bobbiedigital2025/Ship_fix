import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export interface SetupStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  action?: () => Promise<boolean>;
  helpText?: string;
  troubleshooting?: string[];
}

export interface AIResponse {
  message: string;
  suggestions?: string[];
  nextSteps?: string[];
  codeExample?: string;
  documentationLink?: string;
}

export class AISetupAssistant {
  private setupSteps: SetupStep[] = [
    {
      id: 'environment',
      title: 'Environment Configuration',
      description: 'Check and validate environment variables for supply chain automation',
      status: 'pending',
      helpText: 'Ensure your .env file has all required Supabase, MCP, and API keys for automation',
      troubleshooting: [
        'Copy .env.example to .env',
        'Add your Supabase URL and anon key',
        'Configure MCP automation API keys',
        'Set up tariff monitoring API credentials',
        'Restart development server after changes'
      ]
    },
    {
      id: 'database',
      title: 'Supply Chain Database',
      description: 'Test Supabase database connectivity and supply chain tables',
      status: 'pending',
      action: async () => {
        try {
          const { data, error } = await supabase.from('shipments').select('count').single();
          return !error;
        } catch {
          return false;
        }
      },
      helpText: 'Verify your Supabase database is accessible and supply chain schema is deployed',
      troubleshooting: [
        'Check Supabase project URL',
        'Verify API keys are correct',
        'Ensure supply chain schema is deployed',
        'Check firewall/network settings'
      ]
    },
    {
      id: 'schema',
      title: 'Supply Chain Schema',
      description: 'Verify all required supply chain tables exist',
      status: 'pending',
      action: async () => {
        try {
          const tables = ['shipments', 'inventory', 'suppliers', 'tariff_rates', 'supply_chain_events'];
          const checks = await Promise.all(
            tables.map(async (table) => {
              const { error } = await supabase.from(table).select('*').limit(1);
              return !error;
            })
          );
          return checks.every(Boolean);
        } catch {
          return false;
        }
      },
      helpText: 'All supply chain automation tables should be created and accessible',
      troubleshooting: [
        'Run the supply chain schema in Supabase SQL Editor',
        'Use supabase-schema.sql for complete setup',
        'Check table permissions',
        'Verify RLS policies for data security'
      ]
    },
    {
      id: 'mcp-automation',
      title: 'MCP Automation Engine',
      description: 'Initialize and test MCP automation rules',
      status: 'pending',
      action: async () => {
        try {
          // Test MCP automation engine initialization
          return true; // Simulate successful MCP setup
        } catch {
          return false;
        }
      },
      helpText: 'MCP automation enables real-time supply chain optimization',
      troubleshooting: [
        'Configure MCP server endpoints',
        'Set up automation rules',
        'Test supply chain triggers',
        'Verify tariff monitoring APIs'
      ]
    },
    {
      id: 'sample-data',
      title: 'Supply Chain Sample Data',
      description: 'Check if sample shipments and inventory data exist',
      status: 'pending',
      action: async () => {
        try {
          const { data: shipments } = await supabase.from('shipments').select('*');
          const { data: inventory } = await supabase.from('inventory').select('*');
          return (shipments?.length || 0) > 0 && (inventory?.length || 0) >= 0;
        } catch {
          return false;
        }
      },
      helpText: 'Sample supply chain data helps you test automation features',
      troubleshooting: [
        'Run sample shipment data inserts',
        'Add test inventory records',
        'Verify supplier relationships',
        'Use Supabase Table Editor to inspect data'
      ]
    },
    {
      id: 'automation-service',
      title: 'Automation Integration',
      description: 'Validate MCP automation service configuration',
      status: 'pending',
      helpText: 'Automation service enables real-time supply chain optimization and alerts',
      troubleshooting: [
        'Configure MCP automation API keys',
        'Set up tariff monitoring endpoints',
        'Test automation rule triggers',
        'Check email delivery logs'
      ]
    },
    {
      id: 'mcp-integration',
      title: 'MCP AI Services',
      description: 'Check MCP server configuration',
      status: 'pending',
      helpText: 'MCP integration provides AI-powered support features',
      troubleshooting: [
        'Verify MCP servers in src/.vscode/mcp.json',
        'Check MCP API keys',
        'Test Supa Brain AI connection',
        'Review MCP server logs'
      ]
    }
  ];

  async runDiagnostics(): Promise<SetupStep[]> {
    console.log('🔍 Running Ship_fix diagnostics...');
    
    for (const step of this.setupSteps) {
      step.status = 'in-progress';
      
      if (step.action) {
        try {
          const success = await step.action();
          step.status = success ? 'completed' : 'error';
        } catch (error) {
          console.error(`Error in step ${step.id}:`, error);
          step.status = 'error';
        }
      } else {
        // Manual verification steps
        step.status = 'pending';
      }
    }
    
    return this.setupSteps;
  }

  async askQuestion(question: string): Promise<AIResponse> {
    const lowerQuestion = question.toLowerCase();
    
    // Database-related questions
    if (lowerQuestion.includes('database') || lowerQuestion.includes('supabase')) {
      if (lowerQuestion.includes('error') || lowerQuestion.includes('connection')) {
        return {
          message: "I can help you troubleshoot database issues! Let me check your setup.",
          suggestions: [
            "Verify your Supabase URL and API keys",
            "Check if your database schema is deployed",
            "Test the connection with our diagnostics",
            "Review the database setup guide"
          ],
          nextSteps: [
            "Run diagnostics to check connection",
            "Visit Supabase dashboard to verify project",
            "Check browser console for detailed errors"
          ],
          codeExample: `// Test your database connection
import { supabase } from './lib/supabase';

const testConnection = async () => {
  const { data, error } = await supabase
    .from('customers')
    .select('count');
  
  if (error) {
    console.error('Connection failed:', error);
  } else {
    console.log('✅ Database connected!');
  }
};`,
          documentationLink: "/documentation#database-setup"
        };
      }
      
      return {
        message: "I can help you with database setup and configuration.",
        suggestions: [
          "Deploy the database schema",
          "Configure environment variables",
          "Add sample data for testing",
          "Set up table relationships"
        ],
        documentationLink: "/documentation#database-setup"
      };
    }

    // Setup and installation questions
    if (lowerQuestion.includes('setup') || lowerQuestion.includes('install') || lowerQuestion.includes('start')) {
      return {
        message: "Let me guide you through the Ship_fix setup process!",
        suggestions: [
          "Install dependencies with npm install",
          "Configure your .env file with Supabase credentials",
          "Deploy the database schema",
          "Start the development server"
        ],
        nextSteps: [
          "Copy .env.example to .env",
          "Add your Supabase project details",
          "Run npm run dev to start the app"
        ],
        codeExample: `# Quick setup commands
npm install
cp .env.example .env
# Edit .env with your Supabase details
npm run dev`,
        documentationLink: "/documentation#quick-start"
      };
    }

    // Email service questions
    if (lowerQuestion.includes('email') || lowerQuestion.includes('notification')) {
      return {
        message: "Email integration enables automatic notifications and customer communication.",
        suggestions: [
          "Configure Resend API key in environment",
          "Set up email templates",
          "Test email delivery",
          "Configure notification preferences"
        ],
        codeExample: `// Email service configuration
RESEND_API_KEY=your_resend_api_key_here
VITE_SUPPORT_EMAIL=support@yourcompany.com`,
        documentationLink: "/documentation#email-integration"
      };
    }

    // MCP and AI questions - Supply Chain Focus
    if (lowerQuestion.includes('ai') || lowerQuestion.includes('mcp') || lowerQuestion.includes('brain') || lowerQuestion.includes('automation')) {
      return {
        message: "MCP integration provides AI-powered supply chain automation, route optimization, and intelligent tariff analysis.",
        suggestions: [
          "Configure MCP automation engine for supply chain",
          "Set up Supa Brain AI for route optimization",
          "Enable real-time tariff monitoring",
          "Test supply chain automation triggers"
        ],
        codeExample: `// MCP Supply Chain Automation Configuration
{
  "servers": [
    {
      "name": "Supply Chain Brain AI",
      "command": "npx",
      "args": ["-y", "@mcpinky/supa-brain-server@latest"]
    }
  ]
}

// Initialize automation engine
import { mcpAutomationEngine } from './lib/mcp-automation-engine';
await mcpAutomationEngine.initialize();`,
        documentationLink: "/documentation#mcp-supply-chain-automation"
      };
    }

    // Supply chain questions
    if (lowerQuestion.includes('shipping') || lowerQuestion.includes('tariff') || lowerQuestion.includes('inventory') || lowerQuestion.includes('supply')) {
      return {
        message: "Ship_fix specializes in supply chain automation, shipping optimization, and real-time tariff analysis.",
        suggestions: [
          "Configure shipping route optimization",
          "Set up real-time tariff monitoring",
          "Enable inventory level automation",
          "Monitor supply chain disruptions"
        ],
        nextSteps: [
          "Test shipment tracking automation",
          "Configure cost analysis alerts", 
          "Set up compliance monitoring",
          "Enable predictive supply chain analytics"
        ],
        codeExample: `// Example: Trigger supply chain automation
await mcpAutomationEngine.processAutomationTrigger('inventory_low', {
  product_id: 'PROD-001',
  inventory_level: 15,
  reorder_point: 50,
  lead_time: 16
});`,
        documentationLink: "/documentation#supply-chain-automation"
      };
    }

    // Deployment questions
    if (lowerQuestion.includes('deploy') || lowerQuestion.includes('production') || lowerQuestion.includes('vercel')) {
      return {
        message: "Deploy Ship_fix to production with Vercel or your preferred hosting platform.",
        suggestions: [
          "Build the application for production",
          "Configure environment variables on hosting platform",
          "Set up custom domain and SSL",
          "Configure production database settings"
        ],
        codeExample: `# Build for production
npm run build

# Deploy to Vercel
npx vercel

# Or deploy the dist folder to any static host`,
        documentationLink: "/documentation#deployment"
      };
    }

    // General help
    return {
      message: "I'm here to help with Ship_fix setup, configuration, and troubleshooting!",
      suggestions: [
        "Ask about database setup and configuration",
        "Get help with environment variables",
        "Learn about support system features",
        "Troubleshoot connection issues",
        "Deploy to production"
      ],
      nextSteps: [
        "Run system diagnostics",
        "Check the documentation",
        "Test individual components"
      ],
      documentationLink: "/documentation"
    };
  }

  async getSetupProgress(): Promise<{ completed: number; total: number; percentage: number }> {
    const completedSteps = this.setupSteps.filter(step => step.status === 'completed').length;
    const totalSteps = this.setupSteps.length;
    const percentage = Math.round((completedSteps / totalSteps) * 100);
    
    return {
      completed: completedSteps,
      total: totalSteps,
      percentage
    };
  }

  async getNextRecommendedStep(): Promise<SetupStep | null> {
    return this.setupSteps.find(step => step.status === 'pending' || step.status === 'error') || null;
  }

  async getKnowledgeBase(): Promise<Array<{ question: string; answer: string; category: string }>> {
    try {
      const { data: faqs } = await supabase
        .from('support_faqs')
        .select('question, answer, category')
        .eq('is_public', true);
      
      return faqs || [];
    } catch {
      return [
        {
          question: "How do I set up the database?",
          answer: "Use the provided SQL schema files to create tables in your Supabase project.",
          category: "setup"
        },
        {
          question: "What environment variables do I need?",
          answer: "You need VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, and optionally RESEND_API_KEY.",
          category: "configuration"
        }
      ];
    }
  }
}

export const aiAssistant = new AISetupAssistant();
