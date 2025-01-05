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
      <DialogContent className="sm:max-w-[425px] dark:bg-[#1a1a1a] bg-[#f8f8f8] dark:border-gray-600/50 border-gray-200/50 shadow-2xl backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="dark:text-gray-200 text-gray-800">Notifications</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          <NotificationList 
            notifications={notifications} 
            onRead={markAsRead}
          />
        </div>
        <DialogClose asChild>
          <button className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none dark:bg-black bg-white dark:border-gray-600/50 border-gray-200/50 p-1">
            <X className="h-4 w-4 dark:text-gray-200 text-gray-800" />
            <span className="sr-only">Close</span>
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};