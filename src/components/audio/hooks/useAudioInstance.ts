
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
        window.globalAudioPlayer.loop = true;
        window.globalAudioPlayer.volume = 0.2;
        window.globalAudioPlayer.preload = "none";
      } catch (error) {
        console.log('Audio creation failed, environment may not support audio:', error);
        return;
      }
    }
    
    audioRef.current = window.globalAudioPlayer;

    const handleError = (e: Event) => {
      const target = e.target as HTMLAudioElement;
      const error = target.error;
      
      console.error('Audio error details:', {
        code: error?.code,
        message: error?.message,
        src: target.src,
        networkState: target.networkState,
        readyState: target.readyState
      });

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
      console.log('Audio can play - source loaded successfully');
    };

    const handleLoadStart = () => {
      console.log('Audio load started');
    };

    const handleLoadedData = () => {
      console.log('Audio data loaded');
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
