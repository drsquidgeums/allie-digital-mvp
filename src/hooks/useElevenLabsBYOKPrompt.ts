import { useState, useCallback, useMemo } from "react";
import { useAIUsage } from "@/hooks/useAIUsage";

const STORAGE_KEY = "elevenlabs-byok-dismissed";

export const useElevenLabsBYOKPrompt = () => {
  const { usage } = useAIUsage();
  const [showPrompt, setShowPrompt] = useState(false);

  const elevenlabsUsage = usage?.byProvider?.find((p) => p.name === "elevenlabs");
  const hasOwnKey = elevenlabsUsage?.hasOwnKey ?? false;
  const isPermanentlyDismissed = localStorage.getItem(STORAGE_KEY) === "permanent";

  const shouldPrompt = useMemo(
    () => !hasOwnKey && !isPermanentlyDismissed,
    [hasOwnKey, isPermanentlyDismissed]
  );

  const triggerPrompt = useCallback(() => {
    if (shouldPrompt) {
      setShowPrompt(true);
    }
  }, [shouldPrompt]);

  const dismissPrompt = useCallback((permanent?: boolean) => {
    if (permanent) {
      localStorage.setItem(STORAGE_KEY, "permanent");
    }
    setShowPrompt(false);
  }, []);

  return { showPrompt, triggerPrompt, dismissPrompt };
};
