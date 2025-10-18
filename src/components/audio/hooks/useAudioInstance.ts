
import { useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAudioFallback } from './useAudioFallback';

export const useAudioInstance = () => {
  // Use window object to store the audio instance globally
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  const { handleStreamingFailure, audioMode } = useAudioFallback();

  useEffect(() => {
    // Don't create audio if in disabled mode
    if (audioMode === 'disabled') {
      return;
    }

    if (!window.globalAudioPlayer) {
      try {
        window.globalAudioPlayer = new Audio();
        window.globalAudioPlayer.crossOrigin = 'anonymous';
        window.globalAudioPlayer.loop = true;
        window.globalAudioPlayer.volume = 0.2;
        window.globalAudioPlayer.preload = "none";
      } catch (error) {
        return;
      }
    }
    
    audioRef.current = window.globalAudioPlayer;

    // Sync playing state with actual audio state on mount
    if (window.globalAudioPlayer && !window.globalAudioPlayer.paused) {
      console.log('Global audio player is playing, syncing state across components');
      // Dispatch event to notify components that audio is playing
      window.dispatchEvent(new CustomEvent('audioPlayerStateChanged', {
        detail: {
          isPlaying: true,
          selectedMusic: localStorage.getItem('selectedMusicId') || '',
          volume: window.globalAudioPlayer.volume * 100, // Normalize to 0-100
          isLooping: window.globalAudioPlayer.loop,
          isMuted: window.globalAudioPlayer.muted
        }
      }));
    }

    const handleError = (e: Event) => {
      const target = e.target as HTMLAudioElement;
      const error = target.error;

      // Only show error toast if there was actually a source set and it's not the base URL
      if (target.src && target.src !== window.location.href && !target.src.includes('/toolbox')) {
        // Reset the audio element on error
        target.src = '';
        target.load();
        
        // Handle streaming failure through fallback system
        handleStreamingFailure({ id: 'unknown', name: 'Current track', url: target.src });
      }
    };

    const handleCanPlay = () => {
      // Audio ready to play
    };

    const handleLoadStart = () => {
      // Audio loading started
    };

    const handleLoadedData = () => {
      // Audio data loaded
    };

    if (audioRef.current) {
      audioRef.current.addEventListener('error', handleError);
      audioRef.current.addEventListener('canplay', handleCanPlay);
      audioRef.current.addEventListener('loadstart', handleLoadStart);
      audioRef.current.addEventListener('loadeddata', handleLoadedData);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('error', handleError);
        audioRef.current.removeEventListener('canplay', handleCanPlay);
        audioRef.current.removeEventListener('loadstart', handleLoadStart);
        audioRef.current.removeEventListener('loadeddata', handleLoadedData);
      }
    };
  }, [toast, handleStreamingFailure, audioMode]);

  return audioRef;
};

// Add TypeScript declaration for the global audio player
declare global {
  interface Window {
    globalAudioPlayer: HTMLAudioElement;
  }
}
