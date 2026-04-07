import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { encryptApiKey } from "../_shared/crypto.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PROVIDER_LIMITS: Record<string, number> = {
  openai: 25,
  elevenlabs: 10,
};

// Map feature names to their provider
const FEATURE_PROVIDER_MAP: Record<string, string> = {
  "simplify-text": "openai",
  "document-ai-chat": "openai",
  "content-enhancer": "openai",
  "study-buddy-chat": "openai",
  "task-ai-suggestions": "openai",
  "mindmap-ai": "openai",
  "voice-chat": "openai",
  "progress-ai-insights": "openai",
  "elevenlabs-tts": "elevenlabs",
  "elevenlabs-tts-public": "elevenlabs",
  "elevenlabs-transcribe": "elevenlabs",
  "elevenlabs-session": "elevenlabs",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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

    const body = await req.json();
    const { action, provider, apiKey } = body;

    if (action === "get-usage") {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      // Get all usage records this month
      const { data: usageRecords } = await supabaseClient
        .from("ai_feature_usage")
        .select("feature_name, usage_data")
        .eq("user_id", user.id)
        .gte("created_at", monthStart);

      // Count usage per provider
      const providerUsage: Record<string, number> = { openai: 0, elevenlabs: 0 };
      for (const record of usageRecords ?? []) {
        const source = (record.usage_data as any)?.source;
        if (source === "user_key") continue; // Don't count BYOK usage against limits
        const prov = FEATURE_PROVIDER_MAP[record.feature_name] || "openai";
        providerUsage[prov] = (providerUsage[prov] || 0) + 1;
      }

      // Check which providers user has own keys for
      const { data: keys } = await supabaseClient
        .from("user_api_keys")
        .select("provider")
        .eq("user_id", user.id);

      const ownKeyProviders = keys?.map(k => k.provider) ?? [];

      const providers = Object.entries(PROVIDER_LIMITS).map(([name, limit]) => ({
        name,
        used: providerUsage[name] || 0,
        limit,
        remaining: Math.max(0, limit - (providerUsage[name] || 0)),
        hasOwnKey: ownKeyProviders.includes(name),
      }));

      // Also return legacy flat format for backward compat
      const totalUsed = Object.values(providerUsage).reduce((a, b) => a + b, 0);
      const totalLimit = Object.values(PROVIDER_LIMITS).reduce((a, b) => a + b, 0);

      return new Response(JSON.stringify({
        used: totalUsed,
        limit: totalLimit,
        hasOwnKey: ownKeyProviders.length > 0,
        providers: ownKeyProviders,
        byProvider: providers,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "save") {
      if (!provider || !apiKey || typeof apiKey !== "string") {
        return new Response(JSON.stringify({ error: "Provider and API key are required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (!["openai", "elevenlabs"].includes(provider)) {
        return new Response(JSON.stringify({ error: "Invalid provider" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const trimmedKey = apiKey.trim();
      if (trimmedKey.length < 10 || trimmedKey.length > 200) {
        return new Response(JSON.stringify({ error: "Invalid API key format" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Encrypt the API key before storing
      const encryptedKey = await encryptApiKey(trimmedKey);

      const { error } = await supabaseClient
        .from("user_api_keys")
        .upsert({
          user_id: user.id,
          provider,
          api_key: encryptedKey,
        }, { onConflict: "user_id,provider" });

      if (error) {
        console.error("Error saving API key:", error);
        return new Response(JSON.stringify({ error: "Failed to save API key" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "delete") {
      if (!provider) {
        return new Response(JSON.stringify({ error: "Provider is required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      await supabaseClient
        .from("user_api_keys")
        .delete()
        .eq("user_id", user.id)
        .eq("provider", provider);

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("manage-api-keys error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
