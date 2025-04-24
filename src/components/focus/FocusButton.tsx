
import React from 'react';
import { Button } from "@/components/ui/button";
import { Focus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useFocusModeControl } from "@/hooks/focus/useFocusModeControl";

export const FocusButton = () => {
  const { isActive, toggleFocusMode } = useFocusModeControl({
    blockNotifications: true,
    blockPopups: true,
    blockSocialMedia: true,
    muteAudio: false, // Set to false so ambient music isn't affected
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

  return (
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
  );
};
