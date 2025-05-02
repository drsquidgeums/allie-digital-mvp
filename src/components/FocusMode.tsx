
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { FocusButton } from "./focus/FocusButton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Focus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const FocusMode = () => {
  const { toast } = useToast();
  
  // Add a global exit button to handle focus mode exit from any page
  const handleGlobalExit = () => {
    window.dispatchEvent(new CustomEvent('focusModeExit'));
    
    // Display toast for user feedback
    toast({
      title: "Focus mode deactivated",
      description: "Returning to normal mode",
    });
    
    // Update localStorage to ensure consistency
    localStorage.setItem('focusModeActive', 'false');
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Focus Mode</h3>
          <FocusButton />
        </div>
        
        <Alert>
          <Focus className="h-4 w-4" />
          <AlertTitle>Simple Focus Mode</AlertTitle>
          <AlertDescription>
            Click the focus button in the toolbar to toggle focus mode.
            This will block distractions and enter fullscreen mode.
            Press ESC or use the X button that appears to exit focus mode.
          </AlertDescription>
        </Alert>
        
        <div className="text-sm text-muted-foreground">
          <p>Use the X button in the corner when in focus mode to exit from any page.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FocusMode;
