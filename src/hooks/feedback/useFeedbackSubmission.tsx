
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Special user email that's allowed to submit feedback multiple times
const SPECIAL_USER_EMAIL = "antoinettecelinemarshall@gmail.com";

export const useFeedbackSubmission = (
  userEmail: string | undefined | null,
  onClose: () => void
) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { toast } = useToast();

  const handleSubmit = async (comments: string, maxWords: number, wordCount: number): Promise<boolean> => {
    console.log("handleSubmit called with:", { comments, userEmail, wordCount });
    
    // Basic validations
    if (!comments.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide some feedback before submitting.",
        variant: "destructive"
      });
      return false;
    }
    
    if (wordCount > maxWords) {
      toast({
        title: "Too many words",
        description: `Please limit your feedback to ${maxWords} words.`,
        variant: "destructive"
      });
      return false;
    }
    
    if (!userEmail) {
      toast({
        title: "User information missing",
        description: "Unable to identify user. Please try again later.",
        variant: "destructive"
      });
      return false;
    }
    
    setIsSubmitting(true);
    
    try {
      const currentTime = new Date().toISOString();
      
      console.log("Calling submit-feedback function with:", { comments, userEmail });
      
      // Call the Supabase Edge Function to submit feedback
      const { data, error } = await supabase.functions.invoke('submit-feedback', {
        body: {
          comments,
          userEmail
        }
      });
      
      console.log("Function response:", { data, error });
      
      if (error) {
        console.error("Error calling submit-feedback function:", error);
        throw new Error(`Function error: ${error.message}`);
      }
      
      if (!data?.success) {
        console.error("Submit feedback function returned error:", data?.error);
        // Check if the error is about already submitted feedback
        if (data?.error?.includes("already provided feedback")) {
          toast({
            title: "Feedback already submitted",
            description: "You have already provided feedback. Thank you!"
          });
          onClose();
          return false;
        }
        throw new Error(data?.error || "Error submitting feedback");
      }
      
      console.log("Feedback submitted successfully!");
      
      toast({
        title: "Thank you for your feedback!",
        description: "Your input helps us improve the application."
      });
      
      // Store in localStorage that feedback was submitted
      localStorage.setItem("feedback_submitted", currentTime);
      
      onClose();
      return true;
    } catch (error: any) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Error",
        description: error.message || "There was a problem submitting your feedback. Please try again later.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, handleSubmit };
};
