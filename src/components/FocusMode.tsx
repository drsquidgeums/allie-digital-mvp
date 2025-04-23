
import React, { useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FocusSettings } from "./focus/FocusSettings";
import { FocusModeActions } from "./focus/FocusModeActions";
import { FocusModeStatus } from "./focus/FocusModeStatus";
import { useFocusSettings } from "@/hooks/useFocusSettings";
import { useFocusModeEffects } from "./focus/useFocusModeEffects";
import { useNotificationPermission } from "@/hooks/useNotificationPermission";
import { useFullscreenChangeEffect } from "@/hooks/useFullscreenChangeEffect";
import { useFocusModeControl } from "@/hooks/focus/useFocusModeControl";
import { useFocusMode } from "@/hooks/useFocusMode";

export const FocusMode = () => {
  const { settings } = useFocusSettings();
  const { permission, requestPermission } = useNotificationPermission();
  const cardRef = useRef<HTMLDivElement>(null);
  const { isActive, toggleFocusMode } = useFocusModeControl(settings);
  const { isFocusModeActive } = useFocusMode(); // Use shared state
  
  // The active state for UI should honor both local and global state
  const effectiveActive = isActive || isFocusModeActive;
  
  // Apply focus mode effects when active
  useFocusModeEffects(effectiveActive, settings);
  
  // Handle fullscreen change events
  useFullscreenChangeEffect(effectiveActive, setIsActive => {
    if (!effectiveActive) {
      toggleFocusMode();
    }
  });

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && effectiveActive) {
      await toggleFocusMode();
    }
  };

  return (
    <Card 
      className={`w-full animate-fade-in transition-all duration-300 ${
        effectiveActive ? 'border-primary shadow-lg shadow-primary/20' : ''
      }`}
      ref={cardRef}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label="Focus Mode Settings"
      tabIndex={0}
      data-active={effectiveActive}
    >
      <CardHeader className="pb-1 pt-3">
        <CardTitle className={`text-lg flex items-center gap-2 ${
          effectiveActive ? 'text-primary' : ''
        }`}>
          Focus Mode
          {effectiveActive && (
            <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
              Active
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        <FocusModeStatus isActive={effectiveActive} />
        <FocusSettings />
        <FocusModeActions
          isActive={effectiveActive}
          notificationPermission={permission}
          onToggleFocus={toggleFocusMode}
          onRequestNotifications={requestPermission}
        />
      </CardContent>
    </Card>
  );
};
