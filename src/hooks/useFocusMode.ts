
import { useEffect, useState } from 'react';

export const useFocusMode = () => {
  const [isFocusModeActive, setIsFocusModeActive] = useState(false);
  const [focusModeSettings, setFocusModeSettings] = useState<any>(null);

  useEffect(() => {
    // Initialize from localStorage on mount
    const storedState = localStorage.getItem('focusModeActive');
    if (storedState === 'true') {
      setIsFocusModeActive(true);
    } else {
      setIsFocusModeActive(false);
    }

    const handleFocusModeChange = (event: CustomEvent) => {
      console.log('Focus mode state changed in useFocusMode hook:', event.detail);
      setIsFocusModeActive(event.detail.active);
      setFocusModeSettings(event.detail.settings);
    };

    // Listen for focus mode changes
    window.addEventListener('focusModeChanged', handleFocusModeChange as EventListener);
    
    // Handle global exit events
    const handleFocusModeExit = () => {
      console.log('Global focus mode exit event received in useFocusMode');
      setIsFocusModeActive(false);
      setFocusModeSettings(null);
      localStorage.setItem('focusModeActive', 'false');
      
      // Dispatch a focusModeChanged event to ensure all components update
      window.dispatchEvent(new CustomEvent('focusModeChanged', { 
        detail: { 
          active: false,
          settings: null
        } 
      }));
    };
    
    window.addEventListener('focusModeExit', handleFocusModeExit as EventListener);
    
    return () => {
      window.removeEventListener('focusModeChanged', handleFocusModeChange as EventListener);
      window.removeEventListener('focusModeExit', handleFocusModeExit as EventListener);
    };
  }, []);

  return { isFocusModeActive, focusModeSettings };
};
