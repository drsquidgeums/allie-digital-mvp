
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
      const wasInFocusMode = isFocusModeActive;
      const shouldMuteAudio = active && settings?.muteAudio;
      
      console.log('Focus mode change detected in music control:', { active, settings, shouldMuteAudio });
      
      setIsFocusModeActive(shouldMuteAudio);
      
      if (shouldMuteAudio && audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        setWasPausedByFocusMode(true);
        setIsPlaying(false);
        console.log('Audio paused due to focus mode activation with mute setting');
        
        toast({
          title: "Music paused",
          description: "Music playback paused due to Focus Mode",
        });
      }
    };
    
    // Listen for specific audio muting events
    const handleAudioMutingChanged = (event: CustomEvent) => {
      const { muted, forced, source } = event.detail;
      
      console.log('Audio muting event in music control:', { muted, forced, source });
      
      // Always respect a forced mute from focus mode
      if (muted && forced && audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        setIsPlaying(false);
        setWasPausedByFocusMode(true);
        console.log('Audio paused due to forced audio muting event');
        
        if (source === 'focus-mode') {
          toast({
            title: "Music paused",
            description: "Music playback paused due to Focus Mode",
          });
        }
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
    isFocusModeActive,
    wasPausedByFocusMode,
    setWasPausedByFocusMode
  };
};
