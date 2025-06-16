
import { useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useAudioInstance = () => {
  // Use window object to store the audio instance globally
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!window.globalAudioPlayer) {
      window.globalAudioPlayer = new Audio();
      window.globalAudioPlayer.loop = true;
      window.globalAudioPlayer.volume = 0.2;
      window.globalAudioPlayer.crossOrigin = "anonymous";
      window.globalAudioPlayer.preload = "none";
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

      // Only show error toast if there was actually a source set
      if (target.src && target.src !== window.location.href) {
        // Reset the audio element on error
        target.src = '';
        target.load();
        
        toast({
          title: "Playback error",
          description: "There was an error loading the audio stream. This may be due to network restrictions or the stream being unavailable.",
          variant: "destructive",
        });
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
  }, [toast]);

  return audioRef;
};

// Add TypeScript declaration for the global audio player
declare global {
  interface Window {
    globalAudioPlayer: HTMLAudioElement;
  }
}
