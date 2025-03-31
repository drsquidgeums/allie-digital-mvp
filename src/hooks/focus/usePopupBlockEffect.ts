
import { useEffect } from "react";
import { FocusSettings } from "@/hooks/useFocusSettings";

export const usePopupBlockEffect = (isActive: boolean, settings: FocusSettings) => {
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
