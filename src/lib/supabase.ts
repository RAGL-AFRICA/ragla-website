import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://okqbbtheqczvedwmouqq.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rcWJidGhlcWN6dmVkd21vdXFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1ODEzNjAsImV4cCI6MjA4OTE1NzM2MH0.8vpIXOWezzDbxGoORhgHgNmMQIqOhs6ow3K0shVvHJc";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
