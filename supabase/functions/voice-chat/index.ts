import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_AI_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

const SYSTEM_PROMPT = `You are Allie, a friendly and supportive AI study assistant. You help students stay focused, understand difficult concepts, and maintain motivation while learning.

Key traits:
- Warm, encouraging, and patient
- Give concise, clear explanations (since you're speaking, keep responses brief - 1-3 sentences typically)
- When explaining complex topics, break them into simple steps
- Offer study tips and techniques when relevant
- Be supportive without being condescending
- If asked about something outside studying/learning, gently redirect to how you can help with their studies

Remember: You're having a voice conversation, so keep responses natural and conversational. Avoid bullet points or long lists - speak as you would in a real conversation.`;

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory = [] } = await req.json();

    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const sanitizedMessage = message.trim().slice(0, 2000);
    if (sanitizedMessage.length === 0) {
      return new Response(
        JSON.stringify({ error: "Message cannot be empty" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build messages array with conversation history
    const messages: Message[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory.slice(-10), // Keep last 10 messages for context
      { role: 'user', content: sanitizedMessage }
    ];

    console.log("Processing voice chat message:", sanitizedMessage.substring(0, 50));

    const response = await fetch(LOVABLE_AI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages,
        max_tokens: 300, // Keep responses concise for voice
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || "I'm sorry, I didn't understand that. Could you please repeat?";

    console.log("AI response generated successfully");

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        conversationHistory: [
          ...conversationHistory.slice(-10),
          { role: 'user', content: sanitizedMessage },
          { role: 'assistant', content: aiResponse }
        ]
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in voice-chat function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
