import React from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog/dialog-root";
import { NotificationList } from "./notifications/NotificationList";
import { useNotifications } from "@/hooks/useNotifications";

export const NotificationCenter = () => {
  const { notifications, unreadCount, markAsRead } = useNotifications();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="h-9 w-9 bg-background hover:bg-accent hover:text-accent-foreground relative"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-background text-foreground">
        <DialogHeader>
          <DialogTitle>Notifications</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          <NotificationList 
            notifications={notifications} 
            onRead={markAsRead}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};