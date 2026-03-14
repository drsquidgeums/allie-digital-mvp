import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-PAYMENT] ${step}${detailsStr}`);
};

const TRIAL_DAYS = 7;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Check if user is an admin - admins bypass payment
    const { data: adminRole } = await supabaseClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single();

    if (adminRole) {
      logStep("User is admin, bypassing payment check");
      return new Response(JSON.stringify({ 
        hasPaid: true, 
        subscriptionStatus: "admin" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Fetch profile
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("subscription_status, trial_started_at")
      .eq("id", user.id)
      .single();

    // Lifetime access
    if (profile?.subscription_status === "lifetime") {
      logStep("User has lifetime access");
      return new Response(JSON.stringify({ 
        hasPaid: true, 
        subscriptionStatus: "lifetime" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Trial check
    if (profile?.subscription_status === "trial" && profile?.trial_started_at) {
      const trialStart = new Date(profile.trial_started_at);
      const now = new Date();
      // Use calendar days (UTC) so the countdown ticks over at midnight, not after exactly 24h
      const startDay = Date.UTC(trialStart.getUTCFullYear(), trialStart.getUTCMonth(), trialStart.getUTCDate());
      const todayDay = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
      const calendarDaysElapsed = Math.floor((todayDay - startDay) / (1000 * 60 * 60 * 24));
      const daysRemaining = Math.max(0, TRIAL_DAYS - calendarDaysElapsed);
      
      if (calendarDaysElapsed < TRIAL_DAYS) {
        logStep("User is in active trial", { daysRemaining });
        return new Response(JSON.stringify({ 
          hasPaid: true, 
          subscriptionStatus: "trial",
          trialActive: true,
          trialDaysRemaining: daysRemaining,
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      } else {
        logStep("Trial expired", { diffDays });
        // Trial expired - check Stripe as fallback
      }
    }

    // Check Stripe for payment (fallback for expired trial or inactive users)
    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      logStep("No Stripe customer found, trial expired or inactive");
      return new Response(JSON.stringify({ 
        hasPaid: false,
        subscriptionStatus: profile?.subscription_status || "inactive",
        trialActive: false,
        trialExpired: profile?.subscription_status === "trial",
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    const paymentIntents = await stripe.paymentIntents.list({
      customer: customerId,
      limit: 100,
    });

    const hasSuccessfulPayment = paymentIntents.data.some(
      (pi) => pi.status === "succeeded"
    );

    if (hasSuccessfulPayment) {
      logStep("User has successful payment, updating profile");
      
      await supabaseClient
        .from("profiles")
        .update({ subscription_status: "lifetime" })
        .eq("id", user.id);

      await supabaseClient
        .from("stripe_subscriptions")
        .upsert({
          user_id: user.id,
          stripe_customer_id: customerId,
        }, { onConflict: 'user_id' });

      return new Response(JSON.stringify({ 
        hasPaid: true, 
        subscriptionStatus: "lifetime" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    logStep("No successful payment found");
    return new Response(JSON.stringify({ 
      hasPaid: false,
      subscriptionStatus: profile?.subscription_status || "inactive",
      trialActive: false,
      trialExpired: profile?.subscription_status === "trial",
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-payment", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
