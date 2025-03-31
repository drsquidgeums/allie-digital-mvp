
import { createClient } from '@supabase/supabase-js';
import { ExtendedDatabase } from '@/types/database';

const SUPABASE_URL = "https://frvjnuuqacrrrvrhzhuj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZydmpudXVxYWNycnJ2cmh6aHVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzNTEzMTksImV4cCI6MjA1ODkyNzMxOX0.4iDaD2ntPsVUe4lQbSvipMtFwmb99YMvhxuDNz_DGx4";

// Create a Supabase client with our extended database type
export const extendedSupabase = createClient<ExtendedDatabase>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
