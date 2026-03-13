import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { checkAndTrackUsage, getUsageLimitResponse, getAIRequestConfig } from "../_shared/ai-usage.ts";

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
    const usageResult = await checkAndTrackUsage(user.id, "study-buddy-chat");
    if (!usageResult.allowed) {
      return getUsageLimitResponse(0);
    }

    const body = await req.json();
    const { messages, context } = body;

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Messages array is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    for (const msg of messages) {
      if (!msg.role || typeof msg.role !== 'string' || !msg.content || typeof msg.content !== 'string') {
        return new Response(JSON.stringify({ error: "Each message must have role and content strings" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const aiConfig = getAIRequestConfig(usageResult.userApiKey);
    console.log("Study buddy chat, using own key:", usageResult.usingOwnKey);

    let systemPrompt = `You are Allie, an AI study buddy specifically designed for students with ADHD. Your personality traits:

**Communication Style:**
- Keep responses SHORT and scannable (use bullet points, not paragraphs)
- Break complex ideas into bite-sized chunks
- Use encouraging, positive language
- Ask ONE question at a time
- Provide specific, actionable advice

**ADHD Optimizations:**
- Acknowledge when tasks feel overwhelming
- Celebrate small wins enthusiastically 
- Offer structure when you sense uncertainty
- Gently redirect if the conversation loses focus
- Suggest breaks/movement when detecting fatigue
- Use emojis sparingly for visual markers (✓ ⚡ 💡)

**Core Capabilities:**
- Help with study planning and time management
- Explain concepts in simple, relatable terms
- Suggest learning strategies tailored to ADHD
- Provide encouragement during difficult tasks
- Help prioritize when everything feels urgent

**Important Rules:**
- Never write long essays - always concise
- If explaining something complex, ask if they want the detailed version first
- Remember context from earlier in the chat`;

    if (context && typeof context === 'object') {
      if (context.currentDocument && typeof context.currentDocument === 'object' && context.currentDocument.name) {
        systemPrompt += `\n\n**Current Context:** Working on "${String(context.currentDocument.name).slice(0, 200)}".`;
      }
      if (context.recentTasks && Array.isArray(context.recentTasks)) {
        const tasks = context.recentTasks.slice(0, 10).map(t => String(t).slice(0, 100)).join(", ");
        systemPrompt += `\n\n**Recent Tasks:** ${tasks}`;
      }
      if (context.currentTime) {
        const hour = new Date(context.currentTime).getHours();
        if (!isNaN(hour)) {
          const timeOfDay = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";
          systemPrompt += `\n\n**Time Context:** It's ${timeOfDay}.`;
        }
      }
    }

    const response = await fetch(aiConfig.url, {
      method: "POST",
      headers: aiConfig.headers,
      body: JSON.stringify({
        model: aiConfig.model,
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        stream: true,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded." }), {
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
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Study Buddy chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
