
import React from "react";
import { NotificationItem } from "./NotificationItem";
import { useTranslation } from "react-i18next";

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  timestamp: Date;
}

interface NotificationListProps {
  notifications: Notification[];
  onRead: (id: string) => void;
}

export const NotificationList = ({ notifications, onRead }: NotificationListProps) => {
  const { t } = useTranslation();

  if (notifications.length === 0) {
    return <p className="text-sm text-muted-foreground">{t('notifications.empty', 'No notifications')}</p>;
  }

  return (
    <div className="space-y-2">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          {...notification}
          onRead={onRead}
        />
      ))}
    </div>
  );
};
