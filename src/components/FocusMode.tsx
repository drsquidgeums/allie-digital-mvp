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
import { useFocusModeEffects } from "./focus/useFocusModeEffects";

export const FocusMode = () => {
  const [isActive, setIsActive] = React.useState(false);
  const [notificationPermission, setNotificationPermission] = React.useState<NotificationPermission>("default");
  const { settings } = useFocusSettings();
  const { toast } = useToast();
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Apply focus mode effects when active
  useFocusModeEffects(isActive, settings);

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
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if ((elem as any).webkitRequestFullscreen) { // Safari
        await (elem as any).webkitRequestFullscreen();
      } else if ((elem as any).msRequestFullscreen) { // IE11
        await (elem as any).msRequestFullscreen();
      } else if ((elem as any).mozRequestFullScreen) { // Firefox
        await (elem as any).mozRequestFullScreen();
      }
    } catch (error) {
      console.error('Error entering fullscreen:', error);
      toast({
        title: "Fullscreen mode failed",
        description: "Could not enter fullscreen mode. Please check your browser settings.",
        variant: "destructive",
      });
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) { // Safari
        await (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) { // IE11
        await (document as any).msExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) { // Firefox
        await (document as any).mozCancelFullScreen();
      }
    } catch (error) {
      console.error('Error exiting fullscreen:', error);
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

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && isActive) {
      await toggleFocusMode();
    }
  };

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && 
          !(document as any).webkitFullscreenElement && 
          !(document as any).mozFullScreenElement &&
          !(document as any).msFullscreenElement && 
          isActive) {
        setIsActive(false);
        window.dispatchEvent(new CustomEvent('focusModeChanged', { detail: { active: false } }));
        toast({
          title: "Focus mode deactivated",
          description: "Fullscreen mode was exited",
        });
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, [isActive, toast]);

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
          notificationPermission={notificationPermission}
          onToggleFocus={toggleFocusMode}
          onRequestNotifications={requestNotificationPermission}
        />
      </CardContent>
    </Card>
  );
};
