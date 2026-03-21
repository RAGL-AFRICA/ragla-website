import { createClient } from '@supabase/supabase-js';

// Credentials for the external Lovable app (Payments & Library)
const externalSupabaseUrl = "https://mgjqoyoparpxisabhzgi.supabase.co";
const externalSupabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1nanFveW9wYXJweGlzYWJoemdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0NDQ2MzMsImV4cCI6MjA4NTAyMDYzM30.PLJQzLnvmuRDRu2C_VS-XCUJXnfMVH4X9DRqEIp03Zw";

export const externalSupabase = createClient(externalSupabaseUrl, externalSupabaseAnonKey);
