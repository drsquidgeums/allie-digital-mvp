import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Focus, MinusCircle, Bell } from "lucide-react";
import { useFocusMode, getFocusModeState } from "@/hooks/useFocusMode";

interface FocusModeActionsProps {
  isActive: boolean;
  notificationPermission: NotificationPermission;
  onToggleFocus: () => void;
  onRequestNotifications: () => void;
}

export const FocusModeActions = ({
  isActive,
  notificationPermission,
  onToggleFocus,
  onRequestNotifications,
}: FocusModeActionsProps) => {
  // Get the current focus mode state to ensure it's in sync
  const { isFocusModeActive } = useFocusMode();
  
  // Add a local state that we'll keep in sync with both props and global state
  const [effectiveActive, setEffectiveActive] = useState(isActive || isFocusModeActive);
  
  // Update local state whenever the props or global state changes
  useEffect(() => {
    const newActiveState = isActive || isFocusModeActive;
    setEffectiveActive(newActiveState);
    
    // Additional sync check on focus/click
    const syncWithGlobalState = () => {
      const globalState = getFocusModeState();
      const newState = isActive || globalState.active;
      if (newState !== effectiveActive) {
        setEffectiveActive(newState);
      }
    };
    
    window.addEventListener('focus', syncWithGlobalState);
    document.addEventListener('click', syncWithGlobalState);
    
    return () => {
      window.removeEventListener('focus', syncWithGlobalState);
      document.removeEventListener('click', syncWithGlobalState);
    };
  }, [isActive, isFocusModeActive, effectiveActive]);
  
  // Enhanced click handler
  const handleToggleFocus = () => {
    onToggleFocus();
    setEffectiveActive(!effectiveActive);
  };

  return (
    <div className="space-y-4">
      {notificationPermission === "default" && (
        <Button
          variant="outline"
          onClick={onRequestNotifications}
          className="w-full text-xs"
        >
          <Bell className="w-4 h-4 mr-2" />
          Enable Notifications
        </Button>
      )}

      <Button 
        onClick={handleToggleFocus}
        variant={effectiveActive ? "destructive" : "default"}
        className={`w-full flex items-center text-xs transition-all duration-300 ${
          effectiveActive ? 'shadow-md shadow-destructive/30 ring-1 ring-destructive' : 
          'shadow hover:shadow-md hover:shadow-primary/20'
        }`}
      >
        {effectiveActive ? (
          <>
            <MinusCircle className="w-4 h-4 mr-2 animate-pulse" />
            <span>Exit Focus Mode</span>
          </>
        ) : (
          <>
            <Focus className="w-4 h-4 mr-2" />
            <span>Enter Focus Mode</span>
          </>
        )}
      </Button>
    </div>
  );
};
