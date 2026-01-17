import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SupportTicketRequest {
  subject: string;
  issueType: string;
  description: string;
  userEmail: string;
}

const getIssueTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    bug: "Bug Report",
    feature: "Feature Request",
    account: "Account / Payment Issue",
    general: "General Question",
  };
  return labels[type] || type;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { subject, issueType, description, userEmail }: SupportTicketRequest = await req.json();

    // Validate required fields
    if (!subject || !issueType || !description) {
      console.error("Missing required fields:", { subject, issueType, description });
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Sending support ticket email:", { subject, issueType, userEmail });

    const emailResponse = await resend.emails.send({
      from: "Allie.ai Support <onboarding@resend.dev>",
      to: ["fizzeee@pm.me"],
      subject: `[Support Ticket] ${getIssueTypeLabel(issueType)}: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #0047AB; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
              .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px; }
              .field { margin-bottom: 15px; }
              .label { font-weight: bold; color: #555; }
              .value { margin-top: 5px; }
              .description { background: white; padding: 15px; border-radius: 4px; border: 1px solid #e0e0e0; white-space: pre-wrap; }
              .footer { margin-top: 20px; font-size: 12px; color: #888; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">New Support Ticket</h1>
              </div>
              <div class="content">
                <div class="field">
                  <div class="label">From:</div>
                  <div class="value">${userEmail}</div>
                </div>
                <div class="field">
                  <div class="label">Issue Type:</div>
                  <div class="value">${getIssueTypeLabel(issueType)}</div>
                </div>
                <div class="field">
                  <div class="label">Subject:</div>
                  <div class="value">${subject}</div>
                </div>
                <div class="field">
                  <div class="label">Description:</div>
                  <div class="description">${description.replace(/\n/g, '<br>')}</div>
                </div>
                <div class="footer">
                  <p>This ticket was submitted via Allie.ai Support System</p>
                  <p>Timestamp: ${new Date().toISOString()}</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-support-ticket function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
