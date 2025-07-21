import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { ExternalLink, Code, Database, Settings, MessageSquare, Users } from 'lucide-react';

const Documentation: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Ship_fix Documentation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Complete documentation for the Ship_fix Support System with Supabase backend, 
            MCP Inky integration, and Supa Brain AI.
          </p>
          <div className="flex justify-center mt-6 space-x-2">
            <Badge variant="secondary">React + TypeScript</Badge>
            <Badge variant="secondary">Supabase</Badge>
            <Badge variant="secondary">MCP Integration</Badge>
            <Badge variant="secondary">AI Support</Badge>
          </div>
        </div>

        {/* Quick Start */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              Quick Start
            </CardTitle>
            <CardDescription>
              Get Ship_fix up and running in minutes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">1. Install Dependencies</h4>
                <code className="text-sm bg-gray-200 p-2 rounded block">
                  npm install
                </code>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">2. Configure Environment</h4>
                <code className="text-sm bg-gray-200 p-2 rounded block">
                  cp .env.example .env
                </code>
                <p className="text-sm text-gray-600 mt-2">
                  Update your Supabase URL and API keys in the .env file
                </p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">3. Start Development Server</h4>
                <code className="text-sm bg-gray-200 p-2 rounded block">
                  npm run dev
                </code>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Database Setup */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2 h-5 w-5" />
                Database Setup
              </CardTitle>
              <CardDescription>
                Supabase schema and configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Customer management tables</li>
                <li>• Support ticket system</li>
                <li>• FAQ and knowledge base</li>
                <li>• Email logging and tracking</li>
                <li>• User interaction analytics</li>
              </ul>
              <Button variant="outline" size="sm" className="mt-4 w-full">
                <ExternalLink className="mr-2 h-4 w-4" />
                View Schema Guide
              </Button>
            </CardContent>
          </Card>

          {/* API Reference */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Code className="mr-2 h-5 w-5" />
                API Reference
              </CardTitle>
              <CardDescription>
                Backend services and endpoints
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Support Service API</li>
                <li>• Email Service Integration</li>
                <li>• Customer Registration</li>
                <li>• Ticket Management</li>
                <li>• Authentication & Auth</li>
              </ul>
              <Button variant="outline" size="sm" className="mt-4 w-full">
                <ExternalLink className="mr-2 h-4 w-4" />
                API Documentation
              </Button>
            </CardContent>
          </Card>

          {/* Support Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5" />
                Support Features
              </CardTitle>
              <CardDescription>
                Customer support capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Ticket creation & tracking</li>
                <li>• Email notifications</li>
                <li>• Admin dashboard</li>
                <li>• FAQ management</li>
                <li>• Customer portal</li>
              </ul>
              <Button variant="outline" size="sm" className="mt-4 w-full">
                <ExternalLink className="mr-2 h-4 w-4" />
                Feature Guide
              </Button>
            </CardContent>
          </Card>

        </div>

        {/* Integration Guides */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* MCP Integration */}
          <Card>
            <CardHeader>
              <CardTitle>🔗 MCP Inky Integration</CardTitle>
              <CardDescription>
                Model Context Protocol for enhanced AI capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-sm">Configuration</h4>
                  <p className="text-sm text-gray-600">
                    MCP servers configured in src/.vscode/mcp.json
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Features</h4>
                  <ul className="text-sm text-gray-600 list-disc list-inside">
                    <li>Supa Brain AI integration</li>
                    <li>Supabase MCP server</li>
                    <li>Real-time data processing</li>
                  </ul>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  View MCP Setup
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Deployment */}
          <Card>
            <CardHeader>
              <CardTitle>🚀 Deployment</CardTitle>
              <CardDescription>
                Deploy to Vercel or other platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-sm">Platforms</h4>
                  <ul className="text-sm text-gray-600 list-disc list-inside">
                    <li>Vercel (recommended)</li>
                    <li>Netlify</li>
                    <li>Custom Docker</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Environment Variables</h4>
                  <p className="text-sm text-gray-600">
                    Ensure all Supabase and MCP keys are configured
                  </p>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Deployment Guide
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Current Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              System Status
            </CardTitle>
            <CardDescription>
              Current implementation status and what's working
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Supabase Database</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Customer Management</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Support Tickets</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Email Integration</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm">MCP Configuration</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm">AI Integration</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documentation Files */}
        <Card>
          <CardHeader>
            <CardTitle>📚 Additional Documentation</CardTitle>
            <CardDescription>
              Detailed guides and references
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button variant="ghost" className="justify-start h-auto p-4">
                <div className="text-left">
                  <div className="font-semibold">Database Setup</div>
                  <div className="text-sm text-gray-600">Complete Supabase schema guide</div>
                </div>
              </Button>
              <Button variant="ghost" className="justify-start h-auto p-4">
                <div className="text-left">
                  <div className="font-semibold">Troubleshooting</div>
                  <div className="text-sm text-gray-600">Common issues and solutions</div>
                </div>
              </Button>
              <Button variant="ghost" className="justify-start h-auto p-4">
                <div className="text-left">
                  <div className="font-semibold">Support System</div>
                  <div className="text-sm text-gray-600">How to use the support features</div>
                </div>
              </Button>
              <Button variant="ghost" className="justify-start h-auto p-4">
                <div className="text-left">
                  <div className="font-semibold">MCP Integration</div>
                  <div className="text-sm text-gray-600">AI and brain service setup</div>
                </div>
              </Button>
              <Button variant="ghost" className="justify-start h-auto p-4">
                <div className="text-left">
                  <div className="font-semibold">Deployment</div>
                  <div className="text-sm text-gray-600">Production deployment guide</div>
                </div>
              </Button>
              <Button variant="ghost" className="justify-start h-auto p-4">
                <div className="text-left">
                  <div className="font-semibold">API Reference</div>
                  <div className="text-sm text-gray-600">Backend services documentation</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-600">
            Ship_fix Support System - Built with React, TypeScript, Supabase, and MCP Integration
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

      </div>
    </div>
  );
};

export default Documentation;
