import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication check
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

    console.log("Request from user:", user.id);

    const reqBody = await req.json();
    const { type, documentContent } = reqBody;

    // Validate inputs
    if (!type || typeof type !== 'string' || !['flashcards', 'quiz', 'practice'].includes(type)) {
      return new Response(
        JSON.stringify({ error: "Invalid type. Must be 'flashcards', 'quiz', or 'practice'" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!documentContent || typeof documentContent !== 'string') {
      return new Response(
        JSON.stringify({ error: "Document content is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Limit content length for safety
    const sanitizedContent = documentContent.slice(0, 100000);
    console.log("Content enhancer request:", { type, contentLength: sanitizedContent.length });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let body: any = {
      model: "google/gemini-2.5-flash",
      messages: [],
    };

    if (type === "flashcards") {
      systemPrompt = "You are an expert educational content creator. Generate comprehensive flashcards from the provided document content. Each flashcard should have a clear question on the front and a concise, accurate answer on the back. Focus on key concepts, definitions, and important facts.";
      
      body.messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Generate 8-12 flashcards from this content:\n\n${sanitizedContent}` }
      ];

      body.tools = [
        {
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
                      front: { type: "string", description: "The question or prompt" },
                      back: { type: "string", description: "The answer or explanation" },
                      category: { type: "string", description: "Topic category" }
                    },
                    required: ["front", "back", "category"],
                    additionalProperties: false
                  }
                }
              },
              required: ["flashcards"],
              additionalProperties: false
            }
          }
        }
      ];
      body.tool_choice = { type: "function", function: { name: "generate_flashcards" } };

    } else if (type === "quiz") {
      systemPrompt = "You are an expert educational assessment creator. Generate a comprehensive quiz with multiple-choice questions from the provided document content. Each question should have 4 options with only one correct answer. Include questions of varying difficulty.";
      
      body.messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Generate a 10-question quiz from this content:\n\n${sanitizedContent}` }
      ];

      body.tools = [
        {
          type: "function",
          function: {
            name: "generate_quiz",
            description: "Generate a multiple-choice quiz from document content",
            parameters: {
              type: "object",
              properties: {
                questions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      question: { type: "string" },
                      options: {
                        type: "array",
                        items: { type: "string" },
                        minItems: 4,
                        maxItems: 4
                      },
                      correctAnswer: { type: "number", description: "Index of correct option (0-3)" },
                      explanation: { type: "string", description: "Why this answer is correct" }
                    },
                    required: ["question", "options", "correctAnswer", "explanation"],
                    additionalProperties: false
                  }
                }
              },
              required: ["questions"],
              additionalProperties: false
            }
          }
        }
      ];
      body.tool_choice = { type: "function", function: { name: "generate_quiz" } };

    } else if (type === "practice") {
      systemPrompt = "You are an expert educational content creator. Generate practice questions from the provided document content. Create a mix of open-ended questions, short answer questions, and critical thinking prompts that encourage deep understanding of the material.";
      
      body.messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Generate 6-8 practice questions from this content:\n\n${sanitizedContent}` }
      ];

      body.tools = [
        {
          type: "function",
          function: {
            name: "generate_practice_questions",
            description: "Generate practice questions from document content",
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
                      suggestedAnswer: { type: "string", description: "A model answer or key points" },
                      difficulty: { type: "string", enum: ["easy", "medium", "hard"] }
                    },
                    required: ["question", "type", "suggestedAnswer", "difficulty"],
                    additionalProperties: false
                  }
                }
              },
              required: ["questions"],
              additionalProperties: false
            }
          }
        }
      ];
      body.tool_choice = { type: "function", function: { name: "generate_practice_questions" } };
    }

    console.log("Calling Lovable AI Gateway...");
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits depleted. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      throw new Error(`AI gateway error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log("AI response received");

    // Extract the tool call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error("No tool call in AI response");
    }

    const result = JSON.parse(toolCall.function.arguments);
    
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in content-enhancer function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
