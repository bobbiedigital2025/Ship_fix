import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mcpClient, MCPServer, MCPTool } from '@/lib/mcp-client';
import { Play, Code, AlertCircle } from 'lucide-react';

interface MCPToolInvokerProps {
  servers: MCPServer[];
}

export default function MCPToolInvoker({ servers }: MCPToolInvokerProps) {
  const [selectedServer, setSelectedServer] = useState<string>('');
  const [selectedTool, setSelectedTool] = useState<string>('');
  const [toolArgs, setToolArgs] = useState<string>('{}');
  const [result, setResult] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const selectedServerData = servers.find(s => s.id === selectedServer);
  const selectedToolData = selectedServerData?.tools.find(t => t.name === selectedTool);

  const invokeTool = async () => {
    if (!selectedServer || !selectedTool) return;
    
    setLoading(true);
    setError('');
    setResult(null);
    
    try {
      const args = JSON.parse(toolArgs);
      const response = await mcpClient.invokeTool(selectedServer, selectedTool, args);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to invoke tool');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-5 w-5" />
          Tool Invoker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Server</label>
            <Select value={selectedServer} onValueChange={setSelectedServer}>
              <SelectTrigger>
                <SelectValue placeholder="Select server" />
              </SelectTrigger>
              <SelectContent>
                {servers.map(server => (
                  <SelectItem key={server.id} value={server.id}>
                    {server.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Tool</label>
            <Select value={selectedTool} onValueChange={setSelectedTool} disabled={!selectedServer}>
              <SelectTrigger>
                <SelectValue placeholder="Select tool" />
              </SelectTrigger>
              <SelectContent>
                {selectedServerData?.tools.map(tool => (
                  <SelectItem key={tool.name} value={tool.name}>
                    {tool.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedToolData && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-1">{selectedToolData.name}</p>
            <p className="text-sm text-muted-foreground">{selectedToolData.description}</p>
          </div>
        )}

        <div>
          <label className="text-sm font-medium mb-2 block">Arguments (JSON)</label>
          <Textarea
            value={toolArgs}
            onChange={(e) => setToolArgs(e.target.value)}
            placeholder='{"param1": "value1"}'
            className="font-mono text-sm"
          />
        </div>

        <Button onClick={invokeTool} disabled={loading || !selectedServer || !selectedTool} className="w-full">
          {loading ? 'Invoking...' : 'Invoke Tool'}
        </Button>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        {result && (
          <div>
            <label className="text-sm font-medium mb-2 block">Result</label>
            <pre className="bg-muted p-3 rounded-lg text-sm overflow-auto max-h-64">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}