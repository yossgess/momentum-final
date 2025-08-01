import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dkggbrlylwlyqhawpmmb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrZ2dicmx5bHdseXFoYXdwbW1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwNDExNDIsImV4cCI6MjA2OTYxNzE0Mn0.aTFOetW8K2ZW9jafN0ZMhTkOmwjWdT0VWJOCyJKf25A';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export default supabase;
