
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAudioPersistence } from './useAudioPersistence';

export const useFocusModeAudioEffect = (
  audioRef: React.RefObject<HTMLAudioElement>,
  isPlaying: boolean, 
  setIsPlaying: (playing: boolean) => void
) => {
  // We're intentionally NOT using the focus mode state here
  // The ambient player should always be enabled during focus mode
  const [isFocusModeActive, setIsFocusModeActive] = useState(false);
  const { wasPausedByFocusMode, setWasPausedByFocusMode } = useAudioPersistence(audioRef, isPlaying, setIsPlaying);
  const { toast } = useToast();

  // Listen for focus mode changes - but don't actually do anything with them
  useEffect(() => {
    const handleFocusModeChange = (event: CustomEvent) => {
      // We intentionally do not update isFocusModeActive based on the event
      // This ensures the player isn't affected by focus mode
      console.log('Focus mode change detected in music control, but ignoring:', event.detail);
    };
    
    // Listen for specific audio muting events but ignore them
    const handleAudioMutingChanged = (event: CustomEvent) => {
      console.log('Audio muting event in music control ignored:', event.detail);
    };
    
    window.addEventListener('focusModeChanged', handleFocusModeChange as EventListener);
    window.addEventListener('audioMutingChanged', handleAudioMutingChanged as EventListener);
    
    return () => {
      window.removeEventListener('focusModeChanged', handleFocusModeChange as EventListener);
      window.removeEventListener('audioMutingChanged', handleAudioMutingChanged as EventListener);
    };
  }, [audioRef, wasPausedByFocusMode, isFocusModeActive, setIsPlaying, setWasPausedByFocusMode, toast]);

  return {
    // Always return false to indicate focus mode is never active for the audio player
    isFocusModeActive: false,
    wasPausedByFocusMode,
    setWasPausedByFocusMode
  };
};
