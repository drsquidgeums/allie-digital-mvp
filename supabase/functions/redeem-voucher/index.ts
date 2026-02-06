import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, email, password } = await req.json();

    console.log("Voucher redemption attempt:", { code, email });

    if (!code || !email || !password) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: code, email, and password" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Create admin client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // 1. Check if voucher exists and is valid
    const { data: voucher, error: voucherError } = await supabaseAdmin
      .from("vouchers")
      .select("*")
      .eq("code", code.toUpperCase().trim())
      .single();

    if (voucherError || !voucher) {
      console.log("Voucher not found:", code);
      return new Response(
        JSON.stringify({ error: "Invalid voucher code" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // 2. Check if voucher is already used
    if (voucher.is_used) {
      console.log("Voucher already used:", code);
      return new Response(
        JSON.stringify({ error: "This voucher has already been redeemed" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // 3. Check if voucher is expired
    if (voucher.expires_at && new Date(voucher.expires_at) < new Date()) {
      console.log("Voucher expired:", code);
      return new Response(
        JSON.stringify({ error: "This voucher has expired" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // 4. Check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(u => u.email?.toLowerCase() === email.toLowerCase());
    
    if (existingUser) {
      console.log("User already exists:", email);
      return new Response(
        JSON.stringify({ error: "An account with this email already exists. Please sign in instead." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // 5. Create the user account
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // Auto-confirm email for voucher users
    });

    if (createError || !newUser.user) {
      console.error("Error creating user:", createError);
      return new Response(
        JSON.stringify({ error: createError?.message || "Failed to create account" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    console.log("User created:", newUser.user.id);

    // 6. Update the user's profile to lifetime status
    // Wait a moment for the profile trigger to create the profile
    await new Promise(resolve => setTimeout(resolve, 500));

    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .update({ subscription_status: "lifetime" })
      .eq("id", newUser.user.id);

    if (profileError) {
      console.error("Error updating profile:", profileError);
      // Don't fail the whole operation, profile can be updated later
    }

    // 7. Mark the voucher as used
    const { error: updateError } = await supabaseAdmin
      .from("vouchers")
      .update({
        is_used: true,
        used_by: newUser.user.id,
        used_at: new Date().toISOString(),
      })
      .eq("id", voucher.id);

    if (updateError) {
      console.error("Error updating voucher:", updateError);
      // Don't fail - user is already created with access
    }

    console.log("Voucher redeemed successfully:", { code, userId: newUser.user.id });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Account created with lifetime access! You can now sign in." 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );

  } catch (error) {
    console.error("Voucher redemption error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unexpected error occurred" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
