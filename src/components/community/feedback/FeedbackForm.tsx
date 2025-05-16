
import React, { useState, useEffect } from "react";
import { CommentsSection } from "./CommentsSection";
import { FeedbackButtons } from "./FeedbackButtons";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FeedbackFormProps {
  onClose: () => void;
  onPostpone: () => void;
  userInfo: { name: string; email: string } | null;
}

// Special user email that's allowed to submit feedback multiple times
const SPECIAL_USER_EMAIL = "antoinettecelinemarshall@gmail.com";

export const FeedbackForm: React.FC<FeedbackFormProps> = ({
  onClose,
  onPostpone,
  userInfo
}) => {
  const [comments, setComments] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState<boolean>(false);
  const [wordCount, setWordCount] = useState<number>(0);
  const { toast } = useToast();
  
  const MAX_WORDS = 500;

  // Check if the user has already submitted feedback
  useEffect(() => {
    const checkPreviousSubmission = async () => {
      if (!userInfo?.email) return;

      // If this is the special user, don't restrict submissions
      if (userInfo.email === SPECIAL_USER_EMAIL) {
        return;
      }

      try {
        const { data, error } = await supabase
          .from('feedback')
          .select('id')
          .eq('user_id', userInfo.email)
          .maybeSingle();
          
        if (error) throw error;
        
        if (data) {
          setAlreadySubmitted(true);
          toast({
            title: "Feedback already submitted",
            description: "You have already provided feedback. Thank you!",
          });
          // Close the form after a short delay
          setTimeout(onClose, 2000);
        }
      } catch (error) {
        console.error("Error checking previous feedback:", error);
      }
    };
    
    checkPreviousSubmission();
  }, [userInfo, toast, onClose]);

  // Update word count when comments change
  useEffect(() => {
    const words = comments.trim() ? comments.trim().split(/\s+/).length : 0;
    setWordCount(words);
  }, [comments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comments.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide some feedback before submitting.",
        variant: "destructive"
      });
      return;
    }
    
    if (wordCount > MAX_WORDS) {
      toast({
        title: "Too many words",
        description: `Please limit your feedback to ${MAX_WORDS} words.`,
        variant: "destructive"
      });
      return;
    }
    
    if (!userInfo?.email) {
      toast({
        title: "User information missing",
        description: "Unable to identify user. Please try again later.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Use email as unique user ID
      const user_id = userInfo.email;
      let error = null;
      
      // For special users, use upsert to overwrite previous submissions
      if (user_id === SPECIAL_USER_EMAIL) {
        const { error: upsertError } = await supabase
          .from('feedback')
          .upsert([
            { 
              user_id,
              comments: comments || null
            }
          ], {
            onConflict: 'user_id'
          });
        error = upsertError;
      } else {
        // For regular users, use standard insert (with unique constraint)
        const { error: insertError } = await supabase
          .from('feedback')
          .insert([
            { 
              user_id,
              comments: comments || null
            }
          ]);
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
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Error",
        description: "There was a problem submitting your feedback. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (alreadySubmitted) {
    return (
      <div className="p-4 text-center">
        <p className="mb-4">You have already submitted feedback. Thank you!</p>
        <FeedbackButtons 
          onPostpone={() => {}}
          onClose={onClose}
          onSubmit={() => {}}
          isSubmitting={false}
          isDisabled={true}
          hideButtons={['postpone', 'submit']}
        />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      <div className="space-y-4">
        <CommentsSection 
          value={comments} 
          onChange={setComments}
          maxWords={MAX_WORDS}
          currentWordCount={wordCount}
        />
      </div>
      
      <FeedbackButtons 
        onPostpone={onPostpone}
        onClose={onClose}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        isDisabled={!comments.trim()}
      />
    </form>
  );
};
