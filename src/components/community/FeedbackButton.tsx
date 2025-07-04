
import React from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FeedbackButtonProps {
  onClick: () => void;
}

export const FeedbackButton: React.FC<FeedbackButtonProps> = ({ onClick }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 w-9 card-interactive focus-enhanced"
          onClick={onClick}
          aria-label="Provide feedback"
        >
          <MessageSquare className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent 
        side="bottom" 
        className="dialog-elevated z-50 overflow-hidden rounded-md px-3 py-1.5 text-sm shadow-md animate-fade-in"
      >
        Provide feedback
      </TooltipContent>
    </Tooltip>
  );
};
