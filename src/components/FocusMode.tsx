
import React, { useRef } from "react";
import { useToast } from "@/hooks/use-toast";
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

export const FocusMode = () => {
  const [isActive, setIsActive] = React.useState(false);
  const [notificationPermission, setNotificationPermission] = React.useState<NotificationPermission>("default");
  const { settings } = useFocusSettings();
  const { toast } = useToast();
  const cardRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      try {
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
        if (permission === "granted") {
          toast({
            title: "Notification permission granted",
            description: "You can now receive notifications",
          });
        }
      } catch (error) {
        toast({
          title: "Permission request failed",
          description: "Could not request notification permission",
          variant: "destructive",
        });
      }
    }
  };

  const enterFullscreen = async () => {
    try {
      const element = document.documentElement;
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      }
    } catch (error) {
      console.error('Error entering fullscreen:', error);
      toast({
        title: "Fullscreen mode failed",
        description: "Could not enter fullscreen mode",
        variant: "destructive",
      });
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Error exiting fullscreen:', error);
    }
  };

  const toggleFocusMode = async () => {
    if (!isActive) {
      if (settings.blockNotifications && notificationPermission === "granted") {
        localStorage.setItem('previousNotificationState', 'enabled');
      }
      if (settings.muteAudio) {
        document.querySelectorAll('audio, video').forEach((el: HTMLMediaElement) => {
          el.muted = true;
        });
      }
      await enterFullscreen();
      setIsActive(true);
      window.dispatchEvent(new CustomEvent('focusModeChanged', { detail: { active: true } }));
      toast({
        title: "Focus mode activated",
        description: "Your selected focus settings have been applied",
      });
    } else {
      if (localStorage.getItem('previousNotificationState') === 'enabled') {
        localStorage.removeItem('previousNotificationState');
      }
      document.querySelectorAll('audio, video').forEach((el: HTMLMediaElement) => {
        el.muted = false;
      });
      await exitFullscreen();
      setIsActive(false);
      window.dispatchEvent(new CustomEvent('focusModeChanged', { detail: { active: false } }));
      toast({
        title: "Focus mode deactivated",
        description: "Returned to normal mode",
      });
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && isActive) {
      await toggleFocusMode();
    }
  };

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isActive) {
        toggleFocusMode();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isActive]);

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
          Customize your focus session settings
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
          notificationPermission={notificationPermission}
          onToggleFocus={toggleFocusMode}
          onRequestNotifications={requestNotificationPermission}
        />
      </CardContent>
    </Card>
  );
};
