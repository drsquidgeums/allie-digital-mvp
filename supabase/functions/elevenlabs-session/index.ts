import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { checkAndTrackUsage, getUsageLimitResponse } from "../_shared/ai-usage.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const rawBody = req.method === "POST" ? await req.text() : "";
    let mode: "session" | "track" = "session";

    if (rawBody) {
      try {
        const parsedBody = JSON.parse(rawBody);

        if (parsedBody?.mode === "track") {
          mode = "track";
        } else if (parsedBody?.mode && parsedBody.mode !== "session") {
          return new Response(JSON.stringify({ error: "Invalid mode" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      } catch {
        return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

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

    console.log("Request from user:", user.id, { mode });

    if (mode === "track") {
      const usageResult = await checkAndTrackUsage(user.id, "elevenlabs-session");
      if (!usageResult.allowed) {
        return getUsageLimitResponse(0, "ElevenLabs");
      }

      console.log("Tracked successful ElevenLabs conversation", {
        userId: user.id,
        usingOwnKey: usageResult.usingOwnKey,
      });

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check credits but do NOT track yet — only track after a successful client connection
    const usageResult = await checkAndTrackUsage(user.id, "elevenlabs-session", { track: false });
    if (!usageResult.allowed) {
      return getUsageLimitResponse(0, "ElevenLabs");
    }

    const agentId = Deno.env.get("ELEVENLABS_AGENT_ID");
    if (!agentId) {
      throw new Error("ELEVENLABS_AGENT_ID is not configured");
    }

    const elevenLabsApiKey = usageResult.userApiKey ?? Deno.env.get("ELEVENLABS_API_KEY");
    if (!elevenLabsApiKey) {
      throw new Error("ELEVENLABS_API_KEY is not configured");
    }

    console.log("Requesting ElevenLabs conversation credentials for agent:", agentId, {
      usingOwnKey: usageResult.usingOwnKey,
    });

    const headers = {
      "xi-api-key": elevenLabsApiKey,
    };
    const encodedAgentId = encodeURIComponent(agentId);
    const [tokenResult, signedUrlResult] = await Promise.allSettled([
      fetch(
        `https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=${encodedAgentId}`,
        {
          method: "GET",
          headers,
        }
      ),
      fetch(
        `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${encodedAgentId}`,
        {
          method: "GET",
          headers,
        }
      ),
    ]);

    let conversationToken: string | null = null;
    let signedUrl: string | null = null;

    if (tokenResult.status === "fulfilled") {
      if (tokenResult.value.ok) {
        const data = await tokenResult.value.json();
        conversationToken = data?.token ?? null;
      } else {
        const errorText = await tokenResult.value.text();
        console.error("ElevenLabs token API error:", tokenResult.value.status, errorText);

        if (tokenResult.value.status === 401) {
          throw new Error(
            "ElevenLabs authentication failed. Please check the ELEVENLABS_API_KEY secret in Supabase."
          );
        }
      }
    } else {
      console.error("Failed to request ElevenLabs conversation token:", tokenResult.reason);
    }

    if (signedUrlResult.status === "fulfilled") {
      if (signedUrlResult.value.ok) {
        const data = await signedUrlResult.value.json();
        signedUrl = data?.signed_url ?? null;
      } else {
        const errorText = await signedUrlResult.value.text();
        console.warn("ElevenLabs signed URL API error:", signedUrlResult.value.status, errorText);
      }
    } else {
      console.warn("Failed to request ElevenLabs signed URL:", signedUrlResult.reason);
    }

    if (!conversationToken && !signedUrl) {
      throw new Error("No voice session credentials received from ElevenLabs");
    }

    console.log("ElevenLabs conversation credentials created successfully", {
      hasConversationToken: Boolean(conversationToken),
      hasSignedUrl: Boolean(signedUrl),
    });

    return new Response(
      JSON.stringify({ conversation_token: conversationToken, signed_url: signedUrl, agent_id: agentId }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
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
