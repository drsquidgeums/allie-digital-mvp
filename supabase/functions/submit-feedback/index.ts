import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

// Set up CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation helpers
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

function sanitizeString(str: string, maxLength: number): string {
  return str.trim().slice(0, maxLength);
}

// Escape SQL wildcards to prevent injection
function escapeSqlWildcards(str: string): string {
  return str.replace(/[%_\\]/g, '\\$&');
}

interface FeedbackData {
  comments: string;
  userEmail: string;
}

serve(async (req) => {
  console.log(`${req.method} request received`);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Authentication check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    if (token === anonKey) {
      return new Response(JSON.stringify({ success: false, error: "User authentication required" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ success: false, error: "Invalid authentication" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Request from user:", user.id);

    // Create authenticated Supabase client (uses service_role key to bypass RLS)
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          persistSession: false,
        }
      }
    );

    const requestBody = await req.json();
    
    const { comments, userEmail } = requestBody as FeedbackData;

    // Validate and sanitize inputs
    if (!comments || typeof comments !== 'string') {
      console.log("Missing or invalid comments in request");
      return new Response(
        JSON.stringify({ success: false, error: "Comments are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    if (!userEmail || typeof userEmail !== 'string' || !isValidEmail(userEmail)) {
      console.log("Missing or invalid userEmail in request");
      return new Response(
        JSON.stringify({ success: false, error: "Valid email is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Sanitize inputs
    const sanitizedComments = sanitizeString(comments, 5000);
    const sanitizedEmail = sanitizeString(userEmail.toLowerCase(), 255);
    const escapedEmail = escapeSqlWildcards(sanitizedEmail);

    console.log(`Processing feedback submission`);

    // Check for existing feedback by looking for the email in comments (with escaped wildcards)
    console.log("Checking for existing feedback...");
    const { data: existingFeedback, error: checkError } = await supabaseAdmin
      .from('feedback')
      .select('id, comments')
      .ilike('comments', `%${escapedEmail}%`)
      .limit(1);
      
    if (checkError) {
      console.error("Error checking existing feedback:", checkError);
      return new Response(
        JSON.stringify({ success: false, error: "Error checking existing feedback" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    if (existingFeedback && existingFeedback.length > 0) {
      console.log("User has already provided feedback");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "You have already provided feedback. Thank you!" 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Enhance comments with email for reference
    const enhancedComments = `${sanitizedComments}\n\n[Email: ${sanitizedEmail}]`;
    
    console.log("Inserting feedback into database...");
    
    // Insert feedback without user_id since the foreign key constraint is causing issues
    const { data: insertData, error: insertError } = await supabaseAdmin
      .from('feedback')
      .insert({
        comments: enhancedComments,
        created_at: new Date().toISOString(),
        rating: 5,
        usability: 5,
        visual_appeal: 5,
        would_recommend: true
      })
      .select();

    if (insertError) {
      console.error("Database insert error:", insertError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Database error while submitting feedback"
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Feedback inserted successfully");

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Feedback submitted successfully"
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (err) {
    console.error("Function error:", err);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Server error"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
