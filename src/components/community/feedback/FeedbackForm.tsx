
import React, { useState } from "react";
import { RatingSelect } from "../ratings/RatingSelect";
import { RecommendSelect } from "./RecommendSelect";
import { CommentsSection } from "./CommentsSection";
import { FeedbackButtons } from "./FeedbackButtons";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FeedbackFormProps {
  onClose: () => void;
  onPostpone: () => void;
  userInfo: { name: string; email: string } | null;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({
  onClose,
  onPostpone,
  userInfo
}) => {
  const [rating, setRating] = useState<number>(0);
  const [usability, setUsability] = useState<number>(0);
  const [visualAppeal, setVisualAppeal] = useState<number>(0);
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);
  const [comments, setComments] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rating || !usability || !visualAppeal || wouldRecommend === null) {
      toast({
        title: "Missing information",
        description: "Please complete all required fields before submitting.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Get user ID if available, otherwise use a placeholder
      const user_id = userInfo?.email || "anonymous";
      
      // Store feedback in Supabase
      const { error } = await supabase
        .from('feedback')
        .insert([
          { 
            user_id,
            rating,
            usability,
            visual_appeal: visualAppeal,
            would_recommend: wouldRecommend,
            comments: comments || null
          }
        ]);
        
      if (error) throw error;
      
      toast({
        title: "Thank you for your feedback!",
        description: "Your input helps us improve the application."
      });
      
      // Store in localStorage that feedback was submitted
      localStorage.setItem("feedback_submitted", new Date().toISOString());
      
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

  const isFormIncomplete = !rating || !usability || !visualAppeal || wouldRecommend === null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      <div className="space-y-4">
        <RatingSelect 
          label="Overall Experience" 
          value={rating} 
          onChange={setRating} 
        />
        
        <RatingSelect 
          label="Ease of Use" 
          value={usability} 
          onChange={setUsability} 
        />
        
        <RatingSelect 
          label="Visual Design" 
          value={visualAppeal} 
          onChange={setVisualAppeal} 
        />
        
        <RecommendSelect 
          value={wouldRecommend} 
          onChange={setWouldRecommend} 
        />
        
        <CommentsSection 
          value={comments} 
          onChange={setComments} 
        />
      </div>
      
      <FeedbackButtons 
        onPostpone={onPostpone}
        onClose={onClose}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        isDisabled={isFormIncomplete}
      />
    </form>
  );
};
