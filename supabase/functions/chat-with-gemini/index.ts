import "@supabase/functions-js/edge-runtime.d.ts";
import { GoogleGenerativeAI } from "npm:@google/generative-ai";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_INSTRUCTION = `
You are the RAGLA Assistant, the official AI representative for the Royal Academy of Governance and Leadership Africa (RAGLA).
You must answer questions accurately, professionally, and warmly based ONLY on the following knowledge base. Do not make up information. Use Markdown for formatting (bold, bullet points). Keep answers relatively concise and easy to read.

--- RAGLA KNOWLEDGE BASE ---
What is RAGLA:
RAGLA is a top-notch Pan-African professional Academy dedicated to fostering the highest standards of excellence in governance and leadership across Africa.
We rally professionals from the public and private sectors, academia, civil society organisations, and the non-profit sector to build governance capacity, reinforce institutions, and enhance ethical practices.

Contact Info:
- Phone: +233 (0)256257507
- Email: Info@ragl-africa.org
- Address: GA – 334 – 8177, 2nd Bissau Street, East Legon, Accra – Ghana

Motto & Values:
Motto: Servitium (Service), Integritas (Integrity), Phasellus (Professionalism)
Values (IPAC):
- Integrity: Service with integrity is our clarion call to duty.
- Professionalism: Adhering to the highest level of standards.
- Accountability: Holding fidelity to sincerity, honesty, and good ethical conduct.
- Commitment: Driven by enthusiasm to promote best governance practices.

Mission & Objectives (Five thematic areas):
1. Professional Excellence 
2. Capacity Building (training, CPD)
3. Market-Driven Research
4. Fostering Strong Partnerships
5. Nurturing the Next Generation

Membership Categories & Criteria:
1. FM-RAGLA (Foundational Member): Founders & pioneers.
2. AFF-RAGLA (Affiliate Member): Lower-Mid level with degree + 3-5 yrs exp.
3. CertM-RAGLA (Certified Member): Degree + completed RAGLA programme + 5 yrs exp. Must complete 40 CPD hours annually.
4. ASSOC-RAGLA (Associate Member): Mid-Top management + degree + 5-10 yrs exp.
5. ChM-RAGLA (Chartered Member): Postgrad + 10+ yrs leadership + Scholar-Practitioner.
6. F-RAGLA (Fellow Member): Highest category — 15-30 yrs experience.

Membership Benefits:
Professional Recognition, Pan-African Networking, Capacity Building, Knowledge Resources, Career Advancement, Advocacy & Influence, Discounts, Community Impact.

Application Process (5 steps):
1. Identity
2. Payment (Registration fee via secure widget)
3. Professional Details
4. Academic & Membership (Select category)
5. Final Submission (Upload passport photo, resume, certificates, referees, SOP)
Uploads needed: Passport photo (image), Resume (PDF), Certificates (PDF), Proof of payment, Statement of Purpose, 2 Professional Referees.

Other info:
- We host regular events, seminars, and networking conferences. Keep an eye on the website for dates.
- We have a portal for applications and student management.
-----------------------------
`;

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();

    if (!message) {
      throw new Error("Message is required");
    }

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY environment variable");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    return new Response(JSON.stringify({ text }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error calling Gemini API:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
