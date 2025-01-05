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
    }
    
    audioRef.current = window.globalAudioPlayer;

    const handleError = (e: Event) => {
      console.error('Audio error:', e);
      toast({
        title: "Playback error",
        description: "There was an error loading the audio file. Please try another option.",
        variant: "destructive",
      });
    };

    audioRef.current.addEventListener('error', handleError);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('error', handleError);
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