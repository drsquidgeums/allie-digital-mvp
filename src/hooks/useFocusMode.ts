
import { useEffect, useState } from 'react';

export const useFocusMode = () => {
  const [isFocusModeActive, setIsFocusModeActive] = useState(false);
  const [focusModeSettings, setFocusModeSettings] = useState<any>(null);

  useEffect(() => {
    const handleFocusModeChange = (event: CustomEvent) => {
      setIsFocusModeActive(event.detail.active);
      setFocusModeSettings(event.detail.settings);
      console.log('Focus mode state updated:', event.detail.active, event.detail.settings);
    };

    window.addEventListener('focusModeChanged', handleFocusModeChange as EventListener);
    
    return () => {
      window.removeEventListener('focusModeChanged', handleFocusModeChange as EventListener);
    };
  }, []);

  return { isFocusModeActive, focusModeSettings };
};
