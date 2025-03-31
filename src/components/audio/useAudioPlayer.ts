
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
      
      console.log('Focus mode changed in audio player:', { active, settings, audioRef: !!audioRef.current, isPlaying });
      
      if (active && settings?.muteAudio && audioRef.current) {
        // If focus mode is activated with muteAudio setting, pause any playing music
        if (!audioRef.current.paused) {
          console.log('Pausing audio due to focus mode activation');
          setWasPausedByFocusMode(true);
          // Note: The actual pausing is handled by the useAudioMuteEffect hook
        }
      } else if (!active && wasPausedByFocusMode && selectedMusic) {
        // Focus mode deactivation is handled by the useAudioMuteEffect hook
        // This method will be notified of the playing state changes via event listeners
        setWasPausedByFocusMode(false);
        console.log('Audio player received focus mode deactivation');
      }
    };

    // Add event listener for focus mode changes
    window.addEventListener('focusModeChanged', handleFocusModeChange as EventListener);
    
    return () => {
      window.removeEventListener('focusModeChanged', handleFocusModeChange as EventListener);
    };
  }, [audioRef, wasPausedByFocusMode, selectedMusic, isPlaying]);

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
