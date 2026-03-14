import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";
import { notifyAICreditsUsed } from "@/utils/aiCreditsEvent";

export interface ProgressData {
  currentStreak: number;
  longestStreak: number;
  totalCompleted: number;
  activeDays: number;
  peakHour: number;
  peakDay: string;
  weeklyTrend: { day: string; completed: number; added: number }[];
  dayDistribution: { name: string; value: number }[];
}

export type InsightType = "insights" | "motivation" | "summary" | "goals";

interface AIInsight {
  content: string;
  type: InsightType;
  loading: boolean;
}

export const useProgressAI = () => {
  const [insights, setInsights] = useState<Record<InsightType, AIInsight>>({
    insights: { content: "", type: "insights", loading: false },
    motivation: { content: "", type: "motivation", loading: false },
    summary: { content: "", type: "summary", loading: false },
    goals: { content: "", type: "goals", loading: false },
  });
  const { toast } = useToast();

  const generateInsight = useCallback(async (type: InsightType, progressData: ProgressData) => {
    setInsights(prev => ({
      ...prev,
      [type]: { ...prev[type], loading: true },
    }));

    try {
      const { data, error } = await supabase.functions.invoke("progress-ai-insights", {
        body: { progressData, type },
      });

      if (error) {
        console.error(`Error generating ${type}:`, error);
        toast({
          title: "Error",
          description: error.message || `Failed to generate ${type}`,
          variant: "destructive",
        });
        setInsights(prev => ({
          ...prev,
          [type]: { ...prev[type], loading: false },
        }));
        return;
      }

      notifyAICreditsUsed();
      setInsights(prev => ({
        ...prev,
        [type]: { content: data.content, type, loading: false },
      }));
    } catch (error) {
      console.error(`Error generating ${type}:`, error);
      toast({
        title: "Error",
        description: `Failed to generate ${type}. Please try again.`,
        variant: "destructive",
      });
      setInsights(prev => ({
        ...prev,
        [type]: { ...prev[type], loading: false },
      }));
    }
  }, [toast]);

  const generateAllInsights = useCallback(async (progressData: ProgressData) => {
    const types: InsightType[] = ["insights", "motivation", "summary", "goals"];
    await Promise.all(types.map(type => generateInsight(type, progressData)));
  }, [generateInsight]);

  return {
    insights,
    generateInsight,
    generateAllInsights,
  };
};
