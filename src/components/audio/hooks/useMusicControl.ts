
import { useState } from 'react';
import { MusicOption } from '../MusicOptions';
import { useFocusModeAudioEffect } from './useFocusModeAudioEffect';
import { useAudioEvents } from './useAudioEvents';
import { useAudioControls } from './useAudioControls';

export const useMusicControl = (audioRef: React.RefObject<HTMLAudioElement>) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.2);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(true);
  
  // Handle focus mode effects
  const { isFocusModeActive } = useFocusModeAudioEffect(
    audioRef,
    isPlaying, 
    setIsPlaying
  );

  // Handle audio events
  useAudioEvents(
    audioRef,
    setIsPlaying,
    setVolume,
    setIsMuted,
    setIsLooping
  );
  
  // Initialize audio controls
  const { 
    handleVolumeChange, 
    toggleMute, 
    toggleLoop,
    togglePlay 
  } = useAudioControls(
    audioRef,
    isPlaying,
    setIsPlaying,
    isFocusModeActive
  );
  
  // Wrapper functions that update our local state
  const updateVolume = (newVolume: number) => {
    const normalizedVolume = handleVolumeChange(newVolume);
    if (normalizedVolume !== undefined) {
      setVolume(normalizedVolume);
      setIsMuted(false);
    }
  };

  const updateToggleMute = () => {
    const newMuteState = toggleMute();
    setIsMuted(newMuteState);
  };

  const updateToggleLoop = () => {
    const newLoopState = toggleLoop();
    setIsLooping(newLoopState);
  };

  const updateTogglePlay = async (currentMusic: MusicOption | undefined) => {
    await togglePlay(currentMusic);
    // Note: isPlaying state is already updated in the togglePlay function
  };

  return {
    isPlaying,
    volume,
    isMuted,
    isLooping,
    setIsPlaying,
    togglePlay: updateTogglePlay,
    setVolume: updateVolume,
    toggleMute: updateToggleMute,
    toggleLoop: updateToggleLoop,
  };
};
