
import React from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog/dialog-footer";

interface FeedbackButtonsProps {
  onPostpone: () => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  isDisabled: boolean;
}

export const FeedbackButtons: React.FC<FeedbackButtonsProps> = ({
  onPostpone,
  onClose,
  isSubmitting,
  isDisabled
}) => {
  return (
    <DialogFooter className="sm:justify-between gap-2">
      <div className="flex gap-2">
        <Button 
          type="button"
          variant="outline" 
          onClick={onPostpone}
          disabled={isSubmitting}
          className="bg-black text-white hover:bg-black/80"
        >
          Ask Me Later
        </Button>
        <Button 
          type="button"
          variant="ghost" 
          onClick={onClose}
          disabled={isSubmitting}
          className="bg-black text-white hover:bg-black/80"
        >
          No Thanks
        </Button>
      </div>
      <Button 
        type="submit"
        disabled={isSubmitting || isDisabled}
        className="bg-black text-white hover:bg-black/80"
      >
        {isSubmitting ? "Submitting..." : "Submit Feedback"}
      </Button>
    </DialogFooter>
  );
};
