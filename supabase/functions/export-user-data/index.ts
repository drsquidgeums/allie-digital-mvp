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

    const userId = user.id;
    console.log(`[EXPORT-DATA] Exporting data for user ${userId}`);

    // Gather data from all user tables
    const [
      { data: profile },
      { data: tasks },
      { data: savedUrls },
      { data: aiUsage },
      { data: aiInsights },
      { data: aiStudyMaterials },
      { data: aiTaskBreakdowns },
      { data: analytics },
    ] = await Promise.all([
      supabaseClient.from("profiles").select("*").eq("id", userId).single(),
      supabaseClient.from("tasks").select("*").eq("user_id", userId),
      supabaseClient.from("saved_urls").select("*").eq("user_id", userId),
      supabaseClient.from("ai_feature_usage").select("*").eq("user_id", userId),
      supabaseClient.from("ai_insights").select("*").eq("user_id", userId),
      supabaseClient.from("ai_study_materials").select("*").eq("user_id", userId),
      supabaseClient.from("ai_task_breakdowns").select("*").eq("user_id", userId),
      supabaseClient.from("user_analytics").select("*").eq("user_id", userId),
    ]);

    // List stored files (metadata only, not content)
    const { data: files } = await supabaseClient.storage
      .from("files")
      .list(userId);

    const exportData = {
      exportedAt: new Date().toISOString(),
      user: {
        id: user.id,
        email: user.email,
      },
      profile,
      tasks: tasks ?? [],
      savedUrls: savedUrls ?? [],
      aiFeatureUsage: aiUsage ?? [],
      aiInsights: aiInsights ?? [],
      aiStudyMaterials: aiStudyMaterials ?? [],
      aiTaskBreakdowns: aiTaskBreakdowns ?? [],
      analytics: analytics ?? [],
      storedFiles: (files ?? []).map((f) => ({ name: f.name, createdAt: f.created_at })),
    };

    console.log(`[EXPORT-DATA] Export complete for user ${userId}`);

    return new Response(JSON.stringify(exportData, null, 2), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="allie-data-export-${new Date().toISOString().split("T")[0]}.json"`,
      },
    });
  } catch (error) {
    console.error("[EXPORT-DATA] Error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
