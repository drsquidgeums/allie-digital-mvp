import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { decode as base64Decode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

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
    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");
    if (!ELEVENLABS_API_KEY) {
      throw new Error("ELEVENLABS_API_KEY is not configured");
    }

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

    // Guardrail: roughly cap to ~8MB base64 payload (base64 overhead ~1.33)
    if (audioBase64.length > 11_000_000) {
      return new Response(JSON.stringify({ error: "Audio clip is too large" }), {
        status: 413,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const bytes = base64Decode(audioBase64);
    const blob = new Blob([bytes], { type: safeMimeType });
    const file = new File([blob], "speech.webm", { type: safeMimeType });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("model_id", "scribe_v2");
    formData.append("diarize", "false");
    formData.append("tag_audio_events", "false");

    console.log("[ELEVENLABS-TRANSCRIBE] bytes:", bytes.length, "type:", safeMimeType);

    const response = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
      },
      body: formData,
    });

    if (!response.ok) {
      const t = await response.text();
      console.error("[ELEVENLABS-TRANSCRIBE] error:", response.status, t);
      return new Response(JSON.stringify({ error: `Transcription failed: ${response.status}` }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const text = typeof data?.text === "string" ? data.text : "";

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
