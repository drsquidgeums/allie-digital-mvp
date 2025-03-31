
import { useEffect, useState } from 'react';
import { useAudioInstance } from './hooks/useAudioInstance';
import { useMusicControl } from './hooks/useMusicControl';
import { useMusicSelection } from './hooks/useMusicSelection';

export const useAudioPlayer = () => {
  const audioRef = useAudioInstance();
  const { isPlaying, togglePlay, volume, setVolume, isMuted, toggleMute, isLooping, toggleLoop, setIsPlaying } = useMusicControl(audioRef);
  const { selectedMusic, handleMusicChange } = useMusicSelection(audioRef, isPlaying);
  const [wasPausedByFocusMode, setWasPausedByFocusMode] = useState(false);
  
  // Listen for focus mode changes
  useEffect(() => {
    const handleFocusModeChange = (event: CustomEvent) => {
      const { active, settings } = event.detail;
      
      console.log('Focus mode changed in audio player:', { active, settings, audioRef: !!audioRef.current });
      
      if (active && settings?.muteAudio && audioRef.current) {
        // If focus mode is activated with muteAudio setting, pause any playing music
        if (!audioRef.current.paused) {
          console.log('Pausing audio due to focus mode activation');
          audioRef.current.pause();
          setWasPausedByFocusMode(true);
          setIsPlaying(false); // Update the isPlaying state to reflect the pause
        }
      } else if (!active && wasPausedByFocusMode && selectedMusic) {
        // When focus mode is deactivated and music was paused by focus mode,
        // we can optionally resume playback here if desired
        // Uncommenting this would auto-resume music when focus mode ends
        // audioRef.current?.play().catch(e => console.error('Error resuming audio:', e));
        setWasPausedByFocusMode(false);
      }
    };

    // Add event listener for focus mode changes
    window.addEventListener('focusModeChanged', handleFocusModeChange as EventListener);
    
    return () => {
      window.removeEventListener('focusModeChanged', handleFocusModeChange as EventListener);
    };
  }, [audioRef, wasPausedByFocusMode, selectedMusic, setIsPlaying]);

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
