import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { checkAndTrackUsage, getUsageLimitResponse, getAIRequestConfig } from "../_shared/ai-usage.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    if (token === anonKey) {
      return new Response(JSON.stringify({ error: "User authentication required" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
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
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check usage limits
    const usageResult = await checkAndTrackUsage(user.id, "simplify-text");
    if (!usageResult.allowed) {
      return getUsageLimitResponse(0);
    }

    const { text } = await req.json();
    if (!text || typeof text !== 'string') {
      return new Response(JSON.stringify({ error: "Text is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const sanitizedText = text.trim().slice(0, 3000);
    if (sanitizedText.length === 0) {
      return new Response(JSON.stringify({ error: "Text cannot be empty" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiConfig = getAIRequestConfig(usageResult.userApiKey);
    console.log("Simplifying text, using own key:", usageResult.usingOwnKey);

    const response = await fetch(aiConfig.url, {
      method: "POST",
      headers: aiConfig.headers,
      body: JSON.stringify({
        model: aiConfig.model,
        messages: [
          {
            role: "system",
            content: `You are a text simplification assistant designed for users with ADHD and reading difficulties. Your task is to rewrite text to be easier to read and understand.

Rules:
- Replace complex vocabulary with simpler, everyday words
- Break long sentences into shorter ones
- Keep the original meaning intact
- Maintain the same tone (formal/informal)
- Keep proper nouns, names, and technical terms that are necessary
- Return ONLY the simplified text, no explanations or commentary
- Preserve paragraph structure`
          },
          { role: "user", content: `Simplify this text:\n\n${sanitizedText}` }
        ],
        max_tokens: 2000,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI error:", response.status, errorText);
      throw new Error("Failed to simplify text");
    }

    const data = await response.json();
    const simplifiedText = data.choices?.[0]?.message?.content || "";

    return new Response(JSON.stringify({
      simplifiedText,
      remaining: usageResult.remaining,
      usingOwnKey: usageResult.usingOwnKey,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in simplify-text function:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
