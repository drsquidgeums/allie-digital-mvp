import React from "react";
import { Button } from "./ui/button";
import { Focus, Bell, BellOff, Maximize, MinusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface FocusSettings {
  blockNotifications: boolean;
  fullscreen: boolean;
  blockPopups: boolean;
}

export const FocusMode = () => {
  const [isActive, setIsActive] = React.useState(false);
  const [notificationPermission, setNotificationPermission] = React.useState<NotificationPermission>("default");
  const [settings, setSettings] = React.useState<FocusSettings>({
    blockNotifications: true,
    fullscreen: true,
    blockPopups: true,
  });
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
      // Enable focus mode
      try {
        // Handle fullscreen
        if (settings.fullscreen) {
          await document.documentElement.requestFullscreen();
        }

        // Handle notifications
        if (settings.blockNotifications && notificationPermission === "granted") {
          // Store current notification settings to restore later
          localStorage.setItem('previousNotificationState', 'enabled');
        }

        // Set focus mode as active
        setIsActive(true);
        
        // Dispatch custom event to notify other components
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

      setIsActive(false);
      
      // Notify other components
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
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Block Notifications</Label>
              <div className="text-sm text-muted-foreground">
                Mute all notifications during focus mode
              </div>
            </div>
            <Switch
              checked={settings.blockNotifications}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, blockNotifications: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Fullscreen Mode</Label>
              <div className="text-sm text-muted-foreground">
                Enter fullscreen during focus mode
              </div>
            </div>
            <Switch
              checked={settings.fullscreen}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, fullscreen: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Block Popups</Label>
              <div className="text-sm text-muted-foreground">
                Prevent popup dialogs during focus mode
              </div>
            </div>
            <Switch
              checked={settings.blockPopups}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, blockPopups: checked }))
              }
            />
          </div>
        </div>

        {notificationPermission === "default" && (
          <Button
            variant="outline"
            onClick={requestNotificationPermission}
            className="w-full"
          >
            <Bell className="w-4 h-4 mr-2" />
            Enable Notifications
          </Button>
        )}

        <Button 
          onClick={toggleFocusMode}
          variant={isActive ? "destructive" : "default"}
          className="w-full"
        >
          {isActive ? (
            <>
              <MinusCircle className="w-4 h-4 mr-2" />
              Exit Focus Mode
            </>
          ) : (
            <>
              <Focus className="w-4 h-4 mr-2" />
              Enter Focus Mode
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};