import { useEffect, useState } from 'react';

export const useFocusMode = () => {
  const [isFocusModeActive, setIsFocusModeActive] = useState(false);

  useEffect(() => {
    const handleFocusModeChange = (event: CustomEvent) => {
      setIsFocusModeActive(event.detail.active);
    };

    window.addEventListener('focusModeChanged', handleFocusModeChange as EventListener);
    
    return () => {
      window.removeEventListener('focusModeChanged', handleFocusModeChange as EventListener);
    };
  }, []);

  return isFocusModeActive;
};