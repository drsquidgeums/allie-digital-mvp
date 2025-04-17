
import React from "react";
import { Button } from "@/components/ui/button";
import { Focus, MinusCircle, Bell } from "lucide-react";

interface FocusModeActionsProps {
  isActive: boolean;
  notificationPermission: NotificationPermission;
  onToggleFocus: () => void;
  onRequestNotifications: () => void;
}

export const FocusModeActions = ({
  isActive,
  notificationPermission,
  onToggleFocus,
  onRequestNotifications,
}: FocusModeActionsProps) => {
  return (
    <div className="space-y-4">
      {notificationPermission === "default" && (
        <Button
          variant="outline"
          onClick={onRequestNotifications}
          className="w-full text-xs"
        >
          <Bell className="w-4 h-4 mr-2" />
          Enable Notifications
        </Button>
      )}

      <div className="space-y-2">
        <Button 
          onClick={onToggleFocus}
          variant={isActive ? "destructive" : "default"}
          className="w-full flex items-center text-xs"
        >
          <Focus className="w-4 h-4 mr-2" />
          <span>Enter Focus Mode</span>
        </Button>

        <Button 
          onClick={onToggleFocus}
          variant="destructive"
          className="w-full flex items-center text-xs"
          disabled={!isActive}
        >
          <MinusCircle className="w-4 h-4 mr-2" />
          <span>Exit Focus Mode</span>
        </Button>
      </div>
    </div>
  );
};
