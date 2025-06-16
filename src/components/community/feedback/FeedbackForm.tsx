
import React, { useState } from "react";
import { useAlreadySubmittedCheck } from "@/hooks/feedback/useAlreadySubmittedCheck";
import { useFeedbackSubmission } from "@/hooks/feedback/useFeedbackSubmission";
import { useWordCount } from "@/hooks/feedback/useWordCount";
import { RatingSelect } from "./ratings/RatingSelect";
import { RecommendSelect } from "./RecommendSelect";
import { CommentsSection } from "./CommentsSection";
import { FeedbackButtons } from "./FeedbackButtons";
import { SecureTextarea } from "@/components/security/SecureTextarea";
import { commentSchema, checkRateLimit } from "@/utils/inputValidation";
import { useToast } from "@/components/ui/use-toast";

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
  const [validationError, setValidationError] = useState<string>("");
  
  const { toast } = useToast();
  const { alreadySubmitted } = useAlreadySubmittedCheck(userInfo?.email);
  const { isSubmitting, handleSubmit: submitFeedback } = useFeedbackSubmission(userInfo?.email, onClose);
  const { wordCount } = useWordCount(comments);
  
  const maxWords = 500;

  const validateComments = (value: string): boolean => {
    try {
      commentSchema.parse(value);
      setValidationError("");
      return true;
    } catch (error: any) {
      setValidationError(error.errors[0]?.message || "Invalid input");
      return false;
    }
  };

  const handleCommentsChange = (value: string) => {
    if (validateComments(value)) {
      setComments(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Rate limiting check
    const rateLimitKey = `feedback_${userInfo?.email || 'anonymous'}`;
    if (!checkRateLimit(rateLimitKey, 2, 3600000)) { // 2 attempts per hour
      toast({
        title: "Rate limit exceeded",
        description: "Please wait before submitting feedback again.",
        variant: "destructive"
      });
      return;
    }

    // Validate all required fields
    if (rating === 0 || usability === 0 || visualAppeal === 0 || wouldRecommend === null) {
      toast({
        title: "Incomplete form",
        description: "Please complete all rating fields.",
        variant: "destructive"
      });
      return;
    }

    if (!validateComments(comments)) {
      return;
    }

    const success = await submitFeedback(comments, maxWords, wordCount);
    if (success) {
      // Clear form on successful submission
      setRating(0);
      setUsability(0);
      setVisualAppeal(0);
      setWouldRecommend(null);
      setComments("");
    }
  };

  const isFormValid = rating > 0 && usability > 0 && visualAppeal > 0 && 
                     wouldRecommend !== null && comments.trim().length > 0 && 
                     !validationError;

  if (alreadySubmitted) {
    return (
      <div className="text-center py-6">
        <p className="text-lg font-medium mb-2">Thank you!</p>
        <p className="text-muted-foreground">You have already provided feedback.</p>
        <FeedbackButtons
          onPostpone={onPostpone}
          onClose={onClose}
          onSubmit={handleSubmit}
          isSubmitting={false}
          isDisabled={true}
          hideButtons={['submit', 'postpone']}
        />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <RatingSelect
          label="Overall Rating"
          value={rating}
          onChange={setRating}
          required
        />
        
        <RatingSelect
          label="Usability"
          value={usability}
          onChange={setUsability}
          required
        />
        
        <RatingSelect
          label="Visual Appeal"
          value={visualAppeal}
          onChange={setVisualAppeal}
          required
        />
        
        <RecommendSelect
          value={wouldRecommend}
          onChange={setWouldRecommend}
          required
        />
      </div>

      <div className="space-y-2">
        <CommentsSection
          value={comments}
          onChange={handleCommentsChange}
          wordCount={wordCount}
          maxWords={maxWords}
          validationError={validationError}
        />
      </div>

      <FeedbackButtons
        onPostpone={onPostpone}
        onClose={onClose}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        isDisabled={!isFormValid}
      />
    </form>
  );
};
