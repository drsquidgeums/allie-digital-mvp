
import { useEffect } from "react";
import { FocusSettings } from "@/hooks/useFocusSettings";

export const useSocialMediaBlockEffect = (isActive: boolean, settings: FocusSettings) => {
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
};
