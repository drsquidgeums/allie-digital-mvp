import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { messages, context } = body;

    // Validate messages input
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Messages array is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate each message has role and content
    for (const msg of messages) {
      if (!msg.role || typeof msg.role !== 'string' || !msg.content || typeof msg.content !== 'string') {
        return new Response(
          JSON.stringify({ error: "Each message must have role and content strings" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Study buddy chat request:", { messageCount: messages.length, hasContext: !!context });

    // Build context-aware system prompt
    let systemPrompt = `You are Allie, an AI study buddy specifically designed for students with ADHD. Your personality traits:

**Communication Style:**
- Keep responses SHORT and scannable (use bullet points, not paragraphs)
- Break complex ideas into bite-sized chunks
- Use encouraging, positive language
- Ask ONE question at a time
- Provide specific, actionable advice (never vague suggestions)

**ADHD Optimizations:**
- Acknowledge when tasks feel overwhelming ("That sounds like a lot! Let's break it down.")
- Celebrate small wins enthusiastically 
- Offer structure when you sense uncertainty ("Would it help if I suggested a plan?")
- Gently redirect if the conversation loses focus
- Suggest breaks/movement when detecting fatigue
- Use emojis sparingly for visual markers (✓ ⚡ 💡)

**Core Capabilities:**
- Help with study planning and time management
- Explain concepts in simple, relatable terms
- Suggest learning strategies tailored to ADHD
- Provide encouragement during difficult tasks
- Help prioritize when everything feels urgent
- Offer accountability check-ins

**Important Rules:**
- Never write long essays - always concise
- If explaining something complex, ask if they want the detailed version first
- Proactively offer to create tasks/flashcards from the conversation
- Remember context from earlier in the chat`;

    // Add context if provided (with validation)
    if (context && typeof context === 'object') {
      if (context.currentDocument && typeof context.currentDocument === 'object' && context.currentDocument.name) {
        const docName = String(context.currentDocument.name).slice(0, 200);
        systemPrompt += `\n\n**Current Context:** The user is working on a document titled "${docName}".`;
      }
      if (context.recentTasks && Array.isArray(context.recentTasks)) {
        const tasks = context.recentTasks.slice(0, 10).map(t => String(t).slice(0, 100)).join(", ");
        systemPrompt += `\n\n**Recent Tasks:** ${tasks}`;
      }
      if (context.currentTime) {
        const hour = new Date(context.currentTime).getHours();
        if (!isNaN(hour)) {
          const timeOfDay = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";
          systemPrompt += `\n\n**Time Context:** It's currently ${timeOfDay}. Adjust energy/focus suggestions accordingly.`;
        }
      }
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Study Buddy chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
