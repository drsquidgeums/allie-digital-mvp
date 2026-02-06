import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    // Parse request body for email (for signup flow)
    const body = await req.json().catch(() => ({}));
    const { email: providedEmail } = body;

    // Input validation
    if (providedEmail) {
      if (typeof providedEmail !== 'string') {
        throw new Error("Email must be a string");
      }
      if (providedEmail.length > 254) {
        throw new Error("Email is too long");
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(providedEmail)) {
        throw new Error("Invalid email format");
      }
    }

    const sanitizedEmail = providedEmail ? providedEmail.trim().toLowerCase().slice(0, 254) : null;

    if (!sanitizedEmail) {
      throw new Error("Email is required for payment");
    }

    logStep("Processing payment for email", { email: sanitizedEmail });

    // Create Supabase admin client to check existing accounts
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Check if email already has an account with lifetime access
    const { data: existingProfile } = await supabaseAdmin
      .from("profiles")
      .select("id, subscription_status")
      .eq("email", sanitizedEmail)
      .single();

    if (existingProfile) {
      if (existingProfile.subscription_status === "lifetime") {
        logStep("User already has lifetime access", { email: sanitizedEmail });
        return new Response(JSON.stringify({ 
          error: "ALREADY_PAID",
          message: "This email already has lifetime access. Please sign in instead."
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      } else {
        // Account exists but hasn't paid - allow payment but warn
        logStep("Existing account without payment", { email: sanitizedEmail });
      }
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Check if customer already exists in Stripe with a successful payment
    const customers = await stripe.customers.list({ email: sanitizedEmail, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing Stripe customer found", { customerId });

      // Check if this customer already has a successful payment
      const paymentIntents = await stripe.paymentIntents.list({
        customer: customerId,
        limit: 10,
      });

      const hasSuccessfulPayment = paymentIntents.data.some(
        (pi) => pi.status === "succeeded"
      );

      if (hasSuccessfulPayment) {
        logStep("Customer already has successful payment", { customerId });
        return new Response(JSON.stringify({ 
          error: "ALREADY_PAID",
          message: "This email has already paid. Please sign in or reset your password."
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }
    }

    // Create checkout session for one-time payment
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : sanitizedEmail,
      line_items: [
        {
          price: "price_1SnHUGI6zpynUGIHog1UzIhu", // £30 Lifetime Access
          quantity: 1,
        },
      ],
      mode: "payment",
      allow_promotion_codes: true,
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}&email=${encodeURIComponent(sanitizedEmail)}`,
      cancel_url: `${req.headers.get("origin")}/payment-canceled`,
      metadata: {
        email: sanitizedEmail,
      },
    });

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-payment", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});