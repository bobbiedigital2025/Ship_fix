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
      description: 'Check and validate environment variables',
      status: 'pending',
      helpText: 'Ensure your .env file has all required Supabase and API keys',
      troubleshooting: [
        'Copy .env.example to .env',
        'Add your Supabase URL and anon key',
        'Verify API keys are correct',
        'Restart development server after changes'
      ]
    },
    {
      id: 'database',
      title: 'Database Connection',
      description: 'Test Supabase database connectivity',
      status: 'pending',
      action: async () => {
        try {
          const { data, error } = await supabase.from('customers').select('count').single();
          return !error;
        } catch {
          return false;
        }
      },
      helpText: 'Verify your Supabase database is accessible and schema is deployed',
      troubleshooting: [
        'Check Supabase project URL',
        'Verify API keys are correct',
        'Ensure database schema is deployed',
        'Check firewall/network settings'
      ]
    },
    {
      id: 'schema',
      title: 'Database Schema',
      description: 'Verify all required tables exist',
      status: 'pending',
      action: async () => {
        try {
          const tables = ['customers', 'support_tickets', 'support_faqs', 'support_responses'];
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
      helpText: 'All support system tables should be created and accessible',
      troubleshooting: [
        'Run the database schema in Supabase SQL Editor',
        'Use fix-database.sql for clean setup',
        'Check table permissions',
        'Verify RLS policies if enabled'
      ]
    },
    {
      id: 'sample-data',
      title: 'Sample Data',
      description: 'Check if sample customers and tickets exist',
      status: 'pending',
      action: async () => {
        try {
          const { data: customers } = await supabase.from('customers').select('*');
          const { data: tickets } = await supabase.from('support_tickets').select('*');
          return (customers?.length || 0) > 0 && (tickets?.length || 0) >= 0;
        } catch {
          return false;
        }
      },
      helpText: 'Sample data helps you test the application features',
      troubleshooting: [
        'Run the sample data inserts from schema',
        'Check for data validation errors',
        'Verify foreign key relationships',
        'Use Supabase Table Editor to inspect data'
      ]
    },
    {
      id: 'email-service',
      title: 'Email Integration',
      description: 'Validate email service configuration',
      status: 'pending',
      helpText: 'Email service enables ticket notifications and communication',
      troubleshooting: [
        'Add RESEND_API_KEY to environment',
        'Verify email sender domain',
        'Test email templates',
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

    // MCP and AI questions
    if (lowerQuestion.includes('ai') || lowerQuestion.includes('mcp') || lowerQuestion.includes('brain')) {
      return {
        message: "MCP integration provides AI-powered support automation and intelligent routing.",
        suggestions: [
          "Configure MCP servers in mcp.json",
          "Set up Supa Brain AI API key",
          "Test AI response generation",
          "Enable intelligent ticket routing"
        ],
        codeExample: `// MCP configuration example
{
  "servers": [
    {
      "name": "Supa Brain AI",
      "command": "npx",
      "args": ["-y", "@mcpinky/supa-brain-server@latest"]
    }
  ]
}`,
        documentationLink: "/documentation#mcp-integration"
      };
    }

    // Support system questions
    if (lowerQuestion.includes('ticket') || lowerQuestion.includes('support') || lowerQuestion.includes('customer')) {
      return {
        message: "The support system handles customer tickets, responses, and knowledge base management.",
        suggestions: [
          "Create and manage support tickets",
          "Set up automated responses",
          "Configure customer tiers and SLAs",
          "Build a knowledge base with FAQs"
        ],
        nextSteps: [
          "Test ticket creation in the app",
          "Configure response templates",
          "Set up customer notification preferences"
        ],
        documentationLink: "/documentation#support-features"
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
