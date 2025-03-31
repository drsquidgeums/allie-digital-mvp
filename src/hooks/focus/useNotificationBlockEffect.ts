
import { useEffect } from "react";
import { FocusSettings } from "@/hooks/useFocusSettings";

export const useNotificationBlockEffect = (isActive: boolean, settings: FocusSettings) => {
  useEffect(() => {
    if (!isActive || !settings.blockNotifications) return;

    console.log("Notification blocking activated");

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
        console.log('Notification permission request blocked by focus mode');
        return Promise.resolve('denied' as NotificationPermission);
      }

      constructor(title: string, options?: NotificationOptions) {
        console.log('Blocked notification:', title, options);
        return this;
      }
      
      // Mock common methods
      close() {}
      addEventListener() {}
      removeEventListener() {}
      dispatchEvent() { return true; }
    }
    
    // Apply the mock
    // @ts-ignore - Overriding native API
    window.Notification = MockNotification;
    
    // Also block the notification center if available
    const notificationCenter = document.querySelector('.notification-center');
    let originalNotificationCenterDisplay = '';
    
    if (notificationCenter) {
      const el = notificationCenter as HTMLElement;
      originalNotificationCenterDisplay = el.style.display;
      el.style.display = 'none';
    }
    
    return () => {
      console.log("Notification blocking deactivated");
      
      // Restore original Notification API
      window.Notification = originalNotification;
      
      // Restore notification center
      if (notificationCenter) {
        const el = notificationCenter as HTMLElement;
        el.style.display = originalNotificationCenterDisplay;
      }
    };
  }, [isActive, settings.blockNotifications]);
};
