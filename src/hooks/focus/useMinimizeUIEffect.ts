
import { useEffect } from "react";
import { FocusSettings } from "@/hooks/useFocusSettings";

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
    
    // Simplify UI by adding a class to the body
    document.body.classList.add('focus-mode-active');
    
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
    };
  }, [isActive, settings.minimizeDistraction]);
};
