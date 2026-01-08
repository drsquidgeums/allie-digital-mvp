import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VERIFY-PAYMENT-SESSION] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // Authentication check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    if (token === anonKey) {
      return new Response(JSON.stringify({ error: "User authentication required" }), {
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
      return new Response(JSON.stringify({ error: "Invalid authentication" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    logStep("Request from user:", user.id);

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    // Create Supabase admin client to update profiles
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const body = await req.json();
    const { sessionId } = body;

    // Input validation
    if (!sessionId || typeof sessionId !== 'string') {
      throw new Error("Session ID is required");
    }
    if (sessionId.length > 200) {
      throw new Error("Session ID is too long");
    }

    const sanitizedSessionId = sessionId.trim().slice(0, 200);
    logStep("Verifying session", { sessionId: sanitizedSessionId });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sanitizedSessionId);
    const customerEmail = session.customer_email || session.metadata?.email;
    logStep("Session retrieved", { status: session.payment_status, email: customerEmail });

    // Security check: Verify the session email matches the authenticated user's email
    if (customerEmail && user.email && customerEmail.toLowerCase() !== user.email.toLowerCase()) {
      logStep("Email mismatch", { sessionEmail: customerEmail, userEmail: user.email });
      return new Response(JSON.stringify({ 
        error: "Session email does not match authenticated user" 
      }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (session.payment_status === "paid" && customerEmail) {
      // Update the user's profile to mark them as having lifetime access
      const { data: profiles, error: profileError } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("email", customerEmail.toLowerCase());

      if (profileError) {
        logStep("Error fetching profile", { error: profileError.message });
      } else if (profiles && profiles.length > 0) {
        // Update the profile to lifetime status
        const { error: updateError } = await supabaseAdmin
          .from("profiles")
          .update({ subscription_status: "lifetime" })
          .eq("id", profiles[0].id);

        if (updateError) {
          logStep("Error updating profile", { error: updateError.message });
        } else {
          logStep("Profile updated to lifetime", { profileId: profiles[0].id });
        }
      } else {
        logStep("No profile found for email, user needs to sign up", { email: customerEmail });
      }

      // Store the email in localStorage via response so frontend can use it
      return new Response(JSON.stringify({ 
        success: true, 
        email: customerEmail,
        paymentStatus: session.payment_status,
        message: "Payment verified! Please sign in with the email you used for payment."
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    return new Response(JSON.stringify({ 
      success: false, 
      paymentStatus: session.payment_status 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in verify-payment-session", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
