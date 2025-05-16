
import React from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog/dialog-footer";

interface FeedbackButtonsProps {
  onPostpone: () => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  isDisabled: boolean;
  hideButtons?: Array<'postpone' | 'close' | 'submit'>;
}

export const FeedbackButtons: React.FC<FeedbackButtonsProps> = ({
  onPostpone,
  onClose,
  isSubmitting,
  isDisabled,
  hideButtons = []
}) => {
  return (
    <DialogFooter className="sm:justify-between gap-2">
      <div className="flex gap-2">
        {!hideButtons.includes('postpone') && (
          <Button 
            type="button"
            variant="outline" 
            onClick={onPostpone}
            disabled={isSubmitting}
            className="bg-black text-white hover:bg-gray-700 hover:text-white dark:bg-black dark:text-white dark:hover:bg-gray-700 dark:hover:text-white"
          >
            Ask Me Later
          </Button>
        )}
        
        {/* No Thanks button removed as requested */}
      </div>
      
      {!hideButtons.includes('submit') && (
        <Button 
          type="submit"
          disabled={isSubmitting || isDisabled}
          className="bg-black text-white hover:bg-gray-700 hover:text-white dark:bg-black dark:text-white dark:hover:bg-gray-700 dark:hover:text-white"
        >
          {isSubmitting ? "Submitting..." : "Submit Feedback"}
        </Button>
      )}
    </DialogFooter>
  );
};
