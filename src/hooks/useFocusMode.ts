
import { useEffect, useState } from 'react';

export interface FocusModeSettings {
  blockNotifications?: boolean;
  blockPopups?: boolean;
  blockSocialMedia?: boolean;
  muteAudio?: boolean;
}

export const useFocusMode = () => {
  const [isFocusModeActive, setIsFocusModeActive] = useState(false);
  const [focusModeSettings, setFocusModeSettings] = useState<FocusModeSettings | null>(null);

  useEffect(() => {
    // Initialize from localStorage on mount
    const storedState = localStorage.getItem('focusModeActive');
    if (storedState === 'true') {
      setIsFocusModeActive(true);
    } else {
      setIsFocusModeActive(false);
    }

    const handleFocusModeChange = (event: CustomEvent<{active: boolean, settings: FocusModeSettings | null}>) => {
      setIsFocusModeActive(event.detail.active);
      setFocusModeSettings(event.detail.settings);
      
      // Synchronize with localStorage
      localStorage.setItem('focusModeActive', event.detail.active.toString());
    };

    // Listen for focus mode changes
    window.addEventListener('focusModeChanged', handleFocusModeChange as EventListener);
    
    // Handle global exit events
    const handleFocusModeExit = () => {
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
