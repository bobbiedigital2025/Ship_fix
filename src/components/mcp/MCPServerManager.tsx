import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { mcpClient, MCPServer } from '@/lib/mcp-client';
import { Plus, Server, Settings, Database } from 'lucide-react';

export default function MCPServerManager() {
  const [servers, setServers] = useState<MCPServer[]>([]);
  const [newServerUrl, setNewServerUrl] = useState('');
  const [loading, setLoading] = useState(false);

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
    <div className="space-y-6">
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
                
                <Separator className="my-2" />
                
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
    </div>
  );
}