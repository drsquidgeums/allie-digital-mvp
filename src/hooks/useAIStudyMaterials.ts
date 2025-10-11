import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type MaterialType = "flashcards" | "quiz" | "summary" | "mnemonics";

interface GenerateMaterialOptions {
  sourceText: string;
  materialType: MaterialType;
}

export const useAIStudyMaterials = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateMaterial = async ({ sourceText, materialType }: GenerateMaterialOptions) => {
    if (!sourceText.trim()) {
      toast({
        title: "No text provided",
        description: "Please provide some text to generate study materials from.",
        variant: "destructive",
      });
      return null;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-study-materials", {
        body: { sourceText, materialType },
      });

      if (error) {
        console.error("Error generating study materials:", error);
        
        if (error.message?.includes("Rate limits exceeded")) {
          toast({
            title: "Rate limit exceeded",
            description: "Please try again in a few moments.",
            variant: "destructive",
          });
        } else if (error.message?.includes("Payment required")) {
          toast({
            title: "Credits required",
            description: "Please add credits to your Lovable AI workspace to continue.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Generation failed",
            description: "Failed to generate study materials. Please try again.",
            variant: "destructive",
          });
        }
        return null;
      }

      if (!data?.success) {
        throw new Error(data?.error || "Unknown error");
      }

      toast({
        title: "✨ Study materials generated!",
        description: `Your ${materialType} are ready to use.`,
      });

      return data.content;
    } catch (error) {
      console.error("Error in generateMaterial:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate study materials",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const getSavedMaterials = async (materialType?: MaterialType) => {
    try {
      let query = supabase
        .from("ai_study_materials")
        .select("*")
        .order("created_at", { ascending: false });

      if (materialType) {
        query = query.eq("material_type", materialType);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching saved materials:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Error in getSavedMaterials:", error);
      return [];
    }
  };

  const deleteMaterial = async (id: string) => {
    try {
      const { error } = await supabase
        .from("ai_study_materials")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Deleted",
        description: "Study material deleted successfully.",
      });

      return true;
    } catch (error) {
      console.error("Error deleting material:", error);
      toast({
        title: "Error",
        description: "Failed to delete study material",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    isGenerating,
    generateMaterial,
    getSavedMaterials,
    deleteMaterial,
  };
};
