
import { useEffect } from "react";
import { FocusSettings } from "@/hooks/useFocusSettings";

export const useSocialMediaBlockEffect = (isActive: boolean, settings: FocusSettings) => {
  useEffect(() => {
    if (!isActive || !settings.blockSocialMedia) return;

    console.log("Social media blocking activated");

    // Get all social media elements (by class or data attribute)
    const socialElements = document.querySelectorAll('.social-media, [data-social="true"]');
    
    // Store original display values
    const originalStyles = new Map();
    
    socialElements.forEach((element) => {
      const el = element as HTMLElement;
      originalStyles.set(el, el.style.display);
      el.style.display = 'none';
    });
    
    // Create an observer to catch dynamically added social media elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) { // Element node
              const el = node as HTMLElement;
              if (el.classList.contains('social-media') || el.getAttribute('data-social') === 'true') {
                originalStyles.set(el, el.style.display);
                el.style.display = 'none';
              }
              
              // Also check children
              el.querySelectorAll('.social-media, [data-social="true"]').forEach((child) => {
                const childEl = child as HTMLElement;
                originalStyles.set(childEl, childEl.style.display);
                childEl.style.display = 'none';
              });
            }
          });
        }
      });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      console.log("Social media blocking deactivated");
      
      // Restore original display values
      socialElements.forEach((element) => {
        const el = element as HTMLElement;
        const originalDisplay = originalStyles.get(el);
        if (el) {
          try {
            el.style.display = originalDisplay || '';
          } catch (e) {
            console.error('Error restoring social media element style:', e);
          }
        }
      });
      
      observer.disconnect();
    };
  }, [isActive, settings.blockSocialMedia]);
};
