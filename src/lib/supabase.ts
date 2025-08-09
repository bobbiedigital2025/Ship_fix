import { createClient } from '@supabase/supabase-js';
import { validateEnvironment } from './validation';
import { logError } from './error-handling';

// Validate environment variables
const envValidation = validateEnvironment();
if (!envValidation.success) {
  logError('Supabase environment validation failed', envValidation.error);
  console.error('Environment validation failed:', envValidation.error);
  
  // In development, we can continue with defaults, but log the issue
  if (import.meta.env.MODE === 'production') {
    throw new Error(`Supabase configuration error: ${envValidation.error}`);
  }
}

// Supabase configuration from environment variables with validated fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://exwngratmprvuqnibtey.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqemVkYXh6cXBnbHJjY3FvamJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2ODA2NzUsImV4cCI6MjA2ODI1NjY3NX0.Dfi19uVCKcFa51XVFA2QqeHSyQKckLVcvLKnSd6-YQc';

// Validate that we have the required configuration
if (!supabaseUrl || !supabaseKey) {
  const error = 'Missing required Supabase configuration';
  logError('Supabase initialization failed', error);
  throw new Error(error);
}

// Additional validation for URL format
try {
  new URL(supabaseUrl);
} catch {
  const error = 'Invalid Supabase URL format';
  logError('Supabase URL validation failed', error, { url: supabaseUrl });
  throw new Error(error);
}

// Validate API key format (basic check)
if (supabaseKey.length < 20) {
  const error = 'Invalid Supabase API key format';
  logError('Supabase API key validation failed', error);
  
  if (import.meta.env.MODE === 'production') {
    throw new Error(error);
  } else {
    console.warn('Warning: Supabase API key appears to be invalid');
  }
}

// Initialize Supabase client with error handling
let supabase: ReturnType<typeof createClient>;

try {
  supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    },
    global: {
      headers: {
        'X-Client-Info': 'supply-chain-platform'
      }
    }
  });
  
  console.log('✅ Supabase client initialized successfully');
} catch (error) {
  logError('Supabase client creation failed', error);
  throw new Error(`Failed to initialize Supabase client: ${error}`);
}

// Test connection on initialization (non-blocking)
if (typeof window !== 'undefined') {
  supabase.auth.getSession()
    .then(({ error }) => {
      if (error) {
        logError('Supabase connection test failed', error);
        console.warn('Supabase connection test failed:', error.message);
      } else {
        console.log('✅ Supabase connection test successful');
      }
    })
    .catch((error) => {
      logError('Supabase connection test error', error);
      console.warn('Supabase connection test error:', error);
    });
}

export { supabase };