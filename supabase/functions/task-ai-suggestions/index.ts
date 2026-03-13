import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const usageResult = await checkAndTrackUsage(user.id, "task-ai-suggestions");
    if (!usageResult.allowed) {
      return getUsageLimitResponse(0);
    }

    const body = await req.json();
    const { type, context } = body;

    if (!type || typeof type !== 'string' || !['suggest', 'schedule', 'optimize'].includes(type)) {
      return new Response(JSON.stringify({ error: "Type must be 'suggest', 'schedule', or 'optimize'" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const sanitizedContext = context && typeof context === 'string' ? context.slice(0, 5000) : '';

    const aiConfig = getAIRequestConfig(usageResult.userApiKey);
    console.log("Task AI, using own key:", usageResult.usingOwnKey);

    let systemPrompt = "";
    let userPrompt = "";

    if (type === "suggest") {
      systemPrompt = "You are a study planning AI assistant. Suggest actionable study tasks.";
      userPrompt = sanitizedContext || "Suggest 5 study tasks for a college student preparing for exams.";
    } else if (type === "schedule") {
      systemPrompt = "You are a study schedule optimizer. Create realistic, balanced study schedules.";
      userPrompt = sanitizedContext || "Create a study schedule for the next 7 days.";
    } else if (type === "optimize") {
      systemPrompt = "You are a productivity optimizer. Analyze existing tasks and suggest improvements.";
      userPrompt = `Current tasks: ${sanitizedContext}. Suggest how to prioritize and optimize these tasks.`;
    }

    const requestBody: any = {
      model: aiConfig.model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
    };

    if (type === "suggest") {
      requestBody.tools = [{
        type: "function",
        function: {
          name: "suggest_tasks",
          description: "Return 3-5 actionable task suggestions.",
          parameters: {
            type: "object",
            properties: {
              suggestions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    priority: { type: "string", enum: ["low", "medium", "high"] },
                    category: { type: "string" }
                  },
                  required: ["title", "priority", "category"], additionalProperties: false
                }
              }
            },
            required: ["suggestions"], additionalProperties: false
          }
        }
      }];
      requestBody.tool_choice = { type: "function", function: { name: "suggest_tasks" } };
    }

    const response = await fetch(aiConfig.url, {
      method: "POST",
      headers: aiConfig.headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI error:", response.status, errorText);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits depleted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI error: ${response.status}`);
    }

    const data = await response.json();
    let result;
    if (type === "suggest" && data.choices?.[0]?.message?.tool_calls?.[0]) {
      result = JSON.parse(data.choices[0].message.tool_calls[0].function.arguments);
    } else {
      result = { content: data.choices?.[0]?.message?.content || "No response generated" };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in task-ai-suggestions:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
