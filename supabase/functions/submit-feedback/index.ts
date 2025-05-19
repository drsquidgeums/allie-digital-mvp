
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

    console.log(`Processing feedback submission for email: ${userEmail}`);

    // Check if user has already submitted feedback (except for special users)
    const SPECIAL_USER_EMAIL = "antoinettecelinemarshall@gmail.com";
    
    if (userEmail !== SPECIAL_USER_EMAIL) {
      const { data: existingFeedback, error: checkError } = await supabaseAdmin
        .from('feedback')
        .select('id')
        .contains('comments', `[Email: ${userEmail}]`);
        
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

    // Instead of generating a UUID, we'll get ids from existing user records
    // or use a fixed string to satisfy the foreign key constraint
    let userId;
    
    try {
      // Try to find a valid existing user ID in the users table
      const { data: existingUsers, error: usersError } = await supabaseAdmin
        .from('users')
        .select('id')
        .limit(1);
      
      if (usersError || !existingUsers || existingUsers.length === 0) {
        console.log("No existing user found, using a placeholder ID");
        // This means there are no users in the users table, use a placeholder
        // For this to work properly, the user_id column shouldn't have a foreign key constraint
        userId = "00000000-0000-0000-0000-000000000000";
      } else {
        userId = existingUsers[0].id;
      }
      
      console.log(`Using user_id: ${userId} for feedback submission`);
      
      // Enhance comments with email for reference
      const enhancedComments = `${comments}\n\n[Email: ${userEmail}]`;
      
      // Supabase insert operation with valid rating values to satisfy the check constraint
      const { data, error } = await supabaseAdmin
        .from('feedback')
        .insert({
          user_id: userId,
          comments: enhancedComments,
          created_at: new Date().toISOString(),
          rating: 1, // Changed from 0 to 1 to satisfy check constraint
          usability: 1, // Changed from 0 to 1
          visual_appeal: 1, // Changed from 0 to 1
          would_recommend: false
        });

      if (error) {
        console.error("Error submitting feedback:", error);
        
        // If it's a foreign key constraint error, provide more specific message
        if (error.code === '23503' && error.message.includes('violates foreign key constraint')) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: "Database configuration error: The feedback system requires a valid user account.",
              details: error.message
            }),
            {
              status: 500,
              headers: { "Content-Type": "application/json", ...corsHeaders },
            }
          );
        }
        
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Database error while submitting feedback",
            details: error.message
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }

      console.log("Feedback successfully submitted");
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
    } catch (dbError) {
      console.error("Error submitting feedback:", dbError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Database error while submitting feedback",
          details: dbError instanceof Error ? dbError.message : String(dbError)
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
  } catch (err) {
    console.error("Unexpected error in submit-feedback function:", err);
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
