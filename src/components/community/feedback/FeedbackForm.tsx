
import React, { useState } from "react";
import { CommentsSection } from "./CommentsSection";
import { FeedbackButtons } from "./FeedbackButtons";
import { useAlreadySubmittedCheck } from "@/hooks/feedback/useAlreadySubmittedCheck";
import { useWordCount } from "@/hooks/feedback/useWordCount";
import { useFeedbackSubmission } from "@/hooks/feedback/useFeedbackSubmission";

interface FeedbackFormProps {
  onClose: () => void;
  onPostpone: () => void;
  userInfo: { name: string; email: string } | null;
}

const MAX_WORDS = 500;

export const FeedbackForm: React.FC<FeedbackFormProps> = ({
  onClose,
  onPostpone,
  userInfo
}) => {
  const [comments, setComments] = useState<string>("");
  const userEmail = userInfo?.email;
  
  // Custom hooks
  const { alreadySubmitted } = useAlreadySubmittedCheck(userEmail);
  const { wordCount, isOverLimit } = useWordCount(comments, MAX_WORDS);
  const { isSubmitting, handleSubmit } = useFeedbackSubmission(userEmail, onClose);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(comments, MAX_WORDS, wordCount);
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
    <form onSubmit={onSubmit} className="space-y-4 pt-2">
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
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        isDisabled={!comments.trim()}
      />
    </form>
  );
};
