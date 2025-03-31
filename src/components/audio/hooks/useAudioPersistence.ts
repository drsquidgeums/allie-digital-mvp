
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
      
      console.log('Audio persistence detected focus mode change:', { active, settings });
      
      // Just track focus mode state for other components to use
      if (!active && wasPausedByFocusMode) {
        setWasPausedByFocusMode(false);
        console.log('Focus mode deactivated, audio can be played again');
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
