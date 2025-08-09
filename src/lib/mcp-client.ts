import { type ApiResponse } from '@/lib/error-handling';

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
  discoverTools: (serverUrl: string) => Promise<ApiResponse<MCPTool[]>>;
  invokeTool: (serverUrl: string, toolName: string, args: Record<string, unknown>) => Promise<ApiResponse<unknown>>;
  getResource: (serverUrl: string, resourceUri: string) => Promise<ApiResponse<unknown>>;
  connectServer: (serverUrl: string) => Promise<ApiResponse<MCPServer>>;
}

import { supabase } from '@/lib/supabase';
import { validateData, urlSchema } from '@/lib/validation';
import { 
  safeAsync, 
  withRetryAndTimeout, 
  logError, 
  createErrorResponse,
  type ApiResponse 
} from '@/lib/error-handling';

class MCPClientImpl implements MCPClient {
  private servers: Map<string, MCPServer> = new Map();

  async discoverTools(serverUrl: string): Promise<ApiResponse<MCPTool[]>> {
    // Validate server URL
    const validation = validateData(urlSchema, serverUrl);
    if (!validation.success) {
      return createErrorResponse(
        'Invalid server URL provided',
        { message: validation.error, code: 'INVALID_URL' }
      );
    }

    return safeAsync(async () => {
      return await withRetryAndTimeout(async () => {
        const { data, error } = await supabase.functions.invoke('mcp-discover-tools', {
          body: { serverUrl: validation.data }
        });
        
        if (error) {
          throw new Error(`Supabase function error: ${error.message || error}`);
        }
        
        return data?.tools || [];
      }, {
        maxRetries: 3,
        timeoutMs: 30000,
        timeoutMessage: 'Tool discovery timed out'
      });
    }, 'Failed to discover tools');
  }

  async invokeTool(
    serverUrl: string, 
    toolName: string, 
    args: Record<string, unknown>
  ): Promise<ApiResponse<unknown>> {
    // Validate inputs
    const urlValidation = validateData(urlSchema, serverUrl);
    if (!urlValidation.success) {
      return createErrorResponse(
        'Invalid server URL provided',
        { message: urlValidation.error, code: 'INVALID_URL' }
      );
    }

    if (!toolName || typeof toolName !== 'string' || toolName.trim().length === 0) {
      return createErrorResponse(
        'Invalid tool name provided',
        { message: 'Tool name is required and must be a non-empty string', code: 'INVALID_TOOL_NAME' }
      );
    }

    if (!args || typeof args !== 'object') {
      return createErrorResponse(
        'Invalid arguments provided',
        { message: 'Arguments must be a valid object', code: 'INVALID_ARGUMENTS' }
      );
    }

    return safeAsync(async () => {
      return await withRetryAndTimeout(async () => {
        const { data, error } = await supabase.functions.invoke('mcp-invoke-tool', {
          body: { 
            serverUrl: urlValidation.data, 
            toolName: toolName.trim(), 
            args 
          }
        });
        
        if (error) {
          throw new Error(`Supabase function error: ${error.message || error}`);
        }
        
        return data;
      }, {
        maxRetries: 2,
        timeoutMs: 45000,
        timeoutMessage: 'Tool invocation timed out'
      });
    }, 'Failed to invoke tool');
  }

  async getResource(serverUrl: string, resourceUri: string): Promise<ApiResponse<unknown>> {
    // Validate inputs
    const urlValidation = validateData(urlSchema, serverUrl);
    if (!urlValidation.success) {
      return createErrorResponse(
        'Invalid server URL provided',
        { message: urlValidation.error, code: 'INVALID_URL' }
      );
    }

    if (!resourceUri || typeof resourceUri !== 'string' || resourceUri.trim().length === 0) {
      return createErrorResponse(
        'Invalid resource URI provided',
        { message: 'Resource URI is required and must be a non-empty string', code: 'INVALID_RESOURCE_URI' }
      );
    }

    return safeAsync(async () => {
      return await withRetryAndTimeout(async () => {
        const { data, error } = await supabase.functions.invoke('mcp-get-resource', {
          body: { 
            serverUrl: urlValidation.data, 
            resourceUri: resourceUri.trim() 
          }
        });
        
        if (error) {
          throw new Error(`Supabase function error: ${error.message || error}`);
        }
        
        return data;
      }, {
        maxRetries: 2,
        timeoutMs: 30000,
        timeoutMessage: 'Resource retrieval timed out'
      });
    }, 'Failed to get resource');
  }

  async connectServer(serverUrl: string): Promise<ApiResponse<MCPServer>> {
    // Validate server URL
    const validation = validateData(urlSchema, serverUrl);
    if (!validation.success) {
      return createErrorResponse(
        'Invalid server URL provided',
        { message: validation.error, code: 'INVALID_URL' }
      );
    }

    return safeAsync(async () => {
      const toolsResult = await this.discoverTools(validation.data);
      
      if (!toolsResult.success) {
        throw new Error(`Failed to discover tools: ${toolsResult.error}`);
      }

      const server: MCPServer = {
        id: validation.data,
        name: new URL(validation.data).hostname,
        url: validation.data,
        status: 'connected',
        tools: toolsResult.data || [],
        resources: []
      };
      
      this.servers.set(validation.data, server);
      console.log(`✅ Connected to MCP server: ${server.name}`);
      
      return server;
    }, 'Failed to connect to MCP server');
  }
}

export const mcpClient = new MCPClientImpl();