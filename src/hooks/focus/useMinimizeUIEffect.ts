
import { useEffect } from "react";
import { FocusSettings } from "@/hooks/useFocusSettings";

/**
 * Hook to minimize UI distractions during focus mode
 * 
 * Hides non-essential UI elements to create a cleaner, 
 * more focused workspace environment
 */
export const useMinimizeUIEffect = (isActive: boolean, settings: FocusSettings) => {
  useEffect(() => {
    if (!isActive || !settings.minimizeDistraction) return;

    console.log("UI minimization activated");
    
    // Store original styles
    const distractingElements = [
      '.sidebar-tools',
      '.notification-area',
      '.chat-bubble',
      '.music-controls',
      '.banner-ad',
      '.promotion-banner',
      '.social-links',
      '.advertisement',
      '.recommendation-panel',
      '.trending-section'
    ];
    
    const originalStyles = new Map();
    
    // Hide distracting UI elements
    distractingElements.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        const el = element as HTMLElement;
        originalStyles.set(el, el.style.display);
        el.style.display = 'none';
      });
    });
    
    // Apply focus mode class to body for CSS targeting
    document.body.classList.add('focus-mode-active');
    
    // Apply reduced motion preference
    if (settings.reduceMotion) {
      document.documentElement.style.setProperty('--reduced-motion', 'reduce');
    }
    
    return () => {
      console.log("UI minimization deactivated");
      
      // Restore original styles
      distractingElements.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          const el = element as HTMLElement;
          if (originalStyles.has(el)) {
            el.style.display = originalStyles.get(el) || '';
          }
        });
      });
      
      document.body.classList.remove('focus-mode-active');
      
      // Reset reduced motion preference
      document.documentElement.style.removeProperty('--reduced-motion');
    };
  }, [isActive, settings.minimizeDistraction, settings.reduceMotion]);
};
