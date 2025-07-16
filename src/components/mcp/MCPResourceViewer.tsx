import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mcpClient, MCPServer, MCPResource } from '@/lib/mcp-client';
import { FileText, Download, RefreshCw } from 'lucide-react';

interface MCPResourceViewerProps {
  servers: MCPServer[];
}

export default function MCPResourceViewer({ servers }: MCPResourceViewerProps) {
  const [selectedServer, setSelectedServer] = useState<string>('');
  const [selectedResource, setSelectedResource] = useState<string>('');
  const [resourceContent, setResourceContent] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const selectedServerData = servers.find(s => s.id === selectedServer);
  const selectedResourceData = selectedServerData?.resources.find(r => r.uri === selectedResource);

  const loadResource = async () => {
    if (!selectedServer || !selectedResource) return;
    
    setLoading(true);
    try {
      const content = await mcpClient.getResource(selectedServer, selectedResource);
      setResourceContent(content);
    } catch (error) {
      console.error('Failed to load resource:', error);
      setResourceContent({ error: 'Failed to load resource' });
    } finally {
      setLoading(false);
    }
  };

  const getMimeTypeColor = (mimeType: string) => {
    if (mimeType.includes('json')) return 'bg-blue-100 text-blue-800';
    if (mimeType.includes('text')) return 'bg-green-100 text-green-800';
    if (mimeType.includes('image')) return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Resource Viewer
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
            <label className="text-sm font-medium mb-2 block">Resource</label>
            <Select value={selectedResource} onValueChange={setSelectedResource} disabled={!selectedServer}>
              <SelectTrigger>
                <SelectValue placeholder="Select resource" />
              </SelectTrigger>
              <SelectContent>
                {selectedServerData?.resources.map(resource => (
                  <SelectItem key={resource.uri} value={resource.uri}>
                    {resource.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedResourceData && (
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">{selectedResourceData.name}</p>
              <Badge className={getMimeTypeColor(selectedResourceData.mimeType)}>
                {selectedResourceData.mimeType}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{selectedResourceData.description}</p>
            <p className="text-xs text-muted-foreground font-mono">{selectedResourceData.uri}</p>
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={loadResource} disabled={loading || !selectedServer || !selectedResource}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Load Resource
          </Button>
          {resourceContent && (
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          )}
        </div>

        {resourceContent && (
          <div>
            <label className="text-sm font-medium mb-2 block">Content</label>
            <pre className="bg-muted p-3 rounded-lg text-sm overflow-auto max-h-96">
              {typeof resourceContent === 'string' 
                ? resourceContent 
                : JSON.stringify(resourceContent, null, 2)
              }
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}