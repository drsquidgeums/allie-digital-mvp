import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { checkAndTrackUsage, getUsageLimitResponse, trackUsage } from "../_shared/ai-usage.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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

    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid authentication" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Request from user:", user.id);

    const usageResult = await checkAndTrackUsage(user.id, "elevenlabs-session", { track: false });
    if (!usageResult.allowed) {
      return getUsageLimitResponse(0, "ElevenLabs");
    }

    const defaultAgentId = Deno.env.get("ELEVENLABS_AGENT_ID");
    if (!defaultAgentId) {
      throw new Error("ELEVENLABS_AGENT_ID is not configured");
    }

    const elevenLabsApiKey = usageResult.userApiKey ?? Deno.env.get("ELEVENLABS_API_KEY");
    if (!elevenLabsApiKey) {
      throw new Error("ELEVENLABS_API_KEY is not configured");
    }

    console.log("Requesting ElevenLabs session for default agent", {
      usingOwnKey: usageResult.usingOwnKey,
    });

    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${encodeURIComponent(defaultAgentId)}`,
      {
        method: "GET",
        headers: {
          "xi-api-key": elevenLabsApiKey,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ElevenLabs API error:", response.status, errorText);

      if (response.status === 401) {
        throw new Error("ElevenLabs authentication failed. Please check the API key.");
      }

      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const data = await response.json();
    await trackUsage(user.id, "elevenlabs-session", usageResult.usageSource);

    console.log("ElevenLabs session created successfully");

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in elevenlabs-session function:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
