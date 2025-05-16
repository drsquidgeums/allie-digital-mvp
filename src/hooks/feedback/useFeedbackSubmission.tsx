
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Special user email that's allowed to submit feedback multiple times
const SPECIAL_USER_EMAIL = "antoinettecelinemarshall@gmail.com";

export const useFeedbackSubmission = (
  userEmail: string | undefined | null,
  onClose: () => void
) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { toast } = useToast();

  const handleSubmit = async (comments: string, maxWords: number, wordCount: number) => {
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
      // Use email as unique user ID
      const user_id = userEmail;
      let error = null;
      
      // For special users, use upsert to overwrite previous submissions
      if (user_id === SPECIAL_USER_EMAIL) {
        const { error: upsertError } = await supabase
          .from('feedback')
          .upsert({
            user_id,
            comments: comments || null,
            // Required fields per database schema
            rating: 0,
            usability: 0,
            visual_appeal: 0,
            would_recommend: false
          }, {
            onConflict: 'user_id'
          });
        error = upsertError;
      } else {
        // For regular users, use standard insert (with unique constraint)
        const { error: insertError } = await supabase
          .from('feedback')
          .insert({
            user_id,
            comments: comments || null,
            // Required fields per database schema
            rating: 0,
            usability: 0,
            visual_appeal: 0,
            would_recommend: false
          });
        error = insertError;
      }
        
      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Feedback already submitted",
            description: "You have already provided feedback. Thank you!"
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Thank you for your feedback!",
          description: "Your input helps us improve the application."
        });
        
        // Store in localStorage that feedback was submitted
        localStorage.setItem("feedback_submitted", new Date().toISOString());
      }
      
      onClose();
      return true;
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Error",
        description: "There was a problem submitting your feedback. Please try again later.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, handleSubmit };
};
