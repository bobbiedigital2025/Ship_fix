import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const [showSignup, setShowSignup] = React.useState(false);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show login/signup if not authenticated
  if (!isAuthenticated) {
    return showSignup ? (
      <SignupForm onShowLogin={() => setShowSignup(false)} />
    ) : (
      <LoginForm onShowSignup={() => setShowSignup(true)} />
    );
  }

  // Show protected content if authenticated
  return <>{children}</>;
};

export default AuthGuard;