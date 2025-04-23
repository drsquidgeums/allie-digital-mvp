
import { useEffect } from 'react';
import { useAudioInstance } from './hooks/useAudioInstance';
import { useMusicControl } from './hooks/useMusicControl';
import { useMusicSelection } from './hooks/useMusicSelection';
import { useAudioPersistence } from './hooks/useAudioPersistence';

export const useAudioPlayer = () => {
  const audioRef = useAudioInstance();
  const { isPlaying, togglePlay, volume, setVolume, isMuted, toggleMute, isLooping, toggleLoop, setIsPlaying } = useMusicControl(audioRef);
  const { selectedMusic, handleMusicChange } = useMusicSelection(audioRef, isPlaying);
  const { wasPausedByFocusMode, setWasPausedByFocusMode } = useAudioPersistence(audioRef, isPlaying, setIsPlaying);
  
  // Listen for audio muting changes
  useEffect(() => {
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

    window.addEventListener('audioMutingChanged', handleAudioMutingChanged as EventListener);
    
    return () => {
      window.removeEventListener('audioMutingChanged', handleAudioMutingChanged as EventListener);
    };
  }, [audioRef, isPlaying, setIsPlaying, setWasPausedByFocusMode]);

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
