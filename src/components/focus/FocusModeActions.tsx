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
          className="w-full"
        >
          <Bell className="w-4 h-4 mr-2" />
          Enable Notifications
        </Button>
      )}

      <Button 
        onClick={onToggleFocus}
        variant={isActive ? "destructive" : "default"}
        className="w-full flex items-center"
      >
        {isActive ? (
          <>
            <MinusCircle className="w-4 h-4" />
            <span className="ml-6">Exit Focus Mode</span>
          </>
        ) : (
          <>
            <Focus className="w-4 h-4" />
            <span className="ml-6">Enter Focus Mode</span>
          </>
        )}
      </Button>
    </div>
  );
};