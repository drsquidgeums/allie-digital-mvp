import React from "react";
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
  const { settings, updateSetting } = useFocusSettings();
  const { toast } = useToast();

  // Check notification permission on mount
  React.useEffect(() => {
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Request notification permission
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

  const toggleFocusMode = async () => {
    if (!isActive) {
      try {
        if (settings.fullscreen) {
          await document.documentElement.requestFullscreen();
        }
        if (settings.blockNotifications && notificationPermission === "granted") {
          localStorage.setItem('previousNotificationState', 'enabled');
        }
        if (settings.dimBackground) {
          document.body.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
        }
        if (settings.muteAudio) {
          document.querySelectorAll('audio, video').forEach((el: HTMLMediaElement) => {
            el.muted = true;
          });
        }

        setIsActive(true);
        window.dispatchEvent(new CustomEvent('focusModeChanged', { detail: { active: true } }));

        toast({
          title: "Focus mode activated",
          description: "Your selected focus settings have been applied",
        });
      } catch (error) {
        toast({
          title: "Error activating focus mode",
          description: "Some features might not be available",
          variant: "destructive",
        });
      }
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
      if (localStorage.getItem('previousNotificationState') === 'enabled') {
        localStorage.removeItem('previousNotificationState');
      }
      document.body.style.backgroundColor = '';
      document.querySelectorAll('audio, video').forEach((el: HTMLMediaElement) => {
        el.muted = false;
      });

      setIsActive(false);
      window.dispatchEvent(new CustomEvent('focusModeChanged', { detail: { active: false } }));

      toast({
        title: "Focus mode deactivated",
        description: "Returned to normal mode",
      });
    }
  };

  // Use the effects hook
  useFocusModeEffects(isActive, settings);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Focus Mode</CardTitle>
        <CardDescription>
          Customize your focus session settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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