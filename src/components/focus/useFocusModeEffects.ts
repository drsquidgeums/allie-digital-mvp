
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { FocusSettings } from "@/hooks/useFocusSettings";

export const useFocusModeEffects = (isActive: boolean, settings: FocusSettings) => {
  const { toast } = useToast();

  // Handle visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (isActive && document.hidden && settings.blockPopups) {
        toast({
          title: "Stay focused!",
          description: "You've switched away from your focus session",
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isActive, settings.blockPopups, toast]);

  // Handle social media blocking
  useEffect(() => {
    if (!isActive || !settings.blockSocialMedia) return;

    // Get all social media elements (by class or data attribute)
    const socialElements = document.querySelectorAll('.social-media, [data-social="true"]');
    
    // Store original display values
    const originalStyles = new Map();
    
    socialElements.forEach((element) => {
      const el = element as HTMLElement;
      originalStyles.set(el, el.style.display);
      el.style.display = 'none';
    });

    return () => {
      // Restore original display values
      socialElements.forEach((element) => {
        const el = element as HTMLElement;
        const originalDisplay = originalStyles.get(el);
        el.style.display = originalDisplay || '';
      });
    };
  }, [isActive, settings.blockSocialMedia]);

  // Handle audio muting
  useEffect(() => {
    if (!isActive || !settings.muteAudio) return;

    // Store original muted states for all media elements
    const mediaElements = document.querySelectorAll('audio, video');
    const originalMutedStates = new Map();
    
    // Special handling for the global audio player
    if (window.globalAudioPlayer) {
      originalMutedStates.set('globalAudioPlayer', window.globalAudioPlayer.muted);
      window.globalAudioPlayer.muted = true;
      
      // Also store original volume to restore it later
      originalMutedStates.set('globalAudioPlayerVolume', window.globalAudioPlayer.volume);
    }
    
    // Handle all other media elements
    mediaElements.forEach((element) => {
      const el = element as HTMLMediaElement;
      originalMutedStates.set(el, el.muted);
      el.muted = true;
    });

    // Handle dynamically added audio/video elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach((node) => {
            if ((node as Element).tagName === 'AUDIO' || (node as Element).tagName === 'VIDEO') {
              (node as HTMLMediaElement).muted = true;
            }
          });
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      // Restore original muted states
      mediaElements.forEach((element) => {
        const el = element as HTMLMediaElement;
        const wasOriginallyMuted = originalMutedStates.get(el);
        el.muted = wasOriginallyMuted || false;
      });
      
      // Restore global audio player state
      if (window.globalAudioPlayer) {
        window.globalAudioPlayer.muted = originalMutedStates.get('globalAudioPlayer') || false;
      }
      
      observer.disconnect();
    };
  }, [isActive, settings.muteAudio]);

  // Handle notification blocking
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

  // Block popups effect
  useEffect(() => {
    if (!isActive || !settings.blockPopups) return;

    // Store original functions
    const originalOpen = window.open;
    const originalAlert = window.alert;
    const originalConfirm = window.confirm;
    const originalPrompt = window.prompt;
    
    // Override functions to block popups
    window.open = function(...args) {
      console.log('Popup blocked:', args);
      return null;
    };
    
    window.alert = function(message) {
      console.log('Alert blocked:', message);
      return undefined;
    };
    
    window.confirm = function(message) {
      console.log('Confirm dialog blocked:', message);
      return false;
    };
    
    window.prompt = function(message, _default) {
      console.log('Prompt dialog blocked:', message);
      return null;
    };
    
    return () => {
      // Restore original functions
      window.open = originalOpen;
      window.alert = originalAlert;
      window.confirm = originalConfirm;
      window.prompt = originalPrompt;
    };
  }, [isActive, settings.blockPopups]);
};
