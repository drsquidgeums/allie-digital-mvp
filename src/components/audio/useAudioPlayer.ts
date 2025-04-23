
import { useEffect } from 'react';
import { useAudioInstance } from './hooks/useAudioInstance';
import { useMusicControl } from './hooks/useMusicControl';
import { useMusicSelection } from './hooks/useMusicSelection';
import { useAudioPersistence } from './hooks/useAudioPersistence';
import { useFocusMode } from '@/hooks/useFocusMode';

export const useAudioPlayer = () => {
  const audioRef = useAudioInstance();
  const { isPlaying, togglePlay, volume, setVolume, isMuted, toggleMute, isLooping, toggleLoop, setIsPlaying } = useMusicControl(audioRef);
  const { selectedMusic, handleMusicChange } = useMusicSelection(audioRef, isPlaying);
  const { wasPausedByFocusMode, setWasPausedByFocusMode } = useAudioPersistence(audioRef, isPlaying, setIsPlaying);
  
  // We still get the focus mode state for logging purposes only
  const { isFocusModeActive, focusModeSettings } = useFocusMode();

  // Listen for audio muting only for logging purposes
  useEffect(() => {
    const handleAudioMutingChanged = (event: CustomEvent) => {
      const { muted, forced } = event.detail;
      console.log('Audio muting changed in audio player, ignoring event:', { muted, forced });
      // We intentionally don't do anything with the event to ensure music continues playing
    };

    window.addEventListener('audioMutingChanged', handleAudioMutingChanged as EventListener);
    
    return () => {
      window.removeEventListener('audioMutingChanged', handleAudioMutingChanged as EventListener);
    };
  }, []);

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
