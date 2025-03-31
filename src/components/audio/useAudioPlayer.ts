
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
      
      // If focus mode is activated and the muteAudio setting is enabled
      if (active && settings?.muteAudio && audioRef.current) {
        if (!audioRef.current.paused) {
          console.log('Pausing audio due to focus mode activation');
          audioRef.current.pause();
          setIsPlaying(false);
          setWasPausedByFocusMode(true);
        }
      } else if (!active && wasPausedByFocusMode) {
        // When focus mode is deactivated, just track that we're no longer in focus mode
        setWasPausedByFocusMode(false);
        console.log('Audio player received focus mode deactivation');
        // Don't auto-resume, let the user decide to play music again
      }
    };

    // Listen specifically for audio muting events
    const handleAudioMutingChanged = (event: CustomEvent) => {
      const { muted, forced } = event.detail;
      
      console.log('Audio muting changed in audio player:', { muted, forced, audioRef: !!audioRef.current, isPlaying });
      
      if (muted && forced && audioRef.current && !audioRef.current.paused) {
        console.log('Pausing audio due to forced audio muting event');
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
