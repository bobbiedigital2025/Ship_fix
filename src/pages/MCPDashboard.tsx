import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { AppProvider } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mcpClient, MCPServer } from '@/lib/mcp-client';
import { mcpAutomationEngine } from '@/lib/mcp-automation-engine';
import { 
  Plus, 
  Server, 
  Settings, 
  Database, 
  Network, 
  Bot,
  Zap,
  Workflow,
  Brain,
  Activity,
  CheckCircle,
  AlertCircle,
  Play,
  Pause
} from 'lucide-react';

export default function MCPDashboard() {
  const [servers, setServers] = useState<MCPServer[]>([]);
  const [newServerUrl, setNewServerUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [automationStats, setAutomationStats] = useState<any>(null);
  const [automationRules, setAutomationRules] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Initialize MCP automation engine
      await mcpAutomationEngine.initialize();
      
      // Load automation statistics
      const stats = await mcpAutomationEngine.getAutomationStats();
      setAutomationStats(stats);

      // Load automation rules (mock data for now)
      setAutomationRules([
        {
          id: 'auto-assign-technical',
          name: 'Auto-assign Technical Tickets',
          trigger: 'ticket_created',
          status: 'active',
          executions: 47,
          successRate: 98.2
        },
        {
          id: 'escalate-enterprise',
          name: 'Escalate Enterprise Customer Issues',
          trigger: 'ticket_created',
          status: 'active',
          executions: 12,
          successRate: 100
        },
        {
          id: 'ai-sentiment-analysis',
          name: 'AI Sentiment Analysis',
          trigger: 'ticket_created',
          status: 'active',
          executions: 156,
          successRate: 95.8
        }
      ]);
    } catch (error) {
      console.error('Failed to load automation data:', error);
    }
  };

  const addServer = async () => {
    if (!newServerUrl.trim()) return;
    
    setLoading(true);
    try {
      const server = await mcpClient.connectServer(newServerUrl);
      setServers(prev => [...prev, server]);
      setNewServerUrl('');
    } catch (error) {
      console.error('Failed to add server:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <AppProvider>
      <PageLayout>
        <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Network className="h-8 w-8" />
            MCP & Automation Dashboard
          </h1>
          <p className="text-muted-foreground">
            Bobbie Digital's Model Context Protocol servers and automation workflows
          </p>
          {automationStats && (
            <div className="flex items-center gap-4 mt-2 text-sm">
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                {automationStats.active_rules} Active Rules
              </span>
              <span className="flex items-center gap-1">
                <Zap className="h-4 w-4 text-blue-500" />
                {automationStats.executions_today} Executions Today
              </span>
              <span className="flex items-center gap-1">
                <Brain className="h-4 w-4 text-purple-500" />
                {automationStats.ai_analyses_performed} AI Analyses
              </span>
            </div>
          )}
        </div>

        <Tabs defaultValue="automation" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="automation">Automation</TabsTrigger>
            <TabsTrigger value="servers">Server Management</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
          </TabsList>

          <TabsContent value="automation" className="space-y-6">
            {/* Automation Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Success Rate</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {automationStats ? `${(automationStats.success_rate * 100).toFixed(1)}%` : '-.-%'}
                      </p>
                    </div>
                    <Activity className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {automationStats?.avg_response_time || '-.--'}
                      </p>
                    </div>
                    <Zap className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">MCP Servers</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {automationStats?.mcp_servers_connected || 0}
                      </p>
                    </div>
                    <Server className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Automation Rules */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Workflow className="h-5 w-5" />
                  Automation Rules
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {automationRules.map((rule) => (
                    <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {rule.status === 'active' ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-yellow-500" />
                        )}
                        <div>
                          <h4 className="font-medium">{rule.name}</h4>
                          <p className="text-sm text-gray-600">
                            Trigger: {rule.trigger} • {rule.executions} executions
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={rule.status === 'active' ? 'default' : 'secondary'}>
                          {rule.successRate}% success
                        </Badge>
                        <Button variant="outline" size="sm">
                          {rule.status === 'active' ? (
                            <>
                              <Pause className="h-4 w-4 mr-1" />
                              Pause
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-1" />
                              Resume
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Bobbie Digital Automation Specialty */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Bobbie Digital Automation Expertise
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">MCP Specialization</h4>
                    <p className="text-sm text-blue-700">
                      Expert implementation of Model Context Protocol for seamless AI tool integration
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Automation Workflows</h4>
                    <p className="text-sm text-green-700">
                      Custom automation rules for support ticket routing, escalation, and AI analysis
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-900 mb-2">AI Integration</h4>
                    <p className="text-sm text-purple-700">
                      Advanced sentiment analysis, auto-categorization, and intelligent response suggestions
                    </p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-medium text-orange-900 mb-2">Contact Bobbie Digital</h4>
                    <p className="text-sm text-orange-700">
                      marketing-support@bobbiedigital.com • bobbiedigital.com
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="servers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  MCP Server Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Enter MCP server URL..."
                    value={newServerUrl}
                    onChange={(e) => setNewServerUrl(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addServer()}
                  />
                  <Button onClick={addServer} disabled={loading}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Server
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {servers.map((server) => (
                    <div key={server.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(server.status)}`} />
                          <span className="font-medium">{server.name}</span>
                          <Badge variant="outline">{server.status}</Badge>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">{server.url}</p>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Settings className="h-4 w-4" />
                          <span>{server.tools.length} tools</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Database className="h-4 w-4" />
                          <span>{server.resources.length} resources</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Connected Servers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{servers.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Available Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {servers.reduce((acc, server) => acc + server.tools.length, 0)}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {servers.reduce((acc, server) => acc + server.resources.length, 0)}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        </div>
      </PageLayout>
    </AppProvider>
  );
}