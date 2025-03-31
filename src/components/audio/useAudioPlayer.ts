
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
          audioRef.current.pause();
          setIsPlaying(false);
          setWasPausedByFocusMode(true);
        }
      } else if (!active && wasPausedByFocusMode && selectedMusic) {
        // When focus mode is deactivated, restore previous state if music was paused by focus mode
        setWasPausedByFocusMode(false);
        console.log('Audio player received focus mode deactivation');
      }
    };

    // Listen specifically for audio muting events
    const handleAudioMutingChanged = (event: CustomEvent) => {
      const { muted } = event.detail;
      
      console.log('Audio muting changed in audio player:', { muted, audioRef: !!audioRef.current, isPlaying });
      
      if (muted && audioRef.current && !audioRef.current.paused) {
        console.log('Pausing audio due to audio muting event');
        audioRef.current.pause();
        setIsPlaying(false);
        setWasPausedByFocusMode(true);
      }
    };

    // Add event listeners for focus mode changes
    window.addEventListener('focusModeChanged', handleFocusModeChange as EventListener);
    window.addEventListener('audioMutingChanged', handleAudioMutingChanged as EventListener);
    
    return () => {
      window.removeEventListener('focusModeChanged', handleFocusModeChange as EventListener);
      window.removeEventListener('audioMutingChanged', handleAudioMutingChanged as EventListener);
    };
  }, [audioRef, wasPausedByFocusMode, selectedMusic, isPlaying, setIsPlaying]);

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
