
import React, { useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FocusSettings } from "./focus/FocusSettings";
import { FocusModeActions } from "./focus/FocusModeActions";
import { useFocusSettings } from "@/hooks/useFocusSettings";
import { useFocusModeEffects } from "./focus/useFocusModeEffects";
import { useNotificationPermission } from "@/hooks/useNotificationPermission";
import { useFullscreenChangeEffect } from "@/hooks/useFullscreenChangeEffect";
import { useFullscreen } from "@/hooks/useFullscreen";
import { useToast } from "@/hooks/use-toast";

export const FocusMode = () => {
  const [isActive, setIsActive] = useState(false);
  const { settings } = useFocusSettings();
  const { toast } = useToast();
  const cardRef = useRef<HTMLDivElement>(null);
  const { permission, requestPermission } = useNotificationPermission();
  const { enterFullscreen, exitFullscreen } = useFullscreen();
  
  // Apply focus mode effects when active
  useFocusModeEffects(isActive, settings);
  
  // Handle fullscreen change events
  useFullscreenChangeEffect(isActive, setIsActive);

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && isActive) {
      await toggleFocusMode();
    }
  };

  const toggleFocusMode = async () => {
    if (!isActive) {
      setIsActive(true);
      await enterFullscreen();
      
      const audio = new Audio('/sounds/notification-bell.mp3');
      audio.volume = 0.3;
      audio.play().catch(e => console.error('Could not play notification sound:', e));
      
      window.dispatchEvent(new CustomEvent('focusModeChanged', { detail: { active: true } }));
      
      const activeSettings = Object.entries(settings)
        .filter(([_, value]) => value)
        .map(([key]) => {
          switch(key) {
            case 'blockNotifications': return 'notifications blocked';
            case 'blockPopups': return 'popups blocked';
            case 'blockSocialMedia': return 'social media hidden';
            case 'muteAudio': return 'audio muted';
            default: return '';
          }
        })
        .filter(Boolean);
      
      const settingsMessage = activeSettings.length > 0 
        ? `Active settings: ${activeSettings.join(', ')}`
        : 'No distraction blocking settings enabled';
        
      toast({
        title: "Focus mode activated",
        description: settingsMessage,
      });
    } else {
      await exitFullscreen();
      setIsActive(false);
      
      window.dispatchEvent(new CustomEvent('focusModeChanged', { detail: { active: false } }));
      toast({
        title: "Focus mode deactivated",
        description: "Returned to normal mode",
      });
    }
  };

  return (
    <Card 
      className="w-full animate-fade-in"
      ref={cardRef}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label="Focus Mode Settings"
    >
      <CardHeader>
        <CardTitle className="text-lg">Focus Mode</CardTitle>
        <CardDescription className="text-sm">
          Select which distractions to block during your focus session
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
