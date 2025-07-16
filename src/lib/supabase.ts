import { createClient } from '@supabase/supabase-js';


// Initialize Supabase client
// Using direct values from project configuration
const supabaseUrl = 'https://ujzedaxzqpglrccqojbh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqemVkYXh6cXBnbHJjY3FvamJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2ODA2NzUsImV4cCI6MjA2ODI1NjY3NX0.Dfi19uVCKcFa51XVFA2QqeHSyQKckLVcvLKnSd6-YQc';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };