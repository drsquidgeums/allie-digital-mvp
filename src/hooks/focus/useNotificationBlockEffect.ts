
import { useEffect } from "react";
import { FocusSettings } from "@/hooks/useFocusSettings";

export const useNotificationBlockEffect = (isActive: boolean, settings: FocusSettings) => {
  useEffect(() => {
    if (!isActive || !settings.blockNotifications) return;

    // Store original notification permission
    let originalPermission: NotificationPermission | null = null;
    
    if ('Notification' in window) {
      originalPermission = Notification.permission;
    }
    
    // Override the Notification API temporarily
    const originalNotification = window.Notification;
    
    // Create a mock implementation
    class MockNotification {
      static permission: NotificationPermission = 'denied';
      
      static requestPermission() {
        return Promise.resolve('denied' as NotificationPermission);
      }

      constructor(title: string, options?: NotificationOptions) {
        if (settings.blockNotifications && isActive) {
          // Log blocked notification for debugging
          console.log('Blocked notification:', title, options);
          return this;
        }
        return new originalNotification(title, options);
      }
    }
    
    // Apply the mock if needed
    if (settings.blockNotifications) {
      // @ts-ignore - Overriding native API
      window.Notification = MockNotification;
    }
    
    return () => {
      // Restore original Notification API
      window.Notification = originalNotification;
    };
  }, [isActive, settings.blockNotifications]);
};
