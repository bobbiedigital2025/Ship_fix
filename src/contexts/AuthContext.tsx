import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MCPAuthService } from '@/lib/mcp-auth-service';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'support';
  company?: string;
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      setIsLoading(true);
      const isValid = await MCPAuthService.validateSession();
      
      if (isValid) {
        // Get user info from session storage or make MCP call
        const storedUser = localStorage.getItem('mcp_user_info');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          // For development, create a mock user
          const mockUser: User = {
            id: 'dev-user-1',
            name: 'Demo User',
            email: 'demo@bobbiedigital.com',
            role: 'admin',
            company: 'Bobbie Digital',
            permissions: ['read', 'write', 'admin', 'support']
          };
          setUser(mockUser);
          localStorage.setItem('mcp_user_info', JSON.stringify(mockUser));
        }
      } else {
        setUser(null);
        localStorage.removeItem('mcp_user_info');
      }
    } catch (error) {
      console.error('Session check failed:', error);
      // For development, auto-authenticate
      await autoAuthenticate();
    } finally {
      setIsLoading(false);
    }
  };

  const autoAuthenticate = async () => {
    try {
      // Auto-authenticate in development mode
      const agentId = 'supply-chain-platform-user';
      const credentials = {
        appId: 'supply-chain-platform',
        userId: 'demo-user',
        environment: 'development'
      };

      await MCPAuthService.authenticateAgent(agentId, credentials);
      
      const mockUser: User = {
        id: 'dev-user-1',
        name: 'Demo User',
        email: 'demo@bobbiedigital.com',
        role: 'admin',
        company: 'Bobbie Digital',
        permissions: ['read', 'write', 'admin', 'support']
      };
      
      setUser(mockUser);
      localStorage.setItem('mcp_user_info', JSON.stringify(mockUser));
    } catch (error) {
      console.warn('Auto-authentication failed:', error);
      // Continue without authentication for development
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // For MCP A2A authentication, we use agent credentials
      const agentId = `user-${email}`;
      const credentials = {
        email,
        password,
        appId: 'supply-chain-platform',
        timestamp: Date.now()
      };

      await MCPAuthService.authenticateAgent(agentId, credentials);
      
      // In a real implementation, this would come from the MCP server
      const user: User = {
        id: email,
        name: email.split('@')[0],
        email,
        role: email.includes('admin') ? 'admin' : 'user',
        company: 'Demo Company',
        permissions: email.includes('admin') 
          ? ['read', 'write', 'admin', 'support'] 
          : ['read', 'write']
      };
      
      setUser(user);
      localStorage.setItem('mcp_user_info', JSON.stringify(user));
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await MCPAuthService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('mcp_user_info');
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    checkSession
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
