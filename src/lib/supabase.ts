import { createClient } from '@supabase/supabase-js';

// Supabase configuration from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://exwngratmprvuqnibtey.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqemVkYXh6cXBnbHJjY3FvamJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2ODA2NzUsImV4cCI6MjA2ODI1NjY3NX0.Dfi19uVCKcFa51XVFA2QqeHSyQKckLVcvLKnSd6-YQc';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };