import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sourceText, materialType } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Get user ID from auth header
    const authHeader = req.headers.get("authorization");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader! } },
    });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("Unauthorized");
    }

    console.log(`Generating ${materialType} for user ${user.id}`);

    // Define system prompts for different material types
    const systemPrompts: Record<string, string> = {
      flashcards: `You are an expert educational content creator specializing in flashcards for ADHD students. 
Create 8-12 flashcards from the provided text. Each flashcard should:
- Have a clear, concise question (front)
- Have a brief, memorable answer (back)
- Focus on ONE concept per card
- Use simple language
- Include memory aids when helpful

IMPORTANT: Return ONLY valid JSON in this exact format:
{
  "flashcards": [
    {
      "front": "Question text",
      "back": "Answer text",
      "difficulty": "easy|medium|hard"
    }
  ]
}`,
      
      quiz: `You are an expert educational content creator specializing in quizzes for ADHD students.
Create a 10-question quiz from the provided text. Include:
- 7 multiple choice questions
- 3 short answer questions

IMPORTANT: Return ONLY valid JSON in this exact format:
{
  "questions": [
    {
      "type": "multiple_choice",
      "question": "Question text",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0,
      "explanation": "Why this is correct"
    },
    {
      "type": "short_answer",
      "question": "Question text",
      "sampleAnswer": "Expected answer",
      "keyPoints": ["point1", "point2"]
    }
  ]
}`,
      
      summary: `You are an expert at creating concise, scannable summaries for ADHD students.
Create a structured summary with:
- Main idea (1 sentence)
- Key points (3-5 bullet points)
- Important terms (definitions)
- Quick review tips

IMPORTANT: Return ONLY valid JSON in this exact format:
{
  "mainIdea": "One sentence summary",
  "keyPoints": ["Point 1", "Point 2", "Point 3"],
  "terms": [
    {
      "term": "Term name",
      "definition": "Brief definition"
    }
  ],
  "reviewTips": ["Tip 1", "Tip 2"]
}`,
      
      mnemonics: `You are an expert at creating memorable mnemonics and memory aids for ADHD students.
Create creative memory aids including:
- Acronyms
- Visual associations
- Rhymes or songs
- Story-based mnemonics

IMPORTANT: Return ONLY valid JSON in this exact format:
{
  "mnemonics": [
    {
      "concept": "What to remember",
      "type": "acronym|visual|rhyme|story",
      "mnemonic": "The actual memory aid",
      "explanation": "How to use it"
    }
  ]
}`
    };

    const systemPrompt = systemPrompts[materialType] || systemPrompts.summary;

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
          { role: "user", content: `Create ${materialType} from this text:\n\n${sourceText}` },
        ],
        temperature: 0.7,
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

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content generated");
    }

    // Parse JSON from AI response
    let parsedContent;
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/) || content.match(/(\{[\s\S]*\})/);
      const jsonString = jsonMatch ? jsonMatch[1] : content;
      parsedContent = JSON.parse(jsonString);
    } catch (e) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse AI-generated content");
    }

    // Save to database
    const { data: savedMaterial, error: dbError } = await supabase
      .from("ai_study_materials")
      .insert({
        user_id: user.id,
        source_text: sourceText.substring(0, 1000), // Store preview only
        material_type: materialType,
        content: parsedContent,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error("Failed to save study materials");
    }

    // Track usage
    await supabase.from("ai_feature_usage").insert({
      user_id: user.id,
      feature_name: "ai_study_materials",
      usage_data: { material_type: materialType, success: true },
    });

    return new Response(JSON.stringify({ 
      success: true, 
      material: savedMaterial,
      content: parsedContent 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("AI study materials error:", e);
    return new Response(JSON.stringify({ 
      error: e instanceof Error ? e.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
