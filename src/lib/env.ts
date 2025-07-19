// Environment variables utility
// This file helps manage environment variables safely

interface EnvVars {
  VITE_STRIPE_PUBLISHABLE_KEY: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_RESTRICTED_KEY: string;
  RESEND_API_KEY: string;
  VITE_SUPPORT_EMAIL: string;
}

// Function to get environment variable with validation
export function getEnvVar(key: keyof EnvVars, fallback?: string): string {
  const value = import.meta.env[key];
  
  if (!value) {
    if (fallback !== undefined) {
      return fallback;
    }
    if (import.meta.env.DEV) {
      console.warn(`Missing environment variable: ${key}, using fallback`);
      return `dev_${key.toLowerCase()}`;
    }
    throw new Error(`Missing required environment variable: ${key}`);
  }
  
  return value;
}

// Safe way to access API keys
export const apiConfig = {
  // Stripe configuration
  stripe: {
    // This is safe to use in client-side code (publishable key)
    publishableKey: getEnvVar('VITE_STRIPE_PUBLISHABLE_KEY', 'pk_dev_fallback'),
    
    // These should only be used in server-side code or secure contexts
    getSecretKey: () => getEnvVar('STRIPE_SECRET_KEY', 'sk_dev_fallback'),
    getRestrictedKey: () => getEnvVar('STRIPE_RESTRICTED_KEY', 'rk_dev_fallback'),
  },
  
  // Resend email service configuration
  resend: {
    // This should only be used in server-side code or secure contexts
    getApiKey: () => getEnvVar('RESEND_API_KEY', 'resend_dev_fallback'),
  },
  
  // Support configuration
  support: {
    email: getEnvVar('VITE_SUPPORT_EMAIL', 'support@localhost.dev'),
  },
};

// Type-safe environment variable access
export const env = {
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  mode: import.meta.env.MODE,
};
