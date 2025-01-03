import React from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FocusSettingSwitch } from "./focus/FocusSettingSwitch";
import { FocusModeActions } from "./focus/FocusModeActions";
import { useFocusSettings } from "@/hooks/useFocusSettings";

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
        // Handle fullscreen
        if (settings.fullscreen) {
          await document.documentElement.requestFullscreen();
        }

        // Handle notifications
        if (settings.blockNotifications && notificationPermission === "granted") {
          localStorage.setItem('previousNotificationState', 'enabled');
        }

        // Handle background dimming
        if (settings.dimBackground) {
          document.body.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
        }

        // Handle audio muting
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
      // Disable focus mode
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }

      // Restore notification settings
      if (localStorage.getItem('previousNotificationState') === 'enabled') {
        localStorage.removeItem('previousNotificationState');
      }

      // Restore background
      document.body.style.backgroundColor = '';

      // Restore audio
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

  // Handle visibility change
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (isActive && document.hidden) {
        toast({
          title: "Stay focused!",
          description: "You've switched away from your focus session",
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isActive, toast]);

  // Handle fullscreen change
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isActive && settings.fullscreen) {
        setIsActive(false);
        toast({
          title: "Focus mode deactivated",
          description: "Fullscreen mode was exited",
        });
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [isActive, settings.fullscreen, toast]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Focus Mode</CardTitle>
        <CardDescription>
          Customize your focus session settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <FocusSettingSwitch
            label="Block Notifications"
            description="Mute all notifications during focus mode"
            checked={settings.blockNotifications}
            onCheckedChange={(checked) => updateSetting('blockNotifications', checked)}
          />

          <FocusSettingSwitch
            label="Fullscreen Mode"
            description="Enter fullscreen during focus mode"
            checked={settings.fullscreen}
            onCheckedChange={(checked) => updateSetting('fullscreen', checked)}
          />

          <FocusSettingSwitch
            label="Block Popups"
            description="Prevent popup dialogs during focus mode"
            checked={settings.blockPopups}
            onCheckedChange={(checked) => updateSetting('blockPopups', checked)}
          />

          <FocusSettingSwitch
            label="Block Social Media"
            description="Hide social media elements during focus mode"
            checked={settings.blockSocialMedia}
            onCheckedChange={(checked) => updateSetting('blockSocialMedia', checked)}
          />

          <FocusSettingSwitch
            label="Enable Pomodoro"
            description="Automatically start a Pomodoro timer"
            checked={settings.enablePomodoro}
            onCheckedChange={(checked) => updateSetting('enablePomodoro', checked)}
          />

          <FocusSettingSwitch
            label="Dim Background"
            description="Slightly dim the background for better focus"
            checked={settings.dimBackground}
            onCheckedChange={(checked) => updateSetting('dimBackground', checked)}
          />

          <FocusSettingSwitch
            label="Mute Audio"
            description="Mute all audio during focus mode"
            checked={settings.muteAudio}
            onCheckedChange={(checked) => updateSetting('muteAudio', checked)}
          />
        </div>

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