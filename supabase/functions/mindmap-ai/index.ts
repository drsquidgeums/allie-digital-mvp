import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, topic, nodeLabel, existingNodes } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    let systemPrompt = '';
    let userPrompt = '';

    if (type === 'generate') {
      systemPrompt = 'You are an expert mind map creator. Generate comprehensive, well-structured mind maps with main topics and subtopics.';
      userPrompt = `Create a mind map structure for the topic: "${topic}". Return a hierarchical structure with a central idea and 4-6 main branches, each with 2-4 sub-branches.`;
    } else if (type === 'expand') {
      systemPrompt = 'You are an expert at expanding ideas. Generate relevant subtopics and related concepts.';
      userPrompt = `Expand on this mind map node: "${nodeLabel}". Context: ${existingNodes ? `Existing nodes: ${existingNodes.join(', ')}` : 'New mind map'}. Suggest 3-5 relevant child nodes or related concepts.`;
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        tools: [{
          type: 'function',
          function: {
            name: type === 'generate' ? 'create_mindmap' : 'expand_node',
            description: type === 'generate' 
              ? 'Generate a complete mind map structure'
              : 'Generate child nodes for expansion',
            parameters: {
              type: 'object',
              properties: type === 'generate' ? {
                central_topic: { type: 'string', description: 'The main central topic' },
                branches: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      label: { type: 'string', description: 'Branch label' },
                      children: {
                        type: 'array',
                        items: { type: 'string' },
                        description: 'Sub-branch labels'
                      }
                    },
                    required: ['label', 'children']
                  }
                }
              } : {
                suggestions: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'List of suggested child nodes'
                }
              },
              required: type === 'generate' ? ['central_topic', 'branches'] : ['suggestions']
            }
          }
        }],
        tool_choice: { 
          type: 'function', 
          function: { name: type === 'generate' ? 'create_mindmap' : 'expand_node' } 
        }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Payment required. Please add credits to your workspace.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI Response:', JSON.stringify(data, null, 2));

    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error('No tool call in AI response');
    }

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in mindmap-ai function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
