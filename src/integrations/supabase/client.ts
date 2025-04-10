// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xtdukbzdbzbemyqaifhp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0ZHVrYnpkYnpiZW15cWFpZmhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwMjAxNDYsImV4cCI6MjA1OTU5NjE0Nn0.8QARO-qy_LLVb2RHqkwCJHyrluVaMEcc6kMRtxQMBlY";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Test connection on init
supabase.from('profiles').select('count').single().then(({ error }) => {
  if (error) {
    console.error('Supabase connection error:', error.message);
  } else {
    console.log('Supabase connected successfully');
  }
});