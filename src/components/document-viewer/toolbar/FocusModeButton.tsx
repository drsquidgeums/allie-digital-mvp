
import React from 'react';
import { Focus, MinusCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useFocusMode } from '@/hooks/useFocusMode';
import { useFocusModeControl } from '@/hooks/focus/useFocusModeControl';
import { useFocusSettings } from '@/hooks/useFocusSettings';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export const FocusModeButton = () => {
  const { settings } = useFocusSettings();
  const { toggleFocusMode } = useFocusModeControl(settings);
  const { isFocusModeActive } = useFocusMode();
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={isFocusModeActive ? "destructive" : "outline"}
          size="sm"
          onClick={toggleFocusMode}
          className={`h-9 w-9 relative transition-all duration-300 ${
            isFocusModeActive ? 'bg-destructive text-destructive-foreground ring-2 ring-destructive' : ''
          }`}
          aria-label={isFocusModeActive ? "Exit focus mode" : "Enter focus mode"}
        >
          {isFocusModeActive ? (
            <MinusCircle className="h-4 w-4 animate-pulse" />
          ) : (
            <Focus className="h-4 w-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" align="center">
        {isFocusModeActive ? "Exit focus mode" : "Enter focus mode"}
      </TooltipContent>
    </Tooltip>
  );
};
