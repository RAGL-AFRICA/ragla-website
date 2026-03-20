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

        const supabaseUrl = Deno.env.get('EXTERNAL_SUPABASE_URL')
        const supabaseServiceKey = Deno.env.get('EXTERNAL_SUPABASE_SERVICE_ROLE_KEY')

        if (!supabaseUrl || !supabaseServiceKey) {
            return new Response(
                JSON.stringify({ error: 'External Supabase configuration missing' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
            )
        }

        const externalClient = createClient(supabaseUrl, supabaseServiceKey)

        // Query the external 'students' table using the provided 'student_id' column
        const { data: student, error } = await externalClient
            .from('students')
            .select('student_id, full_name, photo_url')
            .eq('student_id', studentId)
            .single()

        if (error || !student) {
            console.error('Student not found or error:', error)
            return new Response(
                JSON.stringify({ error: 'Student ID not found in master records.' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
            )
        }

        return new Response(
            JSON.stringify(student),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
    }
})
