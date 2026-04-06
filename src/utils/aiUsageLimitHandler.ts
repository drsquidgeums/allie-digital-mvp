import { toast } from "sonner";

/**
 * Checks if an error from a Supabase function invocation is a usage limit error.
 * Returns true if the error was handled (credits exhausted), false otherwise.
 */
export function handleAIUsageLimitError(error: any): boolean {
  const msg = typeof error === "string" ? error : error?.message || "";
  if (
    msg.includes("Monthly AI credits") ||
    msg.includes("USAGE_LIMIT_REACHED") ||
    msg.includes("usage limit")
  ) {
    toast.error("AI credits used up", {
      description:
        "Go to Settings → AI Settings to add your own API key for unlimited access. Credits reset on the 1st of each month.",
      duration: 8000,
    });
    return true;
  }
  return false;
}

/**
 * Checks if a response body from a direct fetch (non-SDK) call is a usage limit error.
 */
export function isUsageLimitResponse(data: any): boolean {
  return (
    data?.code === "USAGE_LIMIT_REACHED" ||
    (typeof data?.error === "string" && data.error.includes("Monthly AI credits"))
  );
}
