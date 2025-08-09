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
      
      // First check if we have user info in localStorage
      const storedUser = localStorage.getItem('mcp_user_info');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        
        // For trial users, skip MCP validation and use local validation
        if (user.subscription?.plan === 'trial') {
          // Check if trial has expired
          const expiresAt = new Date(user.subscription.expiresAt);
          if (expiresAt > new Date()) {
            setUser(user);
            return;
          } else {
            // Trial expired, remove user
            localStorage.removeItem('mcp_user_info');
            setUser(null);
            return;
          }
        }
        
        // For non-trial users, validate with MCP
        const isValid = await MCPAuthService.validateSession();
        if (isValid) {
          setUser(user);
        } else {
          setUser(null);
          localStorage.removeItem('mcp_user_info');
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Session check failed:', error);
      // Don't clear localStorage on MCP errors for trial users
      const storedUser = localStorage.getItem('mcp_user_info');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.subscription?.plan === 'trial') {
          const expiresAt = new Date(user.subscription.expiresAt);
          if (expiresAt > new Date()) {
            setUser(user);
            return;
          }
        }
      }
      setUser(null);
      localStorage.removeItem('mcp_user_info');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Check if this is admin login
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@yourcompany.com';
      const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
      
      if (email === adminEmail && password === adminPassword) {
        // Admin login
        const adminUser: User = {
          id: 'admin-1',
          name: 'Administrator',
          email: adminEmail,
          role: 'admin',
          company: import.meta.env.VITE_COMPANY_NAME || 'Your Company',
          permissions: ['read', 'write', 'admin', 'support', 'manage_users', 'billing']
        };
        
        setUser(adminUser);
        localStorage.setItem('mcp_user_info', JSON.stringify(adminUser));
        return;
      }
      
      // For MCP customer authentication
      const agentId = `user-${email}`;
      const credentials = {
        email,
        password,
        appId: 'supply-chain-platform',
        timestamp: Date.now()
      };

      await MCPAuthService.authenticateAgent(agentId, credentials);
      
      // Customer user (in production, this would come from MCP server)
      const user: User = {
        id: email,
        name: email.split('@')[0],
        email,
        role: 'user',
        company: 'Customer Company',
        permissions: ['read', 'write', 'manage_suppliers', 'manage_shippers', 'manage_inventory']
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
