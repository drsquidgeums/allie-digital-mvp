
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
      window.globalAudioPlayer.volume = 0.2; // Set volume to 20% (reduced by 30% from original 0.3)
      window.globalAudioPlayer.crossOrigin = "anonymous"; // Add CORS support
      window.globalAudioPlayer.preload = "none"; // Don't preload until needed
    }
    
    audioRef.current = window.globalAudioPlayer;

    const handleError = (e: Event) => {
      console.error('Audio error:', e);
      // Reset the audio element on error
      if (audioRef.current) {
        audioRef.current.src = '';
        audioRef.current.load();
      }
      toast({
        title: "Playback error",
        description: "There was an error loading the audio file. Please try another option.",
        variant: "destructive",
      });
    };

    const handleCanPlay = () => {
      console.log('Audio can play - source loaded successfully');
    };

    audioRef.current.addEventListener('error', handleError);
    audioRef.current.addEventListener('canplay', handleCanPlay);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('error', handleError);
        audioRef.current.removeEventListener('canplay', handleCanPlay);
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
