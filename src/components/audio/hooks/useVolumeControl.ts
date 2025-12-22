
import { useCallback } from 'react';

export const useVolumeControl = (audioRef: React.RefObject<HTMLAudioElement>) => {
  const handleVolumeChange = useCallback((newVolume: number): number => {
    const normalizedVolume = Math.max(0, Math.min(1, newVolume / 100));
    
    if (audioRef.current) {
      audioRef.current.volume = normalizedVolume;
      // Also unmute when adjusting volume
      if (normalizedVolume > 0 && audioRef.current.muted) {
        audioRef.current.muted = false;
      }
    }
    
    return normalizedVolume;
  }, [audioRef]);

  const toggleMute = useCallback((): boolean => {
    if (!audioRef.current) return false;
    
    const newMutedState = !audioRef.current.muted;
    audioRef.current.muted = newMutedState;
    
    return newMutedState;
  }, [audioRef]);

  return {
    handleVolumeChange,
    toggleMute
  };
};
