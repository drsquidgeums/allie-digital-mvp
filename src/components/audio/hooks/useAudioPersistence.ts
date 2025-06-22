
import { useEffect, useState } from 'react';

export const useAudioPersistence = (
  audioRef: React.RefObject<HTMLAudioElement>,
  isPlaying: boolean,
  setIsPlaying: (playing: boolean) => void
) => {
  const [wasPausedByFocusMode, setWasPausedByFocusMode] = useState(false);
  
  useEffect(() => {
    const handleFocusModeChange = (event: CustomEvent) => {
      const { active, settings } = event.detail;
      
      // Just track focus mode state for other components to use
      if (!active && wasPausedByFocusMode) {
        setWasPausedByFocusMode(false);
      }
    };

    window.addEventListener('focusModeChanged', handleFocusModeChange as EventListener);
    
    return () => {
      window.removeEventListener('focusModeChanged', handleFocusModeChange as EventListener);
    };
  }, [wasPausedByFocusMode]);

  return {
    wasPausedByFocusMode,
    setWasPausedByFocusMode
  };
};
