import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

/**
 * Checks if an AI API error is a usage limit error and shows appropriate toast.
 * Returns true if the error was handled (usage limit), false otherwise.
 */
export const useAIErrorHandler = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAIError = useCallback((error: any, context?: string): boolean => {
    const errorMessage = typeof error === "string" 
      ? error 
      : error?.message || error?.error || "";
    
    const errorCode = error?.code || "";

    // Check for usage limit reached
    if (
      errorCode === "USAGE_LIMIT_REACHED" ||
      errorMessage.includes("Monthly AI credits used up") ||
      errorMessage.includes("USAGE_LIMIT_REACHED")
    ) {
      toast({
        title: "AI Credits Used Up",
        description: "Your monthly AI credits have been used. Go to Settings to add your own OpenAI API key for unlimited access.",
        variant: "destructive",
        action: undefined,
      });
      return true;
    }

    // Check for rate limiting
    if (errorMessage.includes("Rate limit") || errorMessage.includes("429")) {
      toast({
        title: "Too Many Requests",
        description: "Please wait a moment and try again.",
        variant: "destructive",
      });
      return true;
    }

    // Check for payment required
    if (errorMessage.includes("402") || errorMessage.includes("Payment required") || errorMessage.includes("credits")) {
      toast({
        title: "AI Credits Depleted",
        description: "AI service credits are depleted. You can add your own API key in Settings.",
        variant: "destructive",
      });
      return true;
    }

    return false;
  }, [toast, navigate]);

  return { handleAIError };
};
