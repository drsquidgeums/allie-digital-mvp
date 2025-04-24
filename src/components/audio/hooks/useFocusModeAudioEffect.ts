
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAudioPersistence } from './useAudioPersistence';

export const useFocusModeAudioEffect = (
  audioRef: React.RefObject<HTMLAudioElement>,
  isPlaying: boolean, 
  setIsPlaying: (playing: boolean) => void
) => {
  const [isFocusModeActive, setIsFocusModeActive] = useState(false);
  const { wasPausedByFocusMode, setWasPausedByFocusMode } = useAudioPersistence(audioRef, isPlaying, setIsPlaying);
  const { toast } = useToast();

  // Listen for focus mode changes
  useEffect(() => {
    const handleFocusModeChange = (event: CustomEvent) => {
      const { active, settings } = event.detail;
      
      console.log('Focus mode change detected in music control:', { active, settings });
      
      // Ambient music should continue playing during focus mode
      setIsFocusModeActive(false); // Always keep music enabled
    };
    
    // Listen for specific audio muting events
    const handleAudioMutingChanged = (event: CustomEvent) => {
      // We're ignoring audio muting events from focus mode
      const { source } = event.detail;
      if (source === 'focus-mode') {
        console.log('Ignoring audio muting from focus mode to keep ambient music playing');
        return;
      }
    };
    
    window.addEventListener('focusModeChanged', handleFocusModeChange as EventListener);
    window.addEventListener('audioMutingChanged', handleAudioMutingChanged as EventListener);
    
    return () => {
      window.removeEventListener('focusModeChanged', handleFocusModeChange as EventListener);
      window.removeEventListener('audioMutingChanged', handleAudioMutingChanged as EventListener);
    };
  }, [audioRef, wasPausedByFocusMode, isFocusModeActive, setIsPlaying, setWasPausedByFocusMode, toast]);

  return {
    isFocusModeActive: false, // Always return false to keep music enabled
    wasPausedByFocusMode,
    setWasPausedByFocusMode
  };
};
