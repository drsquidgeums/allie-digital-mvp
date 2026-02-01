import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ProgressData {
  currentStreak: number;
  longestStreak: number;
  totalCompleted: number;
  activeDays: number;
  peakHour: number;
  peakDay: string;
  weeklyTrend: { day: string; completed: number; added: number }[];
  dayDistribution: { name: string; value: number }[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { progressData, type } = await req.json() as { progressData: ProgressData; type: string };

    let systemPrompt = "";
    let userPrompt = "";

    const dataContext = `
Current Streak: ${progressData.currentStreak} days
Longest Streak: ${progressData.longestStreak} days
Total Tasks Completed: ${progressData.totalCompleted}
Active Days: ${progressData.activeDays}
Peak Productivity Hour: ${formatHour(progressData.peakHour)}
Most Productive Day: ${progressData.peakDay}
Weekly Trend: ${JSON.stringify(progressData.weeklyTrend)}
Day Distribution: ${JSON.stringify(progressData.dayDistribution)}
`;

    switch (type) {
      case "insights":
        systemPrompt = `You are a productivity analytics expert. Analyze the user's progress data and provide 2-3 specific, actionable insights about their patterns. Be concise and data-driven. Focus on patterns they might not notice themselves. Use emojis sparingly for emphasis.`;
        userPrompt = `Analyze my productivity data and give me smart insights:\n${dataContext}`;
        break;

      case "motivation":
        systemPrompt = `You are an encouraging productivity coach. Based on the user's data, provide a brief, personalized motivational message. Be warm, specific to their achievements, and encouraging. Keep it to 2-3 sentences. Use one relevant emoji.`;
        userPrompt = `Give me a motivational message based on my progress:\n${dataContext}`;
        break;

      case "summary":
        systemPrompt = `You are a productivity analyst. Create a brief, natural language summary of the user's weekly progress. Highlight achievements and areas of improvement. Be conversational but informative. Keep it to 3-4 sentences.`;
        userPrompt = `Summarize my weekly progress in natural language:\n${dataContext}`;
        break;

      case "goals":
        systemPrompt = `You are a productivity strategist. Based on the user's historical data, suggest 2-3 realistic and achievable goals for the coming week. Each goal should be specific, measurable, and based on their patterns. Format as a brief bullet list.`;
        userPrompt = `Based on my productivity patterns, suggest optimal goals for next week:\n${dataContext}`;
        break;

      default:
        throw new Error("Invalid insight type");
    }

    console.log(`Generating ${type} insight for user`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "Unable to generate insight.";

    console.log(`Successfully generated ${type} insight`);

    return new Response(JSON.stringify({ content, type }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Progress AI insights error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function formatHour(hour: number): string {
  if (hour === 0) return "12:00 AM";
  if (hour < 12) return `${hour}:00 AM`;
  if (hour === 12) return "12:00 PM";
  return `${hour - 12}:00 PM`;
}
