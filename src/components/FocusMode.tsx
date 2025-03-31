
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
      className={`w-full animate-fade-in transition-all duration-300 ${
        isActive ? 'border-primary shadow-lg shadow-primary/20' : ''
      }`}
      ref={cardRef}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label="Focus Mode Settings"
      tabIndex={0}
      data-active={isActive}
    >
      <CardHeader className="pb-1 pt-3">
        <CardTitle className={`text-lg flex items-center gap-2 ${
          isActive ? 'text-primary' : ''
        }`}>
          Focus Mode
          {isActive && (
            <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
              Active
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        <FocusModeStatus isActive={isActive} />
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
