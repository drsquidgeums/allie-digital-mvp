import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Get user from Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseClient = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      console.error('Auth error:', userError);
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { taskText, taskId, category } = await req.json();

    if (!taskText) {
      throw new Error('Task text is required');
    }

    console.log('Breaking down task:', taskText);

    // Call Lovable AI Gateway
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are an expert task breakdown assistant. Break down tasks into 3-5 actionable subtasks that are specific, measurable, and achievable. Each subtask should be clear and focused.`
          },
          {
            role: 'user',
            content: `Break down this task into smaller, actionable subtasks: "${taskText}"`
          }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'breakdown_task',
              description: 'Break down a task into smaller subtasks',
              parameters: {
                type: 'object',
                properties: {
                  subtasks: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        title: { type: 'string', description: 'Clear, actionable subtask title' },
                        description: { type: 'string', description: 'Brief description of what needs to be done' },
                        estimatedTime: { type: 'string', description: 'Estimated time to complete (e.g., "15 min", "1 hour")' },
                        priority: { type: 'string', enum: ['low', 'medium', 'high'] }
                      },
                      required: ['title', 'description', 'estimatedTime', 'priority'],
                      additionalProperties: false
                    },
                    minItems: 3,
                    maxItems: 5
                  },
                  reasoning: {
                    type: 'string',
                    description: 'Brief explanation of the breakdown approach'
                  }
                },
                required: ['subtasks', 'reasoning'],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'breakdown_task' } }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI Gateway error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits depleted. Please add credits to your workspace.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      throw new Error('AI generation failed');
    }

    const aiData = await aiResponse.json();
    console.log('AI response:', JSON.stringify(aiData));

    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error('No tool call in AI response');
    }

    const breakdown = JSON.parse(toolCall.function.arguments);

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Save to database
    const { data: savedBreakdown, error: saveError } = await supabase
      .from('ai_task_breakdowns')
      .insert({
        user_id: user.id,
        task_id: taskId,
        original_task_text: taskText,
        breakdown: breakdown
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving breakdown:', saveError);
      throw saveError;
    }

    // Track usage
    await supabase.from('ai_feature_usage').insert({
      user_id: user.id,
      feature_name: 'task_breakdown',
      usage_data: { task_id: taskId, category }
    });

    console.log('Task breakdown completed successfully');

    return new Response(JSON.stringify({ breakdown, id: savedBreakdown.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-task-breakdown:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
