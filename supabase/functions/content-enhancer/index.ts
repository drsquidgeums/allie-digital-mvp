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
    const usageResult = await checkAndTrackUsage(user.id, "content-enhancer");
    if (!usageResult.allowed) {
      return getUsageLimitResponse(0);
    }

    const reqBody = await req.json();
    const { type, documentContent } = reqBody;

    if (!type || typeof type !== 'string' || !['flashcards', 'quiz', 'practice'].includes(type)) {
      return new Response(JSON.stringify({ error: "Invalid type" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!documentContent || typeof documentContent !== 'string') {
      return new Response(JSON.stringify({ error: "Document content is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const sanitizedContent = documentContent.slice(0, 100000);
    const aiConfig = getAIRequestConfig(usageResult.userApiKey);
    console.log("Content enhancer, using own key:", usageResult.usingOwnKey);

    let systemPrompt = "";
    let body: any = { model: aiConfig.model, messages: [] };

    if (type === "flashcards") {
      systemPrompt = "You are an expert educational content creator. Generate comprehensive flashcards from the provided document content.";
      body.messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Generate 8-12 flashcards from this content:\n\n${sanitizedContent}` }
      ];
      body.tools = [{
        type: "function",
        function: {
          name: "generate_flashcards",
          description: "Generate educational flashcards from document content",
          parameters: {
            type: "object",
            properties: {
              flashcards: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    front: { type: "string" }, back: { type: "string" }, category: { type: "string" }
                  },
                  required: ["front", "back", "category"], additionalProperties: false
                }
              }
            },
            required: ["flashcards"], additionalProperties: false
          }
        }
      }];
      body.tool_choice = { type: "function", function: { name: "generate_flashcards" } };
    } else if (type === "quiz") {
      systemPrompt = "You are an expert educational assessment creator. Generate a quiz with multiple-choice questions.";
      body.messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Generate a 10-question quiz from this content:\n\n${sanitizedContent}` }
      ];
      body.tools = [{
        type: "function",
        function: {
          name: "generate_quiz",
          description: "Generate a multiple-choice quiz",
          parameters: {
            type: "object",
            properties: {
              questions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    question: { type: "string" },
                    options: { type: "array", items: { type: "string" }, minItems: 4, maxItems: 4 },
                    correctAnswer: { type: "number" },
                    explanation: { type: "string" }
                  },
                  required: ["question", "options", "correctAnswer", "explanation"], additionalProperties: false
                }
              }
            },
            required: ["questions"], additionalProperties: false
          }
        }
      }];
      body.tool_choice = { type: "function", function: { name: "generate_quiz" } };
    } else if (type === "practice") {
      systemPrompt = "You are an expert educational content creator. Generate practice questions.";
      body.messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Generate 6-8 practice questions from this content:\n\n${sanitizedContent}` }
      ];
      body.tools = [{
        type: "function",
        function: {
          name: "generate_practice_questions",
          description: "Generate practice questions",
          parameters: {
            type: "object",
            properties: {
              questions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    question: { type: "string" },
                    type: { type: "string", enum: ["open-ended", "short-answer", "critical-thinking"] },
                    suggestedAnswer: { type: "string" },
                    difficulty: { type: "string", enum: ["easy", "medium", "hard"] }
                  },
                  required: ["question", "type", "suggestedAnswer", "difficulty"], additionalProperties: false
                }
              }
            },
            required: ["questions"], additionalProperties: false
          }
        }
      }];
      body.tool_choice = { type: "function", function: { name: "generate_practice_questions" } };
    }

    const response = await fetch(aiConfig.url, {
      method: "POST",
      headers: aiConfig.headers,
      body: JSON.stringify(body),
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
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in AI response");

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in content-enhancer:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
