
import React from 'react';
import { Button } from "@/components/ui/button";
import { Focus, CircleX } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useFocusModeControl } from "@/hooks/focus/useFocusModeControl";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export const FocusButton = () => {
  const { isActive, toggleFocusMode } = useFocusModeControl({
    blockNotifications: true,
    blockPopups: true,
    blockSocialMedia: true,
    muteAudio: false,
  });
  const { toast } = useToast();

  const handleToggle = async () => {
    try {
      await toggleFocusMode();
      toast({
        title: isActive ? "Focus mode deactivated" : "Focus mode activated",
        description: isActive 
          ? "Returning to normal mode" 
          : "Entering distraction-free environment",
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

  // Exit button for when in fullscreen mode
  const ExitButton = () => {
    if (!isActive) return null;
    
    return (
      <Button
        variant="outline" 
        size="icon"
        onClick={handleToggle}
        className="fixed top-4 right-4 z-[100] bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20"
        aria-label="Exit focus mode"
      >
        <CircleX className="h-5 w-5 text-white" />
      </Button>
    );
  };

  return (
    <>
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

      <ExitButton />
    </>
  );
};
