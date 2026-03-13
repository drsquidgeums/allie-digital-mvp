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
    const usageResult = await checkAndTrackUsage(user.id, "mindmap-ai");
    if (!usageResult.allowed) {
      return getUsageLimitResponse(0);
    }

    const body = await req.json();
    const { type, topic, nodeLabel, existingNodes } = body;

    if (!type || typeof type !== 'string' || !['generate', 'expand'].includes(type)) {
      return new Response(JSON.stringify({ error: "Type must be 'generate' or 'expand'" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (type === 'generate' && (!topic || typeof topic !== 'string')) {
      return new Response(JSON.stringify({ error: "Topic is required for generate type" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (type === 'expand' && (!nodeLabel || typeof nodeLabel !== 'string')) {
      return new Response(JSON.stringify({ error: "Node label is required for expand type" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const sanitizedTopic = topic ? String(topic).slice(0, 500) : '';
    const sanitizedNodeLabel = nodeLabel ? String(nodeLabel).slice(0, 200) : '';
    const sanitizedExistingNodes = existingNodes && Array.isArray(existingNodes)
      ? existingNodes.slice(0, 50).map(n => String(n).slice(0, 100))
      : [];

    const aiConfig = getAIRequestConfig(usageResult.userApiKey);
    console.log("Mindmap AI, using own key:", usageResult.usingOwnKey);

    let systemPrompt = '';
    let userPrompt = '';

    if (type === 'generate') {
      systemPrompt = 'You are an expert mind map creator. Generate comprehensive, well-structured mind maps.';
      userPrompt = `Create a mind map structure for: "${sanitizedTopic}". Return a hierarchical structure with a central idea and 4-6 main branches, each with 2-4 sub-branches.`;
    } else {
      systemPrompt = 'You are an expert at expanding ideas. Generate relevant subtopics.';
      userPrompt = `Expand on: "${sanitizedNodeLabel}". Context: ${sanitizedExistingNodes.length > 0 ? `Existing nodes: ${sanitizedExistingNodes.join(', ')}` : 'New mind map'}. Suggest 3-5 child nodes.`;
    }

    const response = await fetch(aiConfig.url, {
      method: 'POST',
      headers: aiConfig.headers,
      body: JSON.stringify({
        model: aiConfig.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        tools: [{
          type: 'function',
          function: {
            name: type === 'generate' ? 'create_mindmap' : 'expand_node',
            description: type === 'generate' ? 'Generate a complete mind map structure' : 'Generate child nodes for expansion',
            parameters: {
              type: 'object',
              properties: type === 'generate' ? {
                central_topic: { type: 'string' },
                branches: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      label: { type: 'string' },
                      children: { type: 'array', items: { type: 'string' } }
                    },
                    required: ['label', 'children']
                  }
                }
              } : {
                suggestions: { type: 'array', items: { type: 'string' } }
              },
              required: type === 'generate' ? ['central_topic', 'branches'] : ['suggestions']
            }
          }
        }],
        tool_choice: { type: 'function', function: { name: type === 'generate' ? 'create_mindmap' : 'expand_node' } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded.' }), {
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits depleted.' }), {
          status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error('AI error:', response.status, errorText);
      throw new Error(`AI error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error('No tool call in AI response');

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in mindmap-ai:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
