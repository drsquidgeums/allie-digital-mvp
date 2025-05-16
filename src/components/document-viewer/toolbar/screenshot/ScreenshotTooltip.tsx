
import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ScreenshotTooltipProps {
  children: React.ReactNode;
  isDisabled: boolean;
}

export const ScreenshotTooltip: React.FC<ScreenshotTooltipProps> = ({ children, isDisabled }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent 
        side="bottom"
        className="bg-popover text-popover-foreground px-3 py-1.5 text-sm"
      >
        {isDisabled ? "Screenshots disabled by security policy" : "Capture screenshot"}
      </TooltipContent>
    </Tooltip>
  );
};
