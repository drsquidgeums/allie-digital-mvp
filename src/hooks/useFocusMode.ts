
import { useEffect, useState } from 'react';

export interface FocusModeState {
  active: boolean;
  settings: any;
}

// Create a global variable to track focus mode state across components
let globalFocusModeState: FocusModeState = {
  active: false,
  settings: null
};

export const useFocusMode = () => {
  const [isFocusModeActive, setIsFocusModeActive] = useState(globalFocusModeState.active);
  const [focusModeSettings, setFocusModeSettings] = useState<any>(globalFocusModeState.settings);

  // Update local state when global state changes
  useEffect(() => {
    const handleFocusModeChange = (event: CustomEvent) => {
      const newActive = event.detail.active;
      const newSettings = event.detail.settings;
      
      // Update global state
      globalFocusModeState = {
        active: newActive,
        settings: newSettings
      };
      
      // Update local state
      setIsFocusModeActive(newActive);
      setFocusModeSettings(newSettings);
      console.log('Focus mode state updated:', newActive, newSettings);
    };

    // Initialize local state from global state
    setIsFocusModeActive(globalFocusModeState.active);
    setFocusModeSettings(globalFocusModeState.settings);

    // Listen for focus mode change events
    window.addEventListener('focusModeChanged', handleFocusModeChange as EventListener);
    
    return () => {
      window.removeEventListener('focusModeChanged', handleFocusModeChange as EventListener);
    };
  }, []);

  return { isFocusModeActive, focusModeSettings };
};

// Export a utility to get the current focus mode state without using the hook
// This is useful for components that need to check the state but don't need to re-render
export const getFocusModeState = (): FocusModeState => {
  return { ...globalFocusModeState };
};
