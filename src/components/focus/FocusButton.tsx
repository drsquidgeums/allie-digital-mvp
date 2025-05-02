
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Focus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useFocusModeControl } from "@/hooks/focus/useFocusModeControl";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useFocusMode } from '@/hooks/useFocusMode';

export const FocusButton = () => {
  const { isActive: controlIsActive, toggleFocusMode } = useFocusModeControl({
    blockNotifications: true,
    blockPopups: true,
    blockSocialMedia: true,
    muteAudio: false,
  });
  
  // Use the global focus mode state to ensure consistency across the app
  const { isFocusModeActive } = useFocusMode();
  const [isActive, setIsActive] = useState(false);
  const { toast } = useToast();

  // Sync with localStorage and global state
  useEffect(() => {
    const syncState = () => {
      const storedState = localStorage.getItem('focusModeActive');
      const newState = storedState === 'true';
      if (isActive !== newState) {
        setIsActive(newState);
      }
    };
    
    // Initial sync
    syncState();
    
    // Set up interval to check for changes
    const intervalId = setInterval(syncState, 500);
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Sync with the useFocusMode hook
  useEffect(() => {
    setIsActive(isFocusModeActive);
  }, [isFocusModeActive]);

  // Also sync with the control state
  useEffect(() => {
    setIsActive(controlIsActive);
  }, [controlIsActive]);

  const handleToggle = async () => {
    try {
      await toggleFocusMode();
      const newState = !isActive;
      toast({
        title: newState ? "Focus mode activated" : "Focus mode deactivated",
        description: newState 
          ? "Entering distraction-free environment" 
          : "Returning to normal mode",
      });
    } catch (error) {
      console.error('Error toggling focus mode:', error);
      toast({
        title: "Error",
        description: "Could not toggle focus mode",
        variant: "destructive",
      });
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggle}
          className={cn(
            "h-9 w-9 relative",
            isActive && "bg-red-500 text-white hover:bg-red-600",
            !isActive && "hover:bg-accent hover:text-accent-foreground"
          )}
          aria-label={isActive ? "Exit focus mode" : "Enter focus mode"}
        >
          <Focus className="h-4 w-4" />
          {isActive && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>{isActive ? "Exit Focus Mode" : "Focus Mode"}</p>
      </TooltipContent>
    </Tooltip>
  );
};
