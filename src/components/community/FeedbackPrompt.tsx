
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog/dialog-root";
import { FeedbackForm } from "./feedback/FeedbackForm";

interface FeedbackPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onPostpone: () => void;
  userInfo: { name: string; email: string } | null;
}

export const FeedbackPrompt: React.FC<FeedbackPromptProps> = ({
  isOpen,
  onClose,
  onPostpone,
  userInfo
}) => {
  return (
    <Dialog open={isOpen} modal>
      <DialogContent className="sm:max-w-md dark:bg-background dark:text-foreground" role="dialog" aria-labelledby="feedback-title" aria-describedby="feedback-description">
        <DialogHeader>
          <DialogTitle id="feedback-title" className="text-center text-xl">Feedback</DialogTitle>
          <DialogDescription id="feedback-description" className="text-center text-sm text-muted-foreground">
            Share your thoughts and help us improve your experience with the application.
          </DialogDescription>
        </DialogHeader>
        
        <FeedbackForm
          onClose={onClose}
          onPostpone={onPostpone}
          userInfo={userInfo}
        />
      </DialogContent>
    </Dialog>
  );
};
