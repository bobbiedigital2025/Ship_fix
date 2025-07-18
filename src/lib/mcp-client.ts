export interface MCPServer {
  id: string;
  name: string;
  url: string;
  status: 'connected' | 'disconnected' | 'error';
  tools: MCPTool[];
  resources: MCPResource[];
}

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

export interface MCPResource {
  uri: string;
  name: string;
  description: string;
  mimeType: string;
}

export interface MCPClient {
  discoverTools: (serverUrl: string) => Promise<MCPTool[]>;
  invokeTool: (serverUrl: string, toolName: string, args: Record<string, unknown>) => Promise<unknown>;
  getResource: (serverUrl: string, resourceUri: string) => Promise<unknown>;
  connectServer: (serverUrl: string) => Promise<MCPServer>;
}

import { supabase } from '@/lib/supabase';

class MCPClientImpl implements MCPClient {
  private servers: Map<string, MCPServer> = new Map();

  async discoverTools(serverUrl: string): Promise<MCPTool[]> {
    try {
      const { data, error } = await supabase.functions.invoke('mcp-discover-tools', {
        body: { serverUrl }
      });
      if (error) throw error;
      return data.tools || [];
    } catch (error) {
      console.error('Failed to discover tools:', error);
      return [];
    }
  }

  async invokeTool(serverUrl: string, toolName: string, args: Record<string, unknown>): Promise<unknown> {
    try {
      const { data, error } = await supabase.functions.invoke('mcp-invoke-tool', {
        body: { serverUrl, toolName, args }
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to invoke tool:', error);
      throw error;
    }
  }

  async getResource(serverUrl: string, resourceUri: string): Promise<unknown> {
    try {
      const { data, error } = await supabase.functions.invoke('mcp-get-resource', {
        body: { serverUrl, resourceUri }
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to get resource:', error);
      throw error;
    }
  }

  async connectServer(serverUrl: string): Promise<MCPServer> {
    const tools = await this.discoverTools(serverUrl);
    const server: MCPServer = {
      id: serverUrl,
      name: new URL(serverUrl).hostname,
      url: serverUrl,
      status: 'connected',
      tools,
      resources: []
    };
    this.servers.set(serverUrl, server);
    return server;
  }
}

export const mcpClient = new MCPClientImpl();