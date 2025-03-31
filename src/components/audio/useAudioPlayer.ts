
import { useEffect, useState } from 'react';
import { useAudioInstance } from './hooks/useAudioInstance';
import { useMusicControl } from './hooks/useMusicControl';
import { useMusicSelection } from './hooks/useMusicSelection';

export const useAudioPlayer = () => {
  const audioRef = useAudioInstance();
  const { isPlaying, togglePlay, volume, setVolume, isMuted, toggleMute, isLooping, toggleLoop } = useMusicControl(audioRef);
  const { selectedMusic, handleMusicChange } = useMusicSelection(audioRef, isPlaying);
  
  // Listen for focus mode changes
  useEffect(() => {
    const handleFocusModeChange = (event: CustomEvent) => {
      const { active, settings } = event.detail;
      
      if (active && settings?.muteAudio && audioRef.current) {
        // If focus mode is activated with muteAudio setting, pause any playing music
        if (!audioRef.current.paused) {
          audioRef.current.pause();
          // We don't reset the play state to avoid confusion when exiting focus mode
          // The user will need to manually restart the music if desired
        }
      }
    };

    // Add event listener for focus mode changes
    window.addEventListener('focusModeChanged', handleFocusModeChange as EventListener);
    
    return () => {
      window.removeEventListener('focusModeChanged', handleFocusModeChange as EventListener);
    };
  }, [audioRef]);

  return {
    isPlaying,
    selectedMusic,
    volume,
    isLooping,
    isMuted,
    handleMusicChange,
    togglePlay,
    setVolume,
    toggleMute,
    toggleLoop,
  };
};
