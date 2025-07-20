import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: ('admin' | 'support' | 'user')[];
  fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ 
  children, 
  allowedRoles, 
  fallback = null 
}) => {
  const { user } = useAuth();
  
  if (!user || !allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

interface PermissionGuardProps {
  children: React.ReactNode;
  requiredPermission: string;
  fallback?: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  requiredPermission,
  fallback = null
}) => {
  const { user } = useAuth();
  
  if (!user || !user.permissions.includes(requiredPermission)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

// Hook for checking permissions
export const usePermissions = () => {
  const { user } = useAuth();
  
  const hasPermission = (permission: string) => {
    return user?.permissions.includes(permission) || false;
  };
  
  const hasRole = (role: 'admin' | 'support' | 'user') => {
    return user?.role === role;
  };
  
  const isAdmin = () => hasRole('admin');
  const isSupport = () => hasRole('support') || hasRole('admin');
  const isCustomer = () => hasRole('user');
  
  return {
    hasPermission,
    hasRole,
    isAdmin,
    isSupport,
    isCustomer,
    user
  };
};
