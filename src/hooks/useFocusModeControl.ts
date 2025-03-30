
import { useState } from "react";
import { useToast } from "./use-toast";
import { useFullscreen } from "./useFullscreen";
import { FocusSettings } from "./useFocusSettings";

export const useFocusModeControl = (settings: FocusSettings) => {
  const [isActive, setIsActive] = useState(false);
  const { enterFullscreen, exitFullscreen } = useFullscreen();
  const { toast } = useToast();

  const toggleFocusMode = async () => {
    if (!isActive) {
      setIsActive(true);
      await enterFullscreen();
      
      const audio = new Audio('/sounds/notification-bell.mp3');
      audio.volume = 0.3;
      audio.play().catch(e => console.error('Could not play notification sound:', e));
      
      window.dispatchEvent(new CustomEvent('focusModeChanged', { detail: { active: true } }));
      
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
    } else {
      await exitFullscreen();
      setIsActive(false);
      
      window.dispatchEvent(new CustomEvent('focusModeChanged', { detail: { active: false } }));
      toast({
        title: "Focus mode deactivated",
        description: "Returned to normal mode",
      });
    }
  };

  return { isActive, toggleFocusMode };
};
