import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";
import { notifyAICreditsUsed } from "@/utils/aiCreditsEvent";

export type TaskSuggestion = {
  title: string;
  priority: "low" | "medium" | "high";
  category: string;
};

export const useTaskAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const getSuggestions = async (context?: string): Promise<TaskSuggestion[]> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('task-ai-suggestions', {
        body: { 
          type: "suggest",
          context: context || "Suggest study tasks for a student preparing for exams"
        }
      });

      if (error) {
        console.error("Error getting task suggestions:", error);
        const errMsg = error.message || "Failed to get AI suggestions";
        toast({
          title: errMsg.includes("Monthly AI credits") ? "AI Credits Used Up" : "Error",
          description: errMsg.includes("Monthly AI credits") 
            ? "Go to Settings → AI Settings to add your own API key for unlimited access."
            : errMsg,
          variant: "destructive"
        });
        return [];
      }

      return data?.suggestions || [];
    } catch (error) {
      console.error("Error getting task suggestions:", error);
      toast({
        title: "Error",
        description: "Failed to get AI suggestions. Please try again.",
        variant: "destructive"
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const generateSchedule = async (context?: string): Promise<string> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('task-ai-suggestions', {
        body: { 
          type: "schedule",
          context: context || "Create a balanced study schedule for the next week"
        }
      });

      if (error) {
        console.error("Error generating schedule:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to generate schedule",
          variant: "destructive"
        });
        return "";
      }

      return data?.content || "";
    } catch (error) {
      console.error("Error generating schedule:", error);
      toast({
        title: "Error",
        description: "Failed to generate schedule. Please try again.",
        variant: "destructive"
      });
      return "";
    } finally {
      setIsLoading(false);
    }
  };

  const optimizeTasks = async (currentTasks: string): Promise<string> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('task-ai-suggestions', {
        body: { 
          type: "optimize",
          context: currentTasks
        }
      });

      if (error) {
        console.error("Error optimizing tasks:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to optimize tasks",
          variant: "destructive"
        });
        return "";
      }

      return data?.content || "";
    } catch (error) {
      console.error("Error optimizing tasks:", error);
      toast({
        title: "Error",
        description: "Failed to optimize tasks. Please try again.",
        variant: "destructive"
      });
      return "";
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    getSuggestions,
    generateSchedule,
    optimizeTasks
  };
};
