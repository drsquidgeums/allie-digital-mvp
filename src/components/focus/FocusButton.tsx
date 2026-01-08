
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Focus } from "lucide-react";
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

  // Debug the focus mode state when component mounts
  useEffect(() => {
    console.log('FocusButton mounted, isActive:', isActive);
  }, [isActive]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          onClick={handleToggle}
          className={cn(
            "h-9 w-9 relative bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            isActive && "bg-primary text-primary-foreground ring-2 ring-primary hover:bg-primary/90"
          )}
          aria-label={isActive ? "Exit focus mode" : "Enter focus mode"}
        >
          <Focus className="h-4 w-4" />
          {isActive && (
            <div 
              className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"
              role="status"
              aria-label="Focus mode active"
            />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent 
        side="bottom"
        className="bg-popover text-popover-foreground px-3 py-1.5 text-sm"
      >
        {isActive ? "Exit focus mode" : "Enter focus mode"}
      </TooltipContent>
    </Tooltip>
  );
};
