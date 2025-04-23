
import React, { useEffect, useState } from 'react';
import { Focus, MinusCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useFocusMode, getFocusModeState } from '@/hooks/useFocusMode';
import { useFocusModeControl } from '@/hooks/focus/useFocusModeControl';
import { useFocusSettings } from '@/hooks/useFocusSettings';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export const FocusModeButton = () => {
  const { settings } = useFocusSettings();
  const { toggleFocusMode } = useFocusModeControl(settings);
  const { isFocusModeActive } = useFocusMode();
  
  const [isActive, setIsActive] = useState(isFocusModeActive);
  
  useEffect(() => {
    setIsActive(isFocusModeActive);
    
    const checkFocusState = () => {
      const globalState = getFocusModeState();
      if (globalState.active !== isActive) {
        setIsActive(globalState.active);
      }
    };
    
    window.addEventListener('focus', checkFocusState);
    document.addEventListener('click', checkFocusState);
    
    return () => {
      window.removeEventListener('focus', checkFocusState);
      document.removeEventListener('click', checkFocusState);
    };
  }, [isFocusModeActive, isActive]);
  
  const handleClick = () => {
    toggleFocusMode();
    setIsActive(!isActive);
  };
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={isActive ? "destructive" : "outline"}
          size="sm"
          onClick={handleClick}
          className={`h-9 w-9 relative transition-all duration-300 ${
            isActive ? 'bg-destructive text-destructive-foreground ring-2 ring-destructive' : ''
          }`}
          aria-label={isActive ? "Exit focus mode" : "Enter focus mode"}
        >
          {isActive ? (
            <MinusCircle className="h-4 w-4 animate-pulse" />
          ) : (
            <Focus className="h-4 w-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" align="center">
        {isActive ? "Exit focus mode" : "Enter focus mode"}
      </TooltipContent>
    </Tooltip>
  );
};
