
import React from "react";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
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
          aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span 
              className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center"
              aria-label={`${unreadCount} unread notifications`}
            >
              {unreadCount}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent 
        className="sm:max-w-[425px] bg-card dark:bg-card/95 text-card-foreground border border-border shadow-lg backdrop-blur-sm"
        aria-describedby="notification-description"
      >
        <DialogHeader>
          <DialogTitle className="text-foreground dark:text-gray-200 font-semibold">
            Notifications
          </DialogTitle>
          <DialogDescription id="notification-description">
            View and manage your notifications. Use the notification list to read and dismiss items.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          <NotificationList 
            notifications={notifications} 
            onRead={markAsRead}
          />
        </div>
        <DialogClose asChild>
          <button 
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none dark:text-gray-300 dark:hover:text-gray-100 p-1"
            aria-label="Close notifications"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};
