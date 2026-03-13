import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

export interface ProviderUsage {
  name: string;
  used: number;
  limit: number;
  remaining: number;
  hasOwnKey: boolean;
}

interface AIUsageData {
  used: number;
  limit: number;
  hasOwnKey: boolean;
  providers: string[];
  byProvider: ProviderUsage[];
}

// Module-level cache so data persists across remounts/navigation
let cachedUsage: AIUsageData | null = null;

export const useAIUsage = () => {
  const [usage, setUsage] = useState<AIUsageData | null>(cachedUsage);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchUsage = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke("manage-api-keys", {
        body: { action: "get-usage" },
      });
      if (error) throw error;
      setUsage(data);
    } catch (e) {
      console.error("Failed to fetch AI usage:", e);
    }
  }, []);

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  const saveApiKey = async (provider: string, apiKey: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("manage-api-keys", {
        body: { action: "save", provider, apiKey },
      });
      if (error) throw error;
      toast({ title: "API key saved", description: `Your ${provider} key is now active for unlimited access.` });
      await fetchUsage();
      return true;
    } catch (e) {
      toast({ title: "Error", description: "Failed to save API key", variant: "destructive" });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteApiKey = async (provider: string) => {
    setIsLoading(true);
    try {
      await supabase.functions.invoke("manage-api-keys", {
        body: { action: "delete", provider },
      });
      toast({ title: "API key removed", description: `${provider} will use shared monthly credits.` });
      await fetchUsage();
    } catch (e) {
      toast({ title: "Error", description: "Failed to remove API key", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const remaining = usage ? Math.max(0, usage.limit - usage.used) : null;
  const isLow = remaining !== null && remaining <= 5 && !usage?.hasOwnKey;

  return {
    usage,
    remaining,
    isLow,
    isLoading,
    saveApiKey,
    deleteApiKey,
    refreshUsage: fetchUsage,
  };
};
