
import React from "react";
import { useTranslation } from "react-i18next";

interface NotificationItemProps {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  onRead: (id: string) => void;
}

export const NotificationItem = ({ 
  id, 
  title, 
  message, 
  timestamp, 
  read, 
  onRead 
}: NotificationItemProps) => {
  const { i18n } = useTranslation();

  return (
    <div
      className={`p-3 rounded-lg ${
        read 
          ? "bg-muted hover:bg-muted/80 dark:bg-muted/30 dark:hover:bg-muted/40" 
          : "bg-background hover:bg-accent dark:bg-background/50 dark:hover:bg-accent/50"
      } cursor-pointer transition-colors border border-border`}
      onClick={() => onRead(id)}
    >
      <div className="flex justify-between items-start">
        <h4 className="text-sm font-medium text-foreground dark:text-gray-200">
          {title}
        </h4>
        <span className="text-xs text-muted-foreground dark:text-gray-400">
          {new Date(timestamp).toLocaleTimeString(i18n.language, {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          })}
        </span>
      </div>
      <p className="text-sm text-muted-foreground dark:text-gray-300 mt-1">
        {message}
      </p>
    </div>
  );
};
