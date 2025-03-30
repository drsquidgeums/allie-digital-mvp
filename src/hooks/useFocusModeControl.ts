
import { useState, useCallback } from "react";
import { useToast } from "./use-toast";
import { useFullscreen } from "./useFullscreen";
import { FocusSettings } from "./useFocusSettings";

export const useFocusModeControl = (settings: FocusSettings) => {
  const [isActive, setIsActive] = useState(false);
  const { enterFullscreen, exitFullscreen } = useFullscreen();
  const { toast } = useToast();

  const toggleFocusMode = useCallback(async () => {
    try {
      if (!isActive) {
        // Activate focus mode
        setIsActive(true);
        await enterFullscreen();
        
        // Play notification sound with fallback for accessibility
        const audio = new Audio('/sounds/notification-bell.mp3');
        audio.volume = 0.3;
        audio.setAttribute('aria-hidden', 'true');
        await audio.play().catch(e => console.error('Could not play notification sound:', e));
        
        // Dispatch focus mode event for other components
        window.dispatchEvent(new CustomEvent('focusModeChanged', { 
          detail: { 
            active: true,
            settings
          } 
        }));
        
        // Create a human-readable list of active settings
        const activeSettings = Object.entries(settings)
          .filter(([_, value]) => value)
          .map(([key]) => {
            switch(key) {
              case 'blockNotifications': return 'notifications blocked';
              case 'blockPopups': return 'popups blocked';
              case 'blockSocialMedia': return 'social media hidden';
              case 'muteAudio': return 'audio muted';
              default: return '';
            }
          })
          .filter(Boolean);
        
        const settingsMessage = activeSettings.length > 0 
          ? `Active settings: ${activeSettings.join(', ')}`
          : 'No distraction blocking settings enabled';
          
        toast({
          title: "Focus mode activated",
          description: settingsMessage,
        });
        
        // Announce to screen readers
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'assertive');
        announcement.setAttribute('role', 'status');
        announcement.classList.add('sr-only');
        announcement.textContent = `Focus mode activated. ${settingsMessage}`;
        document.body.appendChild(announcement);
        
        // Remove after announcement is read
        setTimeout(() => {
          document.body.removeChild(announcement);
        }, 3000);
      } else {
        // Deactivate focus mode
        await exitFullscreen();
        setIsActive(false);
        
        // Dispatch focus mode change event
        window.dispatchEvent(new CustomEvent('focusModeChanged', { 
          detail: { 
            active: false,
            settings: null
          } 
        }));
        
        toast({
          title: "Focus mode deactivated",
          description: "Returned to normal mode",
        });
        
        // Announce to screen readers
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'assertive');
        announcement.setAttribute('role', 'status');
        announcement.classList.add('sr-only');
        announcement.textContent = "Focus mode deactivated. Returned to normal mode.";
        document.body.appendChild(announcement);
        
        // Remove after announcement is read
        setTimeout(() => {
          document.body.removeChild(announcement);
        }, 3000);
      }
    } catch (error) {
      console.error("Error toggling focus mode:", error);
      setIsActive(false);
      toast({
        title: "Focus mode error",
        description: "There was an error with focus mode. Please try again.",
        variant: "destructive"
      });
    }
  }, [isActive, settings, enterFullscreen, exitFullscreen, toast]);

  return { isActive, toggleFocusMode };
};
