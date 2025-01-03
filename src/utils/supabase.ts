import { createClient } from '@supabase/supabase-js';

// These environment variables are automatically injected by Lovable
const supabaseUrl = 'https://xgkqmgkgotfwjxlwlzrg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhna3FtZ2tnb3Rmd2p4bHdsenJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc4NTM5MTcsImV4cCI6MjAyMzQyOTkxN30.ZpgVPmGnZNVd_wUXELJ5dNgM_tJ4YqJvXYwPUTMm9F4';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);