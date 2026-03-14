import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";
import { notifyAICreditsUsed } from "@/utils/aiCreditsEvent";

export type Flashcard = {
  front: string;
  back: string;
  category: string;
};

export type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

export type PracticeQuestion = {
  question: string;
  type: "open-ended" | "short-answer" | "critical-thinking";
  suggestedAnswer: string;
  difficulty: "easy" | "medium" | "hard";
};

export const useContentEnhancer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateFlashcards = async (documentContent: string): Promise<Flashcard[]> => {
    if (!documentContent.trim()) {
      toast({
        title: "No Content",
        description: "Please load a document first",
        variant: "destructive",
      });
      return [];
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("content-enhancer", {
        body: {
          type: "flashcards",
          documentContent,
        },
      });

      if (error) {
        console.error("Error generating flashcards:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to generate flashcards",
          variant: "destructive",
        });
        return [];
      }

      toast({
        title: "Success",
        description: `Generated ${data.flashcards?.length || 0} flashcards`,
      });

      return data?.flashcards || [];
    } catch (error) {
      console.error("Error generating flashcards:", error);
      toast({
        title: "Error",
        description: "Failed to generate flashcards. Please try again.",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const generateQuiz = async (documentContent: string): Promise<QuizQuestion[]> => {
    if (!documentContent.trim()) {
      toast({
        title: "No Content",
        description: "Please load a document first",
        variant: "destructive",
      });
      return [];
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("content-enhancer", {
        body: {
          type: "quiz",
          documentContent,
        },
      });

      if (error) {
        console.error("Error generating quiz:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to generate quiz",
          variant: "destructive",
        });
        return [];
      }

      toast({
        title: "Success",
        description: `Generated ${data.questions?.length || 0} quiz questions`,
      });

      return data?.questions || [];
    } catch (error) {
      console.error("Error generating quiz:", error);
      toast({
        title: "Error",
        description: "Failed to generate quiz. Please try again.",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const generatePracticeQuestions = async (
    documentContent: string
  ): Promise<PracticeQuestion[]> => {
    if (!documentContent.trim()) {
      toast({
        title: "No Content",
        description: "Please load a document first",
        variant: "destructive",
      });
      return [];
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("content-enhancer", {
        body: {
          type: "practice",
          documentContent,
        },
      });

      if (error) {
        console.error("Error generating practice questions:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to generate practice questions",
          variant: "destructive",
        });
        return [];
      }

      toast({
        title: "Success",
        description: `Generated ${data.questions?.length || 0} practice questions`,
      });

      return data?.questions || [];
    } catch (error) {
      console.error("Error generating practice questions:", error);
      toast({
        title: "Error",
        description: "Failed to generate practice questions. Please try again.",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    generateFlashcards,
    generateQuiz,
    generatePracticeQuestions,
  };
};
