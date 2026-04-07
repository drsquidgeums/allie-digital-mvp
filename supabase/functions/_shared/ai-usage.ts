import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { decryptApiKey } from "./crypto.ts";

const PROVIDER_LIMITS = {
  openai: 25,
  elevenlabs: 25,
} as const;

const FEATURE_PROVIDER_MAP: Record<string, keyof typeof PROVIDER_LIMITS> = {
  "simplify-text": "openai",
  "document-ai-chat": "openai",
  "content-enhancer": "openai",
  "study-buddy-chat": "openai",
  "task-ai-suggestions": "openai",
  "mindmap-ai": "openai",
  "voice-chat": "openai",
  "progress-ai-insights": "openai",
  "elevenlabs-tts": "elevenlabs",
  "elevenlabs-tts-public": "elevenlabs",
  "elevenlabs-transcribe": "elevenlabs",
  "elevenlabs-session": "elevenlabs",
};

type ProviderName = keyof typeof PROVIDER_LIMITS;
type UsageSource = "shared" | "user_key";

interface UsageCheckResult {
  allowed: boolean;
  remaining: number;
  usedCount: number;
  userApiKey?: string;
  usingOwnKey: boolean;
  provider: ProviderName;
  usageSource: UsageSource;
}

function createServiceClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );
}

function getFeatureProvider(featureName: string): ProviderName {
  return FEATURE_PROVIDER_MAP[featureName] ?? "openai";
}

function getProviderFeatures(provider: ProviderName, featureName: string) {
  const features = Object.entries(FEATURE_PROVIDER_MAP)
    .filter(([, mappedProvider]) => mappedProvider === provider)
    .map(([mappedFeature]) => mappedFeature);

  if (!features.includes(featureName)) {
    features.push(featureName);
  }

  return features;
}

async function resolveUsage(userId: string, featureName: string): Promise<UsageCheckResult> {
  const serviceClient = createServiceClient();
  const provider = getFeatureProvider(featureName);

  const { data: apiKeyData, error: apiKeyError } = await serviceClient
    .from("user_api_keys")
    .select("api_key")
    .eq("user_id", userId)
    .eq("provider", provider)
    .maybeSingle();

  if (apiKeyError) {
    throw apiKeyError;
  }

  if (apiKeyData?.api_key) {
    const decryptedKey = await decryptApiKey(apiKeyData.api_key);

    return {
      allowed: true,
      remaining: -1,
      usedCount: 0,
      userApiKey: decryptedKey,
      usingOwnKey: true,
      provider,
      usageSource: "user_key",
    };
  }

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const providerFeatures = getProviderFeatures(provider, featureName);

  const { data: usageRecords, error: usageError } = await serviceClient
    .from("ai_feature_usage")
    .select("feature_name, usage_data")
    .eq("user_id", userId)
    .gte("created_at", monthStart)
    .in("feature_name", providerFeatures);

  if (usageError) {
    throw usageError;
  }

  const usedCount = (usageRecords ?? []).filter((record) => {
    const source = (record.usage_data as { source?: string } | null)?.source;
    return source !== "user_key";
  }).length;

  const remaining = Math.max(0, PROVIDER_LIMITS[provider] - usedCount);

  return {
    allowed: remaining > 0,
    remaining,
    usedCount,
    usingOwnKey: false,
    provider,
    usageSource: "shared",
  };
}

export async function trackUsage(
  userId: string,
  featureName: string,
  source: UsageSource,
) {
  const serviceClient = createServiceClient();
  const { error } = await serviceClient.from("ai_feature_usage").insert({
    user_id: userId,
    feature_name: featureName,
    usage_data: { source },
  });

  if (error) {
    throw error;
  }
}

export async function checkAndTrackUsage(
  userId: string,
  featureName: string,
  options: { track?: boolean } = {},
): Promise<UsageCheckResult> {
  const usage = await resolveUsage(userId, featureName);

  if (!usage.allowed) {
    return usage;
  }

  if (options.track === false) {
    return usage;
  }

  await trackUsage(userId, featureName, usage.usageSource);

  return {
    ...usage,
    remaining:
      usage.usageSource === "shared" ? Math.max(0, usage.remaining - 1) : usage.remaining,
    usedCount: usage.usageSource === "shared" ? usage.usedCount + 1 : usage.usedCount,
  };
}

export function getUsageLimitResponse(remaining: number, providerLabel = "OpenAI") {
  return new Response(
    JSON.stringify({
      error: `Monthly ${providerLabel} credits used up. You can add your own ${providerLabel} API key in Settings for unlimited access. Credits reset on the 1st of each month.`,
      code: "USAGE_LIMIT_REACHED",
      remaining,
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

export const MONTHLY_AI_LIMIT = PROVIDER_LIMITS.openai;
