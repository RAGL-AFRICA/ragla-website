import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { studentId } = await req.json()

        if (!studentId) {
            return new Response(
                JSON.stringify({ error: 'Student ID is required' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
            )
        }

        // 1. Setup local Supabase with Service Role to bypass RLS
        const supabaseUrl = Deno.env.get('SUPABASE_URL')
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
        const localClient = createClient(supabaseUrl, supabaseServiceKey)

        // 2. Setup external Supabase for master records
        const externalUrl = Deno.env.get('EXTERNAL_SUPABASE_URL') || "https://mgjqoyoparpxisabhzgi.supabase.co"
        const externalKey = Deno.env.get('EXTERNAL_SUPABASE_SERVICE_ROLE_KEY') || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1nanFveW9wYXJweGlzYWJoemdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0NDQ2MzMsImV4cCI6MjA4NTAyMDYzM30.PLJQzLnvmuRDRu2C_VS-XCUJXnfMVH4X9DRqEIp03Zw"
        const externalClient = createClient(externalUrl, externalKey)

        // 3. Check local user_profiles first
        const { data: profile, error: profileError } = await localClient
            .from('user_profiles')
            .select('email, full_name, avatar_url')
            .ilike('membership_number', studentId.trim())
            .maybeSingle()

        if (profile) {
            return new Response(
                JSON.stringify({
                    success: true,
                    source: 'local',
                    user: profile
                }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
            )
        }

        // 4. If not found locally, check external master records
        const { data: externalStudent, error: externalError } = await externalClient
            .from('students')
            .select('full_name, photo_url')
            .eq('student_id', studentId.trim())
            .maybeSingle()

        if (externalStudent) {
            return new Response(
                JSON.stringify({
                    success: false,
                    source: 'external',
                    message: 'ID found in master records but not yet registered on this website.',
                    user: {
                        full_name: externalStudent.full_name,
                        avatar_url: externalStudent.photo_url
                    }
                }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
            )
        }

        // 5. If not found anywhere
        return new Response(
            JSON.stringify({
                success: false,
                source: 'none',
                message: 'Student ID not found in our records. Please double check the ID.'
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
    }
})
