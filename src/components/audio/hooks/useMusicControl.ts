
import { useState, useEffect } from 'react';
import { MusicOption, MUSIC_OPTIONS } from '../MusicOptions';
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

  // Load initial state from localStorage
  useEffect(() => {
    // Restore playback state from localStorage
    const savedIsPlaying = localStorage.getItem('musicIsPlaying') === 'true';
    const savedVolume = parseFloat(localStorage.getItem('musicVolume') || '0.2');
    const savedIsMuted = localStorage.getItem('musicIsMuted') === 'true';
    const savedIsLooping = localStorage.getItem('musicIsLooping') !== 'false'; // Default to true
    
    // Only update states, don't actually play yet
    setVolume(savedVolume || 0.2);
    setIsMuted(savedIsMuted);
    setIsLooping(savedIsLooping);
    
    // Auto-play only if it was playing before
    if (savedIsPlaying && audioRef.current) {
      const savedMusicId = localStorage.getItem('selectedMusicId');
      if (savedMusicId) {
        const savedMusic = MUSIC_OPTIONS.find(opt => opt.id === savedMusicId);
        if (savedMusic) {
          // Prepare for playback
          audioRef.current.src = savedMusic.url;
          audioRef.current.volume = savedVolume || 0.2;
          audioRef.current.muted = savedIsMuted;
          audioRef.current.loop = savedIsLooping;
          
          // Try to resume playback
          audioRef.current.play().then(() => {
            setIsPlaying(true);
          }).catch(err => {
            console.error("Failed to auto-resume audio:", err);
            setIsPlaying(false);
          });
        }
      }
    }
    
    // Listen for audio state changes from other components
    const handleAudioStateChange = (event: CustomEvent) => {
      const { isPlaying: newIsPlaying, volume: newVolume, isMuted: newIsMuted, isLooping: newIsLooping } = event.detail;
      
      if (newIsPlaying !== undefined && newIsPlaying !== isPlaying) {
        setIsPlaying(newIsPlaying);
      }
      if (newVolume !== undefined && newVolume !== volume) {
        setVolume(newVolume);
      }
      if (newIsMuted !== undefined && newIsMuted !== isMuted) {
        setIsMuted(newIsMuted);
      }
      if (newIsLooping !== undefined && newIsLooping !== isLooping) {
        setIsLooping(newIsLooping);
      }
    };
    
    window.addEventListener('audioPlayerStateChanged', handleAudioStateChange as EventListener);
    
    return () => {
      window.removeEventListener('audioPlayerStateChanged', handleAudioStateChange as EventListener);
    };
  }, [audioRef]);
  
  // Persist state changes to localStorage
  useEffect(() => {
    localStorage.setItem('musicIsPlaying', isPlaying.toString());
    localStorage.setItem('musicVolume', volume.toString());
    localStorage.setItem('musicIsMuted', isMuted.toString());
    localStorage.setItem('musicIsLooping', isLooping.toString());
  }, [isPlaying, volume, isMuted, isLooping]);

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
      localStorage.setItem('musicVolume', normalizedVolume.toString());
      localStorage.setItem('musicIsMuted', 'false');
    }
  };

  const updateToggleMute = () => {
    const newMuteState = toggleMute();
    setIsMuted(newMuteState);
    localStorage.setItem('musicIsMuted', newMuteState.toString());
  };

  const updateToggleLoop = () => {
    const newLoopState = toggleLoop();
    setIsLooping(newLoopState);
    localStorage.setItem('musicIsLooping', newLoopState.toString());
  };

  const updateTogglePlay = async (currentMusic: MusicOption | undefined) => {
    if (!currentMusic) {
      // Try to find the selected music from localStorage
      const savedMusicId = localStorage.getItem('selectedMusicId');
      if (savedMusicId) {
        const savedMusic = MUSIC_OPTIONS.find(opt => opt.id === savedMusicId);
        if (savedMusic) {
          currentMusic = savedMusic;
        }
      }
    }
    
    const playState = await togglePlay(currentMusic);
    localStorage.setItem('musicIsPlaying', playState ? 'true' : 'false');
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
