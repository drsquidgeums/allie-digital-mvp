import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { decryptApiKey } from "./crypto.ts";

const MONTHLY_LIMIT = 15;

interface UsageCheckResult {
  allowed: boolean;
  remaining: number;
  usedCount: number;
  userApiKey?: string;
  usingOwnKey: boolean;
}

export async function checkAndTrackUsage(
  userId: string,
  featureName: string
): Promise<UsageCheckResult> {
  const serviceClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  // Check if user has their own OpenAI API key
  const { data: apiKeyData } = await serviceClient
    .from("user_api_keys")
    .select("api_key")
    .eq("user_id", userId)
    .eq("provider", "openai")
    .maybeSingle();

  if (apiKeyData?.api_key) {
    // Decrypt the stored API key
    const decryptedKey = await decryptApiKey(apiKeyData.api_key);
    // User has own key - always allowed, no tracking needed for limits
    // Still log for analytics
    await serviceClient.from("ai_feature_usage").insert({
      user_id: userId,
      feature_name: featureName,
      usage_data: { source: "user_key" },
    });

    return {
      allowed: true,
      remaining: -1, // unlimited
      usedCount: 0,
      userApiKey: decryptedKey,
      usingOwnKey: true,
    };
  }

  // Count this month's usage (shared credits)
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const { count, error } = await serviceClient
    .from("ai_feature_usage")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", monthStart)
    .is("usage_data->source", null); // only count shared-credit usage

  const usedCount = count ?? 0;
  const remaining = Math.max(0, MONTHLY_LIMIT - usedCount);

  if (remaining <= 0) {
    return {
      allowed: false,
      remaining: 0,
      usedCount,
      usingOwnKey: false,
    };
  }

  // Log usage
  await serviceClient.from("ai_feature_usage").insert({
    user_id: userId,
    feature_name: featureName,
    usage_data: { source: "shared" },
  });

  return {
    allowed: true,
    remaining: remaining - 1,
    usedCount: usedCount + 1,
    usingOwnKey: false,
  };
}

export function getUsageLimitResponse(remaining: number) {
  return new Response(
    JSON.stringify({
      error: "Monthly AI credits used up. You can add your own OpenAI API key in Settings for unlimited access. Credits reset on the 1st of each month.",
      code: "USAGE_LIMIT_REACHED",
      remaining: 0,
    }),
    {
      status: 429,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
        "Content-Type": "application/json",
      },
    }
  );
}

export function getAIRequestConfig(userApiKey?: string) {
  if (userApiKey) {
    return {
      url: "https://api.openai.com/v1/chat/completions",
      headers: {
        Authorization: `Bearer ${userApiKey}`,
        "Content-Type": "application/json",
      },
      model: "gpt-4o-mini",
    };
  }

  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) {
    throw new Error("LOVABLE_API_KEY is not configured");
  }

  return {
    url: "https://ai.gateway.lovable.dev/v1/chat/completions",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    model: "google/gemini-2.5-flash",
  };
}

export const MONTHLY_AI_LIMIT = MONTHLY_LIMIT;
