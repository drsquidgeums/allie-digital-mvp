
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
  return (
    <Dialog open={isOpen} modal>
      <DialogContent className="sm:max-w-md">
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
