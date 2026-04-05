declare const Deno: {
  env: {
    get: (key: string) => string | undefined
  }
}

// @ts-ignore Supabase Edge Functions resolve this remote import in Deno runtime.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
// @ts-ignore Supabase Edge Functions resolve this remote import in Deno runtime.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

type ApprovalEmailPayload = {
  to?: string
  applicantName?: string
  membershipCode?: string
  program?: string
  portalUrl?: string
}

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  })

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405)
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")

    if (!supabaseUrl || !serviceRoleKey) {
      return jsonResponse({ success: false, error: "SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not configured" }, 200)
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey)

    const body = (await req.json()) as ApprovalEmailPayload
    const to = body.to?.trim()
    const applicantName = body.applicantName?.trim()
    const membershipCode = body.membershipCode?.trim()
    const program = body.program?.trim() || "Professional Program"
    const portalUrl = body.portalUrl?.trim() || "https://example.edu/portal"

    if (!to || !applicantName || !membershipCode) {
      return jsonResponse(
        { success: false, error: "Missing required fields: to, applicantName, membershipCode" },
        200,
      )
    }

    const { error } = await adminClient.auth.admin.inviteUserByEmail(to, {
      redirectTo: portalUrl,
      data: {
        applicant_name: applicantName,
        student_id: membershipCode,
        program,
        portal_url: portalUrl,
      },
    })

    if (error) {
      // If the user already exists, send a password reset email instead.
      if (/already been registered|already exists|User already registered/i.test(error.message || "")) {
        const { error: recoveryError } = await adminClient.auth.resetPasswordForEmail(to, {
          redirectTo: portalUrl,
        })

        if (recoveryError) {
          return jsonResponse(
            {
              success: false,
              error: "Invite failed and recovery email failed",
              details: recoveryError.message,
            },
            200,
          )
        }

        return jsonResponse(
          {
            success: true,
            provider: "supabase-auth",
            mode: "recovery",
            message: "User already exists. Sent password reset email instead.",
          },
          200,
        )
      }

      return jsonResponse(
        {
          success: false,
          error: "Supabase Auth failed to send approval email",
          details: error.message,
        },
        200,
      )
    }

    return jsonResponse({ success: true, provider: "supabase-auth" }, 200)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error"
    return jsonResponse({ error: message }, 500)
  }
})
