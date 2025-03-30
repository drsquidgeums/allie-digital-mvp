
import React, { useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FocusSettings } from "./focus/FocusSettings";
import { FocusModeActions } from "./focus/FocusModeActions";
import { useFocusSettings } from "@/hooks/useFocusSettings";
import { useFocusModeEffects } from "./focus/useFocusModeEffects";
import { useNotificationPermission } from "@/hooks/useNotificationPermission";
import { useFullscreenChangeEffect } from "@/hooks/useFullscreenChangeEffect";
import { useFocusModeControl } from "@/hooks/useFocusModeControl";

export const FocusMode = () => {
  const { settings } = useFocusSettings();
  const { permission, requestPermission } = useNotificationPermission();
  const cardRef = useRef<HTMLDivElement>(null);
  const { isActive, toggleFocusMode } = useFocusModeControl(settings);
  
  // Apply focus mode effects when active
  useFocusModeEffects(isActive, settings);
  
  // Handle fullscreen change events
  useFullscreenChangeEffect(isActive, setIsActive => {
    if (!isActive) {
      toggleFocusMode();
    }
  });

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && isActive) {
      await toggleFocusMode();
    }
  };

  return (
    <Card 
      className="w-full animate-fade-in"
      ref={cardRef}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label="Focus Mode Settings"
      tabIndex={0}
    >
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-lg">Focus Mode</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        <div 
          role="status" 
          aria-live="polite"
          className="sr-only"
        >
          {isActive ? "Focus mode is active" : "Focus mode is inactive"}
        </div>
        <FocusSettings />
        <FocusModeActions
          isActive={isActive}
          notificationPermission={permission}
          onToggleFocus={toggleFocusMode}
          onRequestNotifications={requestPermission}
        />
      </CardContent>
    </Card>
  );
};
