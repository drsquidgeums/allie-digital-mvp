
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
  console.log(`${req.method} request received`);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const requestBody = await req.json();
    console.log("Request body:", requestBody);
    
    const { comments, userEmail } = requestBody as FeedbackData;

    if (!comments) {
      console.log("Missing comments in request");
      return new Response(
        JSON.stringify({ success: false, error: "Comments are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    if (!userEmail) {
      console.log("Missing userEmail in request");
      return new Response(
        JSON.stringify({ success: false, error: "User email is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`Processing feedback from: ${userEmail}`);

    // Special user email can submit multiple times
    const SPECIAL_USER_EMAIL = "antoinettecelinemarshall@gmail.com";
    
    // Only check for existing feedback if not a special user
    if (userEmail !== SPECIAL_USER_EMAIL) {
      console.log("Checking for existing feedback...");
      
      // Check for existing feedback by looking for the email in comments
      const { data: existingFeedback, error: checkError } = await supabaseAdmin
        .from('feedback')
        .select('id, comments')
        .ilike('comments', `%${userEmail}%`)
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
      
      console.log("Existing feedback check result:", existingFeedback);
      
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
    }

    // Use a fixed user_id for all feedback
    const userId = "00000000-0000-0000-0000-000000000000";
    
    // Enhance comments with email for reference
    const enhancedComments = `${comments}\n\n[Email: ${userEmail}]`;
    
    console.log("Inserting feedback into database...");
    
    // Insert feedback with all required fields
    const { data: insertData, error: insertError } = await supabaseAdmin
      .from('feedback')
      .insert({
        user_id: userId,
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
          error: "Database error while submitting feedback",
          details: insertError.message
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Feedback inserted successfully:", insertData);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Feedback submitted successfully",
        data: insertData
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
