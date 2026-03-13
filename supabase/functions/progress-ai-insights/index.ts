import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { checkAndTrackUsage, getUsageLimitResponse, getAIRequestConfig } from "../_shared/ai-usage.ts";

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
    const usageResult = await checkAndTrackUsage(user.id, "progress-ai-insights");
    if (!usageResult.allowed) {
      return getUsageLimitResponse(0);
    }

    const aiConfig = getAIRequestConfig(usageResult.userApiKey);
    console.log("Progress AI insights, using own key:", usageResult.usingOwnKey);

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
        systemPrompt = "You are a productivity analytics expert. Analyze the user's progress data and provide 2-3 specific, actionable insights. Be concise and data-driven.";
        userPrompt = `Analyze my productivity data:\n${dataContext}`;
        break;
      case "motivation":
        systemPrompt = "You are an encouraging productivity coach. Provide a brief, personalized motivational message. Keep it to 2-3 sentences.";
        userPrompt = `Give me motivation based on:\n${dataContext}`;
        break;
      case "summary":
        systemPrompt = "You are a productivity analyst. Create a brief natural language summary. Keep it to 3-4 sentences.";
        userPrompt = `Summarize my weekly progress:\n${dataContext}`;
        break;
      case "goals":
        systemPrompt = "You are a productivity strategist. Suggest 2-3 realistic goals for the coming week.";
        userPrompt = `Suggest goals based on:\n${dataContext}`;
        break;
      default:
        throw new Error("Invalid insight type");
    }

    const response = await fetch(aiConfig.url, {
      method: "POST",
      headers: aiConfig.headers,
      body: JSON.stringify({
        model: aiConfig.model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI error:", response.status, errorText);
      throw new Error(`AI error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "Unable to generate insight.";

    return new Response(JSON.stringify({ content, type }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Progress AI insights error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function formatHour(hour: number): string {
  if (hour === 0) return "12:00 AM";
  if (hour < 12) return `${hour}:00 AM`;
  if (hour === 12) return "12:00 PM";
  return `${hour - 12}:00 PM`;
}
