import { useState, useEffect } from "react";

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  timestamp: Date;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('notifications');
    return saved ? JSON.parse(saved) : [{
      id: "1",
      title: "Welcome!",
      message: "Welcome to your workspace. Get started by uploading a document or creating a task.",
      read: false,
      timestamp: new Date(),
    }];
  });
  const [notificationSound] = useState(new Audio('/sounds/notification-bell.mp3'));

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    const handleTaskNotification = (event: CustomEvent<Notification>) => {
      setNotifications(prev => {
        const newNotifications = [event.detail, ...prev];
        localStorage.setItem('notifications', JSON.stringify(newNotifications));
        notificationSound.play().catch(error => {
          console.log('Error playing notification sound:', error);
        });
        return newNotifications;
      });
    };

    window.addEventListener('taskNotification', handleTaskNotification as EventListener);

    return () => {
      window.removeEventListener('taskNotification', handleTaskNotification as EventListener);
    };
  }, [notificationSound]);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    markAsRead
  };
};