
import React from "react";
import { useToast } from "./use-toast";

export const useNotificationPermission = () => {
  const [permission, setPermission] = React.useState<NotificationPermission>("default");
  const { toast } = useToast();

  // Check notification permission on mount
  React.useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if ("Notification" in window) {
      try {
        const newPermission = await Notification.requestPermission();
        setPermission(newPermission);
        if (newPermission === "granted") {
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

  return { permission, requestPermission };
};
