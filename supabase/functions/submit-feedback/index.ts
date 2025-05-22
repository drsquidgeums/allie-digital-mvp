
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.1";

// Set up CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

interface FeedbackData {
  comments: string;
  userEmail: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const { comments, userEmail } = await req.json() as FeedbackData;

    if (!comments) {
      return new Response(
        JSON.stringify({ success: false, error: "Comments are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Special user email can submit multiple times
    const SPECIAL_USER_EMAIL = "antoinettecelinemarshall@gmail.com";
    
    // Only check for existing feedback if not a special user
    if (userEmail !== SPECIAL_USER_EMAIL) {
      // More efficient query with limit 1
      const { data: existingFeedback, error: checkError } = await supabaseAdmin
        .from('feedback')
        .select('id')
        .eq('user_id', '00000000-0000-0000-0000-000000000000')
        .limit(1);
        
      if (checkError) {
        return new Response(
          JSON.stringify({ success: false, error: "Error checking existing feedback" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }
      
      if (existingFeedback && existingFeedback.length > 0) {
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
    }

    // Use a fixed user_id for all feedback
    const userId = "00000000-0000-0000-0000-000000000000";
    
    // Enhance comments with email for reference
    const enhancedComments = `${comments}\n\n[Email: ${userEmail}]`;
    
    // Simplified insert with minimal required fields
    const { error } = await supabaseAdmin
      .from('feedback')
      .insert({
        user_id: userId,
        comments: enhancedComments,
        created_at: new Date().toISOString(),
        rating: 1,
        usability: 1,
        visual_appeal: 1,
        would_recommend: false
      });

    if (error) {
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
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Server error",
        details: err instanceof Error ? err.message : String(err)
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
