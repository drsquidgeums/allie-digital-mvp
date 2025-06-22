
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
          className="h-9 w-9 bg-background hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-sm"
          onClick={onClick}
          aria-label="Provide feedback"
        >
          <MessageSquare className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent 
        side="bottom" 
        className="z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-fade-in"
      >
        Provide feedback
      </TooltipContent>
    </Tooltip>
  );
};
