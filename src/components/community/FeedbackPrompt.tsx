
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog/dialog-root";
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
  // Don't render anything if there's no user info (NDA not completed)
  if (!userInfo) {
    return null;
  }

  return (
    <Dialog open={isOpen} modal>
      <DialogContent className="sm:max-w-md dark:bg-background dark:text-foreground">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Feedback</DialogTitle>
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
