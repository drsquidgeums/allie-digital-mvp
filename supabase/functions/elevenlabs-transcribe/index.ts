import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { decode as base64Decode } from "https://deno.land/std@0.168.0/encoding/base64.ts";
import { checkAndTrackUsage, getUsageLimitResponse, trackUsage } from "../_shared/ai-usage.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const getAudioFilename = (mimeType: string) => {
  if (mimeType.includes("mp4") || mimeType.includes("m4a")) return "speech.m4a";
  if (mimeType.includes("mpeg") || mimeType.includes("mp3")) return "speech.mp3";
  if (mimeType.includes("wav")) return "speech.wav";
  if (mimeType.includes("ogg")) return "speech.ogg";
  return "speech.webm";
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
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

    console.log("[ELEVENLABS-TRANSCRIBE] Request from user:", user.id);

    const body = await req.json().catch(() => ({}));
    const audioBase64 = (body as any)?.audioBase64;
    const mimeType = (body as any)?.mimeType;

    if (!audioBase64 || typeof audioBase64 !== "string") {
      return new Response(JSON.stringify({ error: "audioBase64 is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const safeMimeType = typeof mimeType === "string" && mimeType.length < 100 ? mimeType : "audio/webm";

    if (audioBase64.length > 11_000_000) {
      return new Response(JSON.stringify({ error: "Audio clip is too large" }), {
        status: 413,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check usage and get user's own key if available
    const usageResult = await checkAndTrackUsage(user.id, "elevenlabs-transcribe", { track: false });
    if (!usageResult.allowed) {
      return getUsageLimitResponse(0, "ElevenLabs");
    }

    const elevenLabsApiKey = usageResult.userApiKey ?? Deno.env.get("ELEVENLABS_API_KEY");
    if (!elevenLabsApiKey) {
      throw new Error("ELEVENLABS_API_KEY is not configured");
    }

    const bytes = base64Decode(audioBase64);
    const blob = new Blob([bytes], { type: safeMimeType });
    const file = new File([blob], getAudioFilename(safeMimeType), { type: safeMimeType });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("model_id", "scribe_v2");
    formData.append("diarize", "false");
    formData.append("tag_audio_events", "false");

    console.log("[ELEVENLABS-TRANSCRIBE] bytes:", bytes.length, "type:", safeMimeType, "usingOwnKey:", usageResult.usingOwnKey);

    const response = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
      method: "POST",
      headers: {
        "xi-api-key": elevenLabsApiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      const t = await response.text();
      console.error("[ELEVENLABS-TRANSCRIBE] error:", response.status, t);
      return new Response(JSON.stringify({ error: t || `Transcription failed: ${response.status}` }), {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const text = typeof data?.text === "string" ? data.text : "";

    await trackUsage(user.id, "elevenlabs-transcribe", usageResult.usageSource);

    return new Response(JSON.stringify({ text }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[ELEVENLABS-TRANSCRIBE] error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
