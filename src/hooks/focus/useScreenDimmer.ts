
import { useEffect } from "react";
import { FocusSettings } from "@/hooks/useFocusSettings";

/**
 * Hook to apply a dimming effect to the screen during focus mode
 * 
 * Creates an overlay with adjustable opacity to reduce screen brightness
 * and help minimize eye strain and distraction
 */
export const useScreenDimmer = (isActive: boolean, settings: FocusSettings) => {
  useEffect(() => {
    // Only activate if focus mode is active and dimming is enabled in settings
    if (!isActive || !settings.dimScreen) return;
    
    console.log("Screen dimmer activated");
    
    // Create a dimming overlay
    const overlay = document.createElement('div');
    overlay.id = 'focus-mode-dimmer';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.15)'; // Slight dimming
    overlay.style.pointerEvents = 'none'; // Allow clicks to pass through
    overlay.style.zIndex = '9998'; // High but below critical UI elements
    overlay.style.transition = 'opacity 0.5s ease';
    
    // Add to document
    document.body.appendChild(overlay);
    
    return () => {
      console.log("Screen dimmer deactivated");
      const dimmer = document.getElementById('focus-mode-dimmer');
      if (dimmer) {
        // Fade out animation
        dimmer.style.opacity = '0';
        setTimeout(() => {
          dimmer.remove();
        }, 500);
      }
    };
  }, [isActive, settings.dimScreen]);
};
